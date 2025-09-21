# Backend Integration Contracts for Shraddha Uke's Portfolio

## API Endpoints to Implement

### 1. Resume Download Endpoint
**Endpoint:** `GET /api/resume/download`
**Purpose:** Generate and serve a styled PDF resume for download
**Response:** PDF file with proper headers for download

**Features:**
- Generate PDF resume with portfolio styling (royal blue & ivory theme)
- Include all professional information from mock data
- Proper PDF headers for browser download
- Error handling for PDF generation failures

### 2. Contact Form Submission
**Endpoint:** `POST /api/contact/submit`
**Purpose:** Handle contact form submissions and send notifications
**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "subject": "string",
  "message": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

## Data Integration Plan

### Current Mock Data Usage:
- `personalInfo` - Used in hero section, contact info
- `projects` - Project showcase with images and descriptions
- `skills` - Interactive skill cards with progress bars
- `certifications` - Professional credentials display
- `experience` - Career timeline information

### Backend Integration Changes:

#### Frontend Changes Required:
1. **Header.jsx**: Update `handleDownloadResume()` to call actual API endpoint
2. **ContactSection.jsx**: Update `handleSubmit()` to call contact API endpoint
3. Remove mock alert messages and implement proper success/error handling
4. Add loading states for API calls
5. Implement proper error handling with user-friendly messages

#### New Backend Dependencies:
- `reportlab` or `weasyprint` for PDF generation
- Email service integration (optional for contact form)
- File serving capabilities for PDF download

## PDF Resume Content Structure:

### Sections to Include:
1. **Header Section**
   - Name: Shraddha Uke
   - Title: Certified Scrum Product Owner (CSPO®)
   - Contact: Email and LinkedIn (no phone number)
   - Location: India

2. **Career Vision**
   - Professional summary from personalInfo.careerVision

3. **Professional Experience**
   - All experience entries with highlights
   - Company names, positions, durations, achievements

4. **Skills & Certifications**
   - All 6 certifications with descriptions
   - Technical skills organized by category
   - Special highlight for AI-PO and AI-SM micro-credentials

5. **Key Projects**
   - Featured projects with impact metrics
   - Technologies used and achievements

6. **Domain Expertise**
   - B2B SaaS, Investment Banking, Insurance domains

## Implementation Priority:
1. **High Priority**: Resume PDF generation and download
2. **Medium Priority**: Contact form backend processing
3. **Low Priority**: Email notifications for contact form

## Technical Specifications:

### PDF Styling Requirements:
- Use royal blue (#487BF2) as primary color
- Ivory/cream background where appropriate
- Professional typography (similar to Inter font family)
- Clean, modern layout with proper spacing
- Include subtle glassmorphism-inspired design elements where possible

### Error Handling:
- Graceful fallback if PDF generation fails
- User-friendly error messages for API failures
- Loading states during API calls
- Form validation before submission

## Files to Modify:

### Backend Files:
- `/app/backend/server.py` - Add new API endpoints
- `/app/backend/requirements.txt` - Add PDF generation dependencies
- New files for PDF generation logic and contact form processing

### Frontend Files:
- `/app/frontend/src/components/Header.jsx` - Resume download integration
- `/app/frontend/src/components/ContactSection.jsx` - Contact form integration
- Add loading states and error handling components

## Success Criteria:
- ✅ Resume downloads as styled PDF matching portfolio theme
- ✅ Contact form submits successfully with proper validation
- ✅ Proper error handling and user feedback
- ✅ Loading states during API operations
- ✅ No breaking changes to existing functionality