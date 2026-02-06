from fpdf import FPDF
import textwrap

# Colors
NAVY = (15, 23, 42)
GOLD = (180, 140, 45)
WHITE = (255, 255, 255)
GRAY = (51, 65, 81)
LIGHT_GRAY = (241, 245, 249)

class PremiumBrochure(FPDF):
    def header(self):
        # We only want headers on non-cover pages (page > 1)
        if self.page_no() > 1:
            self.set_fill_color(*NAVY)
            self.rect(0, 0, 210, 20, 'F')
            self.set_y(5)
            self.set_font('Arial', 'B', 10)
            self.set_text_color(*GOLD)
            self.cell(0, 10, 'LEXPREMIUM LITE | ÉDITION 2026', 0, 0, 'R')
            self.ln(20)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def create_cover_page(self):
        self.add_page()
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, 297, 'F')
        
        self.set_y(80)
        self.set_font('Arial', 'B', 48)
        self.set_text_color(*WHITE)
        self.cell(0, 20, 'LEXPREMIUM', ln=True, align='C')
        
        self.set_font('Arial', 'B', 48)
        self.set_text_color(*GOLD)
        self.cell(0, 20, 'LITE', ln=True, align='C')
        
        self.ln(20)
        self.set_font('Arial', '', 16)
        self.set_text_color(*WHITE)
        self.multi_cell(0, 10, "L'EXCELLENCE JURIDIQUE\nEN TOUTE AUTONOMIE", align='C')
        
        self.set_y(250)
        self.set_font('Arial', '', 10)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, 'DOCUMENT STRICTEMENT CONFIDENTIEL', 0, 0, 'C')

    def create_section(self, title, subtitle, content_lines):
        self.add_page()
        
        # Section Title
        self.set_font('Arial', 'B', 24)
        self.set_text_color(*NAVY)
        self.cell(0, 15, title, ln=True)
        
        # Divider
        self.set_fill_color(*GOLD)
        self.rect(10, self.get_y(), 50, 2, 'F')
        self.ln(10)
        
        # Subtitle
        if subtitle:
            self.set_font('Arial', 'I', 14)
            self.set_text_color(*GRAY)
            self.multi_cell(0, 8, subtitle)
            self.ln(10)
            
        # Content Box
        self.set_fill_color(*LIGHT_GRAY)
        self.rect(10, self.get_y(), 190, len(content_lines) * 15 + 10, 'F')
        self.set_y(self.get_y() + 5)
        
        for line in content_lines:
            self.set_x(15)
            self.set_font('Arial', 'B', 14)
            self.set_text_color(*GOLD)
            self.cell(10, 10, ">")
            
            self.set_font('Arial', '', 12)
            self.set_text_color(*GRAY)
            self.multi_cell(0, 10, line)
            self.ln(2)

    def create_conclusion(self):
        self.add_page()
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, 297, 'F')
        
        self.set_y(120)
        self.set_font('Arial', 'I', 20)
        self.set_text_color(*GOLD)
        self.multi_cell(0, 15, "\"LexPremium : L'excellence technologique \nau service de votre expertise juridique.\"", align='C')

def generate_pdf():
    pdf = PremiumBrochure()
    
    # Cover
    pdf.create_cover_page()
    
    # 1. Vision
    pdf.create_section(
        "VISION",
        "Le Cabinet Numérique Duo : Gérez moins, défendez mieux.",
        [
            "Centralisez l'intelligence : Un véritable pilote automatique pour votre cabinet.",
            "Automatisez la rigueur : Fini les tâches administratives chronophages.",
            "Libérez votre temps : Focus sur la stratégie et le client."
        ]
    )
    
    # 2. Tableau de Bord
    pdf.create_section(
        "1. TABLEAU DE BORD",
        "Votre Assistant Virtuel : Un centre de commandement dynamique.",
        [
            "Focus Actions Requises : Le logiciel détecte vos priorités immédiates.",
            "Alertes Forclusions : Surveillance 24/7 de vos délais impératifs.",
            "KPIs : Suivez votre chiffre d'affaires en temps réel."
        ]
    )
    
    # 3. Rédaction Assistée
    pdf.create_section(
        "2. RÉDACTION ASSISTÉE",
        "Le Pouvoir de l'IA : Une qualité irréprochable en un temps record.",
        [
            "Templates OHADA : Assignations et conclusions pré-configurées.",
            "Génération Automatique : LexAI rédige pour vous.",
            "Export DOCX : Documents parfaits, prêts à signer."
        ]
    )
    
    # 4. LexAI
    pdf.create_section(
        "3. LEX AI",
        "Expertise Juridique Augmentée : Une bibliothèque sans précédent.",
        [
            "Jurisprudence Ciblée : Droit sénégalais et Actes Uniformes.",
            "Analyse de Dossiers : Résumés automatiques et extraction de points clés.",
            "Veille Transversale : Une information toujours à jour."
        ]
    )
    
    # 5. Gestion & Facturation
    pdf.create_section(
        "4. GESTION & FINANCES",
        "Organisation structurée et rentabilité immédiate.",
        [
            "Dossiers Zéro-Papier : Tout votre cabinet dans votre poche.",
            "Facturation Express : Générez vos mémoires en 3 clics.",
            "Relances Auto : Laissez l'assistant gérer les impayés."
        ]
    )
    
    # Conclusion
    pdf.create_conclusion()

    pdf.output("c:/gravity/Avocat/avocat-lite/LexPremium_Lite_Brochure_2026.pdf")
    print("PDF Generated successfully.")

if __name__ == "__main__":
    generate_pdf()
