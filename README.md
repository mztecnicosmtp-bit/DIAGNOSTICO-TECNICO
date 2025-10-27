
# Hoja de Diagnóstico – PDF rellenable (estático)

Proyecto estático (HTML+JS) que genera un **PDF con campos editables (AcroForm)** similar a tu hoja de diagnóstico. No requiere servidor: puedes alojarlo en **GitHub Pages**.

## Uso local
1. Abre `index.html` en un navegador moderno o sirve la carpeta con `npx serve .`.
2. Haz clic en **“Descargar PDF rellenable”**.
3. Abre el PDF y rellénalo en tu lector preferido (Adobe Acrobat/otros).

## Despliegue en GitHub Pages
1. Crea un repositorio y sube estos archivos.
2. En **Settings → Pages**, selecciona la rama `main` y carpeta `/root`.
3. Accede a la URL pública y prueba el botón.

## Personalización
- Puedes renombrar campos dentro de `app.js`.
- Si necesitas **usar tu PDF original como plantilla**, sube `plantilla.pdf` y, en `app.js`, en lugar de `PDFDocument.create()`, usa `PDFDocument.load()` y agrega los campos en posiciones absolutas sobre la plantilla.

## Nota
Este PDF es **rellenable** (no imagen), por lo que los técnicos podrán editar los campos directamente en el lector de PDF de la tablet.
