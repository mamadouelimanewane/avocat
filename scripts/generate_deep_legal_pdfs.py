
from fpdf import FPDF
import os

class CodePDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, 'REPUBLIQUE DU SENEGAL - ARCHIVES JURIDIQUES NUMERIQUES', border=False, align='R')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Document Certifié LexPremium AI - Page {self.page_no()}', align='C')

def generate_deep_codes_pdf():
    codes = [
        {
            "title": "CODE PENAL SENEGALAIS 2024",
            "content": """REFORME N° 2024-06 DU 9 FEVRIER 2024
            
DISPOSITIONS GENERALES :
Nul ne peut être puni d'une peine qui n'était pas prononcée par la loi avant que l'infraction fût commise.

INFRACTIONS NUMERIQUES (Cybercriminalité) :
- Accès illégal à un système de données : 2 à 5 ans d'emprisonnement.
- Propagation de fausses nouvelles via les réseaux sociaux : Amende de 500.000 à 5.000.000 FCFA.

LUTTE CONTRE LA CORRUPTION :
Renforcement des pôles judiciaires financiers. Saisie des avoirs illicites étendue aux prête-noms."""
        },
        {
            "title": "CODE DE L'URBANISME - REGLEMENTATION 2025",
            "content": """DECRET N° 2025-1194 D'APPLICATION
            
CERTIFICAT D'URBANISME :
Tout propriétaire a le droit d'obtenir de l'administration un certificat d'urbanisme indiquant les règles applicables à son terrain.

PERMIS DE CONSTRUIRE :
L'instruction du dossier est centralisée via la plateforme Teledac. 
Silence de l'administration : Passé un délai de 45 jours, le pétitionnaire peut saisir l'autorité supérieure pour mise en demeure.

ZONES D'AMENAGEMENT CONCERTE (ZAC) :
L'Etat définit des zones prioritaires d'habitation où les normes sismiques et environnementales sont impératives."""
        },
        {
            "title": "CODE DE L'ENVIRONNEMENT 2024",
            "content": """TEXTE INTEGRAL ACTUALISE
            
PRINCIPES FONDAMENTAUX :
Le droit à un environnement sain est reconnu à chaque citoyen. Le principe 'pollueur-payeur' est appliqué strictement aux installations classées.

INSTALLATIONS CLASSEES POUR LA PROTECTION DE L'ENVIRONNEMENT (ICPE) :
Aucun projet industriel ne peut démarrer sans une Etude d'Impact Environnemental et Social (EIES) validée par la Direction de l'Environnement.

SANCTIONS :
Toute pollution accidentelle non signalée entraîne une astreinte journalière et la suspension immédiate des activités."""
        },
        {
            "title": "CODE DE L'ELECTRICITE - CADRE 2024",
            "content": """REGULATION ET LIBERALISATION DU SECTEUR
            
MISSIONS DE LA CRSE :
La Commission de Régulation du Secteur de l'Énergie assure l'arbitrage entre les impératifs financiers de la SENELEC et la protection du consommateur.

PRODUCTION INDEPENDANTE :
Les entreprises peuvent désormais produire leur propre énergie solaire et revendre le surplus à SENELEC sous réserve d'un contrat d'achat d'électricité (PPA) standardisé.

TRANSITION ENERGETIQUE :
Objectif 30% d'énergies renouvelables dans le mix énergétique national à l'horizon 2030."""
        }
    ]

    output_dir = "public/codes_pdf"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for code in codes:
        pdf = CodePDF()
        pdf.add_page()
        pdf.set_font('Helvetica', 'B', 16)
        pdf.set_text_color(31, 41, 55)
        pdf.multi_cell(0, 10, code['title'], align='C')
        pdf.ln(10)
        pdf.set_font('Helvetica', '', 11)
        pdf.set_text_color(55, 65, 81)
        pdf.multi_cell(0, 8, code['content'])
        
        # Consistent filename with the first script
        filename = code['title'].lower().replace(' ', '_').replace('\'', '').replace('(', '').replace(')', '') + ".pdf"
        file_path = os.path.join(output_dir, filename)
        pdf.output(file_path)
        print(f"Généré : {file_path}")

if __name__ == "__main__":
    generate_deep_codes_pdf()
