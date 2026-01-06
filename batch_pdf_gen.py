from fpdf import FPDF
import os
import re

class LexPDF(FPDF):
    def __init__(self, title_text="LexPremium 2.0"):
        super().__init__()
        self.title_text = title_text

    def header(self):
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, self.title_text, border=False, align='R')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'LexPremium 2026 - Document Confidentiel - Page {self.page_no()}', align='C')

def clean_text(text):
    # Remove emojis and non-latin1 characters
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def convert_md_to_pdf(md_filename, pdf_filename, title):
    if not os.path.exists(md_filename):
        print(f"Skipping: {md_filename} (not found)")
        return

    pdf = LexPDF(title)
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    with open(md_filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line in lines:
        raw_line = line.strip()
        cleaned_line = clean_text(raw_line)
        
        if not cleaned_line:
            pdf.ln(5)
            continue
            
        if cleaned_line.startswith('# '):
            pdf.set_font('helvetica', 'B', 24)
            pdf.set_text_color(30, 58, 138)
            pdf.multi_cell(0, 15, cleaned_line[2:])
            pdf.ln(5)
        elif cleaned_line.startswith('## '):
            pdf.set_font('helvetica', 'B', 18)
            pdf.set_text_color(31, 41, 55)
            pdf.multi_cell(0, 12, cleaned_line[3:])
            pdf.ln(2)
        elif cleaned_line.startswith('### '):
            pdf.set_font('helvetica', 'B', 14)
            pdf.set_text_color(55, 65, 81)
            pdf.multi_cell(0, 10, cleaned_line[4:])
        else:
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(31, 41, 55)
            # Use multi_cell with a width that is clearly less than full page to avoid floating point issues
            pdf.multi_cell(180, 7, cleaned_line)

    pdf.output(pdf_filename)
    print(f"Created: {pdf_filename}")

files_to_convert = [
    ("LexPremium_Guide_Utilisateur_Complet_2026_V2.md", "LexPremium_Guide_Utilisateur_V2.pdf", "Guide Utilisateur V2.0"),
    ("LexPremium_Presentation_Premium_2026.md", "LexPremium_Presentation_Premium_2026.pdf", "Presentation Premium 2026"),
    ("LexPremium_Presentation_18_Pages.md", "LexPremium_Presentation_18_Pages.pdf", "Presentation 18 Pages"),
    ("LexPremium_Presentation_Complete_2026_V2.md", "LexPremium_Presentation_V2.pdf", "Presentation Complete V2.0"),
    ("LexPremium_Brochure_Commerciale_2026.md", "LexPremium_Brochure_Commerciale_2026.pdf", "Brochure Commerciale 2026"),
    ("LexPremium_Prospection_Emails_2026.md", "LexPremium_Prospection_Emails_2026.pdf", "Prospection Emails 2026"),
    ("METHODES_SUCCESSION.md", "METHODES_SUCCESSION_DETAILEES.pdf", "Methodes de Succession"),
    ("docs/ROADMAP_AMELIORATIONS.md", "docs/ROADMAP_AMELIORATIONS_2026.pdf", "Roadmap 2026"),
    ("docs/QUICK_START.md", "docs/QUICK_START_2.0.pdf", "Quick Start V2.0"),
    ("docs/AI_CONFIGURATION.md", "docs/AI_CONFIGURATION_2.0.pdf", "AI Configuration V2.0"),
]

if __name__ == "__main__":
    for md, pdf, title in files_to_convert:
        convert_md_to_pdf(md, pdf, title)
