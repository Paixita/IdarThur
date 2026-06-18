import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const story = await request.json();
    
    // Validar campos básicos
    if (!story.titulo || !story.narrativa) {
      return Response.json({ success: false, error: "Datos incompletos" }, { status: 400 });
    }

    // Generar un ID único amigable si no tiene
    if (!story.id) {
      story.id = story.titulo.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remover acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    
    story.ano = story.ano || new Date().getFullYear().toString();

    // 1. Cargar historias actuales
    const filePath = path.join(process.cwd(), 'data', 'historias', 'stories.json');
    let stories = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      stories = JSON.parse(fileContent);
    }

    // Evitar duplicados por ID
    const exists = stories.some(s => s.id === story.id);
    if (exists) {
      story.id = `${story.id}-${Date.now().toString().slice(-4)}`;
    }

    // Insertar al inicio de la lista
    stories.unshift(story);

    const updatedJSON = JSON.stringify(stories, null, 2);

    // 2. Si hay configurado un GITHUB_TOKEN y GITHUB_REPO, subir commit a GitHub para autodespliegue
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // e.g. "Paixita/IdarThur"
    const branch = process.env.GITHUB_BRANCH || "master";

    let githubPushed = false;
    let githubMessage = "";

    if (token && repo) {
      try {
        const url = `https://api.github.com/repos/${repo}/contents/data/historias/stories.json`;
        
        // A. Obtener SHA del archivo actual en GitHub
        const getRes = await fetch(`${url}?ref=${branch}`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IdarThur-App'
          }
        });

        let sha = null;
        if (getRes.ok) {
          const getData = await getRes.json();
          sha = getData.sha;
        }

        // B. Hacer commit (PUT) a GitHub
        const putRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'IdarThur-App'
          },
          body: JSON.stringify({
            message: `content: Yessel Cronista publica nueva historia: ${story.titulo}`,
            content: Buffer.from(updatedJSON).toString('base64'),
            sha: sha || undefined,
            branch: branch
          })
        });

        if (putRes.ok) {
          githubPushed = true;
          githubMessage = "Historia publicada y sincronizada con GitHub con éxito. El auto-despliegue está en curso.";
        } else {
          const errData = await putRes.json();
          githubMessage = `Fallo al hacer commit en GitHub: ${errData.message || 'Error desconocido'}`;
        }
      } catch (err) {
        githubMessage = `Error de conexión con la API de GitHub: ${err.message}`;
      }
    }

    // 3. Escribir localmente (siempre útil en desarrollo local)
    fs.writeFileSync(filePath, updatedJSON, 'utf8');

    return Response.json({
      success: true,
      github: githubPushed,
      message: githubPushed ? githubMessage : `Guardado en base de datos local. ${githubMessage || '(Configura GITHUB_TOKEN y GITHUB_REPO para sincronizar con producción a través de GitHub)'}`,
      story: story
    });

  } catch (error) {
    console.error("Error al guardar historia:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
