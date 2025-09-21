import requests
import sys
import json
import time
from datetime import datetime

class StoryTestAPITester:
    def __init__(self, base_url="https://storyqa-ai.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_story_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return success, response_data
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout (30s)")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_create_story(self):
        """Test creating a new user story"""
        story_data = {
            "title": "User Login Feature",
            "description": "As a user, I want to be able to log into the system using my email and password so that I can access my personal dashboard and manage my account settings."
        }
        
        success, response = self.run_test(
            "Create User Story",
            "POST",
            "stories",
            200,  # Changed from 201 to 200 based on FastAPI default
            data=story_data
        )
        
        if success and 'id' in response:
            self.created_story_id = response['id']
            print(f"   Created story ID: {self.created_story_id}")
        
        return success, response

    def test_get_stories(self):
        """Test getting all stories"""
        return self.run_test("Get All Stories", "GET", "stories", 200)

    def test_get_story_by_id(self):
        """Test getting a specific story by ID"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        return self.run_test(
            "Get Story by ID",
            "GET",
            f"stories/{self.created_story_id}",
            200
        )

    def test_parse_story(self):
        """Test parsing a story with AI"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        print("   Note: This test may take 10-30 seconds due to AI processing...")
        success, response = self.run_test(
            "Parse Story with AI",
            "POST",
            f"stories/{self.created_story_id}/parse",
            200
        )
        
        if success:
            # Verify the story was parsed correctly
            if response.get('parsed') == True:
                print("   ✅ Story marked as parsed")
                if response.get('acceptance_criteria'):
                    print(f"   ✅ Acceptance criteria generated: {len(response['acceptance_criteria'])} items")
                if response.get('preconditions'):
                    print(f"   ✅ Preconditions generated: {len(response['preconditions'])} items")
                if response.get('actions'):
                    print(f"   ✅ Actions generated: {len(response['actions'])} items")
                if response.get('expected_outcomes'):
                    print(f"   ✅ Expected outcomes generated: {len(response['expected_outcomes'])} items")
            else:
                print("   ⚠️ Story not marked as parsed")
        
        return success, response

    def test_generate_tests(self):
        """Test generating test cases for a story"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        print("   Note: This test may take 30-60 seconds due to AI test generation...")
        success, response = self.run_test(
            "Generate Tests for Story",
            "POST",
            f"stories/{self.created_story_id}/generate-tests",
            200
        )
        
        if success:
            generated_count = response.get('generated_tests', 0)
            tests = response.get('tests', [])
            print(f"   ✅ Generated {generated_count} tests")
            
            # Check test types
            test_types = [test.get('test_type') for test in tests]
            print(f"   Test types: {', '.join(test_types)}")
            
            # Verify each test has required fields
            for i, test in enumerate(tests):
                if all(key in test for key in ['test_type', 'framework', 'code', 'description']):
                    print(f"   ✅ Test {i+1} ({test['test_type']}) has all required fields")
                else:
                    print(f"   ⚠️ Test {i+1} missing required fields")
        
        return success, response

    def test_get_story_tests(self):
        """Test getting tests for a specific story"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        return self.run_test(
            "Get Story Tests",
            "GET",
            f"stories/{self.created_story_id}/tests",
            200
        )

    def test_get_all_tests(self):
        """Test getting all test cases"""
        return self.run_test("Get All Tests", "GET", "tests", 200)

    def test_dashboard_stats(self):
        """Test getting dashboard statistics"""
        success, response = self.run_test("Get Dashboard Stats", "GET", "dashboard/stats", 200)
        
        if success:
            # Verify expected fields in dashboard stats
            expected_fields = ['total_stories', 'total_tests', 'parsed_stories', 'coverage_percentage', 'test_types']
            for field in expected_fields:
                if field in response:
                    print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
        
        return success, response

    def test_coverage_stats(self):
        """Test getting coverage statistics"""
        success, response = self.run_test("Get Coverage Stats", "GET", "coverage", 200)
        
        if success:
            # Verify expected fields in coverage stats
            expected_fields = ['total_stories', 'covered_stories', 'coverage_percentage', 'test_types']
            for field in expected_fields:
                if field in response:
                    print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
        
        return success, response

def main():
    print("🚀 Starting User Story to Test Case Parser API Tests")
    print("=" * 60)
    
    tester = StoryTestAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Story", tester.test_create_story),
        ("Get All Stories", tester.test_get_stories),
        ("Get Story by ID", tester.test_get_story_by_id),
        ("Parse Story with AI", tester.test_parse_story),
        ("Generate Tests", tester.test_generate_tests),
        ("Get Story Tests", tester.test_get_story_tests),
        ("Get All Tests", tester.test_all_tests),
        ("Dashboard Stats", tester.test_dashboard_stats),
        ("Coverage Stats", tester.test_coverage_stats),
    ]
    
    print(f"\n📋 Running {len(tests)} API tests...")
    
    for test_name, test_func in tests:
        try:
            test_func()
            # Small delay between tests
            time.sleep(1)
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️ {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())