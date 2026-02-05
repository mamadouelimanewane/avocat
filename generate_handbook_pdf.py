import sys
import subprocess

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    from fpdf import FPDF
except ImportError:
    print("Installing fpdf2...")
    install('fpdf2')
    from fpdf import FPDF

class LexPremiumHandbookPDF(FPDF):
    def header(self):
        # Logo placeholder or Text Logo
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(79, 70, 229) # Indigo
        self.cell(0, 10, 'LEXPREMIUM ELITE - MANUEL DE MAÎTRISE', 0, 1, 'R')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()} | Propriété Exclusive du Cabinet', 0, 0, 'C')

    def chapter_title(self, title, level=1):
        self.set_text_color(15, 23, 42) # Slate-900
        if level == 1:
            self.set_font('helvetica', 'B', 20)
            self.ln(10)
            self.cell(0, 15, title.upper(), 0, 1, 'L')
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(5)
        elif level == 2:
            self.set_font('helvetica', 'B', 16)
            self.ln(8)
            self.cell(0, 10, title, 0, 1, 'L')
            self.ln(2)
        else:
            self.set_font('helvetica', 'B', 12)
            self.ln(5)
            self.cell(0, 8, title, 0, 1, 'L')

    def chapter_body(self, text):
        self.set_font('helvetica', '', 11)
        self.set_text_color(51, 65, 85) # Slate-700
        self.multi_cell(0, 6, text)
        self.ln()

    def add_bullet(self, text):
        self.set_font('helvetica', '', 11)
        self.set_x(15)
        self.cell(5, 6, '-', 0, 0)
        self.multi_cell(0, 6, text)

# Initialize PDF
pdf = LexPremiumHandbookPDF()
pdf.set_auto_page_break(auto=True, margin=15)

# --- COVER PAGE ---
pdf.add_page()
pdf.set_fill_color(15, 23, 42) # Dark Slate
pdf.rect(0, 0, 210, 297, 'F')
pdf.set_text_color(255, 255, 255)
pdf.set_font('helvetica', 'B', 40)
pdf.set_y(100)
pdf.cell(0, 20, 'LEXPREMIUM ELITE', 0, 1, 'C')
pdf.set_font('helvetica', '', 20)
pdf.cell(0, 20, 'LE MANUEL DE MAÎTRISE INTÉGRALE', 0, 1, 'C')
pdf.ln(100)
pdf.set_font('helvetica', 'I', 12)
pdf.cell(0, 10, 'Version 2026.1 - Édition de Prestige', 0, 1, 'C')

# --- TABLE OF CONTENTS ---
pdf.add_page()
pdf.chapter_title('SOMMAIRE GÉNÉRAL')
pdf.set_font('helvetica', 'B', 12)
toc = [
    "I. PHILOSOPHIE DU SYSTÈME",
    "II. MODULE STRATÉGIQUE : LEXVISION WAR ROOM",
    "   - LexDiscovery : Graphes de Connexion",
    "   - LexOracle : Analyse Prédictive",
    "   - LexDojo : Simulation d'Audience",
    "III. MODULE OPÉRATIONNEL : LEXCOURRIER",
    "   - Workflows en Cascade",
    "   - Moteur de Validation",
    "IV. GESTION DU CABINET (CRM & FINANCE)",
    "V. NEXUS INTELLIGENCE (IA)",
    "VI. CONFORMITÉ & AUDIT",
    "VII. GUIDE DES ACTIONS ET ICONOGRAPHIE"
]
for item in toc:
    pdf.cell(0, 8, item, 0, 1, 'L')

# --- CONTENT SECTIONS ---
pdf.add_page()
pdf.chapter_title('I. PHILOSOPHIE DU SYSTÈME')
pdf.chapter_body("LexPremium n'est pas un simple outil de gestion. C'est une extension cognitive pour l'avocat d'élite. L'architecture repose sur trois piliers fondamentaux :")
pdf.add_bullet("L'Infaillibilité Stratégique : Utiliser l'IA pour ne laisser aucune place au hasard dans la préparation des dossiers.")
pdf.add_bullet("La Souveraineté de l'Information : Un contrôle souverain et sécurisé sur chaque donnée du cabinet.")
pdf.add_bullet("L'Expérience de Prestige : Une interface d'exception reflétant le standing du cabinet.")

pdf.chapter_title('II. LEXVISION WAR ROOM', 2)
pdf.chapter_body("Le module War Room est le centre nerveux de la stratégie judiciaire. Il transforme la complexité en clarté visuelle.")

pdf.chapter_title('1. LexDiscovery (TM) : Cartographie Dynamique', 3)
pdf.chapter_body("Action : Cliquer sur un noeud dans le graphe.")
pdf.chapter_body("Resultat : Visualisation immediate des correlations entre preuves, faits et points de droit.")
pdf.chapter_body("Philosophie : Rendre visible l'invisible. Detecter les synergies que l'esprit humain pourrait omettre dans des dossiers de plusieurs milliers de pages.")

pdf.chapter_title('2. LexOracle (TM) : Diagnostic Predictif', 3)
pdf.chapter_body("Action : Activer le bouton 'Analyser Probabilites'.")
pdf.chapter_body("Resultat : Score de reussite (0-100%) base sur la jurisprudence OHADA/CCJA et les cours d'appel de Dakar.")
pdf.chapter_body("Didactique : Utilisez ces donnees pour ajuster vos conclusions avant le depot ou pour conseiller au mieux votre client sur l'opportunite d'une transaction.")

pdf.chapter_title('3. LexDojo (TM) : Simulation d\'Audience', 3)
pdf.chapter_body("Action : Selectionner un profil de sparring (ex: Juge Severe) et dicter l'argumentaire.")
pdf.chapter_body("Resultat : L'IA genere des contre-arguments et des questions destabilisantes pour preparer l'avocat au pire scenario.")

pdf.add_page()
pdf.chapter_title('III. LEXCOURRIER DYNAMIQUE', 2)
pdf.chapter_body("LexCourrier transforme la gestion du courrier en un processus industriel de haute precision.")

pdf.chapter_title('1. Workflows en Cascade', 3)
pdf.chapter_body("Concept : Chaque courrier suit une voie de circulation predefinie.")
pdf.chapter_body("Reception -> Analyse -> Redaction -> Validation -> Envoi.")
pdf.chapter_body("Controle : Seuls les utilisateurs avec le role 'ASSOCIE' peuvent valider l'etape finale du workflow sortant.")

pdf.chapter_title('2. Audit Trail & Transparence', 3)
pdf.chapter_body("Action : Consulter le journal d'activite d'un courrier.")
pdf.chapter_body("Resultat : Historique complet de qui a fait quoi, quand, et avec quel commentaire.")

pdf.add_page()
pdf.chapter_title('IV. GESTION DU CABINET (CRM & FINANCE)')
pdf.chapter_body("Une gestion rigoureuse est le socle de la puissance d'un cabinet.")

pdf.chapter_title('1. CRM 360(o)', 2)
pdf.chapter_body("La fiche client centralise dossiers, communications et finances. Le bouton 'Score de Risque' permet de prevenir les impayes en analysant les comportements passes.")

pdf.chapter_title('2. Finance & Facturation', 2)
pdf.chapter_body("Generation automatique de factures conformes aux regles CARPA et OHADA. Le système gere nativement la TVA (18%) et les prelevements specifiques du Senegal.")

pdf.add_page()
pdf.chapter_title('V. NEXUS INTELLIGENCE (IA)')
pdf.chapter_body("L'IA LexPremium est integree au coeur du code, et non comme un simple gadget.")

pdf.chapter_title('1. LexAI Co-Counsel', 2)
pdf.chapter_body("Assistant de recherche capable de naviguer dans la bibliotheque supreme et la doctrine pour repondre a des problematiques complexes en quelques secondes.")

pdf.chapter_title('2. LexAudio Drafter', 2)
pdf.chapter_body("Transforme vos memos vocaux en projets d'actes structures. Ideal pour les collaborateurs en deplacement ou au palais.")

pdf.add_page()
pdf.chapter_title('VI. LEXIQUE DES ACTIONS & ICONOGRAPHIE')
pdf.chapter_body("Comprendre l'alphabet visuel de LexPremium :")
pdf.add_bullet("Icone Eclair (Zap) : Unite de traitement IA active.")
pdf.add_bullet("Icone Bouclier : Securite des donnees ou conformite KYC/CARPA.")
pdf.add_bullet("Icone Cerveau : Analyse strategique ou prediction de resultat.")
pdf.add_bullet("Icone Workflow : Processus en cours de validation.")

pdf.output("LexPremium_Master_Handbook_2026.pdf")
print("PDF généré avec succès.")
