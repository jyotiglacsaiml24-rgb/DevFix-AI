from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_service import fix_code

app = FastAPI(title="DevFix AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("CORS SETTINGS LOADED")

class FixRequest(BaseModel):
    language: str
    code: str
    error: str


@app.get("/")
def home():
    return {"message": "DevFix AI backend is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/fix")
def analyze(request: FixRequest):
    try:
        return fix_code(
            request.language,
            request.code,
            request.error
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except Exception as exc:
        print("GEMINI ERROR:", repr(exc))
        raise HTTPException(
            status_code=502,
            detail="AI request failed. Check the backend terminal."
        )
