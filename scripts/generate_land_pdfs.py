
from fpdf import FPDF
import os

class LandPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(21, 128, 61) # Green 700
        self.cell(0, 10, 'SENEGAL - DROIT FONCIER ET IMMOBILIER', border=False, align='R')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'LexPremium Legal Library - Page {self.page_no()}', align='C')

def generate_land_pdfs():
    codes = [
        {
            "title": "LOI SUR LE DOMAINE NATIONAL 64-46",
            "content": """LOI N° 64-46 DU 17 JUIN 1964
            
REPUBLIQUE DU SENEGAL

ARTICLE 1 : 
Constituent de plein droit le domaine national toutes les terres non immatriculées, non transcrites à la conservation des hypothèques à la date de mise en vigueur de la présente loi.

ARTICLE 2 :
L'Etat détient les terres du domaine national en vue d'en assurer l'utilisation et le développement rationnels, conformément aux plans de développement et aux programmes d'aménagement.

STRUCTURE DU DOMAINE NATIONAL :
1. Zones urbaines : Terres situées sur le territoire des communes.
2. Zones classées : Zones à vocation forestière ou de protection.
3. Zones de terroir : Terres exploitées par les membres des communautés rurales.
4. Zones pionnières : Terres dont l'Etat assure l'aménagement."""
        },
        {
            "title": "LOI SUR L'EXPROPRIATION 76-67",
            "content": """LOI N° 76-67 DU 2 JUILLET 1976
            
PROCEDURE D'EXPROPRIATION :
L'expropriation d'immeubles, en tout ou en partie, ou de droits réels immobiliers pour cause d'utilité publique s'opère par voie d'autorité.

L'UTILITE PUBLIQUE :
Elle est déclarée par décret suite à une enquête préalable dite enquête de commodo et incommodo durant laquelle les intéressés peuvent présenter leurs observations.

L'INDEMNITE :
L'indemnité d'expropriation doit comprendre le prix du terrain et des impenses. Elle est fixée, à défaut d'accord amiable, par la juridiction civile."""
        },
        {
            "title": "DECRET SUR LA BAISSE DES LOYERS 2023",
            "content": """DECRET N° 2023-382 DU 24 FEVRIER 2023
            
MESURES DE BAISSE DES PRIX DES LOYERS :
Sont fixées d'autorité les baisses suivantes sur les loyers des baux à usage d'habitation :
- 15% pour les loyers inférieurs ou égaux à 300.000 FCFA.
- 10% pour les loyers compris entre 300.001 et 500.000 FCFA.
- 5% pour les loyers supérieurs à 500.000 FCFA.

COMMISSION NATIONALE DE REGULATION DU LOYER :
La CONAREL est chargée de veiller à l'application stricte des tarifs et de médiatiser les litiges entre bailleurs et locataires."""
        },
        {
            "title": "GUIDE SUR L'IMMATRICULATION FONCIERE",
            "content": """PROCEDURE D'OBTENTION DU TITRE FONCIER
            
1. LA REQUETE : Dépôt d'une réquisition d'immatriculation auprès du Conservateur de la Propriété Foncière.
2. LE BORNAGE : Opération technique réalisée par un géomètre agréé pour délimiter physiquement la parcelle.
3. LA PUBLICITE : Insertion d'un avis au Journal Officiel et affichage au Tribunal.
4. L'INSCRIPTION : Si aucune opposition n'est formulée dans les délais légaux, le titre est créé et inscrit au Livre Foncier.

Le Titre Foncier est définitif, irrévocable et inattaquable."""
        }
    ]

    output_dir = "public/codes_pdf"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for code in codes:
        pdf = LandPDF()
        pdf.add_page()
        pdf.set_font('Helvetica', 'B', 16)
        pdf.set_text_color(22, 101, 52) # Dark Green
        pdf.multi_cell(0, 10, code['title'], align='C')
        pdf.ln(10)
        pdf.set_font('Helvetica', '', 11)
        pdf.set_text_color(51, 65, 85) # Slate
        pdf.multi_cell(0, 8, code['content'])
        
        filename = code['title'].lower().replace(' ', '_').replace('\'', '') + ".pdf"
        file_path = os.path.join(output_dir, filename)
        pdf.output(file_path)
        print(f"Généré : {file_path}")

if __name__ == "__main__":
    generate_land_pdfs()
