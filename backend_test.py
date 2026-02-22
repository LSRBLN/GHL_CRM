#!/usr/bin/env python3
"""
GoHighLevel Prospecting Backend API Tests
Tests all prospecting endpoints according to the review request specifications.
"""

import requests
import json
import time
from typing import Dict, Any, Optional

# Get backend URL from frontend .env file
BACKEND_URL = "https://jolly-volhard-3.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api/prospecting"

class ProspectingAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.created_lead_id = None
        self.created_report_id = None
        
    def test_search_businesses(self) -> bool:
        """Test POST /api/prospecting/search - Search for businesses"""
        print("\n=== Testing POST /api/prospecting/search ===")
        
        # Test data as specified in review request
        search_data = {
            "keyword": "gastro",
            "location": "Berlin, Deutschland", 
            "radius": 5
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/search", json=search_data)
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data Keys: {list(data.keys())}")
            
            # Validate required fields
            required_fields = ['businesses', 'total', 'keyword', 'location']
            for field in required_fields:
                if field not in data:
                    print(f"❌ FAILED: Missing field '{field}' in response")
                    return False
                    
            businesses = data['businesses']
            if not isinstance(businesses, list) or len(businesses) == 0:
                print("❌ FAILED: No businesses returned")
                return False
                
            # Validate business object structure
            business = businesses[0]
            expected_business_fields = [
                'id', 'name', 'address', 'phone', 'website', 'rating', 
                'review_count', 'conversion_rate', 'conversion_label', 
                'online_presence', 'has_website'
            ]
            
            for field in expected_business_fields:
                if field not in business:
                    print(f"❌ FAILED: Missing field '{field}' in business object")
                    return False
                    
            print(f"✅ SUCCESS: Found {len(businesses)} businesses")
            print(f"Sample business: {business['name']}")
            print(f"Conversion rate: {business['conversion_rate']}% ({business['conversion_label']})")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_save_lead(self) -> bool:
        """Test POST /api/prospecting/leads - Save a lead"""
        print("\n=== Testing POST /api/prospecting/leads ===")
        
        # Test data as specified in review request
        lead_data = {
            "name": "Test Restaurant",
            "address": "Teststr. 1, Berlin",
            "phone": "+49 30 1234567",
            "website": "www.test.de",
            "rating": 4.5,
            "review_count": 100,
            "category": "Restaurant", 
            "conversion_rate": 65,
            "online_presence": {"google": True, "facebook": True}
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/leads", json=lead_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data: {data}")
            
            # Validate response structure
            if not isinstance(data, dict):
                print("❌ FAILED: Response is not a dictionary")
                return False
                
            if 'lead_id' not in data:
                print("❌ FAILED: Missing 'lead_id' in response")
                return False
                
            if 'success' not in data or not data['success']:
                print("❌ FAILED: Success field is missing or False")
                return False
                
            self.created_lead_id = data['lead_id']
            print(f"✅ SUCCESS: Lead saved with ID: {self.created_lead_id}")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_get_leads(self) -> bool:
        """Test GET /api/prospecting/leads - Get all leads"""
        print("\n=== Testing GET /api/prospecting/leads ===")
        
        try:
            response = self.session.get(f"{API_BASE_URL}/leads")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data Keys: {list(data.keys())}")
            
            # Validate response structure
            if 'leads' not in data:
                print("❌ FAILED: Missing 'leads' field in response")
                return False
                
            if 'total' not in data:
                print("❌ FAILED: Missing 'total' field in response")
                return False
                
            leads = data['leads']
            if not isinstance(leads, list):
                print("❌ FAILED: 'leads' field is not an array")
                return False
                
            print(f"✅ SUCCESS: Retrieved {len(leads)} leads")
            
            # If we created a lead, verify it's in the list
            if self.created_lead_id and len(leads) > 0:
                found_lead = any(lead.get('id') == self.created_lead_id for lead in leads)
                if found_lead:
                    print(f"✅ SUCCESS: Found our created lead in the list")
                else:
                    print(f"⚠️  WARNING: Our created lead not found in the list")
                    
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_generate_report(self) -> bool:
        """Test POST /api/prospecting/report - Generate audit report"""
        print("\n=== Testing POST /api/prospecting/report ===")
        
        # Test data as specified in review request
        report_data = {
            "business_name": "Test Restaurant GmbH",
            "address": "Friedrichstr. 45, Berlin",
            "phone": "+49 30 9876543",
            "website": "www.testrestaurant.de",
            "rating": 4.3,
            "review_count": 108
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/report", json=report_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data Keys: {list(data.keys())}")
            
            # Validate required sections as specified in review request
            required_sections = [
                'overall_score', 'critical_info', 'tech_stack', 'google_profile',
                'listings', 'reputation', 'website_performance', 'seo'
            ]
            
            for section in required_sections:
                if section not in data:
                    print(f"❌ FAILED: Missing section '{section}' in audit report")
                    return False
                    
            # Validate basic report fields
            if 'id' not in data:
                print("❌ FAILED: Missing 'id' field in report")
                return False
                
            self.created_report_id = data['id']
            overall_score = data['overall_score']
            
            print(f"✅ SUCCESS: Audit report generated")
            print(f"Report ID: {self.created_report_id}")
            print(f"Overall Score: {overall_score}/100")
            print(f"Business Name: {data.get('business_name', 'N/A')}")
            
            # Validate some key section structures
            if not isinstance(data['tech_stack'], list):
                print("❌ FAILED: tech_stack should be an array")
                return False
                
            if not isinstance(data['critical_info'], dict):
                print("❌ FAILED: critical_info should be an object")
                return False
                
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_get_all_reports(self) -> bool:
        """Test GET /api/prospecting/reports - Get all reports"""
        print("\n=== Testing GET /api/prospecting/reports ===")
        
        try:
            response = self.session.get(f"{API_BASE_URL}/reports")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data Keys: {list(data.keys())}")
            
            # Validate response structure
            if 'reports' not in data:
                print("❌ FAILED: Missing 'reports' field in response")
                return False
                
            if 'total' not in data:
                print("❌ FAILED: Missing 'total' field in response")
                return False
                
            reports = data['reports']
            if not isinstance(reports, list):
                print("❌ FAILED: 'reports' field is not an array")
                return False
                
            print(f"✅ SUCCESS: Retrieved {len(reports)} reports")
            
            # If we created a report, verify it's in the list
            if self.created_report_id and len(reports) > 0:
                found_report = any(report.get('id') == self.created_report_id for report in reports)
                if found_report:
                    print(f"✅ SUCCESS: Found our created report in the list")
                else:
                    print(f"⚠️  WARNING: Our created report not found in the list")
                    
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_get_report_by_id(self) -> bool:
        """Test GET /api/prospecting/report/{id} - Get report by ID"""
        print("\n=== Testing GET /api/prospecting/report/{id} ===")
        
        if not self.created_report_id:
            print("❌ FAILED: No report ID available for testing")
            return False
            
        try:
            response = self.session.get(f"{API_BASE_URL}/report/{self.created_report_id}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data Keys: {list(data.keys())}")
            
            # Validate that we got the correct report
            if data.get('id') != self.created_report_id:
                print(f"❌ FAILED: Wrong report returned. Expected {self.created_report_id}, got {data.get('id')}")
                return False
                
            # Validate required sections
            required_sections = [
                'overall_score', 'critical_info', 'tech_stack', 'google_profile',
                'listings', 'reputation', 'website_performance', 'seo'
            ]
            
            for section in required_sections:
                if section not in data:
                    print(f"❌ FAILED: Missing section '{section}' in report")
                    return False
                    
            print(f"✅ SUCCESS: Retrieved report by ID")
            print(f"Report ID: {data['id']}")
            print(f"Business Name: {data.get('business_name', 'N/A')}")
            print(f"Overall Score: {data.get('overall_score', 'N/A')}/100")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def test_delete_lead(self) -> bool:
        """Test DELETE /api/prospecting/leads/{id} - Delete lead"""
        print("\n=== Testing DELETE /api/prospecting/leads/{id} ===")
        
        if not self.created_lead_id:
            print("❌ FAILED: No lead ID available for testing")
            return False
            
        try:
            response = self.session.delete(f"{API_BASE_URL}/leads/{self.created_lead_id}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: Expected status 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
            data = response.json()
            print(f"Response Data: {data}")
            
            # Validate response structure
            if not isinstance(data, dict):
                print("❌ FAILED: Response is not a dictionary")
                return False
                
            if 'success' not in data or not data['success']:
                print("❌ FAILED: Success field is missing or False")
                return False
                
            print(f"✅ SUCCESS: Lead deleted successfully")
            
            # Verify the lead is actually deleted by trying to get all leads
            print("Verifying lead deletion...")
            time.sleep(1)  # Give a moment for the deletion to process
            
            verify_response = self.session.get(f"{API_BASE_URL}/leads")
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                leads = verify_data.get('leads', [])
                found_deleted_lead = any(lead.get('id') == self.created_lead_id for lead in leads)
                if found_deleted_lead:
                    print("⚠️  WARNING: Deleted lead still found in the list")
                else:
                    print("✅ SUCCESS: Deleted lead not found in the list (deletion confirmed)")
            
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ FAILED: Invalid JSON response - {str(e)}")
            return False
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            return False
            
    def run_all_tests(self) -> Dict[str, bool]:
        """Run all tests in sequence and return results"""
        print("🚀 Starting GoHighLevel Prospecting API Tests")
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"API base URL: {API_BASE_URL}")
        
        results = {}
        
        # Test in the order specified in the review request
        tests = [
            ('search_businesses', self.test_search_businesses),
            ('save_lead', self.test_save_lead),
            ('get_leads', self.test_get_leads),
            ('generate_report', self.test_generate_report),
            ('get_all_reports', self.test_get_all_reports),
            ('get_report_by_id', self.test_get_report_by_id),
            ('delete_lead', self.test_delete_lead),
        ]
        
        for test_name, test_func in tests:
            try:
                results[test_name] = test_func()
            except Exception as e:
                print(f"❌ FAILED: Test {test_name} crashed with error: {str(e)}")
                results[test_name] = False
                
        return results
        
    def print_summary(self, results: Dict[str, bool]) -> None:
        """Print test summary"""
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name}: {status}")
            
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests PASSED! API is working correctly.")
        else:
            print("⚠️  Some tests FAILED. Check the detailed output above.")


def main():
    """Main test runner"""
    tester = ProspectingAPITester()
    results = tester.run_all_tests()
    tester.print_summary(results)
    
    # Return appropriate exit code
    all_passed = all(results.values())
    return 0 if all_passed else 1


if __name__ == "__main__":
    exit(main())