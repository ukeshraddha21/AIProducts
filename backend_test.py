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

    def test_story_coverage(self):
        """Test getting detailed coverage for a specific story"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        success, response = self.run_test(
            "Get Story Coverage",
            "GET",
            f"stories/{self.created_story_id}/coverage",
            200
        )
        
        if success:
            # Verify expected fields in story coverage
            expected_fields = ['story_id', 'test_types', 'total_tests', 'passed_tests', 'failed_tests', 'coverage_percentage']
            for field in expected_fields:
                if field in response:
                    print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
            
            # Check test types coverage
            if 'test_types' in response:
                test_types = response['test_types']
                print(f"   Test type coverage: {len(test_types)} types")
                for test_type, info in test_types.items():
                    status = info.get('status', 'unknown')
                    print(f"     {test_type}: {status}")
        
        return success, response

    def test_story_test_mapping(self):
        """Test getting story-test mapping"""
        success, response = self.run_test("Get Story-Test Mapping", "GET", "story-test-mapping", 200)
        
        if success:
            if 'mapping' in response:
                mapping = response['mapping']
                print(f"   ✅ Found {len(mapping)} story mappings")
                
                # Check first mapping structure if available
                if mapping:
                    first_mapping = mapping[0]
                    expected_fields = ['story_id', 'story_title', 'test_types', 'total_tests', 'passed_tests', 'failed_tests', 'coverage_percentage']
                    for field in expected_fields:
                        if field in first_mapping:
                            print(f"   ✅ Mapping has {field}: {first_mapping[field]}")
                        else:
                            print(f"   ⚠️ Mapping missing field: {field}")
            else:
                print("   ⚠️ Missing 'mapping' field in response")
        
        return success, response

    def test_execute_tests(self):
        """Test executing tests (simulated)"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        # First get the tests for the story
        success, tests_response = self.run_test(
            "Get Tests for Execution",
            "GET",
            f"stories/{self.created_story_id}/tests",
            200
        )
        
        if not success or not tests_response:
            print("❌ Failed to get tests for execution")
            return False, {}
        
        if len(tests_response) == 0:
            print("❌ No tests available for execution")
            return False, {}
        
        # Execute the first test
        test_id = tests_response[0]['id']
        execution_data = {
            "test_ids": [test_id]
        }
        
        success, response = self.run_test(
            "Execute Tests",
            "POST",
            "tests/execute",
            200,
            data=execution_data
        )
        
        if success:
            executed_count = response.get('executed_tests', 0)
            results = response.get('results', [])
            print(f"   ✅ Executed {executed_count} tests")
            
            # Check results structure
            for i, result in enumerate(results):
                if 'status' in result and 'duration' in result:
                    print(f"   ✅ Result {i+1}: {result['status']} ({result.get('duration', 0):.2f}s)")
                else:
                    print(f"   ⚠️ Result {i+1} missing required fields")
        
        return success, response

    def test_enhanced_dashboard_stats(self):
        """Test enhanced dashboard statistics with all 6 stats cards"""
        success, response = self.run_test("Get Enhanced Dashboard Stats", "GET", "dashboard/stats", 200)
        
        if success:
            # Verify all 6 stats card fields
            stats_fields = [
                'total_stories', 'passed_tests', 'failed_tests', 'pending_tests',
                'avg_confidence_score', 'avg_testability_score'
            ]
            
            for field in stats_fields:
                if field in response:
                    value = response[field]
                    if field in ['avg_confidence_score', 'avg_testability_score']:
                        percentage = round(value * 100) if value else 0
                        print(f"   ✅ {field}: {percentage}%")
                    else:
                        print(f"   ✅ {field}: {value}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
            
            # Check recent activity sections
            activity_fields = ['recent_stories', 'recent_tests', 'recent_results']
            for field in activity_fields:
                if field in response:
                    items = response[field]
                    print(f"   ✅ {field}: {len(items)} items")
                else:
                    print(f"   ⚠️ Missing field: {field}")
        
        return success, response

    def test_generate_selective_tests(self):
        """Test generating selective test types"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        # Test generating only specific test types
        selective_data = {
            "test_types": ["security", "performance"],
            "framework": "Custom Framework"
        }
        
        print("   Note: This test may take 20-40 seconds due to AI test generation...")
        success, response = self.run_test(
            "Generate Selective Tests",
            "POST",
            f"stories/{self.created_story_id}/generate-tests",
            200,
            data=selective_data
        )
        
        if success:
            generated_count = response.get('generated_tests', 0)
            tests = response.get('tests', [])
            print(f"   ✅ Generated {generated_count} selective tests")
            
            # Verify only requested test types were generated
            test_types = [test.get('test_type') for test in tests]
            print(f"   Test types generated: {', '.join(test_types)}")
            
            # Check if tests have the custom framework
            for test in tests:
                if 'Custom Framework' in test.get('framework', ''):
                    print(f"   ✅ Custom framework used in {test['test_type']} test")
        
        return success, response

def main():
    print("🚀 Starting User Story to Test Case Parser API Tests")
    print("=" * 60)
    
    tester = StoryTestAPITester()
    
    # Test sequence - Enhanced with new features
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Story", tester.test_create_story),
        ("Get All Stories", tester.test_get_stories),
        ("Get Story by ID", tester.test_get_story_by_id),
        ("Parse Story with AI", tester.test_parse_story),
        ("Generate Tests", tester.test_generate_tests),
        ("Get Story Tests", tester.test_get_story_tests),
        ("Get All Tests", tester.test_get_all_tests),
        ("Enhanced Dashboard Stats", tester.test_enhanced_dashboard_stats),
        ("Coverage Stats", tester.test_coverage_stats),
        ("Story Coverage", tester.test_story_coverage),
        ("Story-Test Mapping", tester.test_story_test_mapping),
        ("Execute Tests", tester.test_execute_tests),
        ("Generate Selective Tests", tester.test_generate_selective_tests),
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