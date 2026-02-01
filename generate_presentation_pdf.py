from fpdf import FPDF
import os
import re

class PresentationPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        # Header on all pages except maybe the first one? Let's keep it simple.
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, 'LexPremium 2026 - Présentation Commerciale', align='R')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def clean_text(text):
    # Remove emojis and non-latin1 characters to satisfy FPDF
    # Keep French accents (C0-FF)
    text = text.replace('’', "'").replace('“', '"').replace('”', '"').replace('…', '...')
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def create_pdf(md_file, pdf_file):
    pdf = PresentationPDF()
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by '---' for pages
    pages = content.split('---')
    
    for page_content in pages:
        pdf.add_page()
        lines = page_content.strip().split('\n')
        
        for line in lines:
            line = clean_text(line.strip())
            if not line:
                pdf.ln(5)
                continue
            
            # Handle Markdown-ish styling
            if line.startswith('# '):
                # H1
                pdf.set_font('helvetica', 'B', 24)
                pdf.set_text_color(22, 59, 128) # Blue
                pdf.multi_cell(0, 15, line[2:])
                pdf.ln(5)
            elif line.startswith('## '):
                # H2
                pdf.set_font('helvetica', 'B', 18)
                pdf.set_text_color(51, 65, 85) # Dark Grey
                pdf.multi_cell(0, 12, line[3:])
                pdf.ln(2)
            elif line.startswith('### '):
                # H3
                pdf.set_font('helvetica', 'B', 14)
                pdf.set_text_color(51, 65, 85)
                pdf.multi_cell(0, 10, line[4:])
            elif line.startswith('* '):
                # Bullet
                pdf.set_font('helvetica', '', 12)
                pdf.set_text_color(0, 0, 0)
                pdf.cell(10) # Indent
                pdf.multi_cell(0, 7, chr(149) + ' ' + line[2:]) # Bullet char
            elif line.startswith('**') and line.endswith('**'):
                 # Bold line (approx)
                pdf.set_font('helvetica', 'B', 12)
                pdf.set_text_color(0, 0, 0)
                pdf.multi_cell(0, 7, line.replace('**', ''))
            else:
                # Normal text
                # Simple bold handling for **word**
                parts = re.split(r'(\*\*.*?\*\*)', line)
                pdf.set_font('helvetica', '', 12)
                pdf.set_text_color(30,30,30)
                
                # Check if line fits or needs multicell logic manually or just dump it?
                # MultiCell handles wrapping.
                # To do inline bolding in FPDF is hard without HTML mixin. 
                # We will just strip ** for now and print plain or bold the whole line if it looks like a header logic.
                # For simplicity in this script, we'll just print plain text but clean markers
                clean_line = line.replace('**', '')
                pdf.multi_cell(0, 7, clean_line)
        
    pdf.output(pdf_file)
    print(f"PDF Generated: {pdf_file}")

if __name__ == "__main__":
    create_pdf("c:/gravity/avocat/PRESENTATION_PROSPECTS_AVOCAT.md", "c:/gravity/avocat/PRESENTATION_CABINET_AVOCAT.pdf")
