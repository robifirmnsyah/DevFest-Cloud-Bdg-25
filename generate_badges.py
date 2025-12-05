import csv
import qrcode
import io
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader, simpleSplit

# Configuration
CSV_FILE = 'participants_2025-12-04.csv'
OUTPUT_PDF = 'badges_single_page.pdf'
BACKGROUND_IMAGE = 'public/badge.png'

# Page dimensions
PAGE_WIDTH, PAGE_HEIGHT = A4

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
    
    # Convert to bytes for ReportLab
    img_buffer = io.BytesIO()
    img.save(img_buffer, format="PNG")
    img_buffer.seek(0)
    return img_buffer

def create_badges():
    print(f"Generating badges from {CSV_FILE}...")
    c = canvas.Canvas(OUTPUT_PDF, pagesize=A4)
    
    try:
        with open(CSV_FILE, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            count = 0
            for participant in reader:
                # Draw Background
                if os.path.exists(BACKGROUND_IMAGE):
                    c.drawImage(BACKGROUND_IMAGE, 0, 0, width=PAGE_WIDTH, height=PAGE_HEIGHT)
                else:
                    print(f"Warning: Background image {BACKGROUND_IMAGE} not found.")

                # Get data
                name = participant.get('Name', 'Unknown')
                title = participant.get('Title', '')
                company = participant.get('Company', '')
                qr_data = participant.get('QR Code', '')
                
                # Text Configuration
                text_x = 38 * mm # Moved left (was 42mm)
                max_text_width = 115 * mm # Reduced width (was 125mm)
                
                # Name
                c.setFillColorRGB(0.1, 0.1, 0.1) # #1a1a1a
                name_font_size = 30
                c.setFont("Helvetica-Bold", name_font_size)
                
                start_y = 190 * mm # Moved up (was 185mm)
                
                # Check if name fits in one line
                if c.stringWidth(name, "Helvetica-Bold", name_font_size) <= max_text_width:
                    c.drawString(text_x, start_y, name)
                    current_y = start_y
                else:
                    # Wrap to 2 lines
                    lines = simpleSplit(name, "Helvetica-Bold", name_font_size, max_text_width)
                    
                    # If splitting results in more than 2 lines, reduce font size
                    if len(lines) > 2:
                        name_font_size = 24
                        c.setFont("Helvetica-Bold", name_font_size)
                        lines = simpleSplit(name, "Helvetica-Bold", name_font_size, max_text_width)
                    
                    # Draw up to 2 lines
                    y_cursor = start_y
                    for i, line in enumerate(lines[:2]):
                        c.drawString(text_x, y_cursor, line)
                        if i < len(lines[:2]) - 1:
                            y_cursor -= 12 * mm # Line spacing
                    
                    current_y = y_cursor

                # Title
                c.setFillColorRGB(0.2, 0.2, 0.2) # #333
                c.setFont("Helvetica-Bold", 20)
                
                # Position title below name
                title_y = current_y - 15 * mm
                c.drawString(text_x, title_y, title)
                
                # Company
                c.setFillColorRGB(0.33, 0.33, 0.33) # #555
                c.setFont("Helvetica", 18)
                c.drawString(text_x, title_y - 10 * mm, company)
                
                # QR Code
                if qr_data:
                    qr_img_buffer = generate_qr_code_image(qr_data)
                    qr_size = 75 * mm
                    # Center QR code horizontally in the white area
                    # Moved right slightly (was + 18mm)
                    qr_x = (PAGE_WIDTH - qr_size) / 2 + 18 * mm 
                    qr_y = 60 * mm 
                    
                    c.drawImage(ImageReader(qr_img_buffer), qr_x, qr_y, width=qr_size, height=qr_size)

                c.showPage()
                count += 1
                    
        c.save()
        print(f"Successfully generated {count} badges in {OUTPUT_PDF}")
        
    except FileNotFoundError:
        print(f"Error: File {CSV_FILE} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_badges()