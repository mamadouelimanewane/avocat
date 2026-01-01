from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import os

def create_presentation():
    prs = Presentation()

    # Define some colors
    NAVY = RGBColor(30, 41, 59)
    GOLD = RGBColor(251, 191, 36)
    WHITE = RGBColor(255, 255, 255)

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    # --- PAGE 1: COVER ---
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    set_slide_background(slide, NAVY)
    
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    
    title.text = "LEXPREMIUM"
    title.text_frame.paragraphs[0].font.color.rgb = GOLD
    title.text_frame.paragraphs[0].font.bold = True
    title.text_frame.paragraphs[0].font.size = Pt(60)
    
    subtitle.text = "Solution de Gestion Intégrale & IA Juridique\npour Cabinets d'Exception"
    subtitle.text_frame.paragraphs[0].font.color.rgb = WHITE
    
    # Try to add hero image if it exists
    hero_path = r"C:\Users\HP\.gemini\antigravity\brain\17fc691b-af56-4fb5-a458-49923a728e99\lexpremium_presentation_hero_1767228227038.png"
    if os.path.exists(hero_path):
        slide.shapes.add_picture(hero_path, Inches(5), Inches(3), width=Inches(4.5))

    # Helper for content slides
    def add_content_slide(title_text, points):
        slide = prs.slides.add_slide(prs.slide_layouts[1])
        # Background light gray/blue
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = RGBColor(241, 245, 249)
        
        title = slide.shapes.title
        title.text = title_text
        title.text_frame.paragraphs[0].font.color.rgb = NAVY
        
        body = slide.placeholders[1]
        tf = body.text_frame
        tf.word_wrap = True
        
        for p in points:
            p_para = tf.add_paragraph()
            p_para.text = p
            p_para.level = 0
            p_para.font.size = Pt(20)
            p_para.font.color.rgb = RGBColor(51, 65, 85)

    # --- PAGE 2: CONTEXT ---
    add_content_slide("Le Contexte : Les Défis du Barreau", [
        "Fragmentation : Trop d'outils, données éparpillées.",
        "Perte de Temps : 30% du temps d'un avocat est administratif.",
        "Sécurité : Risques croissants sur la confidentialité.",
        "Besoin d'IA : L'avantage compétitif indispensable."
    ])

    # --- PAGE 3: VISION ---
    add_content_slide("La Vision : L'Avocat Augmenté", [
        "Un cabinet 100% numérique, sécurisé et intelligent.",
        "Centralisation totale des dossiers et de la finance.",
        "L'IA au service de l'expertise juridique.",
        "Libérez-vous des tâches répétitives."
    ])

    # --- PAGE 4: TABLEAU DE BORD ---
    add_content_slide("Pilotage Visionnaire", [
        "Vue 360° : Dossiers, clients et alertes en un coup d'œil.",
        "Indicateurs Financiers : CA et impayés en temps réel.",
        "Priorisation IA : Identification des urgences.",
        "Interface tactile et intuitive."
    ])

    # --- PAGE 5: IA JURIDIQUE I ---
    add_content_slide("LexAI : Votre Collaborateur 24h/24", [
        "Chat Juridique : Questions en langage naturel.",
        "Synthèse Automatique : Résumé de documents volumineux.",
        "Analyse de Pièces : Extraction de données clés (dates, montants).",
        "Assistance à la rédaction permanente."
    ])

    # --- PAGE 6: RED TEAMING ---
    add_content_slide("IA : Stratégie & 'Red Teaming'", [
        "Simulation d'Attaque : Identifiez les failles de votre argumentaire.",
        "Générateur de Contre-Arguments : Anticipez la partie adverse.",
        "Audit de contrats : Détectez les clauses risquées.",
        "Optimisation de la stratégie de défense."
    ])

    # --- PAGE 7: JURISPRUDENCE ---
    add_content_slide("Recherche & Jurisprudence", [
        "Accès instantané aux précédents judiciaires.",
        "Moteur de recherche sémantique LexPremium.",
        "Surveillance des évolutions législatives (OHADA).",
        "Bibliothèque de droit comparé."
    ])

    # --- PAGE 8: AIDE PLAIDOIRIE ---
    add_content_slide("Le 'War Room' de l'Audience", [
        "Chronomètre de Plaidoirie intégré.",
        "Mode Palais : Accès rapide aux pièces sur smartphone.",
        "Notes de plaidoirie interactives.",
        "Consultation hors-ligne au tribunal."
    ])

    # --- PAGE 9: DOSSIERS ---
    add_content_slide("Gestion de Dossiers Next-Gen", [
        "Chronologie interactive de la procédure.",
        "Interconnexion dynamique des parties (Experts, Huissiers).",
        "Suivi des délais légaux par étape.",
        "Versioning complet des documents."
    ])

    # --- PAGE 10: LA BIBLE ---
    add_content_slide("La Bible des Modèles", [
        "Standardisation de l'excellence rédactionnelle.",
        "Générateur d'actes : Remplissage auto des données clients.",
        "Bibliothèque de clauses sécurisées.",
        "Gain de temps de 70% sur la création d'actes."
    ])

    # --- PAGE 11: COMPTA OHADA ---
    add_content_slide("Comptabilité & OHADA", [
        "Comptabilité intégrée (Achats, Ventes, Caisse).",
        "Conformité SYSCOHADA garantie.",
        "Automatisation des écritures comptables.",
        "Historique des journaux inaltérable."
    ])

    # --- PAGE 12: FINANCE ---
    add_content_slide("Finance & Pilotage", [
        "Pilotage stratégique par la donnée.",
        "Gestion des CARPA (Fonds Tiers) sécurisée.",
        "Rapports de rentabilité par collaborateur.",
        "Suivi précis de la marge brute par dossier."
    ])

    # --- PAGE 13: FACTURATION ---
    add_content_slide("Facturation & Recouvrement", [
        "Émission de factures professionnelles en 3 clics.",
        "Suivi automatisé des relances pour impayés.",
        "Calculatrice d'intérêts moratoires intégrée.",
        "Gestion des débours et honoraires séparée."
    ])

    # --- PAGE 14: AGENDA ---
    add_content_slide("Agenda & Délais", [
        "Calculateur automatique de délais de procédure.",
        "Synchronisation smartphone globale.",
        "Agenda d'équipe partagé par juridiction.",
        "Alertes forclusion intelligentes."
    ])

    # --- PAGE 15: DICTÉE VOCALE ---
    add_content_slide("Dictée Vocale IA", [
        "Dictée haute précision (jargon juridique OHADA).",
        "Transcription instantanée en brouillons d'actes.",
        "Mobilité : Dictez vos notes dès la sortie d'audience.",
        "Reconnaissance multi-locuteurs pour les réunions."
    ])

    # --- PAGE 16: PORTAIL CLIENT ---
    add_content_slide("Portail Client (Extranet)", [
        "Espace sécurisé dédié pour chaque client.",
        "Suivi de l'avancement du dossier 24h/24.",
        "Dépôt de pièces sécurisé (Fin des emails lourds).",
        "Paiement des provisions en ligne."
    ])

    # --- PAGE 17: CARTOGRAPHIE ---
    add_content_slide("Cartographie Sémantique", [
        "Visualisation des liens complexes d'un dossier.",
        "Frise chronologique des faits clés générée par l'IA.",
        "Détection visuelle des incohérences.",
        "Outil d'aide à la décision stratégique."
    ])

    # --- PAGE 18: CONCLUSION ---
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    set_slide_background(slide, NAVY)
    title = slide.shapes.title
    title.text = "Choisissez l'Avenir."
    title.text_frame.paragraphs[0].font.color.rgb = GOLD
    
    subtitle = slide.placeholders[1]
    subtitle.text = "LexPremium - L'IA au service du Droit\nDémo : avocat-tito.vercel.app"
    subtitle.text_frame.paragraphs[0].font.color.rgb = WHITE

    # Save
    prs.save("LexPremium_Presentation.pptx")
    print("Presentation created successfully: LexPremium_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
