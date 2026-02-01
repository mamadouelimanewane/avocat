from fpdf import FPDF
import os
import re

class PresentationPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, 'LexPremium 2026 - Document Visuel', align='R')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def clean_text(text):
    text = text.replace('’', "'").replace('“', '"').replace('”', '"').replace('…', '...')
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def create_pdf(md_file, pdf_file):
    pdf = PresentationPDF()
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pages = content.split('---')
    
    for page_content in pages:
        pdf.add_page()
        lines = page_content.strip().split('\n')
        
        for line in lines:
            line = clean_text(line.strip())
            
            # Image handling: ![Alt](path)
            img_match = re.match(r'!\[.*?\]\((.*?)\)', line)
            if img_match:
                img_path = img_match.group(1)
                if os.path.exists(img_path):
                    # Center the image
                    # Assuming full width somewhat, let's say 120 width
                    pdf.image(img_path, x=45, w=120)
                    pdf.ln(5)
                else:
                    print(f"Warning: Image not found: {img_path}")
                continue

            if not line:
                pdf.ln(5)
                continue
            
            if line.startswith('# '):
                pdf.set_font('helvetica', 'B', 24)
                pdf.set_text_color(22, 59, 128)
                pdf.multi_cell(0, 15, line[2:])
                pdf.ln(5)
            elif line.startswith('## '):
                pdf.set_font('helvetica', 'B', 18)
                pdf.set_text_color(51, 65, 85)
                pdf.multi_cell(0, 12, line[3:])
                pdf.ln(2)
            elif line.startswith('### '):
                pdf.set_font('helvetica', 'B', 14)
                pdf.set_text_color(51, 65, 85)
                pdf.multi_cell(0, 10, line[4:])
            elif line.startswith('* '):
                pdf.set_font('helvetica', '', 12)
                pdf.set_text_color(0, 0, 0)
                pdf.cell(10)
                pdf.multi_cell(0, 7, chr(149) + ' ' + line[2:])
            else:
                pdf.set_font('helvetica', '', 12)
                pdf.set_text_color(30, 30, 30)
                pdf.multi_cell(0, 7, line.replace('**', ''))
        
    pdf.output(pdf_file)
    print(f"PDF Generated: {pdf_file}")

if __name__ == "__main__":
    create_pdf("c:/gravity/avocat/PRESENTATION_PROSPECTS_AVOCAT_VISUAL.md", "c:/gravity/avocat/PRESENTATION_CABINET_AVOCAT_VISUEL.pdf")
