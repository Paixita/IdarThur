const fs = require('fs');
const files = [
  'app/agentes/page.js',
  'app/autos/page.js',
  'app/eventos/page.js',
  'app/historias/[id]/page.js',
  'app/noticias/page.js',
  'app/privacidad/page.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Replace unescaped quotes in JSX text
    // A naive but effective approach for these specific files
    content = content.replace(/([a-zA-Z\s])"([a-zA-Z\s])/g, '$1&quot;$2');
    content = content.replace(/([a-zA-Z\s])'([a-zA-Z\s])/g, '$1&apos;$2');
    fs.writeFileSync(f, content);
  }
});
console.log('Fixed quotes');
