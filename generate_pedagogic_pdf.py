from fpdf import FPDF
import re

class PedagogicPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, 'Guide Pédagogique LexPremium ERP - Maîtrisez votre Cabinet Numérique', align='R')
        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def clean_text(text):
    # Remove markers like ** and * used for markdown bold/italic
    text = text.replace('**', '').replace('*', '')
    text = text.replace('’', "'").replace('“', '"').replace('”', '"').replace('…', '...')
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def create_pedagogic_pdf(md_file, pdf_file):
    pdf = PedagogicPDF()
    pdf.add_page()
    
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        raw_line = line.strip()
        cleaned_line = clean_text(raw_line)
        
        if not cleaned_line or cleaned_line == '---':
            pdf.ln(5)
            continue
        
        # TITRE PRINCIPAL (H1)
        if raw_line.startswith('# '):
            pdf.ln(10)
            pdf.set_font('helvetica', 'B', 24)
            pdf.set_text_color(12, 74, 110) 
            pdf.multi_cell(0, 15, cleaned_line.upper(), align='C')
            pdf.ln(10)
            
        # TITRE DE CHAPITRE (H2)
        elif raw_line.startswith('## '):
            if pdf.get_y() > 220:
                pdf.add_page()
            pdf.ln(5)
            pdf.set_fill_color(224, 242, 254) 
            pdf.set_font('helvetica', 'B', 16)
            pdf.set_text_color(3, 105, 161) 
            pdf.cell(0, 12, f"  {cleaned_line}", ln=True, fill=True)
            pdf.ln(4)
            
        # SOUS-TITRE (H3) -> Transformé en "Contenu"
        elif raw_line.startswith('### '):
            pdf.set_font('helvetica', 'B', 12)
            pdf.set_text_color(8, 145, 178) 
            pdf.multi_cell(0, 8, "Contenu")
            pdf.ln(2)
            
        # LISTE A PUCES (Bullet points and sub-bullets)
        elif raw_line.startswith('• ') or raw_line.startswith('- '):
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(31, 41, 55)
            
            # Gestion de l'indentation selon le type de puce
            indent = 20 if raw_line.startswith('• ') else 25
            pdf.set_x(indent)
            
            # Dessin de la puce
            pdf.set_fill_color(8, 145, 178)
            current_y = pdf.get_y() + 2
            pdf.rect(indent - 4, current_y, 2, 2, 'F')
            
            content = cleaned_line[2:] if raw_line.startswith('• ') else cleaned_line[2:]
            
            if ':' in content:
                label, info = content.split(':', 1)
                # Label en MARRON et GRAS
                pdf.set_font('helvetica', 'B', 11)
                pdf.set_text_color(101, 67, 33) # Marron
                pdf.write(6, label + " : ")
                
                # Reste en GRIS normal
                pdf.set_font('helvetica', '', 11)
                pdf.set_text_color(55, 65, 81)
                pdf.multi_cell(0, 6, info.strip())
            else:
                pdf.multi_cell(0, 6, content)
            
        # TEXTE NORMAL
        else:
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(55, 65, 81)
            pdf.multi_cell(0, 6, cleaned_line)
            
    pdf.output(pdf_file)
    print(f"Pedagogic PDF Updated: {pdf_file}")

if __name__ == "__main__":
    create_pedagogic_pdf("c:/gravity/avocat/MANUEL_UTILISATION_DETAILLE.md", "c:/gravity/avocat/release1_pedagogique.pdf")
