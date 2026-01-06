from fpdf import FPDF
import os

class CatalogPDF(FPDF):
    def header(self):
        self.set_fill_color(10, 25, 47) # Navy Deep
        self.rect(0, 0, 210, 30, 'F')
        self.set_font('helvetica', 'B', 16)
        self.set_text_color(197, 161, 67) # Gold
        self.cell(0, 10, 'LEXPREMIUM 2.0 - CATALOGUE VISUEL D\'ELITE (SENEGAL)', border=False, align='C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'LexPremium 2026 - Edition Prestige Afrique - Page {self.page_no()}', align='C')

def generate_visual_catalog_fr():
    IMAGE_DIR = r"C:\Users\HP\.gemini\antigravity\brain\22708f14-dd02-4f2e-a16a-33482af3c99d"
    
    # Selection of French and African-representative images
    visuals = [
        ("TABLEAU DE BORD EXECUTIF 2026", "executive_dashboard_2026_premium_1767649518351.png", 
         "Le cockpit strategique pour les associes du barreau. Vision 360 du CA, de la marge nette et previsions de tresorerie par Intelligence Artificielle."),
        ("RECOUVREMENT INTELLIGENT IA", "smart_recovery_ia_fr_senegal_1767652719083.png", 
         "Automatisation du recouvrement avec scoring de risque client et relances WhatsApp Business. Interface adaptee au marche senegalais."),
        ("SUCCESSION PRO EXPERT", "succession_pro_fr_senegal_1767652743050.png", 
         "Calculateur de partage successoral complexe conforme au Code de la Famille du Senegal. Expertise juridique et fiscale automatisee."),
        ("SALLE DE COMMANDE (WAR ROOM)", "lexpremium_war_room_tablet_1767649561511.png", 
         "L'experience mobile ultime pour les plaidoiries au Palais de Justice de Dakar. OCR tactile et analyse live des pieces.")
    ]

    pdf = CatalogPDF()
    
    for title, img_name, desc in visuals:
        img_path = os.path.join(IMAGE_DIR, img_name)
        if not os.path.exists(img_path):
            print(f"Avertissement: Image non trouvee {img_name}")
            continue
            
        pdf.add_page()
        
        # Title of the visual
        pdf.set_font('helvetica', 'B', 20)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(0, 15, title, new_x="LMARGIN", new_y="NEXT", align='L')
        pdf.ln(5)
        
        # The Image
        pdf.image(img_path, x=15, y=50, w=180)
        
        # Description
        pdf.set_y(240)
        pdf.set_font('helvetica', '', 12)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 7, desc, align='C')

    output_path = "LexPremium_Catalogue_Visuel_FR_2026.pdf"
    pdf.output(output_path)
    print(f"Catalogue visuel genere avec succes: {output_path}")

if __name__ == "__main__":
    generate_visual_catalog_fr()
