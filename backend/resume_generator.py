from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
import datetime

# Royal Blue and Ivory color scheme
ROYAL_BLUE = HexColor('#487BF2')
ROYAL_BLUE_DARK = HexColor('#3A5BDB')
IVORY = HexColor('#FFFEF7')
DARK_TEXT = HexColor('#1E3A8A')
MEDIUM_TEXT = HexColor('#3B82F6')
LIGHT_TEXT = HexColor('#64748B')

class ResumeGenerator:
    def __init__(self):
        self.styles = self._create_custom_styles()
        
    def _create_custom_styles(self):
        styles = getSampleStyleSheet()
        
        # Custom styles for the resume
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=ROYAL_BLUE_DARK,
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=ROYAL_BLUE,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        styles.add(ParagraphStyle(
            name='ContactInfo',
            parent=styles['Normal'],
            fontSize=11,
            textColor=DARK_TEXT,
            spaceAfter=8,
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=ROYAL_BLUE_DARK,
            spaceAfter=8,
            spaceBefore=16,
            fontName='Helvetica-Bold',
            borderWidth=1,
            borderColor=ROYAL_BLUE,
            borderPadding=4,
            backColor=HexColor('#F0F4FF')
        ))
        
        styles.add(ParagraphStyle(
            name='JobTitle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=DARK_TEXT,
            spaceAfter=2,
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='CompanyInfo',
            parent=styles['Normal'],
            fontSize=11,
            textColor=ROYAL_BLUE,
            spaceAfter=4,
            fontName='Helvetica'
        ))
        
        styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=styles['Normal'],
            fontSize=10,
            textColor=DARK_TEXT,
            spaceAfter=4,
            fontName='Helvetica',
            leading=12
        ))
        
        styles.add(ParagraphStyle(
            name='BulletPoint',
            parent=styles['Normal'],
            fontSize=10,
            textColor=DARK_TEXT,
            spaceAfter=3,
            fontName='Helvetica',
            leftIndent=20,
            bulletIndent=10,
            leading=12
        ))
        
        return styles

    def generate_resume_pdf(self, personal_info, experience, projects, skills, certifications):
        """Generate a PDF resume with the provided data"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        story = []
        
        # Header Section
        story.append(Paragraph(personal_info['name'], self.styles['CustomTitle']))
        story.append(Paragraph(personal_info['title'], self.styles['CustomSubtitle']))
        
        # Contact Information
        contact_info = f"{personal_info['email']} | {personal_info['location']} | LinkedIn: {personal_info['linkedin']}"
        story.append(Paragraph(contact_info, self.styles['ContactInfo']))
        story.append(Spacer(1, 16))
        
        # Career Vision Section
        story.append(Paragraph("CAREER VISION", self.styles['SectionHeader']))
        story.append(Paragraph(personal_info['careerVision'], self.styles['CustomBodyText']))
        story.append(Spacer(1, 12))
        
        # Professional Experience Section
        story.append(Paragraph("PROFESSIONAL EXPERIENCE", self.styles['SectionHeader']))
        
        for exp in experience:
            # Job title and company
            story.append(Paragraph(exp['position'], self.styles['JobTitle']))
            company_duration = f"{exp['company']}, {exp['location']} | {exp['duration']}"
            story.append(Paragraph(company_duration, self.styles['CompanyInfo']))
            
            # Highlights
            for highlight in exp['highlights']:
                bullet_text = f"• {highlight}"
                story.append(Paragraph(bullet_text, self.styles['BulletPoint']))
            
            story.append(Spacer(1, 8))
        
        # Key Projects Section
        story.append(Paragraph("KEY PROJECTS", self.styles['SectionHeader']))
        
        for project in projects[:3]:  # Show top 3 projects
            project_title = f"<b>{project['title']}</b> - {project['category']}"
            story.append(Paragraph(project_title, self.styles['JobTitle']))
            story.append(Paragraph(project['description'], self.styles['CustomBodyText']))
            
            # Technologies
            tech_text = f"<i>Technologies:</i> {', '.join(project['technologies'])}"
            story.append(Paragraph(tech_text, self.styles['CustomBodyText']))
            
            # Impact
            impact_text = f"<i>Impact:</i> {project['impact']}"
            story.append(Paragraph(impact_text, self.styles['CustomBodyText']))
            story.append(Spacer(1, 8))
        
        # Skills Section
        story.append(Paragraph("CORE COMPETENCIES", self.styles['SectionHeader']))
        
        for skill_category in skills:
            category_name = f"<b>{skill_category['category']}:</b>"
            skill_names = [skill['name'] for skill in skill_category['skills']]
            skills_text = f"{category_name} {', '.join(skill_names)}"
            story.append(Paragraph(skills_text, self.styles['CustomBodyText']))
        
        story.append(Spacer(1, 12))
        
        # Certifications Section
        story.append(Paragraph("CERTIFICATIONS & CREDENTIALS", self.styles['SectionHeader']))
        
        for cert in certifications:
            cert_title = f"<b>{cert['name']}</b> - {cert['issuer']} ({cert['date']})"
            story.append(Paragraph(cert_title, self.styles['JobTitle']))
            story.append(Paragraph(cert['description'], self.styles['BodyText']))
            
            # Special highlight for AI certifications
            if 'AI-PO' in cert['name'] or 'AI-SM' in cert['name']:
                ai_highlight = "<i>★ AI Micro-credential</i>"
                story.append(Paragraph(ai_highlight, self.styles['BodyText']))
            
            story.append(Spacer(1, 6))
        
        # Footer
        story.append(Spacer(1, 20))
        footer_text = f"Generated on {datetime.datetime.now().strftime('%B %d, %Y')}"
        story.append(Paragraph(footer_text, self.styles['ContactInfo']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

# Mock data for testing (this will be replaced with actual data from frontend)
MOCK_PERSONAL_INFO = {
    "name": "Shraddha Uke",
    "title": "Certified Scrum Product Owner (CSPO®)",
    "location": "India",
    "email": "uke.shraddha954@gmail.com",
    "linkedin": "https://linkedin.com/in/shraddha-uke",
    "careerVision": "Certified Scrum Product Owner (CSPO®) with proven success across B2B SaaS, Investment Banking, and Insurance domains. Deep expertise in stakeholder engagement, process optimization, and data-driven product decisions. Believer in minimalist, outcome-driven delivery and solving the right problems simply and effectively."
}

MOCK_EXPERIENCE = [
    {
        "company": "6sense Insights India Pvt Ltd",
        "position": "Associate Engineering Manager, QA",
        "duration": "Apr 2023 - Present",
        "location": "Pune, India",
        "highlights": [
            "Partnered with Product Managers to shape roadmap-aligned deliverables",
            "Leveraged AI-based analytics improving roadmap alignment by 25%",
            "Spearheaded global database migration across 10 feature teams",
            "Championed Agile practices boosting QA team efficiency by 40%"
        ]
    },
    {
        "company": "6sense Insights India Pvt Ltd", 
        "position": "Lead QA Engineer",
        "duration": "Apr 2022 - Mar 2023",
        "location": "Pune, India",
        "highlights": [
            "Served as proxy Product Owner across Agile pods",
            "Facilitated Agile ceremonies and backlog refinement",
            "Mentored junior engineers in product-first thinking",
            "Automated QA reporting reducing manual effort by 25%"
        ]
    }
]

MOCK_PROJECTS = [
    {
        "title": "Sales Intelligence Platform",
        "category": "Product Management",
        "description": "Led Agile delivery for actionable insights platform improving lead targeting and conversion. Partnered with product teams to enhance feature adoption by 25% through data-driven enhancements.",
        "technologies": ["JIRA", "Confluence", "Agile", "Data Analytics"],
        "impact": "25% improvement in feature adoption"
    },
    {
        "title": "Marketing Insights Analytics",
        "category": "Product Management", 
        "description": "Directed backlog prioritization for campaign performance analysis platform. Implemented iterative feedback loops reducing post-production defects and optimizing ROI tracking.",
        "technologies": ["API Testing", "Postman", "CI/CD", "Analytics"],
        "impact": "15% decrease in post-release defects"
    }
]

MOCK_SKILLS = [
    {
        "category": "Product Ownership",
        "skills": [
            {"name": "Backlog Management"}, {"name": "User Story Mapping"}, 
            {"name": "Stakeholder Collaboration"}, {"name": "MVP Strategy"}
        ]
    },
    {
        "category": "Agile & Scrum",
        "skills": [
            {"name": "Sprint Planning"}, {"name": "Agile Facilitation"}, 
            {"name": "Scrum Events"}, {"name": "Agile Coaching"}
        ]
    }
]

MOCK_CERTIFICATIONS = [
    {
        "name": "Certified Scrum Product Owner (CSPO)®",
        "issuer": "Scrum Alliance",
        "description": "Mastered Agile product ownership, backlog management, user story slicing, prioritization, and stakeholder collaboration.",
        "date": "2023"
    },
    {
        "name": "AI for Product Owners (AI-PO)",
        "issuer": "Scrum Alliance",
        "description": "Leveraged AI tools for data-driven product decisions and customer insights.",
        "date": "2024"
    }
]