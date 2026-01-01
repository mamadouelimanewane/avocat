from fpdf import FPDF
import os

def generate_pdf():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    md_file = "LexPremium_Guide_Utilisateur_Complet_2026.md"
    if not os.path.exists(md_file):
        print("Fichier non trouvé")
        return

    with open(md_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Nettoyage brutal des caractères non-latin1
    clean_content = "".join([i if ord(i) < 256 else " " for i in content])

    pdf.multi_cell(0, 10, txt=clean_content)
    pdf.output("LexPremium_Guide_Utilisateur_2026.pdf")
    print("PDF généré avec succès.")

if __name__ == "__main__":
    generate_pdf()
