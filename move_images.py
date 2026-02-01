import shutil
import os

source_dir = "C:/Users/HP/.gemini/antigravity/brain/30245e31-b369-4522-be39-7fe636f4dde0"
target_dir = "c:/gravity/avocat"

images = [
    ("african_female_lawyer_1768466855301.png", "african_female_lawyer.png"),
    ("modern_law_firm_team_senegal_1768466871620.png", "modern_law_firm_team.png"),
    ("legal_justice_scales_wood_1768466887718.png", "legal_scales.png")
]

for src_name, target_name in images:
    src_path = os.path.join(source_dir, src_name)
    target_path = os.path.join(target_dir, target_name)
    
    if os.path.exists(src_path):
        try:
            shutil.copy2(src_path, target_path)
            print(f"Copied {src_name} to {target_name}")
        except Exception as e:
            print(f"Error copying {src_name}: {e}")
    else:
        print(f"Source file not found: {src_path}")
