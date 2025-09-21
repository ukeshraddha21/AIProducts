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

# Enhanced Models
class UserStory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    acceptance_criteria: List[str] = []
    preconditions: List[str] = []
    actions: List[str] = []
    expected_outcomes: List[str] = []
    parsed: bool = False
    confidence_score: float = 0.0
    testability_score: float = 0.0
    suggestions: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserStoryCreate(BaseModel):
    title: str
    description: str

class TestCase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    story_id: str
    test_type: str  # unit, api, ui, security, performance, manual, database
    framework: str  # jest, cypress, pytest, etc.
    code: str
    description: str
    status: str = "pending"  # pending, passed, failed, error
    generated: bool = True
    editable: bool = True
    last_run: Optional[datetime] = None
    duration: Optional[float] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    test_case_id: str
    story_id: str
    status: str  # passed, failed, error, timeout
    duration: Optional[float] = None
    error_message: Optional[str] = None
    logs: Optional[str] = None
    environment: str = "test"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CoverageStats(BaseModel):
    total_stories: int
    covered_stories: int
    coverage_percentage: float
    test_types: Dict[str, int]

class StoryTestMapping(BaseModel):
    story_id: str
    story_title: str
    test_types: Dict[str, str]  # test_type: status
    total_tests: int
    passed_tests: int
    failed_tests: int
    coverage_percentage: float

class TestGenerationRequest(BaseModel):
    test_types: List[str]
    framework: Optional[str] = None

class TestExecutionRequest(BaseModel):
    test_ids: List[str]

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

async def parse_user_story_with_ai(story: str) -> dict:
    """Enhanced story parsing with confidence scoring"""
    try:
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"story_parser_{uuid.uuid4()}",
            system_message="""You are an expert business analyst and test engineer. 
            Parse user stories into structured components for test case generation.
            
            Return a JSON object with these exact keys:
            - "acceptance_criteria": array of specific, testable acceptance criteria
            - "preconditions": array of conditions that must be true before testing
            - "actions": array of specific actions/steps to be taken
            - "expected_outcomes": array of expected results/behaviors
            - "confidence_score": float 0-1 indicating how well the story was parsed
            - "testability_score": float 0-1 indicating how testable the story is
            - "suggestions": array of suggestions to improve story quality
            
            Make sure each criterion is specific, measurable, and testable.
            Focus on edge cases and error scenarios as well as happy path.
            Provide actionable suggestions for improving testability."""
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(
            text=f"Parse this user story into structured test components and evaluate its quality:\n\n{story}"
        )
        
        response = await chat.send_message(user_message)
        
        # Clean the response and parse JSON
        response_text = response.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
            
        parsed_data = json.loads(response_text)
        return parsed_data
        
    except Exception as e:
        logging.error(f"Error parsing user story: {str(e)}")
        # Return default structure if parsing fails
        return {
            "acceptance_criteria": ["Story needs to be manually reviewed"],
            "preconditions": ["System is accessible"],
            "actions": ["Execute the described functionality"],
            "expected_outcomes": ["Functionality works as described"],
            "confidence_score": 0.3,
            "testability_score": 0.3,
            "suggestions": ["Consider adding more specific acceptance criteria", "Define clearer success metrics"]
        }

async def generate_test_with_ai(story: UserStory, test_type: str, framework: str = None) -> dict:
    """Enhanced test generation with framework selection"""
    try:
        frameworks = {
            "unit": framework or "Jest (JavaScript/React)",
            "api": framework or "Jest with axios",
            "ui": framework or "Playwright",
            "security": framework or "Security checklist",
            "performance": framework or "k6 Performance testing",
            "manual": framework or "Manual test steps",
            "database": framework or "Database validation scripts"
        }
        
        selected_framework = frameworks.get(test_type, "Generic")
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"test_generator_{uuid.uuid4()}",
            system_message=f"""You are an expert test engineer. Generate {test_type} tests using {selected_framework}.
            
            Return a JSON object with these exact keys:
            - "code": the actual test code (or test steps for manual tests)
            - "description": brief description of what this test validates
            - "framework": the testing framework used
            - "estimated_duration": estimated execution time in seconds
            
            For JavaScript/Jest tests, use modern ES6+ syntax and best practices.
            For security tests, provide a comprehensive checklist format.
            For manual tests, provide clear step-by-step instructions.
            For performance tests, include load testing scenarios."""
        ).with_model("openai", "gpt-4o")
        
        story_context = f"""
        Title: {story.title}
        Description: {story.description}
        Acceptance Criteria: {', '.join(story.acceptance_criteria)}
        Actions: {', '.join(story.actions)}
        Expected Outcomes: {', '.join(story.expected_outcomes)}
        """
        
        user_message = UserMessage(
            text=f"Generate a comprehensive {test_type} test using {selected_framework} for this user story:\n\n{story_context}"
        )
        
        response = await chat.send_message(user_message)
        
        # Clean the response and parse JSON
        response_text = response.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
            
        test_data = json.loads(response_text)
        test_data["framework"] = selected_framework
        return test_data
        
    except Exception as e:
        logging.error(f"Error generating {test_type} test: {str(e)}")
        return {
            "code": f"// {test_type.title()} test placeholder - generation failed",
            "description": f"Placeholder {test_type} test",
            "framework": selected_framework,
            "estimated_duration": 30
        }

async def simulate_test_execution(test_case: TestCase) -> TestResult:
    """Simulate test execution for demo purposes"""
    # Simulate execution time
    duration = random.uniform(0.5, 5.0)
    
    # Simulate test results (80% pass rate)
    status_options = ["passed"] * 8 + ["failed"] * 2
    status = random.choice(status_options)
    
    error_message = None
    logs = f"Test executed successfully in {duration:.2f}s"
    
    if status == "failed":
        error_messages = [
            "AssertionError: Expected element to be visible",
            "TypeError: Cannot read property 'id' of undefined", 
            "TimeoutError: Element not found within 30 seconds",
            "ValidationError: Invalid email format",
            "NetworkError: Request failed with status 500"
        ]
        error_message = random.choice(error_messages)
        logs = f"Test failed after {duration:.2f}s - {error_message}"
    
    # Update test case status
    await db.test_cases.update_one(
        {"id": test_case.id},
        {"$set": {
            "status": status,
            "last_run": datetime.now(timezone.utc).isoformat(),
            "duration": duration,
            "error_message": error_message
        }}
    )
    
    # Create test result
    test_result = TestResult(
        test_case_id=test_case.id,
        story_id=test_case.story_id,
        status=status,
        duration=duration,
        error_message=error_message,
        logs=logs
    )
    
    result_data = prepare_for_mongo(test_result.dict())
    await db.test_results.insert_one(result_data)
    
    return test_result

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Enhanced User Story to Test Case Parser API"}

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

@api_router.post("/stories/{story_id}/parse")
async def parse_story(story_id: str):
    """Parse a user story using AI with enhanced features"""
    story = await db.user_stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story_obj = UserStory(**parse_from_mongo(story))
    
    # Parse with AI
    parsed_data = await parse_user_story_with_ai(f"{story_obj.title}\n\n{story_obj.description}")
    
    # Update story with parsed data
    update_data = {
        "acceptance_criteria": parsed_data["acceptance_criteria"],
        "preconditions": parsed_data["preconditions"],
        "actions": parsed_data["actions"],
        "expected_outcomes": parsed_data["expected_outcomes"],
        "confidence_score": parsed_data.get("confidence_score", 0.5),
        "testability_score": parsed_data.get("testability_score", 0.5),
        "suggestions": parsed_data.get("suggestions", []),
        "parsed": True
    }
    
    await db.user_stories.update_one({"id": story_id}, {"$set": update_data})
    
    # Return updated story
    updated_story = await db.user_stories.find_one({"id": story_id})
    return UserStory(**parse_from_mongo(updated_story))

@api_router.post("/stories/{story_id}/generate-tests")
async def generate_tests(story_id: str, request: TestGenerationRequest = None):
    """Generate test cases for a user story with framework selection"""
    if request is None:
        test_types = ["unit", "api", "ui", "security", "performance", "manual", "database"]
        framework = None
    else:
        test_types = request.test_types or ["unit", "api", "ui", "security", "performance", "manual", "database"]
        framework = request.framework
    
    story = await db.user_stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story_obj = UserStory(**parse_from_mongo(story))
    
    generated_tests = []
    
    for test_type in test_types:
        # Check if test already exists
        existing_test = await db.test_cases.find_one({"story_id": story_id, "test_type": test_type})
        if existing_test:
            continue  # Skip if test already exists
            
        test_data = await generate_test_with_ai(story_obj, test_type, framework)
        
        test_case = TestCase(
            story_id=story_id,
            test_type=test_type,
            framework=test_data["framework"],
            code=test_data["code"],
            description=test_data["description"]
        )
        
        # Store in database
        test_data_mongo = prepare_for_mongo(test_case.dict())
        await db.test_cases.insert_one(test_data_mongo)
        generated_tests.append(test_case)
    
    return {"generated_tests": len(generated_tests), "tests": generated_tests}

@api_router.get("/stories/{story_id}/tests", response_model=List[TestCase])
async def get_story_tests(story_id: str):
    """Get all test cases for a story"""
    tests = await db.test_cases.find({"story_id": story_id}).to_list(1000)
    return [TestCase(**parse_from_mongo(test)) for test in tests]

@api_router.get("/stories/{story_id}/coverage")
async def get_story_coverage(story_id: str):
    """Get detailed coverage information for a specific story"""
    tests = await db.test_cases.find({"story_id": story_id}).to_list(1000)
    
    test_types = ["unit", "api", "ui", "security", "performance", "manual", "database"]
    coverage_by_type = {}
    
    for test_type in test_types:
        test_for_type = next((t for t in tests if t["test_type"] == test_type), None)
        if test_for_type:
            coverage_by_type[test_type] = {
                "status": test_for_type.get("status", "pending"),
                "last_run": test_for_type.get("last_run"),
                "duration": test_for_type.get("duration")
            }
        else:
            coverage_by_type[test_type] = {
                "status": "missing",
                "last_run": None,
                "duration": None
            }
    
    total_tests = len(tests)
    passed_tests = len([t for t in tests if t.get("status") == "passed"])
    failed_tests = len([t for t in tests if t.get("status") == "failed"])
    coverage_percentage = (total_tests / len(test_types)) * 100
    
    return {
        "story_id": story_id,
        "test_types": coverage_by_type,
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "coverage_percentage": coverage_percentage
    }

@api_router.get("/tests", response_model=List[TestCase])
async def get_all_tests():
    """Get all test cases"""
    tests = await db.test_cases.find().to_list(1000)
    return [TestCase(**parse_from_mongo(test)) for test in tests]

@api_router.post("/tests/execute")
async def execute_tests(request: TestExecutionRequest):
    """Execute specified tests (simulated for demo)"""
    executed_tests = []
    
    for test_id in request.test_ids:
        test = await db.test_cases.find_one({"id": test_id})
        if not test:
            continue
            
        test_case = TestCase(**parse_from_mongo(test))
        result = await simulate_test_execution(test_case)
        executed_tests.append(result)
    
    return {"executed_tests": len(executed_tests), "results": executed_tests}

@api_router.get("/tests/{test_id}/results")
async def get_test_results(test_id: str):
    """Get test execution results for a specific test"""
    results = await db.test_results.find({"test_case_id": test_id}).to_list(100)
    return [TestResult(**parse_from_mongo(result)) for result in results]

@api_router.put("/tests/{test_id}")
async def update_test_code(test_id: str, code: str, description: str = None):
    """Update test code and description"""
    update_data = {"code": code}
    if description:
        update_data["description"] = description
    
    result = await db.test_cases.update_one({"id": test_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    
    updated_test = await db.test_cases.find_one({"id": test_id})
    return TestCase(**parse_from_mongo(updated_test))

@api_router.get("/coverage", response_model=CoverageStats)
async def get_coverage_stats():
    """Get test coverage statistics"""
    # Get total stories
    total_stories = await db.user_stories.count_documents({})
    
    # Get stories with tests
    pipeline = [
        {"$lookup": {
            "from": "test_cases",
            "localField": "id",
            "foreignField": "story_id",
            "as": "tests"
        }},
        {"$match": {"tests": {"$ne": []}}},
        {"$count": "covered_stories"}
    ]
    
    covered_result = await db.user_stories.aggregate(pipeline).to_list(1)
    covered_stories = covered_result[0]["covered_stories"] if covered_result else 0
    
    # Get test type distribution
    test_types_pipeline = [
        {"$group": {"_id": "$test_type", "count": {"$sum": 1}}}
    ]
    
    test_types_result = await db.test_cases.aggregate(test_types_pipeline).to_list(10)
    test_types = {item["_id"]: item["count"] for item in test_types_result}
    
    coverage_percentage = (covered_stories / total_stories * 100) if total_stories > 0 else 0
    
    return CoverageStats(
        total_stories=total_stories,
        covered_stories=covered_stories,
        coverage_percentage=coverage_percentage,
        test_types=test_types
    )

@api_router.get("/story-test-mapping")
async def get_story_test_mapping():
    """Get comprehensive story-test mapping"""
    pipeline = [
        {"$lookup": {
            "from": "test_cases",
            "localField": "id",
            "foreignField": "story_id",
            "as": "tests"
        }},
        {"$project": {
            "id": 1,
            "title": 1,
            "parsed": 1,
            "tests": 1
        }}
    ]
    
    stories_with_tests = await db.user_stories.aggregate(pipeline).to_list(1000)
    
    mapping = []
    for story in stories_with_tests:
        test_types = {}
        total_tests = len(story["tests"])
        passed_tests = 0
        failed_tests = 0
        
        for test in story["tests"]:
            test_types[test["test_type"]] = test.get("status", "pending")
            if test.get("status") == "passed":
                passed_tests += 1
            elif test.get("status") == "failed":
                failed_tests += 1
        
        coverage_percentage = (total_tests / 7) * 100  # 7 total test types
        
        mapping.append({
            "story_id": story["id"],
            "story_title": story["title"],
            "parsed": story.get("parsed", False),
            "test_types": test_types,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "coverage_percentage": coverage_percentage
        })
    
    return {"mapping": mapping}

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get enhanced dashboard statistics"""
    # Basic counts
    total_stories = await db.user_stories.count_documents({})
    total_tests = await db.test_cases.count_documents({})
    parsed_stories = await db.user_stories.count_documents({"parsed": True})
    
    # Test execution stats
    passed_tests = await db.test_cases.count_documents({"status": "passed"})
    failed_tests = await db.test_cases.count_documents({"status": "failed"})
    pending_tests = await db.test_cases.count_documents({"status": "pending"})
    
    # Recent activity
    recent_stories = await db.user_stories.find().sort("created_at", -1).limit(5).to_list(5)
    recent_tests = await db.test_cases.find().sort("created_at", -1).limit(5).to_list(5)
    recent_results = await db.test_results.find().sort("timestamp", -1).limit(10).to_list(10)
    
    # Test type distribution
    test_types_pipeline = [
        {"$group": {"_id": "$test_type", "count": {"$sum": 1}}}
    ]
    test_types_result = await db.test_cases.aggregate(test_types_pipeline).to_list(10)
    test_types = {item["_id"]: item["count"] for item in test_types_result}
    
    # Average scores
    avg_scores_pipeline = [
        {"$match": {"parsed": True}},
        {"$group": {
            "_id": None,
            "avg_confidence": {"$avg": "$confidence_score"},
            "avg_testability": {"$avg": "$testability_score"}
        }}
    ]
    avg_scores_result = await db.user_stories.aggregate(avg_scores_pipeline).to_list(1)
    avg_confidence = avg_scores_result[0]["avg_confidence"] if avg_scores_result else 0
    avg_testability = avg_scores_result[0]["avg_testability"] if avg_scores_result else 0
    
    return {
        "total_stories": total_stories,
        "total_tests": total_tests,
        "parsed_stories": parsed_stories,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "pending_tests": pending_tests,
        "coverage_percentage": (parsed_stories / total_stories * 100) if total_stories > 0 else 0,
        "test_types": test_types,
        "avg_confidence_score": avg_confidence,
        "avg_testability_score": avg_testability,
        "recent_stories": [UserStory(**parse_from_mongo(s)) for s in recent_stories],
        "recent_tests": [TestCase(**parse_from_mongo(t)) for t in recent_tests],
        "recent_results": [TestResult(**parse_from_mongo(r)) for r in recent_results]
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