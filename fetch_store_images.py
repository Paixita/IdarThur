import os
import urllib.parse
import urllib.request

IMG_PATH = os.path.join("public", "tienda")
os.makedirs(IMG_PATH, exist_ok=True)

prompts = {
    "equipaje_premium.jpg": "Hyper realistic product photography of a premium luxury polycarbonate travel suitcase, sleek modern design, studio lighting, highly detailed, 8k",
    "chaqueta_viaje.jpg": "Hyper realistic fashion photography of an elegant tactical travel winter jacket for men and women, premium fabric, outdoor snowy mountain background, cinematic lighting",
    "perfume_arabe.jpg": "Hyper realistic product photography of an elegant luxury Arabian Oud perfume bottle, gold and dark glass, exotic spices and rose petals around it, dramatic studio lighting, commercial photography, 8k",
    "mascotas_amigos.jpg": "Hyper realistic photography of a cute dog and a cute cat hugging each other as best friends, sitting next to a portable travel water bowl and a pet carrier bag, warm natural lighting, extremely detailed, heartwarming",
    "juego_portatil.jpg": "Hyper realistic product photography of a modern handheld gaming console playing a colorful game, lying on an airplane tray table, cinematic lighting, highly detailed, 8k"
}

print("Descargando imágenes realistas de la Tienda...")
for filename, prompt in prompts.items():
    prompt_seguro = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{prompt_seguro}?width=1200&height=800&nologo=true&enhance=false&model=flux-realism"
    filepath = os.path.join(IMG_PATH, filename)
    print(f"-> Generando {filename}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        print(f"   [OK] Guardado en {filepath}")
    except Exception as e:
        print(f"   [ERROR] Falló la descarga: {e}")

print("Proceso completado.")
