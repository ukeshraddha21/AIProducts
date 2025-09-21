import requests
import sys
import json
import time
from datetime import datetime

class StoryTestMVPTester:
    def __init__(self, base_url="https://testcase-forge-2.preview.emergentagent.com"):
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

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 1000:
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
            "description": "As a user, I want to be able to log into the system using my email and password so that I can access my personal dashboard and manage my account settings. The system should validate credentials, handle failed login attempts, and provide secure session management."
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
        """Test generating test case titles for all 6 categories"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        print("   Note: This test may take 30-60 seconds due to AI processing...")
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
            print(f"   ✅ Categories: {', '.join(categories)}")
            
            # Verify we have exactly 6 categories
            expected_categories = ["Unit Tests", "API Tests", "Database Tests", "Security Tests", "Manual Tests", "Automation Tests"]
            if len(categories) == 6 and all(cat in expected_categories for cat in categories):
                print("   ✅ All 6 expected categories generated")
            else:
                print(f"   ⚠️ Expected 6 categories, got {len(categories)}")
            
            # Verify we have 10 test cases per category (60 total)
            if generated_count == 60:
                print("   ✅ Generated exactly 60 test case titles (10 per category)")
            else:
                print(f"   ⚠️ Expected 60 test titles, got {generated_count}")
            
            # Check test case structure
            if test_titles:
                first_title = test_titles[0]
                required_fields = ['id', 'story_id', 'test_category', 'test_case_title', 'priority', 'complexity', 'severity', 'defect_likelihood_score', 'defect_likelihood_color']
                for field in required_fields:
                    if field in first_title:
                        print(f"   ✅ Test title has {field}: {first_title[field]}")
                    else:
                        print(f"   ⚠️ Test title missing field: {field}")
                
                # Check risk assessment
                score = first_title.get('defect_likelihood_score', 0)
                color = first_title.get('defect_likelihood_color', '')
                if 0 <= score <= 1 and color in ['Red', 'Yellow', 'Green']:
                    print(f"   ✅ Risk assessment valid: {score:.2f} ({color})")
                else:
                    print(f"   ⚠️ Invalid risk assessment: {score} ({color})")
        
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
            
            # Group by category to verify 10 per category
            categories = {}
            for title in response:
                cat = title.get('test_category', 'Unknown')
                categories[cat] = categories.get(cat, 0) + 1
            
            print("   Category distribution:")
            for cat, count in categories.items():
                status = "✅" if count == 10 else "⚠️"
                print(f"     {status} {cat}: {count} test cases")
        
        return success, response

    def test_get_all_test_titles(self):
        """Test getting all test case titles"""
        success, response = self.run_test("Get All Test Titles", "GET", "test-titles", 200)
        
        if success and isinstance(response, list):
            print(f"   ✅ Retrieved {len(response)} total test case titles")
        
        return success, response

    def test_dashboard_stats(self):
        """Test getting dashboard statistics"""
        success, response = self.run_test("Get Dashboard Stats", "GET", "dashboard/stats", 200)
        
        if success:
            # Verify expected fields in dashboard stats
            expected_fields = [
                'total_stories', 'total_test_titles', 'high_risk_count', 
                'medium_risk_count', 'low_risk_count', 'average_defect_likelihood',
                'category_distribution', 'recent_stories', 'recent_titles'
            ]
            for field in expected_fields:
                if field in response:
                    value = response[field]
                    if field == 'average_defect_likelihood':
                        print(f"   ✅ {field}: {value:.2f}")
                    elif field in ['category_distribution', 'recent_stories', 'recent_titles']:
                        if isinstance(value, (list, dict)):
                            print(f"   ✅ {field}: {len(value)} items")
                        else:
                            print(f"   ✅ {field}: {value}")
                    else:
                        print(f"   ✅ {field}: {value}")
                else:
                    print(f"   ⚠️ Missing field: {field}")
        
        return success, response

    def test_risk_assessment_stats(self):
        """Test getting risk assessment statistics"""
        success, response = self.run_test("Get Risk Assessment Stats", "GET", "risk-assessment", 200)
        
        if success:
            # Verify expected fields in risk assessment stats
            expected_fields = [
                'total_test_cases', 'high_risk_count', 'medium_risk_count', 
                'low_risk_count', 'average_defect_likelihood'
            ]
            for field in expected_fields:
                if field in response:
                    value = response[field]
                    if field == 'average_defect_likelihood':
                        print(f"   ✅ {field}: {value:.2f}")
                    else:
                        print(f"   ✅ {field}: {value}")
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

    def test_risk_calculation_algorithm(self):
        """Test the risk calculation algorithm with known values"""
        if not self.created_story_id:
            print("❌ Skipped - No story ID available")
            return False, {}
        
        # Get test titles to verify risk calculation
        success, response = self.run_test(
            "Verify Risk Calculation",
            "GET",
            f"stories/{self.created_story_id}/test-titles",
            200
        )
        
        if success and isinstance(response, list):
            print("   Verifying risk calculation algorithm...")
            
            for title in response[:5]:  # Check first 5 titles
                priority = title.get('priority', '')
                complexity = title.get('complexity', '')
                severity = title.get('severity', '')
                score = title.get('defect_likelihood_score', 0)
                color = title.get('defect_likelihood_color', '')
                
                # Manual calculation based on backend algorithm
                priority_weights = {'High': 0.4, 'Medium': 0.25, 'Low': 0.1}
                complexity_weights = {'Complex': 0.35, 'Moderate': 0.2, 'Simple': 0.05}
                severity_weights = {'Critical': 0.3, 'Major': 0.2, 'Minor': 0.05}
                
                expected_score = (
                    priority_weights.get(priority, 0.1) +
                    complexity_weights.get(complexity, 0.05) +
                    severity_weights.get(severity, 0.05)
                )
                expected_score = min(expected_score, 1.0)
                
                expected_color = "Red" if expected_score >= 0.7 else "Yellow" if expected_score >= 0.4 else "Green"
                
                if abs(score - expected_score) < 0.01 and color == expected_color:
                    print(f"   ✅ Risk calculation correct: {priority}/{complexity}/{severity} = {score:.2f} ({color})")
                else:
                    print(f"   ⚠️ Risk calculation mismatch: Expected {expected_score:.2f} ({expected_color}), got {score:.2f} ({color})")
        
        return success, response

def main():
    print("🚀 Starting StoryTest Parser MVP API Tests")
    print("🎯 Testing Test Case Title Generation with Risk Assessment")
    print("=" * 70)
    
    tester = StoryTestMVPTester()
    
    # Test sequence for MVP functionality
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
        ("Risk Calculation Algorithm", tester.test_risk_calculation_algorithm),
    ]
    
    print(f"\n📋 Running {len(tests)} MVP API tests...")
    
    for test_name, test_func in tests:
        try:
            test_func()
            # Small delay between tests
            time.sleep(2)
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 70)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All MVP tests passed!")
        print("✅ Test Case Title Generation MVP is working correctly")
        return 0
    else:
        failed_tests = tester.tests_run - tester.tests_passed
        print(f"⚠️ {failed_tests} tests failed")
        print("❌ MVP functionality needs attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())