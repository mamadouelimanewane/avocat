from fpdf import FPDF
import os
import re

class EliteReportPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        # Only header on pages other than the first
        if self.page_no() > 1:
            self.set_font('helvetica', 'I', 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, 'Rapport d\'Innovation : Avocat Pro Elite 2026', align='R')
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
    pdf = EliteReportPDF()
    
    if not os.path.exists(md_file):
        print(f"Error: {md_file} not found")
        return

    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pages = content.split('---')
    
    for i, page_content in enumerate(pages):
        pdf.add_page()
        
        # Background subtle tint for premium feel
        if i == 0:
            pdf.set_fill_color(15, 23, 42) # Dark Blue-Slate
            pdf.rect(0, 0, 210, 297, 'F')
            pdf.set_text_color(255, 255, 255)
        else:
            pdf.set_text_color(30, 41, 59)
            
        lines = page_content.strip().split('\n')
        
        for line in lines:
            line = clean_text(line.strip())
            
            if not line:
                pdf.ln(5)
                continue
            
            if line.startswith('# '):
                if i == 0:
                    pdf.set_y(100)
                    pdf.set_font('helvetica', 'B', 42)
                    pdf.multi_cell(0, 20, line[2:].upper(), align='C')
                else:
                    pdf.set_font('helvetica', 'B', 28)
                    pdf.set_text_color(79, 70, 229) # Indigo 600
                    pdf.multi_cell(0, 15, line[2:])
                pdf.ln(10)
            elif line.startswith('## '):
                pdf.set_font('helvetica', 'B', 22)
                if i == 0:
                    pdf.set_text_color(199, 210, 254) # Indigo 200
                    pdf.multi_cell(0, 12, line[3:], align='C')
                else:
                    pdf.set_text_color(30, 41, 59)
                    pdf.multi_cell(0, 12, line[3:])
                pdf.ln(5)
            elif line.startswith('### '):
                pdf.set_font('helvetica', 'B', 16)
                pdf.set_text_color(71, 85, 105)
                pdf.multi_cell(0, 10, line[4:])
                pdf.ln(2)
            elif line.startswith('* '):
                pdf.set_font('helvetica', 'B', 12)
                pdf.set_text_color(79, 70, 229)
                pdf.cell(10)
                pdf.multi_cell(0, 7, chr(149) + ' ' + line[2:])
            elif line.startswith('    * ') or line.startswith('  * '):
                pdf.set_font('helvetica', '', 11)
                pdf.set_text_color(71, 85, 105)
                pdf.cell(20)
                pdf.multi_cell(0, 7, '- ' + line.strip()[2:])
            else:
                pdf.set_font('helvetica', '', 12)
                if i == 0:
                    pdf.set_text_color(226, 232, 240)
                    pdf.multi_cell(0, 8, line.replace('**', ''), align='C')
                else:
                    pdf.set_text_color(51, 65, 85)
                    pdf.multi_cell(0, 7, line.replace('**', ''))
        
    pdf.output(pdf_file)
    print(f"PDF Generated successfully at: {pdf_file}")

if __name__ == "__main__":
    create_pdf("c:/gravity/avocat/EliteFeaturesReport.md", "c:/gravity/avocat/RAPPORT_INNOVATION_AVOCAT_PRO_ELITE.pdf")
