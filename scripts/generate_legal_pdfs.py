
from fpdf import FPDF
import os

class CodePDF(FPDF):
    def header(self):
        # Logo placeholder or cabinet name
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, 'REPUBLIQUE DU SENEGAL - BIBLIOTHEQUE JURIDIQUE LEXPREMIUM', border=False, align='R')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Document généré par LexPremium AI - Page {self.page_no()}', align='C')

def generate_codes_pdf():
    codes = [
        {
            "title": "CODE GENERAL DES IMPOTS (CGI) 2025",
            "content": """ACTUALISATION LOI DE FINANCES 2025
            
Dispositions Générales :
Le présent code régit l'ensemble des impôts directs et indirects perçus au profit de l'Etat et des collectivités territoriales.

Nouveautés 2025 :
1. Facturation Électronique : L'usage de la facturation électronique certifiée est désormais obligatoire pour toutes les entreprises réalisant un chiffre d'affaires supérieur à 100 millions FCFA.
2. Télédéclaration : Généralisation de la plateforme 'Etax' pour tous les contribuables relevant du régime réel.
3. Taxe sur le Numérique : Introduction d'une taxe de 3% sur les services de publicité en ligne fournis par des plateformes non-résidentes.
4. Incitations Vertes : Exonération de TVA sur les équipements de production d'énergie solaire et éolienne importés."""
        },
        {
            "title": "CODE DES INVESTISSEMENTS 2025",
            "content": """LOI N°2025-16 - SOUVERAINETE ET INDUSTRIALISATION
            
Article 1 : 
L'Etat du Sénégal garantit à toute personne physique ou morale investissant sur son territoire la liberté de transfert des capitaux.

Régimes de faveur :
- Régime Zone Spéciale : Exonération totale d'impôts sur les sociétés pendant 5 ans pour les investissements hors Dakar.
- Crédit Impôt Recherche : Déduction de 20% des dépenses de R&D des entreprises innovantes.
- Emploi Local : Prime d'équipement accordée pour chaque création d'emploi de cadre sénégalais."""
        },
        {
            "title": "CODE DES MARCHÉS PUBLICS 2024",
            "content": """RÈGLES DE LA COMMANDE PUBLIQUE (ARCOP)
            
L'Autorité de Régulation de la Commande Publique (ARCOP) veille au respect des principes de transparence et d'égalité d'accès.

Points clés de la réforme :
1. Dématérialisation : Toutes les offres doivent être soumises via le portail unique de l'ARCOP.
2. Contenu Local : Une préférence de 15% est accordée aux entreprises nationales lors de l'évaluation des offres.
3. Seuil de dispense : Relèvement du seuil de dispense pour les marchés de travaux en zones rurales."""
        },
        {
            "title": "CODE DU TRAVAIL SÉNÉGALAIS 2024",
            "content": """CADRE DU TÉLÉTRAVAIL ET PROTECTION SOCIALE
            
Réforme du Télétravail :
Le télétravail peut être mis en place par accord collectif ou, à défaut, dans le cadre d'une charte élaborée par l'employeur.
Le salarié en télétravail bénéficie des mêmes droits que le salarié travaillant dans les locaux de l'entreprise.

Protection des données :
L'employeur est tenu de prendre les mesures nécessaires pour assurer la protection des données traitées par le salarié à des fins professionnelles."""
        },
        {
            "title": "CODE MINIER DU SÉNÉGAL 2025",
            "content": """SOUVERAINETÉ SUR LES RESSOURCES NATURELLES
            
Participation de l'État :
L'État se réserve le droit de prendre une participation gratuite de 10% dans le capital des sociétés d'exploitation minière. Cette participation peut être portée à 35% à titre onéreux.

Contenu Local Minier :
Les titulaires de titres miniers sont tenus de donner la préférence aux entreprises sénégalaises pour les contrats de sous-traitance, à conditions égales de prix et de qualité."""
        }
    ]

    output_dir = "public/codes_pdf"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for code in codes:
        pdf = CodePDF()
        pdf.add_page()
        
        # Title
        pdf.set_font('Helvetica', 'B', 16)
        pdf.set_text_color(31, 41, 55) # Slate 800
        pdf.multi_cell(0, 10, code['title'], align='C')
        pdf.ln(10)
        
        # Content
        pdf.set_font('Helvetica', '', 11)
        pdf.set_text_color(55, 65, 81) # Slate 700
        pdf.multi_cell(0, 8, code['content'])
        
        filename = code['title'].lower().replace(' ', '_').replace('(', '').replace(')', '') + ".pdf"
        file_path = os.path.join(output_dir, filename)
        pdf.output(file_path)
        print(f"Généré : {file_path}")

if __name__ == "__main__":
    generate_codes_pdf()
