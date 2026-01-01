from fpdf import FPDF
import os
import re

class PDF(FPDF):
    def header(self):
        # Adding a logo-like text
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(30, 41, 59)
        self.cell(0, 10, 'LEXPREMIUM 2026 - DOCUMENTATION OFFICIELLE', border=False, align='C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f'Page {self.page_no()} - LexPremium : L\'Excellence au service du Droit', align='C')

def clean_for_pdf(text):
    # Remove emojis and non-latin1 characters strictly
    cleaned = text.encode("ascii", "ignore").decode("ascii")
    # Replace common markdown symbols for better PDF rendering
    cleaned = cleaned.replace('#', '').replace('*', '')
    return cleaned.strip()

def generate_guide():
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    md_file = "LexPremium_Guide_Utilisateur_Complet_2026.md"
    if not os.path.exists(md_file):
        print("Fichier Markdown introuvable.")
        return

    with open(md_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        raw_line = line.strip()
        if not raw_line:
            pdf.ln(5)
            continue
            
        if line.startswith('# '):
            pdf.set_font('helvetica', 'B', 22)
            pdf.set_text_color(245, 158, 11) # Gold
            pdf.multi_cell(0, 15, clean_for_pdf(raw_line))
            pdf.ln(5)
        elif line.startswith('## '):
            pdf.set_font('helvetica', 'B', 16)
            pdf.set_text_color(79, 70, 229) # Indigo
            pdf.multi_cell(0, 12, clean_for_pdf(raw_line))
            pdf.ln(2)
        elif line.startswith('### '):
            pdf.set_font('helvetica', 'B', 13)
            pdf.set_text_color(30, 41, 59)
            pdf.multi_cell(0, 10, clean_for_pdf(raw_line))
        else:
            pdf.set_font('helvetica', '', 11)
            pdf.set_text_color(51, 65, 85)
            pdf.multi_cell(0, 7, clean_for_pdf(raw_line))

    output_path = "LexPremium_Guide_Utilisateur_2026.pdf"
    pdf.output(output_path)
    print(f"PDF généré avec succès : {output_path}")

if __name__ == "__main__":
    generate_guide()
