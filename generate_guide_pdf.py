from fpdf import FPDF
import os
import re

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(30, 41, 59)
        self.cell(0, 10, 'LEXPREMIUM 2026 - GUIDE UTILISATEUR', border=False, align='C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Page {self.page_no()} - LexPremium - L\'Excellence au service du Droit', align='C')

def clean_text(text):
    # Remove emojis and non-latin1 characters for basic PDF compatibility
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def create_pdf():
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    md_path = "LexPremium_Guide_Utilisateur_Complet_2026.md"
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.readlines()

    for line in content:
        line = line.strip()
        line = clean_text(line)
        if not line:
            pdf.ln(5)
            continue
            
        if line.startswith('# '):
            pdf.set_font('helvetica', 'B', 20)
            pdf.set_text_color(245, 158, 11)
            pdf.cell(0, 15, line[2:], new_x="LMARGIN", new_y="NEXT")
            pdf.ln(5)
        elif line.startswith('## '):
            pdf.set_font('helvetica', 'B', 16)
            pdf.set_text_color(79, 70, 229)
            pdf.cell(0, 12, line[3:], new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
        elif line.startswith('### '):
            pdf.set_font('helvetica', 'B', 14)
            pdf.set_text_color(51, 65, 85)
            pdf.cell(0, 10, line[4:], new_x="LMARGIN", new_y="NEXT")
        elif line.startswith('- '):
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(71, 85, 105)
            pdf.multi_cell(0, 8, f'  * {line[2:]}')
        else:
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(71, 85, 105)
            pdf.multi_cell(0, 8, line)

    pdf.output("LexPremium_Guide_Utilisateur_2026.pdf")
    print("PDF created successfully: LexPremium_Guide_Utilisateur_2026.pdf")

if __name__ == "__main__":
    create_pdf()
