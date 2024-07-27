from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from openai import OpenAI
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8888",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CourseInfo(BaseModel):
    title: str
    information: str
    webhook_url: str

class SkillsOutput(BaseModel):
    skills: list[str]

async def get_skills_from_openai(course_info: str) -> list:
    client = OpenAI(api_key=OPENAI_API_KEY)

    chat_completion = client.chat.completions.create(
        messages=[
        {
            "role": "user",
            "content": f"Extract the skills learned from the following course information:\n\n{course_info}:\nStructure the output into a JSON format. Here is an example: \"skills\": [\n    \"data manipulation\",\n    \"statistical analysis\",\n    \"machine learning techniques\"",
        }
    ],
    model="gpt-4o-mini",
    response_format={ "type": "json_object" }
    )
    
    skills_text = chat_completion.choices[0].message.content.strip()
    skills = skills_text.split(", ")
    return skills

async def send_to_webhook(webhook_url: str, data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(webhook_url, json=data)
        response.raise_for_status()
        
@app.post("/process-course/")
async def process_course(course_info: CourseInfo):
    try:
        skills = await get_skills_from_openai(f"{course_info.title}: {course_info.information}")
        skills_output = SkillsOutput(skills=skills)
        await send_to_webhook(course_info.webhook_url, skills_output.dict())
        return {"message": "Skills processed and sent to the webhook successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
