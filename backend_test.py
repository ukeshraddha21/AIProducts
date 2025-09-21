import requests
import sys
import json
import time
from datetime import datetime

class AIStoryTestGeneratorTester:
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
                response = requests.get(url, headers=headers, params=params, timeout=60)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=60)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=60)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=60)

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
            print(f"❌ Failed - Request timeout (60s)")
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
            200,
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

    def test_generate_test_titles(self):
        """Test generating test case titles for a story with AI"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        print("   Note: This test may take 30-60 seconds due to AI test case generation...")
        success, response = self.run_test(
            "Generate Test Case Titles",
            "POST",
            f"stories/{self.created_story_id}/generate-test-titles",
            200
        )
        
        if success:
            generated_count = response.get('generated_count', 0)
            categories = response.get('categories', [])
            test_titles = response.get('test_case_titles', [])
            
            print(f"   ✅ Generated {generated_count} test case titles")
            print(f"   ✅ Categories covered: {', '.join(categories)}")
            
            # Verify we have 6 categories (Unit, API, Database, Security, Manual, Automation)
            expected_categories = ['Unit Tests', 'API Tests', 'Database Tests', 'Security Tests', 'Manual Tests', 'Automation Tests']
            if len(categories) == 6 and all(cat in expected_categories for cat in categories):
                print("   ✅ All 6 test categories covered")
            else:
                print(f"   ⚠️ Expected 6 categories, got {len(categories)}")
            
            # Verify each test case has required fields and risk assessment
            for i, test_title in enumerate(test_titles[:5]):  # Check first 5 for brevity
                required_fields = ['test_case_title', 'priority', 'complexity', 'severity', 'defect_likelihood_score', 'defect_likelihood_color']
                if all(key in test_title for key in required_fields):
                    risk_score = test_title['defect_likelihood_score']
                    risk_color = test_title['defect_likelihood_color']
                    print(f"   ✅ Test {i+1}: {test_title['test_category']} - Risk: {risk_color} ({risk_score:.2f})")
                else:
                    print(f"   ⚠️ Test {i+1} missing required fields")
        
        return success, response

    def test_get_story_test_titles(self):
        """Test getting test case titles for a specific story"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        success, response = self.run_test(
            "Get Story Test Titles",
            "GET",
            f"stories/{self.created_story_id}/test-titles",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Retrieved {len(response)} test case titles")
            
            # Verify minimum 10 test cases per category (60 total for 6 categories)
            if len(response) >= 60:
                print("   ✅ Minimum 60 test cases generated (10 per category)")
            else:
                print(f"   ⚠️ Expected minimum 60 test cases, got {len(response)}")
        
        return success, response

    def test_get_all_test_titles(self):
        """Test getting all test case titles"""
        return self.run_test("Get All Test Titles", "GET", "test-titles", 200)

    def test_dashboard_stats(self):
        """Test getting dashboard statistics"""
        success, response = self.run_test("Get Dashboard Stats", "GET", "dashboard/stats", 200)
        
        if success:
            # Verify expected fields in dashboard stats for AI StoryTest Generator
            expected_fields = ['total_stories', 'total_test_titles', 'high_risk_count', 'medium_risk_count', 'low_risk_count', 'average_defect_likelihood']
            for field in expected_fields:
                if field in response:
                    if field == 'average_defect_likelihood':
                        percentage = round(response[field] * 100) if response[field] else 0
                        print(f"   ✅ {field}: {percentage}%")
                    else:
                        print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
            
            # Check category distribution
            if 'category_distribution' in response:
                categories = response['category_distribution']
                print(f"   ✅ Category distribution: {len(categories)} categories")
                for category, count in categories.items():
                    print(f"     {category}: {count} test cases")
            
            # Check recent activity
            if 'recent_stories' in response:
                recent_stories = response['recent_stories']
                print(f"   ✅ Recent stories: {len(recent_stories)} items")
            
            if 'recent_titles' in response:
                recent_titles = response['recent_titles']
                print(f"   ✅ Recent test titles: {len(recent_titles)} items")
        
        return success, response

    def test_risk_assessment_stats(self):
        """Test getting risk assessment statistics"""
        success, response = self.run_test("Get Risk Assessment Stats", "GET", "risk-assessment", 200)
        
        if success:
            # Verify expected fields in risk assessment stats
            expected_fields = ['total_test_cases', 'high_risk_count', 'medium_risk_count', 'low_risk_count', 'average_defect_likelihood']
            for field in expected_fields:
                if field in response:
                    if field == 'average_defect_likelihood':
                        percentage = round(response[field] * 100) if response[field] else 0
                        print(f"   ✅ {field}: {percentage}%")
                    else:
                        print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
        
        return success, response

    def test_export_csv(self):
        """Test exporting test case titles as CSV"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        success, response = self.run_test(
            "Export Test Titles as CSV",
            "GET",
            f"test-titles/export/csv",
            200,
            params={"story_id": self.created_story_id}
        )
        
        if success:
            print("   ✅ CSV export successful")
        
        return success, response

    def test_export_json(self):
        """Test exporting test case titles as JSON"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        success, response = self.run_test(
            "Export Test Titles as JSON",
            "GET",
            f"test-titles/export/json",
            200,
            params={"story_id": self.created_story_id}
        )
        
        if success:
            print("   ✅ JSON export successful")
        
        return success, response

    def test_selective_test_generation(self):
        """Test generating test titles for specific categories"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        # Test generating only specific categories with correct request structure
        selective_data = {
            "story_id": self.created_story_id,
            "categories": ["Security Tests", "API Tests"]
        }
        
        print("   Note: This test may take 20-40 seconds due to AI test generation...")
        success, response = self.run_test(
            "Generate Selective Test Categories",
            "POST",
            f"stories/{self.created_story_id}/generate-test-titles",
            200,
            data=selective_data
        )
        
        if success:
            generated_count = response.get('generated_count', 0)
            categories = response.get('categories', [])
            test_titles = response.get('test_case_titles', [])
            
            print(f"   ✅ Generated {generated_count} test titles for selective categories")
            print(f"   ✅ Categories: {', '.join(categories)}")
            
            # Verify only requested categories were generated
            if len(categories) == 2 and 'Security Tests' in categories and 'API Tests' in categories:
                print("   ✅ Only requested categories generated")
            else:
                print(f"   ⚠️ Expected 2 specific categories, got {len(categories)}")
        
        return success, response

def main():
    print("🚀 Starting AI StoryTest Generator API Tests")
    print("=" * 60)
    
    tester = AIStoryTestGeneratorTester()
    
    # Test sequence - Comprehensive testing of all 5 core features
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Story", tester.test_create_story),
        ("Get All Stories", tester.test_get_stories),
        ("Get Story by ID", tester.test_get_story_by_id),
        ("Generate Test Case Titles", tester.test_generate_test_titles),
        ("Get Story Test Titles", tester.test_get_story_test_titles),
        ("Get All Test Titles", tester.test_get_all_test_titles),
        ("Dashboard Stats", tester.test_dashboard_stats),
        ("Risk Assessment Stats", tester.test_risk_assessment_stats),
        ("Export CSV", tester.test_export_csv),
        ("Export JSON", tester.test_export_json),
        ("Selective Test Generation", tester.test_selective_test_generation),
    ]
    
    print(f"\n📋 Running {len(tests)} API tests...")
    
    for test_name, test_func in tests:
        try:
            test_func()
            # Small delay between tests
            time.sleep(2)
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All API tests passed!")
        return 0
    else:
        print(f"⚠️ {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())