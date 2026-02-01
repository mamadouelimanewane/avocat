from fpdf import FPDF
import re

class ReleasePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, 'LexPremium ERP - Description Fonctionnelle', align='R')
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
    pdf = ReleasePDF()
    pdf.add_page()
    
    with open(md_file, 'r', encoding='utf-8') as f:
        # Read all lines
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        cleaned_line = clean_text(line)
        
        if not cleaned_line:
            pdf.ln(5)
            continue
        
        if cleaned_line.startswith('# '):
            pdf.add_page() # Start main chapters on new page usually, or just big header
            pdf.set_font('helvetica', 'B', 20)
            pdf.set_text_color(22, 59, 128) # Dark Blue
            pdf.multi_cell(0, 15, cleaned_line[2:])
            pdf.ln(5)
        elif cleaned_line.startswith('## '):
            pdf.ln(5)
            pdf.set_font('helvetica', 'B', 16)
            pdf.set_text_color(51, 65, 85) # Dark Grey
            pdf.multi_cell(0, 12, cleaned_line[3:])
            pdf.ln(2)
        elif cleaned_line.startswith('### '):
            pdf.set_font('helvetica', 'B', 12)
            pdf.set_text_color(70, 70, 70)
            pdf.multi_cell(0, 10, cleaned_line[4:])
        elif cleaned_line.startswith('• ') or cleaned_line.startswith('- '):
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(0, 0, 0)
            pdf.cell(10) # Indent
            # Replace bullet char with something safe if needed, or just keep dash
            safe_bullet = chr(149) if cleaned_line.startswith('•') else '-'
            content = cleaned_line[2:]
            pdf.multi_cell(0, 6, f"{safe_bullet} {content}")
        else:
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(0, 6, cleaned_line)
            
    pdf.output(pdf_file)
    print(f"PDF Generated: {pdf_file}")

if __name__ == "__main__":
    create_pdf("c:/gravity/avocat/MANUEL_UTILISATION_DETAILLE.md", "c:/gravity/avocat/release1.pdf")
