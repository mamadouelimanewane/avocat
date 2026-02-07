import sys
import subprocess
import os

def install(package):
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    except:
        pass

try:
    from fpdf import FPDF
except ImportError:
    print("Installation de fpdf2...")
    install('fpdf2')
    from fpdf import FPDF

class LexPremiumSecurityPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('helvetica', 'B', 10)
            self.set_text_color(79, 70, 229) # Indigo
            self.cell(0, 10, 'LIVRE BLANC : SÉCURITÉ LEXPREMIUM', 0, 1, 'R')
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()} | Document Confidentiel - LexPremium Elite', 0, 0, 'C')

    def section_title(self, title):
        self.set_text_color(15, 23, 42) # Slate-900
        self.set_font('helvetica', 'B', 16)
        self.ln(8)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(2)

    def body_text(self, text):
        self.set_font('helvetica', '', 11)
        self.set_text_color(51, 65, 85) # Slate-700
        self.multi_cell(0, 6, text)
        self.ln()

    def add_bullet(self, title, text):
        self.set_font('helvetica', 'B', 11)
        self.set_text_color(30, 41, 59)
        self.set_x(15)
        self.cell(5, 6, chr(149), 0, 0)
        self.cell(0, 6, title, 0, 1)
        self.set_font('helvetica', '', 11)
        self.set_text_color(71, 85, 105)
        self.set_x(20)
        self.multi_cell(0, 6, text)
        self.ln(2)

# Initialize PDF
pdf = LexPremiumSecurityPDF()
pdf.set_auto_page_break(auto=True, margin=15)

# --- COVER PAGE ---
pdf.add_page()
pdf.set_fill_color(15, 23, 42) # Slate-900
pdf.rect(0, 0, 210, 297, 'F')
pdf.set_text_color(255, 255, 255)

pdf.set_font('helvetica', 'B', 32)
pdf.set_y(80)
pdf.multi_cell(0, 15, "SÉCURITÉ ET INTÉGRITÉ\nDES DONNÉES", 0, 'C')

pdf.ln(10)
pdf.set_font('helvetica', '', 18)
pdf.set_text_color(129, 140, 248) # Indigo-400
pdf.cell(0, 10, 'Livre Blanc - Édition 2026', 0, 1, 'C')

pdf.set_y(220)
pdf.set_font('helvetica', 'B', 14)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, 'LEXPREMIUM ELITE ERP', 0, 1, 'C')
pdf.set_font('helvetica', '', 10)
pdf.cell(0, 10, 'La forteresse numérique de l\'avocat moderne', 0, 1, 'C')

# --- CONTENT ---
pdf.add_page()

pdf.section_title("1. Introduction")
pdf.body_text("La sécurité de l'information est le pilier central du cabinet d'élite. LexPremium intègre des protocoles de sécurité de niveau bancaire pour garantir la confidentialité, l'intégrité et la disponibilité de vos dossiers juridiques les plus sensibles.")

pdf.section_title("2. Infrastructure et Protection")
pdf.body_text("Toutes les données transitent via des protocoles TLS 1.3 (HTTPS) sécurisés, garantissant qu'aucune interception n'est possible entre votre poste et nos serveurs. Au repos, les bases de données sont entièrement chiffrées (AES-256), rendant les données illisibles sans les clés de déchiffrement sécurisées.")

pdf.section_title("3. La Doctrine 'Zéro Altération'")
pdf.body_text("Chaque document déposé ou généré dans LexPremium est protégé par un mécanisme de Scellement Numérique.")

pdf.add_bullet("Empreinte Numérique (Hash SHA-256)", 
               "Dès sa création, une empreinte unique est calculée. Si le document est modifié à l'extérieur du système, l'empreinte ne correspondra plus, et le système alertera immédiatement d'une rupture d'intégrité.")

pdf.add_bullet("Audit Trail (Journal d'Audit)", 
               "Chaque action (consultation, modification, téléchargement) est journalisée avec l'identité de l'utilisateur, l'horodatage précis et l'adresse IP source.")

pdf.section_title("4. Signature Électronique et LexSig")
pdf.body_text("Le moteur de signature LexPremium transforme chaque acte en une preuve juridique infalsifiable.")

pdf.add_bullet("Preuve de Signature", 
               "Un certificat de preuve est généré pour chaque signature, incluant l'identité certifiée et l'heure exacte (horodatage serveur).")

pdf.add_bullet("Sceau d'Intégrité", 
               "Le document signé est scellé cryptographiquement. Toute tentative de modification ultérieure invalide mathématiquement la signature.")

pdf.section_title("5. Gestion des Versions et Archivage")
pdf.add_bullet("Versioning", 
               "LexPremium conserve l'historique complet de vos documents. Vous pouvez revenir à n'importe quelle version antérieure en toute sécurité.")

pdf.add_bullet("Archivage Légal", 
               "Le système gère les boîtes d'archives physiques et numériques avec des politiques de rétention configurables selon la nature des actes (OHADA/SYSCOHADA).")

pdf.ln(5)
pdf.section_title("6. Conclusion")
pdf.body_text("Avec LexPremium, votre cabinet dispose d'une forteresse numérique. La technologie de scellement garantit que vos documents conservent leur valeur probante devant toutes les juridictions, offrant ainsi une sérénité totale à vos clients.")

output_path = "LIVRE_BLANC_SECURITE.pdf"
pdf.output(output_path)
print(f"PDF généré avec succès : {output_path}")
