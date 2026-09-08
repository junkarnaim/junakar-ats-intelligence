import os
import shutil
import tempfile
import json

from dotenv import load_dotenv

# ============================================================
# LOAD .ENV FROM SERVER FOLDER
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ENV_PATH = os.path.join(BASE_DIR, "server", ".env")

load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("=" * 50)
print("AI RESUME ANALYSIS SERVICE  (port 8000)")
print("=" * 50)
print("ENV PATH   :", ENV_PATH)
print("GEMINI KEY :", "found" if GEMINI_API_KEY else "MISSING")
print("MODEL      : gemini-3.6-flash")
print("=" * 50)

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in server/.env")


# ============================================================
# GEMINI REST API  (no SDK — avoids large dependency chain)
# ============================================================

import requests as http_requests

GEMINI_URL = (
    "https://generativelanguage.googleapis.com"
    "/v1beta/models/gemini-3.6-flash:generateContent"
    "?key={key}"
)


def call_gemini(prompt: str) -> str:
    """POST to Gemini REST API, return text response."""
    url = GEMINI_URL.format(key=GEMINI_API_KEY)

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.15,
            "maxOutputTokens": 2048,
        },
    }

    response = http_requests.post(url, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError("Gemini returned no candidates")

    parts = candidates[0].get("content", {}).get("parts", [])
    if not parts:
        raise ValueError("Gemini returned no content parts")

    return parts[0].get("text", "")


# ============================================================
# PDF + OCR
# ============================================================

import pymupdf
import pytesseract
from PIL import Image


# ============================================================
# FLASK
# ============================================================

from flask import Flask, request, jsonify

app = Flask(__name__)


# ============================================================
# TESSERACT CONFIGURATION
# ============================================================

windows_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
system_tesseract = shutil.which("tesseract")

if os.path.exists(windows_tesseract):
    pytesseract.pytesseract.tesseract_cmd = windows_tesseract
elif system_tesseract:
    pytesseract.pytesseract.tesseract_cmd = system_tesseract


# ============================================================
# ATS ANALYSIS  (Gemini prompt)
# ============================================================

def analyze_resume(resume_text: str, job_description: str, required_skills: list) -> dict:
    """
    Call Gemini with resume + job context.
    Returns structured ATS analysis dict.
    """

    skills_list = ", ".join(required_skills) if required_skills else "Not specified"

    prompt = f"""
You are an expert ATS (Applicant Tracking System) that scores resumes.

Analyse the resume below against the job description and required skills.

=== RESUME ===
{resume_text}

=== JOB DESCRIPTION ===
{job_description}

=== REQUIRED SKILLS ===
{skills_list}

=== INSTRUCTIONS ===
Return ONLY valid JSON with no markdown, no code fences, no extra text.

Use EXACTLY this structure:

{{
  "aiScore": 72,
  "matchedSkills": ["Python", "REST APIs"],
  "missingSkills": ["Kubernetes", "Terraform"],
  "strengths": ["5 years of backend experience", "Led cross-functional teams"],
  "recommendations": ["Add cloud certifications", "Highlight CI/CD experience"],
  "experienceMatch": true,
  "aiSummary": "The candidate has strong backend skills matching 60% of requirements but lacks DevOps expertise."
}}

Rules:
1. aiScore: integer 0–100 reflecting overall match to the job.
2. matchedSkills: skills from the required list that are present in the resume.
3. missingSkills: required skills that are absent from the resume.
4. strengths: 2–4 notable positives from the resume relevant to this job.
5. recommendations: 2–4 concrete actions the candidate should take to improve their chances.
6. experienceMatch: true if years/domain of experience broadly fits the role.
7. aiSummary: 1–3 sentence neutral assessment of the candidate for this role.
"""

    raw = call_gemini(prompt).strip()

    # Strip markdown fences if returned
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]

    return json.loads(raw.strip())


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF.
    Falls back to OCR (Tesseract) for image-only pages.
    """
    doc = pymupdf.open(file_path)
    pages = []

    try:
        for page_number, page in enumerate(doc, start=1):
            text = page.get_text("text", sort=True).strip()

            # OCR fallback for scanned pages
            if not text:
                pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

                try:
                    text = pytesseract.image_to_string(img).strip()
                except pytesseract.TesseractNotFoundError:
                    text = ""

            if text:
                pages.append(f"--- Page {page_number} ---\n{text}")
    finally:
        doc.close()

    return "\n\n".join(pages).strip()


# ============================================================
# /extract-resume  (POST)
# ============================================================

@app.route("/extract-resume", methods=["POST"])
def extract_resume():
    if "resume" not in request.files:
        return jsonify({"success": False, "error": "No resume file uploaded"}), 400

    file = request.files["resume"]
    if not file.filename:
        return jsonify({"success": False, "error": "No file selected"}), 400

    temp_path = None

    try:
        # Save PDF to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            file.save(tmp.name)
            temp_path = tmp.name

        # Extract text
        resume_text = extract_from_pdf(temp_path)
        if not resume_text:
            return jsonify({
                "success": False,
                "error": "Could not extract text from the PDF. Ensure it is not a scanned image-only PDF."
            }), 422

        # Get job context from form fields
        job_description = request.form.get("jobDescription", "").strip()
        required_skills_raw = request.form.get("requiredSkills", "")
        required_skills = [s.strip() for s in required_skills_raw.split(",") if s.strip()]

        # Run ATS analysis
        ai_result = analyze_resume(resume_text, job_description, required_skills)

        return jsonify({
            "success": True,
            "filename": file.filename,
            "characters": len(resume_text),
            "text": resume_text,
            "aiAnalysis": ai_result,
        })

    except json.JSONDecodeError as e:
        return jsonify({"success": False, "error": f"Gemini returned invalid JSON: {e}"}), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


# ============================================================
# /  (GET) — health check
# ============================================================

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "service": "AI Resume Analysis Service",
        "model": "gemini-3.6-flash",
        "status": "running",
    })


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)