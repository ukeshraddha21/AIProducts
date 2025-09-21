#!/usr/bin/env python3
"""
Backend API Testing Suite for Shraddha Uke's Portfolio Application
Tests all backend endpoints including resume download, contact form, and error handling
"""

import requests
import json
import io
import PyPDF2
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://shraddha-design.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.session = requests.Session()
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_resume_download(self):
        """Test GET /api/resume/download endpoint"""
        print("🔍 Testing Resume Download Endpoint...")
        
        try:
            # Test resume download
            response = self.session.get(f"{API_BASE_URL}/resume/download", timeout=30)
            
            if response.status_code == 200:
                # Check content type
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' not in content_type:
                    self.log_test(
                        "Resume Download - Content Type",
                        False,
                        f"Expected PDF content type, got: {content_type}"
                    )
                    return
                
                # Check content disposition header
                content_disposition = response.headers.get('content-disposition', '')
                if 'attachment' not in content_disposition or 'filename' not in content_disposition:
                    self.log_test(
                        "Resume Download - Headers",
                        False,
                        f"Missing proper download headers: {content_disposition}"
                    )
                    return
                
                # Verify PDF content
                try:
                    pdf_content = io.BytesIO(response.content)
                    pdf_reader = PyPDF2.PdfReader(pdf_content)
                    
                    if len(pdf_reader.pages) == 0:
                        self.log_test(
                            "Resume Download - PDF Content",
                            False,
                            "PDF has no pages"
                        )
                        return
                    
                    # Extract text from all pages to verify content
                    full_text = ""
                    for page in pdf_reader.pages:
                        full_text += page.extract_text()
                    
                    # Check for key resume sections
                    required_sections = [
                        "Shraddha Uke",
                        "Certified Scrum Product Owner",
                        "uke.shraddha954@gmail.com",
                        "PROFESSIONAL EXPERIENCE",
                        "CORE COMPETENCIES",
                        "CERTIFICATIONS"
                    ]
                    
                    missing_sections = []
                    for section in required_sections:
                        if section not in full_text:
                            missing_sections.append(section)
                    
                    if missing_sections:
                        self.log_test(
                            "Resume Download - Content Verification",
                            False,
                            f"Missing required sections: {missing_sections}",
                            {"pdf_size": len(response.content), "pages": len(pdf_reader.pages)}
                        )
                        return
                    
                    self.log_test(
                        "Resume Download",
                        True,
                        "PDF generated successfully with all required sections",
                        {
                            "pdf_size": len(response.content),
                            "pages": len(pdf_reader.pages),
                            "content_type": content_type,
                            "filename": content_disposition
                        }
                    )
                    
                except Exception as pdf_error:
                    self.log_test(
                        "Resume Download - PDF Parsing",
                        False,
                        f"Failed to parse PDF: {str(pdf_error)}"
                    )
                    
            else:
                self.log_test(
                    "Resume Download",
                    False,
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Resume Download",
                False,
                f"Request failed: {str(e)}"
            )

    def test_contact_form_submission(self):
        """Test POST /api/contact/submit endpoint"""
        print("🔍 Testing Contact Form Submission...")
        
        # Test valid submission
        valid_data = {
            "name": "Shraddha Test User",
            "email": "shraddha.test@example.com",
            "subject": "Portfolio Inquiry",
            "message": "I'm interested in learning more about your product management experience and would like to discuss potential collaboration opportunities."
        }
        
        try:
            response = self.session.post(
                f"{API_BASE_URL}/contact/submit",
                json=valid_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('success') and response_data.get('message'):
                    self.log_test(
                        "Contact Form - Valid Submission",
                        True,
                        "Form submitted successfully",
                        {"response": response_data}
                    )
                else:
                    self.log_test(
                        "Contact Form - Valid Submission",
                        False,
                        f"Invalid response format: {response_data}"
                    )
            else:
                self.log_test(
                    "Contact Form - Valid Submission",
                    False,
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Contact Form - Valid Submission",
                False,
                f"Request failed: {str(e)}"
            )

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        print("🔍 Testing Contact Form Validation...")
        
        # Test missing required fields
        invalid_data_sets = [
            {"name": "", "email": "test@example.com", "subject": "Test", "message": "Test message"},
            {"name": "Test User", "email": "", "subject": "Test", "message": "Test message"},
            {"name": "Test User", "email": "test@example.com", "subject": "", "message": "Test message"},
            {"name": "Test User", "email": "test@example.com", "subject": "Test", "message": ""},
            {}  # Empty data
        ]
        
        for i, invalid_data in enumerate(invalid_data_sets):
            try:
                response = self.session.post(
                    f"{API_BASE_URL}/contact/submit",
                    json=invalid_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code in [400, 422]:
                    self.log_test(
                        f"Contact Form - Validation Test {i+1}",
                        True,
                        f"Properly rejected invalid data with status {response.status_code}",
                        {"invalid_data": invalid_data, "response": response.text}
                    )
                else:
                    self.log_test(
                        f"Contact Form - Validation Test {i+1}",
                        False,
                        f"Should have returned 400/422, got {response.status_code}",
                        {"invalid_data": invalid_data}
                    )
                    
            except requests.exceptions.RequestException as e:
                self.log_test(
                    f"Contact Form - Validation Test {i+1}",
                    False,
                    f"Request failed: {str(e)}"
                )

    def test_contact_submissions_retrieval(self):
        """Test GET /api/contact/submissions endpoint"""
        print("🔍 Testing Contact Submissions Retrieval...")
        
        try:
            response = self.session.get(f"{API_BASE_URL}/contact/submissions", timeout=10)
            
            if response.status_code == 200:
                submissions = response.json()
                if isinstance(submissions, list):
                    self.log_test(
                        "Contact Submissions Retrieval",
                        True,
                        f"Retrieved {len(submissions)} submissions",
                        {"count": len(submissions)}
                    )
                else:
                    self.log_test(
                        "Contact Submissions Retrieval",
                        False,
                        f"Expected list, got: {type(submissions)}"
                    )
            else:
                self.log_test(
                    "Contact Submissions Retrieval",
                    False,
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Contact Submissions Retrieval",
                False,
                f"Request failed: {str(e)}"
            )

    def test_error_handling(self):
        """Test error handling for invalid endpoints and scenarios"""
        print("🔍 Testing Error Handling...")
        
        # Test 404 for invalid endpoint
        try:
            response = self.session.get(f"{API_BASE_URL}/invalid/endpoint", timeout=10)
            if response.status_code == 404:
                self.log_test(
                    "Error Handling - 404",
                    True,
                    "Properly returns 404 for invalid endpoint"
                )
            else:
                self.log_test(
                    "Error Handling - 404",
                    False,
                    f"Expected 404, got {response.status_code}"
                )
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Error Handling - 404",
                False,
                f"Request failed: {str(e)}"
            )

        # Test invalid JSON data
        try:
            response = self.session.post(
                f"{API_BASE_URL}/contact/submit",
                data="invalid json",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            if response.status_code in [400, 422]:
                self.log_test(
                    "Error Handling - Invalid JSON",
                    True,
                    f"Properly handles invalid JSON with status {response.status_code}"
                )
            else:
                self.log_test(
                    "Error Handling - Invalid JSON",
                    False,
                    f"Expected 400/422, got {response.status_code}"
                )
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Error Handling - Invalid JSON",
                False,
                f"Request failed: {str(e)}"
            )

    def test_cors_configuration(self):
        """Test CORS configuration"""
        print("🔍 Testing CORS Configuration...")
        
        try:
            # Test preflight request
            response = self.session.options(
                f"{API_BASE_URL}/contact/submit",
                headers={
                    'Origin': 'https://shraddha-design.preview.emergentagent.com',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                },
                timeout=10
            )
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            }
            
            if any(cors_headers.values()):
                self.log_test(
                    "CORS Configuration",
                    True,
                    "CORS headers present",
                    {"cors_headers": cors_headers}
                )
            else:
                self.log_test(
                    "CORS Configuration",
                    False,
                    "No CORS headers found",
                    {"response_headers": dict(response.headers)}
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "CORS Configuration",
                False,
                f"Request failed: {str(e)}"
            )

    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        print("🔍 Testing Basic API Connectivity...")
        
        try:
            response = self.session.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test(
                        "Basic Connectivity",
                        True,
                        "API is accessible and responding",
                        {"response": data}
                    )
                else:
                    self.log_test(
                        "Basic Connectivity",
                        False,
                        f"Unexpected response: {data}"
                    )
            else:
                self.log_test(
                    "Basic Connectivity",
                    False,
                    f"HTTP {response.status_code}: {response.text}"
                )
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Basic Connectivity",
                False,
                f"Cannot connect to API: {str(e)}"
            )

    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests for: {API_BASE_URL}")
        print("=" * 60)
        
        # Run all tests
        self.test_basic_connectivity()
        self.test_resume_download()
        self.test_contact_form_submission()
        self.test_contact_form_validation()
        self.test_contact_submissions_retrieval()
        self.test_error_handling()
        self.test_cors_configuration()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        return self.test_results

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()