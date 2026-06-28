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
    "juego_portatil.jpg": "Hyper realistic product photography of a modern handheld gaming console playing a colorful game, lying on an airplane tray table, cinematic lighting, highly detailed, 8k",
    "laptop_asus.jpg": "Hyper realistic product photography of a modern ASUS Vivobook laptop, open showing windows desktop, clean home office desk background, studio lighting, 8k",
    "ram_kingston.jpg": "Hyper realistic photography of two DDR5 Kingston FURY Beast RAM memory modules, sleek black heatsink design, macro shot, highly detailed, 8k",
    "cojin_ergonomico.jpg": "Hyper realistic product photography of an ergonomic black memory foam seat cushion for office chairs, clean design, floating studio shot, soft lighting, 8k",
    "lampara_escritorio.jpg": "Hyper realistic product photography of a modern minimalist white LED desk lamp, sleek design, glowing warm light, charging a smart phone wirelessly on its base, clean minimalist desk background, 8k",
    "mancuernas_ajustables.jpg": "Hyper realistic product photography of a pair of heavy adjustable dumbbells in their trays, modern select weight dials, high-end home gym background, cinematic studio lighting, 8k",
    "bandas_resistencia.jpg": "Hyper realistic product photography of a set of 5 colorful latex resistance bands with handles, ankle straps and door anchor, arranged neatly on a gym floor, studio lighting, 8k",
    "serum_hidratante.jpg": "Hyper realistic product photography of a luxury amber glass dropper bottle of hyaluronic acid facial serum, droplets of water on the bottle, elegant design, soft natural lighting, commercial cosmetics shot, 8k"
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
