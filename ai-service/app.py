import os
import shutil
import tempfile
import json

from dotenv import load_dotenv

# ============================================================
# LOAD .ENV FROM SERVER FOLDER
# Project structure:
#
# AI-Powered-Applicant-Tracking-System-ATS/
# ├── server/
# │   └── .env
# ├── ai-service/
# │   └── app.py
# └── client/
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ENV_PATH = os.path.join(
    BASE_DIR,
    "server",
    ".env"
)

load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("========================================")
print("AI SERVICE")
print("========================================")
print("ENV PATH:", ENV_PATH)
print("GEMINI KEY FOUND:", bool(GEMINI_API_KEY))
print("========================================")


# ============================================================
# GEMINI
# ============================================================

import google.generativeai as genai

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY was not found in server/.env"
    )

genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-3.6-flash"
)


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

windows_tesseract = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

system_tesseract = shutil.which("tesseract")


if os.path.exists(windows_tesseract):

    pytesseract.pytesseract.tesseract_cmd = (
        windows_tesseract
    )

elif system_tesseract:

    pytesseract.pytesseract.tesseract_cmd = (
        system_tesseract
    )


# ============================================================
# GEMINI RESUME ANALYSIS
# ============================================================

def analyze_resume(resume_text, job_description):

    prompt = f"""
You are an AI recruitment assistant.

Analyze the candidate's resume against the job description.

========================
RESUME
========================

{resume_text}

========================
JOB DESCRIPTION
========================

{job_description}

========================
RESPONSE FORMAT
========================

Return ONLY valid JSON.

Do not add markdown.
Do not add ```json.
Do not add explanations outside JSON.

Use exactly this structure:

{{
    "aiScore": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "experienceMatch": false,
    "aiSummary": ""
}}

Rules:

1. aiScore must be a number between 0 and 100.

2. matchedSkills:
   List important skills that appear in both
   the resume and job description.

3. missingSkills:
   List important job skills that are missing
   from the resume.

4. experienceMatch:
   true if the candidate's experience is relevant
   to the job, otherwise false.

5. aiSummary:
   Give a short explanation of the candidate's
   suitability for the job.
"""

    response = model.generate_content(prompt)

    result_text = response.text.strip()

    # Remove markdown fences if Gemini returns them
    if result_text.startswith("```json"):
        result_text = result_text[7:]

    if result_text.startswith("```"):
        result_text = result_text[3:]

    if result_text.endswith("```"):
        result_text = result_text[:-3]

    result_text = result_text.strip()

    return json.loads(result_text)


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_from_pdf(file_path):

    """
    Extract text from PDF.

    1. First try normal selectable PDF text.
    2. If a page has no selectable text,
       use OCR with Tesseract.
    """

    doc = pymupdf.open(file_path)

    pages = []

    try:

        for page_number, page in enumerate(
            doc,
            start=1
        ):

            # ----------------------------------------
            # Normal PDF text extraction
            # ----------------------------------------

            text = page.get_text(
                "text",
                sort=True
            ).strip()


            # ----------------------------------------
            # OCR fallback
            # ----------------------------------------

            if not text:

                pix = page.get_pixmap(
                    matrix=pymupdf.Matrix(2, 2),
                    alpha=False
                )

                img = Image.frombytes(
                    "RGB",
                    [pix.width, pix.height],
                    pix.samples
                )

                try:

                    text = (
                        pytesseract
                        .image_to_string(img)
                        .strip()
                    )

                except pytesseract.TesseractNotFoundError:

                    text = ""


            # ----------------------------------------
            # Store page text
            # ----------------------------------------

            if text:

                pages.append(
                    f"--- Page {page_number} ---\n{text}"
                )

    finally:

        doc.close()


    return "\n\n".join(pages).strip()


# ============================================================
# RESUME API
# ============================================================

@app.route(
    "/extract-resume",
    methods=["POST"]
)
def extract_resume():

    # ========================================================
    # CHECK RESUME FILE
    # ========================================================

    if "resume" not in request.files:

        return jsonify({
            "success": False,
            "error": "No resume file uploaded"
        }), 400


    file = request.files["resume"]


    if file.filename == "":

        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400


    temp_path = None


    try:

        # ====================================================
        # SAVE PDF TEMPORARILY
        # ====================================================

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            file.save(
                temp_file.name
            )

            temp_path = temp_file.name


        # ====================================================
        # EXTRACT RESUME TEXT
        # ====================================================

        resume_text = extract_from_pdf(
            temp_path
        )


        if not resume_text:

            return jsonify({
                "success": False,
                "error": "Could not extract text from resume"
            }), 422


        # ====================================================
        # GET JOB DESCRIPTION
        # ====================================================

        job_description = request.form.get(
            "jobDescription",
            ""
        ).strip()


        # ====================================================
        # AI ANALYSIS
        # ====================================================

        ai_result = analyze_resume(
            resume_text,
            job_description
        )


        # ====================================================
        # RETURN RESPONSE
        # ====================================================

        return jsonify({

            "success": True,

            "filename": file.filename,

            "characters": len(resume_text),

            "text": resume_text,

            "aiAnalysis": ai_result

        })


    except json.JSONDecodeError as error:

        return jsonify({

            "success": False,

            "error": (
                "Gemini returned invalid JSON: "
                + str(error)
            )

        }), 500


    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)

        }), 500


    finally:

        # ====================================================
        # DELETE TEMPORARY FILE
        # ====================================================

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def health_check():

    return jsonify({

        "success": True,

        "service": "AI Resume Service",

        "status": "running"

    })


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )