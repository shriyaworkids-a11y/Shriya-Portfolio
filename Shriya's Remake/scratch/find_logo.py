import os, glob

brain_dir = r"C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56"
files = glob.glob(brain_dir + "/**/*", recursive=True)
images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.jfif'))]
images.sort(key=os.path.getmtime, reverse=True)

with open("scratch/found_images.txt", "w", encoding="utf-8") as out:
    for img in images[:20]:
        out.write(f"{img}\n")
print("Done found", len(images))
