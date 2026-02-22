#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

user_problem_statement: "GoHighLevel CRM clone with Prospecting/Marketing Audit feature - Backend for lead search and audit report generation"

backend:
  - task: "POST /api/prospecting/search - Search businesses"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Search endpoint with mock business generation"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Search API working correctly. Returns 15 businesses with all required fields: id, name, address, phone, website, rating, review_count, conversion_rate, conversion_label, online_presence, has_website. Test data: keyword='gastro', location='Berlin, Deutschland', radius=5"

  - task: "POST /api/prospecting/leads - Save lead"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Save lead to MongoDB"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Lead save API working correctly. Successfully saved lead with ID 96b6eb6d-2876-4f8c-8293-6b86500b9299. Returns success=true and lead_id. MongoDB persistence verified."

  - task: "GET /api/prospecting/leads - Get all leads"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Fetch all saved leads"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Get leads API working correctly. Returns leads array and total count. Verified that previously saved lead appears in the list."

  - task: "POST /api/prospecting/report - Generate audit report"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Generate comprehensive marketing audit report"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Audit report generation working correctly. Created comprehensive report with ID 8ab8eb9c-669c-4b1b-b687-147034122514, overall_score 68/100. All required sections present: overall_score, critical_info, tech_stack, google_profile, listings, reputation, website_performance, seo."

  - task: "GET /api/prospecting/report/{id} - Get saved report"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Fetch report by ID"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Get report by ID API working correctly. Successfully retrieved the created report with all sections intact. Report ID validation working properly."

  - task: "GET /api/prospecting/reports - Get all reports"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "List all generated reports"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Get all reports API working correctly. Returns reports array and total count. Verified that previously created report appears in the list."

  - task: "DELETE /api/prospecting/leads/{id} - Delete lead"
    implemented: true
    working: true
    file: "routes_prospecting.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Delete a lead by ID"
      - working: true
        agent: "testing"
        comment: "✅ PASSED: Delete lead API working correctly. Successfully deleted lead and returns success=true. Deletion confirmed by verifying lead no longer appears in the leads list."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "testing"
    message: "Completed comprehensive testing of all GoHighLevel Prospecting backend APIs. All 7 endpoints are working perfectly: search businesses, save/get/delete leads, generate/get audit reports. Used real test data as specified in review request. Created backend_test.py for automated testing. All core functionality verified including MongoDB persistence, data validation, and proper response structures. No critical issues found - API is production ready."

#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================