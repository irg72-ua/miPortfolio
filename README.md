# Portfolio — Izan Ruzafa

Portfolio personal hecho con **HTML, CSS y JavaScript puro** (sin frameworks ni dependencias de build).
Estudiante de Ingeniería Informática + ADE (I²ADE) en la Universidad de Alicante.

🔗 **En vivo:** https://irg72-ua.github.io/miPortfolio/

## Características

- 🎨 Diseño responsive con **modo claro/oscuro** (manual y según el sistema, recordado entre visitas).
- ✨ Animaciones de entrada con `IntersectionObserver` y efectos 3D sutiles en las tarjetas.
- ♿ Accesibilidad: enlace de salto al contenido, `aria` en iconos, foco visible y respeto a `prefers-reduced-motion`.
- 🔎 SEO: metadatos Open Graph/Twitter, `canonical` y datos estructurados JSON-LD (Schema.org).
- 📨 Formulario de contacto funcional mediante [Formspree](https://formspree.io).
- ⚡ Sin dependencias pesadas: solo una hoja de iconos ([devicon](https://devicon.dev)) servida por CDN con versión fijada.

## Estructura

```
.
├── index.html       # Estructura y contenido
├── styles.css       # Estilos y temas (variables CSS)
├── script.js        # Interacciones (tema, scroll, contadores, etc.)
└── docs/
    └── CV.pdf       # Currículum
```

## Desarrollo local

No requiere instalación. Abre `index.html` en el navegador, o sirve la carpeta para evitar
limitaciones de `file://`:

```bash
# Con Python
python -m http.server 8000
# Luego visita http://localhost:8000
```

(En VS Code también puedes usar la extensión **Live Server**.)

## Despliegue

Alojado en **GitHub Pages** desde la rama `main`. Cada `push` despliega automáticamente
la nueva versión en ~1 minuto, sin pasos manuales.
