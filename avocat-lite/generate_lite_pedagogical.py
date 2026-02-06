from fpdf import FPDF

# Colors
NAVY = (15, 23, 42)
GOLD = (180, 140, 45)
WHITE = (255, 255, 255)
GRAY = (51, 65, 81)
LIGHT_BLUE = (240, 249, 255)

class PedagogicalPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_fill_color(*NAVY)
            self.rect(0, 0, 210, 15, 'F')
            self.set_y(2)
            self.set_font('Arial', 'B', 8)
            self.set_text_color(*WHITE)
            self.cell(0, 10, 'GUIDE DE FORMATION | LEXPREMIUM LITE', 0, 0, 'R')
            self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 16)
        self.set_fill_color(*LIGHT_BLUE)
        self.set_text_color(*NAVY)
        self.cell(0, 12, f"  {title}", ln=True, fill=True)
        self.ln(5)

    def add_step(self, step_num, text, result):
        self.set_font('Arial', 'B', 11)
        self.set_text_color(*GOLD)
        self.write(10, f"Action {step_num}: ")
        self.set_font('Arial', '', 11)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 10, text)
        
        self.set_x(20)
        self.set_font('Arial', 'I', 10)
        self.set_text_color(22, 163, 74) # Success Green
        self.multi_cell(0, 8, f"Resultat attendu: {result}")
        self.ln(4)

def generate_pedagogical_pdf():
    pdf = PedagogicalPDF()
    
    # Cover
    pdf.add_page()
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.set_y(100)
    pdf.set_font('Arial', 'B', 36)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 20, 'GUIDE DE FORMATION', ln=True, align='C')
    pdf.set_font('Arial', '', 18)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 15, 'MAITRISEZ VOTRE CABINET EN 5 MINUTES', ln=True, align='C')
    
    # Intro
    pdf.add_page()
    pdf.chapter_title("1. INTRODUCTION & CONNEXION")
    pdf.add_step("1.1", "Accédez à l'URL https://avocat-lite.vercel.app", "Redirection automatique vers la page de login (Middleware de sécurité).")
    pdf.add_step("1.2", "Saisissez vos identifiants (maitre.diag@lexpremium.sn)", "L'écran de chargement 'LexAI' apparaît avant d'ouvrir le Dashboard.")
    
    # Dashboard
    pdf.chapter_title("2. LE TABLEAU DE BORD (BUREAU VIRTUEL)")
    pdf.add_step("2.1", "Vérifiez les cartes de statistiques en haut de page.", "Affichage en temps réel des dossiers, clients, audiences et délais.")
    pdf.add_step("2.2", "Posez une question à LexAI dans la zone 'Priorités'.", "Redirection vers le chat IA avec le contexte de votre question.")
    
    # LexAI
    pdf.chapter_title("3. LEXAI : VOTRE RECHERCHE JURIDIQUE")
    pdf.add_step("3.1", "Utilisez les suggestions OHADA ou entrez un fait juridique.", "Analyse instantanée et proposition de fondements juridiques.")
    
    # Dossiers
    pdf.chapter_title("4. GESTION DES DOSSIERS & COURRIERS")
    pdf.add_step("4.1", "Naviguez vers 'Courrier Arrivé'.", "Les documents numérisés sont automatiquement analysés par l'IA.")
    pdf.add_step("4.2", "Consultez les 'Mails IA'.", "L'assistant propose des réponses automatiques basées sur le contenu.")
    
    # Lab
    pdf.chapter_title("5. INNOVATION : LE LAB")
    pdf.add_step("5.1", "Activez la 'Dictée Juridique' ou le 'Scan Magique'.", "Simulation de la puissance technologique de LexPremium.")

    pdf.output("c:/gravity/Avocat/avocat-lite/LexPremium_Lite_Guide_Formation.pdf")
    print("Pedagogical PDF Generated successfully.")

if __name__ == "__main__":
    generate_pedagogical_pdf()
