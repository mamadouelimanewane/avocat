from fpdf import FPDF
import re
import os

class PremiumBrochure(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)
        self.navy = (15, 23, 42)    # Slate 900
        self.gold = (180, 140, 45)  # Professional Gold (slightly deeper)
        self.brown = (101, 67, 33)  # Professional Brown
        self.text_gray = (55, 65, 81) # Slate 700
        self.light_gray = (241, 245, 249) # Slate 100

    def header(self):
        if self.page_no() > 1:
            # Subtle top bar
            self.set_fill_color(*self.navy)
            self.rect(0, 0, 210, 1.5, 'F')
            
            self.set_y(8)
            self.set_font('helvetica', 'B', 8)
            self.set_text_color(148, 163, 184)
            self.cell(0, 10, 'LEXPREMIUM ERP | MANUEL DE HAUTE PERFORMANCE', align='R')
            self.ln(15)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-20)
            self.set_fill_color(*self.light_gray)
            self.rect(0, 280, 210, 20, 'F')
            
            self.set_y(-15)
            self.set_font('helvetica', 'B', 9)
            self.set_text_color(*self.navy)
            self.cell(0, 10, f'CONFIDENTIEL - Page {self.page_no()}', align='C')

    def cover_page(self):
        self.add_page()
        # Large Navy Background Area
        self.set_fill_color(*self.navy)
        self.rect(0, 0, 210, 120, 'F')
        
        # Logo in Gold/White on Navy
        self.set_y(40)
        self.set_x(20)
        self.set_font('helvetica', 'B', 45)
        self.set_text_color(255, 255, 255)
        self.write(15, "LEX")
        self.set_text_color(*self.gold)
        self.write(15, "PREMIUM")
        
        self.ln(25)
        self.set_x(20)
        self.set_font('helvetica', 'B', 22)
        self.set_text_color(255, 255, 255)
        self.multi_cell(0, 12, "L'EXCELLENCE JURIDIQUE\nÀ L'ÈRE DU NUMÉRIQUE")
        
        # Subtle separator
        self.set_fill_color(*self.gold)
        self.rect(20, 105, 60, 3, 'F')
        
        # Main Illustration
        img_path = "c:/gravity/avocat/legal_scales.jpg"
        if os.path.exists(img_path):
            self.image(img_path, x=20, y=130, w=170)
            
        self.set_y(250)
        self.set_x(20)
        self.set_font('helvetica', 'I', 13)
        self.set_text_color(*self.navy)
        self.multi_cell(0, 8, "Guide des fonctionnalités stratégiques pour\nles cabinets d'avocats de prestige.")

    def ensure_space(self, h):
        """Check if remaining space is less than h, then add page."""
        if (self.h - self.get_y() - self.b_margin) < h:
            self.add_page()

def clean_text(text):
    text = text.replace('**', '').replace('*', '')
    text = text.replace('’', "'").replace('“', '"').replace('”', '"').replace('…', '...')
    return re.sub(r'[^\x00-\x7F\xC0-\xFF]', '', text)

def create_premium_brochure(md_file, pdf_file):
    pdf = PremiumBrochure()
    pdf.cover_page()
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by chapters (## )
    chapters = re.split(r'\n## ', content)
    
    # First part is intro, skip if empty or handle specifically
    intro = chapters[0]
    
    for chapter in chapters[1:]:
        lines = chapter.strip().split('\n')
        if not lines: continue
        
        # Chapter Title
        header_line = clean_text(lines[0])
        pdf.ensure_space(40) # Ensure space for title + intro
        
        pdf.ln(10)
        pdf.set_font('helvetica', 'B', 20)
        
        # Split number and title
        match = re.match(r'(\d+)\.\s+(.*)', header_line)
        if match:
            num, title = match.groups()
            pdf.set_text_color(*pdf.gold)
            pdf.write(10, num + ". ")
            pdf.set_text_color(*pdf.navy)
            pdf.multi_cell(0, 10, title.upper())
        else:
            pdf.set_text_color(*pdf.navy)
            pdf.multi_cell(0, 10, header_line.upper())
            
        pdf.set_draw_color(*pdf.gold)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 50, pdf.get_y())
        pdf.ln(8)
        
        for line in lines[1:]:
            raw_line = line.strip()
            cleaned_line = clean_text(raw_line)
            if not cleaned_line or cleaned_line == '---': continue
            
            # Subtitle "Contenu"
            if raw_line.startswith('### '):
                pdf.ensure_space(15)
                pdf.set_font('helvetica', 'B', 10)
                pdf.set_text_color(150, 150, 150)
                pdf.multi_cell(0, 6, "LES PILIERS DU MODULE", align='L')
                pdf.ln(2)
            
            # List Items
            elif raw_line.startswith('• ') or raw_line.startswith('- '):
                pdf.ensure_space(12)
                pdf.set_x(25)
                
                content_text = cleaned_line[2:]
                # Bullet
                pdf.set_fill_color(*pdf.gold)
                pdf.ellipse(19, pdf.get_y() + 2, 2.5, 2.5, 'F')
                
                if ':' in content_text:
                    label, desc = content_text.split(':', 1)
                    pdf.set_font('helvetica', 'B', 11)
                    pdf.set_text_color(*pdf.brown)
                    pdf.write(6, label.strip() + " : ")
                    
                    pdf.set_font('helvetica', '', 11)
                    pdf.set_text_color(*pdf.text_gray)
                    pdf.multi_cell(0, 6, desc.strip())
                else:
                    pdf.set_font('helvetica', '', 11)
                    pdf.set_text_color(*pdf.text_gray)
                    pdf.multi_cell(0, 6, content_text)
                pdf.ln(1)
            
            # Module Intro Text
            else:
                pdf.set_font('helvetica', 'I', 11)
                pdf.set_text_color(80, 80, 80)
                pdf.multi_cell(0, 6, cleaned_line)
                pdf.ln(2)

    # Conclusion Page
    pdf.add_page()
    pdf.set_y(100)
    pdf.set_font('helvetica', 'B', 28)
    pdf.set_text_color(*pdf.navy)
    pdf.multi_cell(0, 15, "CONSTRUISEZ LE CABINET\nDE DEMAIN, DÈS AUJOURD'HUI.", align='C')
    pdf.ln(20)
    
    pdf.set_fill_color(*pdf.gold)
    curr_x = (210 - 80) / 2
    pdf.rect(curr_x, pdf.get_y(), 80, 2, 'F')
    pdf.ln(20)
    
    pdf.set_font('helvetica', '', 16)
    pdf.set_text_color(*pdf.text_gray)
    pdf.multi_cell(0, 10, "LexPremium ERP : La technologie au service\nde la rigueur juridique.", align='C')
    
    pdf.output(pdf_file)
    print(f"Professional Brochure Refined: {pdf_file}")

if __name__ == "__main__":
    create_premium_brochure("c:/gravity/avocat/MANUEL_UTILISATION_DETAILLE.md", "c:/gravity/avocat/LexPremium_Brochure_Elite_2026.pdf")
