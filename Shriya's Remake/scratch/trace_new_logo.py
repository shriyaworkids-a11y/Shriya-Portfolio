import cv2
import numpy as np
from PIL import Image
import os

input_path = r"C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\.user_uploaded\media_1789929159096.jpg"
output_dir = r"d:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya"
os.makedirs(output_dir, exist_ok=True)

# Load image in grayscale
img = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE)
h_orig, w_orig = img.shape

# Threshold white logo vs dark background
_, thresh = cv2.threshold(img, 120, 255, cv2.THRESH_BINARY)

# Find bounding box of all white pixels
y_indices, x_indices = np.where(thresh > 120)
y_min, y_max = y_indices.min(), y_indices.max()
x_min, x_max = x_indices.min(), x_indices.max()

# Add 2px margin
margin = 4
y_min = max(0, y_min - margin)
y_max = min(h_orig - 1, y_max + margin)
x_min = max(0, x_min - margin)
x_max = min(w_orig - 1, x_max + margin)

cropped_thresh = thresh[y_min:y_max+1, x_min:x_max+1]
crop_h, crop_w = cropped_thresh.shape

# 1. Generate Transparent PNG (White logo on transparent)
rgba_white = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
rgba_white[cropped_thresh > 120] = [255, 255, 255, 255]
Image.fromarray(rgba_white).save(os.path.join(output_dir, "shriya-butterfly-logo-cropped.png"))
Image.fromarray(rgba_white).save(os.path.join(output_dir, "shriya-butterfly-white.png"))

# 2. Generate Transparent PNG (Black logo on transparent)
rgba_black = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
rgba_black[cropped_thresh > 120] = [18, 18, 18, 255]
Image.fromarray(rgba_black).save(os.path.join(output_dir, "shriya-butterfly-black.png"))

# 3. Vector Contours -> SVG
# Find contours with hierarchy
contours, hierarchy = cv2.findContours(cropped_thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

svg_paths = []
for cnt in contours:
    # simplify contour slightly for clean curves
    epsilon = 0.0012 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    if len(approx) < 3:
        continue
    
    pts = approx.reshape(-1, 2)
    path_d = f"M {pts[0][0]} {pts[0][1]} "
    for pt in pts[1:]:
        path_d += f"L {pt[0]} {pt[1]} "
    path_d += "Z"
    svg_paths.append(path_d)

combined_d = " ".join(svg_paths)

svg_content = f'''<svg class="brand-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {crop_w} {crop_h}" fill="currentColor" fill-rule="evenodd">
  <path d="{combined_d}" />
</svg>'''

svg_path_file = os.path.join(output_dir, "shriya-butterfly-logo.svg")
with open(svg_path_file, "w", encoding="utf-8") as f:
    f.write(svg_content)

with open(r"d:\riya\Shriya's Portfolio\Shriya's Remake\scratch\new_svg_markup.txt", "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"SUCCESS: cropped dimensions = {crop_w}x{crop_h}, contours = {len(contours)}, paths = {len(svg_paths)}")
