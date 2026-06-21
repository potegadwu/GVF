import os
from PIL import Image, ImageOps

# Path to the logo image
logo_path = r"C:\Users\Malgorzata\Desktop\GRUPA VILLA FOKSAL ANTYGRAVITY\www grupa\wizytowka i logo\logo villa foksal group.jpg"
output_path = r"C:\Users\Malgorzata\Desktop\GRUPA VILLA FOKSAL ANTYGRAVITY\website\assets\favicon.png"

try:
    with Image.open(logo_path) as img:
        img = img.convert("RGB")
        width, height = img.size
        
        # 1. We know the text "VILLA FOKSAL GROUP" is at the bottom.
        # Let's crop out the bottom 25% of the image to remove the text.
        img_no_text = img.crop((0, 0, width, int(height * 0.75)))
        
        # 2. Invert the image so the background is black and the logo is white-ish (to find bounding box)
        # Assuming the background is white/light
        inv_img = ImageOps.invert(img_no_text)
        
        # 3. Get bounding box of the non-black pixels (the VFG logo)
        bbox = inv_img.getbbox()
        
        if bbox:
            # Crop to the VFG logo
            vfg_logo = img_no_text.crop(bbox)
            
            # 4. Make it square by adding white padding
            vw, vh = vfg_logo.size
            size = max(vw, vh)
            
            # Create a new white square image
            square_img = Image.new('RGB', (size, size), (255, 255, 255))
            
            # Paste the VFG logo into the center
            offset = ((size - vw) // 2, (size - vh) // 2)
            square_img.paste(vfg_logo, offset)
            
            # 5. Add a bit of padding around the whole thing (10%)
            final_size = int(size * 1.2)
            final_img = Image.new('RGB', (final_size, final_size), (255, 255, 255))
            final_offset = ((final_size - size) // 2, (final_size - size) // 2)
            final_img.paste(square_img, final_offset)
            
            # 6. Resize to standard favicon sizes (e.g., 512x512)
            final_img = final_img.resize((512, 512), Image.Resampling.LANCZOS)
            
            # Save it
            final_img.save(output_path, format="PNG")
            print("Favicon successfully created at", output_path)
        else:
            print("Could not find bounding box.")
except Exception as e:
    print("Error:", str(e))
