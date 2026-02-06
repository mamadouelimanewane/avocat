
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
import datetime

def create_release_pdf(filename):
    c = canvas.Canvas(filename, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # Background - Premium Dark Blue
    c.setFillColorRGB(0.05, 0.1, 0.2)
    c.rect(0, 0, width, height, fill=1)
    
    # Header
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 40)
    c.drawString(20 * mm, height - 30 * mm, "LEX PREMIUM")
    
    c.setFillColorRGB(0.3, 0.7, 1) # Cyan
    c.setFont("Helvetica-Bold", 40)
    c.drawString(110 * mm, height - 30 * mm, "ULTIMATE")
    
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica", 14)
    c.drawString(20 * mm, height - 40 * mm, "RELEASE NOTE V2.0 - LE NEURO-SYSTÈME")
    
    # Date
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 20 * mm, height - 30 * mm, datetime.datetime.now().strftime("%Y-%m-%d"))

    # Modules Grid Visualization
    modules = [
        ("MENTAL", ["LexFlow (Binaural)", "LexTwin (Identity)"], colors.cyan),
        ("COMBAT", ["LexLive (Courtroom)", "War Room (Strat)", "Predictor"], colors.red),
        ("AI INTEL", ["Bot Universe", "Materia", "Automata"], colors.violet),
        ("HUMAN", ["LexPublic (Angel)", "Mediator", "Voice"], colors.green),
        ("ACTION", ["Closing", "Sentinel", "Copilot"], colors.orange),
    ]
    
    y = height - 80 * mm
    x_start = 20 * mm
    box_width = 50 * mm
    box_height = 40 * mm
    gap = 5 * mm
    
    for i, (category, items, color) in enumerate(modules):
        x = x_start + (i * (box_width + gap))
        
        # Category Box
        c.setStrokeColor(color)
        c.setLineWidth(2)
        c.setFillColorRGB(0.1, 0.15, 0.25)
        c.roundRect(x, y - box_height, box_width, box_height, 4, fill=1)
        
        # Title
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(x + box_width/2, y - 10 * mm, category)
        
        # Items
        c.setFillColorRGB(0.9, 0.9, 0.9)
        c.setFont("Helvetica", 9)
        for j, item in enumerate(items):
            c.drawCentredString(x + box_width/2, y - 20 * mm - (j * 5 * mm), item)

    # Key Innovations Section
    y_content = height - 140 * mm
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(20 * mm, y_content, "NOUVEAUTÉS MAJEURES")
    
    innovations = [
        "1. LEX PUBLIC (Angel Bot) : Chatbot citoyen bienveillant générant des leads qualifiés.",
        "2. WAR ROOM : Cartographie neuronale des arguments et simulation adverse (Red Team).",
        "3. LEX LIVE : Assistant d'audience temps réel avec détection de mensonges.",
        "4. LEX TWIN : Jumeau numérique qui apprend votre style et rédige à votre place.",
        "5. LEX FLOW : Barre audio binaurale pour le contrôle des ondes cérébrales."
    ]
    
    c.setFont("Helvetica", 12)
    for k, line in enumerate(innovations):
        c.drawString(20 * mm, y_content - 15 * mm - (k * 8 * mm), line)

    # Footer
    c.setStrokeColorRGB(1, 1, 1)
    c.setLineWidth(1)
    c.line(20 * mm, 20 * mm, width - 20 * mm, 20 * mm)
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(20 * mm, 15 * mm, "Généré automatiquement par LexPremium System Core")
    
    c.save()
    print(f"PDF Generated: {filename}")

if __name__ == "__main__":
    create_release_pdf("C:\\gravity\\Avocat\\RELEASE_NOTE_V2_ULTIMATE.pdf")
