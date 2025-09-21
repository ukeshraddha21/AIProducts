from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid
from datetime import datetime
from resume_generator import ResumeGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactFormData(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class PersonalInfo(BaseModel):
    name: str
    title: str
    location: str
    email: str
    linkedin: str
    careerVision: str

class Experience(BaseModel):
    company: str
    position: str
    duration: str
    location: str
    highlights: List[str]

class Project(BaseModel):
    title: str
    category: str
    description: str
    technologies: List[str]
    impact: str

class Skill(BaseModel):
    name: str

class SkillCategory(BaseModel):
    category: str
    skills: List[Skill]

class Certification(BaseModel):
    name: str
    issuer: str
    description: str
    date: str

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    experience: List[Experience]
    projects: List[Project]
    skills: List[SkillCategory]
    certifications: List[Certification]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.get("/resume/download")
async def download_resume():
    """Generate and download a styled PDF resume"""
    try:
        # Mock data - in a real app, this would come from database
        mock_personal_info = {
            "name": "Shraddha Uke",
            "title": "Certified Scrum Product Owner (CSPO®)",
            "location": "India",
            "email": "uke.shraddha954@gmail.com",
            "linkedin": "https://linkedin.com/in/shraddha-uke",
            "careerVision": "Certified Scrum Product Owner (CSPO®) with proven success across B2B SaaS, Investment Banking, and Insurance domains. Deep expertise in stakeholder engagement, process optimization, and data-driven product decisions. Believer in minimalist, outcome-driven delivery and solving the right problems simply and effectively."
        }
        
        mock_experience = [
            {
                "company": "6sense Insights India Pvt Ltd",
                "position": "Associate Engineering Manager, QA",
                "duration": "Apr 2023 - Present",
                "location": "Pune, India",
                "highlights": [
                    "Partnered with Product Managers to shape roadmap-aligned deliverables",
                    "Leveraged AI-based analytics improving roadmap alignment by 25%",
                    "Spearheaded global database migration across 10 feature teams",
                    "Championed Agile practices boosting QA team efficiency by 40%"
                ]
            },
            {
                "company": "6sense Insights India Pvt Ltd", 
                "position": "Lead QA Engineer",
                "duration": "Apr 2022 - Mar 2023",
                "location": "Pune, India",
                "highlights": [
                    "Served as proxy Product Owner across Agile pods",
                    "Facilitated Agile ceremonies and backlog refinement",
                    "Mentored junior engineers in product-first thinking",
                    "Automated QA reporting reducing manual effort by 25%"
                ]
            },
            {
                "company": "Wipro Technologies",
                "position": "Senior Test Engineer / Analyst",
                "duration": "Jan 2013 - Aug 2020", 
                "location": "Pune, India",
                "highlights": [
                    "Led QA for Royal Sun Alliance and Credit Suisse projects",
                    "Achieved 30% reduction in critical defects",
                    "Led automation initiatives cutting regression testing by 40%",
                    "Facilitated stakeholder communication for 90%+ on-time delivery"
                ]
            }
        ]
        
        mock_projects = [
            {
                "title": "Sales Intelligence Platform",
                "category": "Product Management",
                "description": "Led Agile delivery for actionable insights platform improving lead targeting and conversion. Partnered with product teams to enhance feature adoption by 25% through data-driven enhancements.",
                "technologies": ["JIRA", "Confluence", "Agile", "Data Analytics"],
                "impact": "25% improvement in feature adoption"
            },
            {
                "title": "Marketing Insights Analytics",
                "category": "Product Management", 
                "description": "Directed backlog prioritization for campaign performance analysis platform. Implemented iterative feedback loops reducing post-production defects and optimizing ROI tracking.",
                "technologies": ["API Testing", "Postman", "CI/CD", "Analytics"],
                "impact": "15% decrease in post-release defects"
            },
            {
                "title": "Pipeline Intelligence Tool",
                "category": "Product Management",
                "description": "Managed end-to-end QA and product delivery for sales pipeline forecasting system. Achieved 20% faster sprint completions through cross-team collaboration and alignment.",
                "technologies": ["SQL", "TestRail", "Scrum", "Forecasting"],
                "impact": "20% faster sprint completions"
            },
            {
                "title": "QA Automation Framework",
                "category": "QA Leadership",
                "description": "Led automation initiatives for insurance and banking clients including Royal Sun Alliance and Credit Suisse. Cut regression testing time by 40% and achieved 95% test coverage.",
                "technologies": ["TestRail", "HP ALM", "JMeter", "Automation"],
                "impact": "40% reduction in testing time"
            }
        ]
        
        mock_skills = [
            {
                "category": "Product Ownership",
                "skills": [
                    {"name": "Backlog Management"}, {"name": "User Story Mapping"}, 
                    {"name": "Stakeholder Collaboration"}, {"name": "MVP Strategy"}
                ]
            },
            {
                "category": "Agile & Scrum",
                "skills": [
                    {"name": "Sprint Planning"}, {"name": "Agile Facilitation"}, 
                    {"name": "Scrum Events"}, {"name": "Agile Coaching"}
                ]
            },
            {
                "category": "Technical Tools",
                "skills": [
                    {"name": "JIRA"}, {"name": "Confluence"}, 
                    {"name": "API Testing"}, {"name": "SQL"}
                ]
            },
            {
                "category": "Analytics & AI",
                "skills": [
                    {"name": "Data-Driven Decisions"}, {"name": "AI-Powered Insights"}, 
                    {"name": "Product Analytics"}, {"name": "Process Optimization"}
                ]
            }
        ]
        
        mock_certifications = [
            {
                "name": "Certified Scrum Product Owner (CSPO)®",
                "issuer": "Scrum Alliance",
                "description": "Mastered Agile product ownership, backlog management, user story slicing, prioritization, and stakeholder collaboration.",
                "date": "2023"
            },
            {
                "name": "Certified ScrumMaster (CSM)®",
                "issuer": "Scrum Alliance", 
                "description": "Built expertise in Agile facilitation, team coaching, and servant leadership.",
                "date": "2022"
            },
            {
                "name": "AI for Product Owners (AI-PO)",
                "issuer": "Scrum Alliance",
                "description": "Leveraged AI tools for data-driven product decisions and customer insights.",
                "date": "2024"
            },
            {
                "name": "AI-SM Micro-credential",
                "issuer": "Scrum Alliance",
                "description": "Advanced AI integration in Scrum and product management workflows.",
                "date": "2024"
            },
            {
                "name": "McKinsey.org Forward Program",
                "issuer": "McKinsey & Company",
                "description": "Trained in problem-solving, strategic thinking, and agile collaboration.",
                "date": "2023"
            },
            {
                "name": "Project Management Skills for Leaders",
                "issuer": "LinkedIn",
                "description": "Translated big-picture goals into actions and enhanced leadership capabilities.",
                "date": "2023"
            }
        ]
        
        # Generate PDF
        generator = ResumeGenerator()
        pdf_buffer = generator.generate_resume_pdf(
            mock_personal_info, 
            mock_experience, 
            mock_projects, 
            mock_skills, 
            mock_certifications
        )
        
        # Return PDF as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=Shraddha_Uke_Resume.pdf"
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating resume PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate resume PDF")

@api_router.post("/contact/submit")
async def submit_contact_form(form_data: ContactFormData):
    """Handle contact form submission"""
    try:
        # Validate form data
        if not all([form_data.name, form_data.email, form_data.subject, form_data.message]):
            raise HTTPException(status_code=400, detail="All fields are required")
        
        # Store contact form submission in database
        contact_dict = form_data.dict()
        contact_dict["id"] = str(uuid.uuid4())
        contact_dict["timestamp"] = datetime.utcnow()
        contact_dict["status"] = "received"
        
        _ = await db.contact_submissions.insert_one(contact_dict)
        
        logger.info(f"Contact form submitted by {form_data.name} ({form_data.email})")
        
        return {
            "success": True,
            "message": "Thank you for your message! I'll get back to you soon."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process contact form")

@api_router.get("/contact/submissions")
async def get_contact_submissions():
    """Get all contact form submissions (for admin use)"""
    try:
        submissions = await db.contact_submissions.find().to_list(100)
        # Convert ObjectId to string for JSON serialization
        for submission in submissions:
            if '_id' in submission:
                submission['_id'] = str(submission['_id'])
        return submissions
    except Exception as e:
        logger.error(f"Error retrieving contact submissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve contact submissions")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
