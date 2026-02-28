"""
Grasp API: YouTube transcript summarization via FastAPI + Gemini.
"""
import os
from dotenv import load_dotenv

load_dotenv()

import asyncio
import json
import re
import sys
from typing import Optional, Tuple
from urllib.parse import quote
from urllib.request import urlopen

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from google import genai

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api import (
        NoTranscriptFound,
        TranscriptsDisabled,
        VideoUnavailable,
    )
except ImportError:
    YouTubeTranscriptApi = None
    NoTranscriptFound = Exception
    TranscriptsDisabled = Exception
    VideoUnavailable = Exception


GEMINI_MODEL = "gemini-2.5-flash"  # Updated model name (use 'gemini-2.0-flash' if this returns 404)

# Robust regex: matches all common YouTube URL formats and captures the 10–12 char video ID
YOUTUBE_ID_REGEX = re.compile(
    r"(?:youtube\.com/(?:watch\?v=|embed/|v/|shorts/)|youtu\.be/)([\w-]{10,12})",
    re.IGNORECASE,
)
# Fallback: raw 11-char id (YouTube IDs are typically 11 chars)
RAW_ID_REGEX = re.compile(r"\b([\w-]{11})\b")


app = FastAPI(title="Grasp API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummarizeRequest(BaseModel):
    url: str
    language: str = "EN"


class SummarizeResponse(BaseModel):
    summary: str
    title: str = ""
    thumbnail: str = ""


def extract_youtube_video_id(url: str) -> Optional[str]:
    """
    Extract YouTube video ID from any common format using a single robust regex.
    Supports: youtube.com/watch?v=, embed/, v/, shorts/, youtu.be/
    """
    if not url or not isinstance(url, str):
        return None
    url = url.strip()
    if not url:
        return None

    match = YOUTUBE_ID_REGEX.search(url)
    if match:
        return match.group(1)
    # Fallback: pasted raw 11-char id
    match = RAW_ID_REGEX.search(url)
    return match.group(1) if match else None


# Preferred language codes (pt/en/es first); fallback is any available transcript
PREFERRED_LANGUAGES = ("pt", "pt-BR", "en", "es")


def fetch_transcript_text(video_id: str) -> str:
    """
    Fetch transcript for video_id: prefer pt, pt-BR, en, es; otherwise use ANY
    available transcript from list_transcripts. Gemini can summarize any language.
    """
    if YouTubeTranscriptApi is None:
        raise RuntimeError("youtube_transcript_api is not installed")

    api = YouTubeTranscriptApi()
    transcript_list = api.list(video_id)

    # Prefer preferred languages; if none found, take the first available (any language)
    try:
        transcript = transcript_list.find_transcript(list(PREFERRED_LANGUAGES))
    except NoTranscriptFound:
        first = next(iter(transcript_list), None)
        if first is None:
            raise ValueError("No transcript available for this video.")
        transcript = first

    fetched = transcript.fetch()
    parts = [snippet.text for snippet in fetched if getattr(snippet, "text", None)]
    transcript = " ".join(parts).strip()
    if not transcript:
        raise ValueError("Transcript is empty for this video.")
    return transcript


def fetch_video_metadata(url: str) -> Tuple[str, str]:
    """Fetch title and thumbnail via YouTube oembed (no API key). Returns (title, thumbnail_url)."""
    try:
        oembed_url = f"https://www.youtube.com/oembed?url={quote(url)}&format=json"
        with urlopen(oembed_url, timeout=10) as resp:
            data = json.load(resp)
        title = (data.get("title") or "").strip()
        thumbnail = (data.get("thumbnail_url") or "").strip()
        return title, thumbnail
    except Exception:
        return "", ""


@app.get("/health")
@app.get("/api/health")
async def health() -> dict:
    return {"status": "Grasp API is alive"}


@app.post("/summarize", response_model=SummarizeResponse)
@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest) -> SummarizeResponse:
    url = (request.url or "").strip()
    print("[Grasp] POST /api/summarize — url (first 80 chars):", (url[:80] + "..." if len(url) > 80 else url), flush=True)

    video_id = extract_youtube_video_id(url)
    if not video_id:
        print("[Grasp] Failed to extract video ID from URL.", flush=True)
        raise HTTPException(
            status_code=400,
            detail="Unable to extract a valid YouTube video ID from the provided URL.",
        )
    print("[Grasp] ID extracted:", video_id, flush=True)

    # Fetch video metadata (title, thumbnail) via oembed
    title, thumbnail = await asyncio.to_thread(fetch_video_metadata, url)
    print("[Grasp] Metadata fetched — title:", (title[:50] + "..." if len(title) > 50 else title) or "(none)", flush=True)

    # Step 2: Fetch transcript (wrap in try/except → 400 if any failure)
    try:
        transcript = await asyncio.to_thread(fetch_transcript_text, video_id)
        print("[Grasp] Transcript fetched. Length:", len(transcript), "chars.", flush=True)
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as e:
        print("[Grasp] Transcript error (subtitles unavailable):", type(e).__name__, str(e), flush=True)
        raise HTTPException(
            status_code=400,
            detail="Could not find subtitles for this video.",
        ) from None
    except Exception as e:
        print("[Grasp] Transcript fetch failed:", type(e).__name__, str(e), file=sys.stderr, flush=True)
        raise HTTPException(
            status_code=400,
            detail="Could not find subtitles for this video.",
        ) from None

    # Step 3: Summarize with Gemini — explicit API key + debug print
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"[Grasp] API Key loaded: {api_key[:5]}***" if api_key else "[Grasp] ERROR: API Key STILL None!")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set in environment variables.",
        )

    language = (request.language or "EN").strip() or "EN"
    print("[Grasp] Summary language requested:", language, flush=True)

    try:
        # define sync inner function for Gemini call
        def _call_gemini_sync_transcript(transcript: str, api_key: str, lang: str) -> str:
            client = genai.Client(api_key=api_key)
            prompt = (
                f"You are an expert executive assistant. Summarize the following YouTube video transcript. "
                f"CRITICAL INSTRUCTION: You MUST write the ENTIRE summary in {lang} language. Do not use any other language. "
                f"Use Markdown formatting, bullet points, and highlight key insights. Transcript: {transcript}"
            )
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            text = getattr(response, "text", None)
            if text is None or (isinstance(text, str) and not text.strip()):
                raise RuntimeError("Gemini returned an empty response.")
            return text if isinstance(text, str) else str(text)

        summary_text = await asyncio.to_thread(
            _call_gemini_sync_transcript, transcript, api_key, language
        )
        print("[Grasp] Gemini summary generated. Length:", len(summary_text), "chars.", flush=True)
    except RuntimeError as e:
        print("[Grasp] Gemini error:", str(e), flush=True)
        raise HTTPException(status_code=500, detail=str(e)) from None
    except Exception as e:
        print("[Grasp] Gemini call failed:", type(e).__name__, str(e), file=sys.stderr, flush=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate summary with Gemini.",
        ) from None

    return SummarizeResponse(summary=summary_text, title=title, thumbnail=thumbnail)
