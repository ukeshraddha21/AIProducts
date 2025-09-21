from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import re
import random

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

# Initialize LLM Chat
emergent_key = os.environ.get('EMERGENT_LLM_KEY')

# Enhanced Models for MVP Test Case Title Generation
class UserStory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserStoryCreate(BaseModel):
    title: str
    description: str

class TestCaseTitle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    story_id: str
    test_category: str  # Unit, API, Database, Security, Manual, Automation
    test_case_title: str
    priority: str  # High, Medium, Low
    complexity: str  # Simple, Moderate, Complex
    severity: str  # Critical, Major, Minor
    defect_likelihood_score: float  # 0.0 to 1.0
    defect_likelihood_color: str  # Red, Yellow, Green
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestCaseGenerationRequest(BaseModel):
    story_id: str
    categories: Optional[List[str]] = None

class RiskAssessmentStats(BaseModel):
    total_test_cases: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    average_defect_likelihood: float

# Helper function to prepare data for MongoDB
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

# Helper function to parse data from MongoDB
def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if key.endswith('_at') and isinstance(value, str):
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

def calculate_defect_likelihood(priority: str, complexity: str, severity: str) -> tuple[float, str]:
    """Calculate defect likelihood score and color based on Priority, Complexity, and Severity"""
    
    # Priority weights (higher = more likely to cause defects if missed)
    priority_weights = {
        'High': 0.4,
        'Medium': 0.25,
        'Low': 0.1
    }
    
    # Complexity weights (higher complexity = more likely to have defects)
    complexity_weights = {
        'Complex': 0.35,
        'Moderate': 0.2,
        'Simple': 0.05
    }
    
    # Severity weights (higher severity = bigger impact if defect occurs)
    severity_weights = {
        'Critical': 0.3,
        'Major': 0.2,
        'Minor': 0.05
    }
    
    # Calculate weighted score (0.0 to 1.0)
    score = (
        priority_weights.get(priority, 0.1) +
        complexity_weights.get(complexity, 0.05) +
        severity_weights.get(severity, 0.05)
    )
    
    # Normalize to 0.0-1.0 range (max possible score is 1.05)
    score = min(score, 1.0)
    
    # Determine color based on score
    if score >= 0.7:
        color = "Red"
    elif score >= 0.4:
        color = "Yellow"
    else:
        color = "Green"
    
    return score, color

async def generate_test_case_titles_with_ai(story: UserStory, category: str) -> List[dict]:
    """Generate test case titles with metadata using OpenAI GPT-4o"""
    try:
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"test_titles_{uuid.uuid4()}",
            system_message=f"""You are an expert QA engineer specializing in {category} testing. 
            Generate exactly 10 comprehensive test case titles for the given user story.
            
            IMPORTANT REQUIREMENTS:
            1. Generate EXACTLY 10 test case titles (no more, no less)
            2. Each test case title should be concise, actionable, and unique
            3. Focus on {category} testing scenarios
            4. If truly not applicable for this category, return "NA" for all fields
            5. Cover edge cases, error scenarios, and happy path scenarios
            
            Return a JSON array with exactly 10 objects, each containing:
            - "test_case_title": string (concise, actionable title)
            - "priority": "High"|"Medium"|"Low"
            - "complexity": "Simple"|"Moderate"|"Complex"  
            - "severity": "Critical"|"Major"|"Minor"
            
            Example format:
            [
              {{
                "test_case_title": "Validate successful user login with valid credentials",
                "priority": "High",
                "complexity": "Simple", 
                "severity": "Critical"
              }},
              {{
                "test_case_title": "Verify login failure with invalid password",
                "priority": "High",
                "complexity": "Simple",
                "severity": "Major"
              }}
            ]
            
            Categories context:
            - Unit Tests: Test individual functions, methods, components in isolation
            - API Tests: Test REST endpoints, request/response validation, status codes
            - Database Tests: Test data persistence, queries, transactions, constraints
            - Security Tests: Test authentication, authorization, input validation, vulnerabilities
            - Manual Tests: Test user workflows, usability, exploratory scenarios
            - Automation Tests: Test automated workflows, regression scenarios, integration flows"""
        ).with_model("openai", "gpt-4o")
        
        story_context = f"""
        Title: {story.title}
        Description: {story.description}
        Category: {category}
        """
        
        user_message = UserMessage(
            text=f"Generate exactly 10 {category} test case titles with metadata for this user story:\n\n{story_context}"
        )
        
        response = await chat.send_message(user_message)
        
        # Clean the response and parse JSON
        response_text = response.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
            
        test_cases_data = json.loads(response_text)
        
        # Ensure we have exactly 10 test cases
        if len(test_cases_data) < 10:
            # Generate additional generic test cases to reach 10
            generic_cases = []
            for i in range(10 - len(test_cases_data)):
                generic_cases.append({
                    "test_case_title": f"Additional {category.lower()} test scenario {i+1}",
                    "priority": "Medium",
                    "complexity": "Moderate",
                    "severity": "Minor"
                })
            test_cases_data.extend(generic_cases)
        elif len(test_cases_data) > 10:
            # Take only first 10
            test_cases_data = test_cases_data[:10]
            
        return test_cases_data
        
    except Exception as e:
        logging.error(f"Error generating {category} test case titles: {str(e)}")
        # Return 10 placeholder test cases if AI fails
        return [
            {
                "test_case_title": f"{category} test case {i+1} - AI generation failed",
                "priority": "Medium",
                "complexity": "Moderate", 
                "severity": "Minor"
            } for i in range(10)
        ]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "StoryTest Parser - MVP for Test Case Title Generation with Risk Assessment"}

@api_router.post("/stories", response_model=UserStory)
async def create_story(story_input: UserStoryCreate):
    """Create a new user story"""
    story_dict = story_input.dict()
    story = UserStory(**story_dict)
    
    # Store in database
    story_data = prepare_for_mongo(story.dict())
    await db.user_stories.insert_one(story_data)
    
    return story

@api_router.get("/stories", response_model=List[UserStory])
async def get_stories():
    """Get all user stories"""
    stories = await db.user_stories.find().to_list(1000)
    return [UserStory(**parse_from_mongo(story)) for story in stories]

@api_router.get("/stories/{story_id}", response_model=UserStory)
async def get_story(story_id: str):
    """Get a specific user story"""
    story = await db.user_stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return UserStory(**parse_from_mongo(story))

@api_router.post("/stories/{story_id}/generate-test-titles")
async def generate_test_case_titles(story_id: str, request: TestCaseGenerationRequest = None):
    """Generate test case titles for a user story across all categories"""
    
    # Default categories if none specified
    categories = request.categories if request and request.categories else [
        "Unit Tests", "API Tests", "Database Tests", "Security Tests", "Manual Tests", "Automation Tests"
    ]
    
    story = await db.user_stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story_obj = UserStory(**parse_from_mongo(story))
    
    # Clear existing test case titles for this story
    await db.test_case_titles.delete_many({"story_id": story_id})
    
    generated_titles = []
    
    for category in categories:
        test_cases_data = await generate_test_case_titles_with_ai(story_obj, category)
        
        for test_case_data in test_cases_data:
            # Calculate defect likelihood score and color
            defect_score, defect_color = calculate_defect_likelihood(
                test_case_data["priority"],
                test_case_data["complexity"], 
                test_case_data["severity"]
            )
            
            test_case_title = TestCaseTitle(
                story_id=story_id,
                test_category=category,
                test_case_title=test_case_data["test_case_title"],
                priority=test_case_data["priority"],
                complexity=test_case_data["complexity"],
                severity=test_case_data["severity"],
                defect_likelihood_score=defect_score,
                defect_likelihood_color=defect_color
            )
            
            # Store in database
            title_data = prepare_for_mongo(test_case_title.dict())
            await db.test_case_titles.insert_one(title_data)
            generated_titles.append(test_case_title)
    
    return {
        "generated_count": len(generated_titles),
        "categories": categories,
        "test_case_titles": generated_titles
    }

@api_router.get("/stories/{story_id}/test-titles", response_model=List[TestCaseTitle])
async def get_story_test_titles(story_id: str):
    """Get all test case titles for a story"""
    titles = await db.test_case_titles.find({"story_id": story_id}).to_list(1000)
    return [TestCaseTitle(**parse_from_mongo(title)) for title in titles]

@api_router.get("/test-titles", response_model=List[TestCaseTitle])
async def get_all_test_titles():
    """Get all test case titles"""
    titles = await db.test_case_titles.find().to_list(5000)
    return [TestCaseTitle(**parse_from_mongo(title)) for title in titles]

@api_router.get("/test-titles/export/{format}")
async def export_test_titles(format: str, story_id: str = None):
    """Export test case titles in CSV or JSON format"""
    from fastapi.responses import StreamingResponse
    import csv
    import io
    
    # Get test titles (filtered by story if specified)
    if story_id:
        titles = await db.test_case_titles.find({"story_id": story_id}).to_list(5000)
    else:
        titles = await db.test_case_titles.find().to_list(5000)
    
    if not titles:
        raise HTTPException(status_code=404, detail="No test titles found")
    
    # Get story information for export
    story_titles = {}
    for title in titles:
        if title["story_id"] not in story_titles:
            story = await db.user_stories.find_one({"id": title["story_id"]})
            story_titles[title["story_id"]] = story["title"] if story else "Unknown Story"
    
    if format.lower() == "csv":
        # Generate CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "User Story", "Test Category", "Test Case Title", 
            "Priority", "Complexity", "Severity", "Defect Likelihood Score", "Risk Level"
        ])
        
        # Write data
        for title in titles:
            writer.writerow([
                story_titles.get(title["story_id"], "Unknown"),
                title["test_category"],
                title["test_case_title"],
                title["priority"],
                title["complexity"],
                title["severity"],
                f"{title['defect_likelihood_score']:.2f}",
                title["defect_likelihood_color"]
            ])
        
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=test_case_titles.csv"}
        )
    
    elif format.lower() == "json":
        # Generate JSON
        export_data = []
        for title in titles:
            export_data.append({
                "user_story": story_titles.get(title["story_id"], "Unknown"),
                "test_category": title["test_category"],
                "test_case_title": title["test_case_title"],
                "priority": title["priority"],
                "complexity": title["complexity"],
                "severity": title["severity"],
                "defect_likelihood_score": title["defect_likelihood_score"],
                "risk_level": title["defect_likelihood_color"]
            })
        
        return StreamingResponse(
            io.BytesIO(json.dumps(export_data, indent=2).encode()),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=test_case_titles.json"}
        )
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'csv' or 'json'")

@api_router.get("/risk-assessment", response_model=RiskAssessmentStats)
async def get_risk_assessment_stats():
    """Get risk assessment statistics"""
    # Get all test case titles
    titles = await db.test_case_titles.find().to_list(5000)
    
    if not titles:
        return RiskAssessmentStats(
            total_test_cases=0,
            high_risk_count=0,
            medium_risk_count=0,
            low_risk_count=0,
            average_defect_likelihood=0.0
        )
    
    # Calculate risk distribution
    high_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Red"])
    medium_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Yellow"])
    low_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Green"])
    
    # Calculate average defect likelihood
    total_score = sum(t["defect_likelihood_score"] for t in titles)
    average_score = total_score / len(titles) if titles else 0.0
    
    return RiskAssessmentStats(
        total_test_cases=len(titles),
        high_risk_count=high_risk_count,
        medium_risk_count=medium_risk_count,
        low_risk_count=low_risk_count,
        average_defect_likelihood=average_score
    )

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics for MVP"""
    # Basic counts
    total_stories = await db.user_stories.count_documents({})
    total_test_titles = await db.test_case_titles.count_documents({})
    
    # Risk assessment stats
    titles = await db.test_case_titles.find().to_list(5000)
    
    high_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Red"])
    medium_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Yellow"])
    low_risk_count = len([t for t in titles if t["defect_likelihood_color"] == "Green"])
    
    # Category distribution
    category_pipeline = [
        {"$group": {"_id": "$test_category", "count": {"$sum": 1}}}
    ]
    category_result = await db.test_case_titles.aggregate(category_pipeline).to_list(10)
    category_distribution = {item["_id"]: item["count"] for item in category_result}
    
    # Recent activity
    recent_stories = await db.user_stories.find().sort("created_at", -1).limit(5).to_list(5)
    recent_titles = await db.test_case_titles.find().sort("created_at", -1).limit(10).to_list(10)
    
    # Average defect likelihood
    total_score = sum(t["defect_likelihood_score"] for t in titles)
    average_defect_likelihood = total_score / len(titles) if titles else 0.0
    
    return {
        "total_stories": total_stories,
        "total_test_titles": total_test_titles,
        "high_risk_count": high_risk_count,
        "medium_risk_count": medium_risk_count,
        "low_risk_count": low_risk_count,
        "average_defect_likelihood": average_defect_likelihood,
        "category_distribution": category_distribution,
        "recent_stories": [UserStory(**parse_from_mongo(s)) for s in recent_stories],
        "recent_titles": [TestCaseTitle(**parse_from_mongo(t)) for t in recent_titles]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()