from PIL import Image
import shutil
import os

source_dir = "C:/Users/HP/.gemini/antigravity/brain/30245e31-b369-4522-be39-7fe636f4dde0"
target_dir = "c:/gravity/avocat"

images = [
    ("african_female_lawyer_1768466855301.png", "african_female_lawyer.jpg"),
    ("modern_law_firm_team_senegal_1768466871620.png", "modern_law_firm_team.jpg"),
    ("legal_justice_scales_wood_1768466887718.png", "legal_scales.jpg")
]

for src_name, target_name in images:
    src_path = os.path.join(source_dir, src_name)
    target_path = os.path.join(target_dir, target_name)
    
    if os.path.exists(src_path):
        try:
            # Open as PNG and save as JPG
            img = Image.open(src_path)
            # Remove alpha channel if present
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(target_path, "JPEG", quality=95)
            print(f"Converted and saved {target_name}")
        except Exception as e:
            print(f"Error converting {src_name}: {e}")
    else:
        print(f"Source file not found: {src_path}")
