# 🧠 Grasp | Your Private YouTube Distillate

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Modern-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google)
![TailwindCSS](https://img.shields.io/badge/UI-Liquid_Glass-38B2AC?style=flat-square&logo=tailwind-css)

> **Grasp** is an AI-powered Micro-SaaS that transforms long, complex YouTube videos into clear, structured, and actionable textual insights in seconds.

## 🚀 The Philosophy: Vibecoding & Language-Agnostic Engineering

This project was built as a proof-of-concept to test a modern software engineering paradigm: **Vibecoding**. 

Instead of manually typing syntax, this entire full-stack application was architected, orchestrated, and generated using advanced **Prompt Engineering** through the **Cursor IDE**. 

My goal was to demonstrate that a Senior Engineer's true value lies in **system design, architecture, problem-solving, and AI orchestration**, rather than being tied to a specific programming language. By acting as the architect, I guided the AI to seamlessly integrate a modern TypeScript frontend with a robust Python backend, proving a language-agnostic capability to deliver high-value products rapidly.

## ✨ Key Features

- **Liquid Glass UI/UX:** An ultra-premium, Apple-inspired interface built with Tailwind CSS, featuring subtle mesh gradients, glassmorphism, and Framer Motion animations.
- **AI-Powered Summarization:** Uses the `youtube-transcript-api` to extract CCs and feeds them into **Google's Gemini 2.5 Flash** model to distill hours of video into structured markdown.
- **Multilingual Context Engine:** Fully localized in EN, PT, ES, and DE. The frontend not only translates the UI but also dynamically prompts the backend AI to return the video summary in the user's selected language, regardless of the video's original audio.
- **Immersive Loading States:** Features a "The Sims" inspired, dynamically translated cyclic loading animation with AI-themed phrases to enhance perceived performance during heavy backend processing.
- **Smart Metadata Extraction:** Automatically fetches the YouTube video thumbnail and original title using oEmbed without requiring YouTube Data API quotas.

## 🛠️ Tech Stack

**Frontend (The Face):**
- Next.js (App Router)
- React & TypeScript
- Tailwind CSS & Framer Motion
- Lucide React (Icons)
- React Markdown

**Backend (The Brain):**
- Python 3
- FastAPI (RESTful Architecture)
- Google GenAI SDK (Gemini)
- Pydantic (Data Validation)

## 🚦 Running Locally

To run this project on your machine, you will need Node.js and Python installed, along with a free Google Gemini API Key.

**Clone the repository:**
```bash
git clone [https://github.com/yourusername/grasp.git](https://github.com/yourusername/grasp.git)
cd grasp
```

## Setup the Backend (Python):

# Create a virtual environment (recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

# Install dependencies
```bash
python -m pip install fastapi pydantic youtube-transcript-api google-genai uvicorn python-dotenv
```

# Set up your environment variables
# Create a .env file in the root directory and add your key:
```bash
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```
# Run the FastAPI server (runs on port 8000)
```bash
python -m uvicorn api.index:app --reload --port 8000
```
## Setup the Frontend (Next.js):
Open a new terminal tab in the project root:

# Install Node dependencies
```bash
npm install
```
# Run the development server (runs on port 3000)
```bash
npm run dev
```
Open http://localhost:3000 in your browser to see Grasp in action.

## 🤝 Architecture & Prompt Engineering Notes
The backbone of this project is the .cursorrules file, which sets the strict architectural boundaries for the AI (e.g., forcing stateless backend functions for Vercel Serverless compatibility, strict type hints in Python, and the overarching Liquid Glass aesthetic).

Every line of code is the result of iterative, context-aware prompt engineering, debugging via AI terminal analysis, and strategic component refactoring.
## 
Designed for deep understanding. Engineered for the future.