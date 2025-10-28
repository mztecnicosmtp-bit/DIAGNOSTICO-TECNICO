// app.js (reemplazar completo)
window.addEventListener('DOMContentLoaded', () => {
  if (!window.PDFLib) {
    alert('No se pudo cargar la librería PDF-Lib. Revisa tu conexión/CDN y recarga.');
    return;
  }

  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;

  function addLabel(page, text, x, y, font, size = 10) {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
  }

  async function generarPDF() {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 en puntos
      const form = pdfDoc.getForm();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 36;
      let y = page.getHeight() - margin;

      function titulo(txt) {
        y -= 20;
        page.drawText(txt, { x: margin, y, size: 14, font: fontBold });
        y -= 10;
        // Si tu versión de pdf-lib no soporta drawLine, comenta estas 2 líneas
        page.drawLine({
          start: { x: margin, y },
          end: { x: page.getWidth() - margin, y },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });
        y -= 12;
      }

      function campoTexto(nombre, etiqueta, x, y, w, h = 18, multiline = false) {
        addLabel(page, etiqueta, x, y + h + 2, font, 9);
        const tf = form.createTextField(nombre);
        if (multiline) tf.setMultiline(true);
        tf.addToPage(page, { x, y, width: w, height: h, borderColor: rgb(0.7, 0.7, 0.7) });
        // 👇 Apariencia por campo (evita el error setHelvetica)
        tf.updateAppearances(font);
        return tf;
      }

      function combo(nombre, etiqueta, opciones, x, y, w, h = 18) {
        addLabel(page, etiqueta, x, y + h + 2, font, 9);
        const dd = form.createDropdown(nombre);
        if (Array.isArray(opciones) && opciones.length) dd.addOptions(opciones);
        // No seleccionamos '' explícito para evitar edge cases
        dd.addToPage(page, { x, y, width: w, height: h, borderColor: rgb(0.7, 0.7, 0.7) });
        dd.updateAppearances(font); // 👈 también para dropdown
        return dd;
      }

      // Encabezado
      page.drawText('Hoja de Diagnóstico del Técnico', { x: margin, y, size: 16, font: fontBold });
      y -= 24;

      // Datos del vehículo (2 columnas)
      titulo('Datos del vehículo');
      const colW = (page.getWidth() - margin * 2 - 12) / 2;
      let x1 = margin, x2 = margin + colW + 12;
      let yy = y;
      campoTexto('no_or', 'No. OR', x1, yy, colW);
      campoTexto('vin', 'VIN', x2, yy, colW);
      yy -= 28;

      campoTexto('km', 'Kilometraje', x1, yy, colW);
      campoTexto('distribuidor', 'No. Distribuidor', x2, yy, colW);
      yy -= 28;

      campoTexto('modelo', 'Modelo', x1, yy, colW);
      campoTexto('fecha', 'Fecha (AAAA-MM-DD)', x2, yy, colW);
      yy -= 28;
      y = yy - 6;

      // Quejas y verificación
      titulo('Quejas y verificación');
      yy = y;
      campoTexto('queja_cliente', 'Queja del cliente (como la reporta)', margin, yy - 100, page.getWidth() - margin * 2, 100, true);
      yy -= 120;
      combo('queja_verificada', '¿Se verificó la queja?', ['SI', 'NO'], margin, yy, 160);
      yy -= 28;
      campoTexto('queja_tecnico', 'Interpretación del técnico (queja real)', margin, yy - 80, page.getWidth() - margin * 2, 80, true);
      yy -= 96; y = yy;

      // Inspección visual
      titulo('Inspección visual');
      yy = y;
      combo('inspeccion_causa', '¿Se encontró la causa?', ['SI', 'NO'], margin, yy, 160);
      yy -= 28;
      campoTexto('inspeccion_notas', 'Notas', margin, yy - 80, page.getWidth() - margin * 2, 80, true);
      yy -= 96; y = yy;

      // Pruebas y DTCs
      titulo('Pruebas y DTCs');
      yy = y;
      campoTexto('prueba_camino', 'Prueba de camino (Estática / Dinámica)', margin, yy - 60, page.getWidth() - margin * 2, 60, true);
      yy -= 76;
      campoTexto('dtcs_iniciales', 'DTCs (iniciales)', margin, yy - 60, page.getWidth() - margin * 2, 60, true);
      yy -= 76;
      campoTexto('dtcs_repro', 'DTCs (tras reproducir la queja)', margin, yy - 60, page.getWidth() - margin * 2, 60, true);
      yy -= 76; y = yy;

      // Pruebas precisas
      titulo('Pruebas precisas');
      yy = y;
      combo('pruebas_ok', '¿Dentro de especificación?', ['SI', 'NO'], margin, yy, 200);
      yy -= 28;
      campoTexto('pruebas_notas', 'Notas', margin, yy - 60, page.getWidth() - margin * 2, 60, true);
      yy -= 76; y = yy;

      // Reparación
      titulo('Reparación');
      yy = y;
      campoTexto('reparacion_desc', 'Descripción de la reparación', margin, yy - 80, page.getWidth() - margin * 2, 80, true);
      yy -= 96;
      const half = (page.getWidth() - margin * 2 - 12) / 2;
      campoTexto('partes_1', 'No. de parte(s) utilizadas', margin, yy - 60, half, 60, true);
      campoTexto('partes_2', 'No. de parte(s) utilizadas', margin + half + 12, yy - 60, half, 60, true);
      yy -= 76;
      combo('verificacion_reparacion', '¿Se verificó que la queja se ha resuelto?', ['SI', 'NO'], margin, yy, half);
      combo('dtcs_borrados', '¿DTCs borrados?', ['SI', 'NO'], margin + half + 12, yy, half);
      yy -= 28;
      campoTexto('causa', '¿Cuál es la causa de la queja del cliente?', margin, yy - 60, page.getWidth() - margin * 2, 60, true);
      yy -= 76; y = yy;

      // Cierre
      titulo('Cierre');
      yy = y;
      campoTexto('tecnico_nombre', 'Nombre del técnico', margin, yy, half);
      campoTexto('fecha_elaboracion', 'Fecha de elaboración', margin + half + 12, yy, half);
      yy -= 28;
      addLabel(page, 'Firma del técnico (use la herramienta de firma del lector PDF)', margin, yy, font, 9);
      const firma = form.createTextField('firma_tecnico');
      firma.addToPage(page, { x: margin, y: yy - 40, width: page.getWidth() - margin * 2, height: 40, borderColor: rgb(0.7, 0.7, 0.7) });
      firma.updateAppearances(font);
      yy -= 60;

      // ✅ NO llamamos a form.updateFieldAppearances(font);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'Hoja_Diagnostico_Tecnico_rellenable.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error generando el PDF: ' + (err?.message || err));
    }
  }

  const btn = document.getElementById('btn');
  if (btn) btn.addEventListener('click', generarPDF);
});
