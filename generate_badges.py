import csv
import qrcode
import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

# Configuration
CSV_FILE = 'participants_2025-12-04.csv'
OUTPUT_DIR = 'badges_output'
BACKGROUND_IMAGE = 'public/badge.png'

# Dimensions in mm
PAGE_WIDTH_MM = 75   # Lebar
PAGE_HEIGHT_MM = 110 # Panjang
DPI = 300

# Convert to pixels
PAGE_WIDTH = int(PAGE_WIDTH_MM * DPI / 25.4)
PAGE_HEIGHT = int(PAGE_HEIGHT_MM * DPI / 25.4)

def mm_to_px(mm):
    return int(mm * DPI / 25.4)

def generate_qr_code_image(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=1,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    return img

def draw_centered_text(draw, text, y, font, fill, max_width):
    """Draws text centered horizontally, wrapping if necessary."""
    if not text:
        return y

    lines = []
    # Estimate char width to wrap
    # This is a rough estimation. For better wrapping, we'd measure words.
    avg_char_width = draw.textlength("a", font=font)
    max_chars = int(max_width / avg_char_width)
    
    # Use textwrap to split lines
    wrapped_lines = textwrap.wrap(text, width=max_chars)
    
    current_y = y
    for line in wrapped_lines:
        # Calculate width of the line
        w = draw.textlength(line, font=font)
        x = (PAGE_WIDTH - w) / 2
        draw.text((x, current_y), line, font=font, fill=fill)
        # Move y down by font height + padding
        bbox = font.getbbox(line)
        height = bbox[3] - bbox[1]
        current_y += height + mm_to_px(2)
        
    return current_y

def create_badges():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    print(f"Generating badges from {CSV_FILE}...")
    
    # Load font
    try:
        # Try to load a standard font
        # macOS path
        font_path = "/System/Library/Fonts/Helvetica.ttc"
        if not os.path.exists(font_path):
            # Fallback or other OS
            font_path = "arial.ttf"

        # Font sizes
        name_font = ImageFont.truetype(font_path, mm_to_px(4.1))  # slightly smaller for name
        name_font_small = ImageFont.truetype(font_path, mm_to_px(3.9))  # smaller when name > 3 words
        title_font = ImageFont.truetype(font_path, mm_to_px(3.1))  # keep title readable
        company_font = ImageFont.truetype(font_path, mm_to_px(2.9))  # smaller for company
        # Smaller variants used for long lines (> 3 words)
        title_font_small = ImageFont.truetype(font_path, mm_to_px(2.9))
        company_font_small = ImageFont.truetype(font_path, mm_to_px(2.7))
    except Exception:
        print("Warning: Custom font not found, using default.")
        name_font = ImageFont.load_default()
        name_font_small = ImageFont.load_default()
        title_font = ImageFont.load_default()
        company_font = ImageFont.load_default()
        title_font_small = ImageFont.load_default()
        company_font_small = ImageFont.load_default()

    try:
        with open(CSV_FILE, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            count = 0
            for i, participant in enumerate(reader):
                # Create canvas
                if os.path.exists(BACKGROUND_IMAGE):
                    bg = Image.open(BACKGROUND_IMAGE).convert("RGBA")
                    # Resize background to fit new dimensions
                    bg = bg.resize((PAGE_WIDTH, PAGE_HEIGHT))
                    img = bg.convert("RGB") # Convert back to RGB for saving as JPG
                else:
                    img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), color='white')

                draw = ImageDraw.Draw(img)

                # Get data
                name = participant.get('Name', 'Unknown')
                # Normalize participant name: only first letters capital, rest lowercase
                if isinstance(name, str):
                    name = " ".join([w.capitalize() for w in name.strip().split()])
                title = participant.get('Title', '')
                company = participant.get('Company', '')
                qr_data = participant.get('QR Code', '')
                
                # Layout
                # Left margin (move slightly more to the left)
                left_margin = mm_to_px(13)
                # Use narrower width for name, slightly narrower for title/company to avoid overflow
                name_max_text_width = PAGE_WIDTH - left_margin - mm_to_px(20)  # tight for name
                info_max_text_width = PAGE_WIDTH - left_margin - mm_to_px(8)  # reduce width a bit to stay within bounds

                # Start text position (move slightly up)
                current_y = mm_to_px(36)

                # Helper: draw left-aligned wrapped text
                def draw_left_wrapped(text, y, font, fill, max_width, small_font=None, force_small=False):
                    if not text:
                        return y
                    # Estimate chars per line based on average 'a' width
                    avg_char_width = draw.textlength("a", font=font) or 1
                    max_chars = max(1, int(max_width / avg_char_width))
                    lines = textwrap.wrap(text, width=max_chars)
                    cy = y
                    for line in lines:
                        # If force_small enabled, shrink entire line; otherwise shrink only when the line has > 3 words
                        line_font = font
                        if small_font is not None and (force_small or len(line.split()) > 3):
                            line_font = small_font
                        draw.text((left_margin, cy), line, font=line_font, fill=fill)
                        bbox = line_font.getbbox(line)
                        height = bbox[3] - bbox[1]
                        # tighter line spacing
                        cy += height + mm_to_px(1.8)
                    return cy

                # Name: if more than 3 words, shrink entire name block
                name_force_small = len(name.split()) > 3
                current_y = draw_left_wrapped(name, current_y, name_font, "#111111", name_max_text_width, small_font=name_font_small, force_small=name_force_small)

                # Spacing before title (bring info closer to name, minimal gap)
                current_y += mm_to_px(1.2)

                # Title
                # If the title has more than 3 words overall, use small font for all its lines
                title_force_small = len(title.split()) > 3
                current_y = draw_left_wrapped(title, current_y, title_font, "#333333", info_max_text_width, small_font=title_font_small, force_small=title_force_small)

                # Company
                # Apply same logic for company text
                company_force_small = len(company.split()) > 3
                current_y = draw_left_wrapped(company, current_y, company_font, "#555555", info_max_text_width, small_font=company_font_small, force_small=company_force_small)
                
                # QR Code
                if qr_data:
                    qr_img = generate_qr_code_image(qr_data)
                    qr_size = mm_to_px(30) # 30mm QR code
                    qr_img = qr_img.resize((qr_size, qr_size))
                    
                    # Position at bottom area
                    qr_x = (PAGE_WIDTH - qr_size) // 2 + mm_to_px(6)  # shift right ~6mm
                    qr_y = PAGE_HEIGHT - qr_size - mm_to_px(18)  # increase bottom padding to 18mm
                    
                    img.paste(qr_img, (qr_x, qr_y))

                # Save
                safe_name = "".join([c for c in name if c.isalpha() or c.isdigit() or c==' ']).rstrip()
                output_filename = os.path.join(OUTPUT_DIR, f"badge_{i+1}_{safe_name.replace(' ', '_')}.jpg")
                img.save(output_filename, "JPEG", quality=95)
                count += 1
                
        print(f"Successfully generated {count} badges in {OUTPUT_DIR}/")
        
    except FileNotFoundError:
        print(f"Error: File {CSV_FILE} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
if __name__ == "__main__":
    create_badges()