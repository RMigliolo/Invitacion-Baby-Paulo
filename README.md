# Invitación Baby Shower · Baby Paulo

Invitación estática lista para GitHub Pages. Incluye portada, música, cuenta
regresiva, carrusel de cuatro imágenes, dinámica niña/niño, aviso solo adultos,
mapa, confirmación por WhatsApp y registro opcional en Google Sheets. El fondo
incorpora nubes difuminadas, estrellas de cuento y estrellas fugaces de
aparición aleatoria; los efectos se reducen automáticamente si el dispositivo
tiene activada la preferencia de movimiento reducido.

## 1. Archivos que debes agregar

Coloca tus archivos con estos nombres exactos:

```text
assets/
├── audio/
│   └── baby-paulo.mp3
├── img/
│   ├── baby-paulo-1.jpg
│   ├── baby-paulo-2.jpg
│   ├── baby-paulo-3.jpg
│   ├── baby-paulo-4.jpg
│   ├── winnie-pooh-autorizado.png
│   └── dinamica-nino-nina.png
└── distribucion/
    ├── preview-invitacion.jpg
    └── preview-invitacion.png
```

La imagen autorizada `winnie-pooh-autorizado.png` está configurada como imagen
principal. `fondo-osito.png` se conserva como recurso alternativo.

## 2. Publicación en GitHub Pages

1. Crea el repositorio `Invitacion-Baby-Paulo` en la cuenta `rmigliolo`.
2. Sube todo el contenido de esta carpeta a la raíz del repositorio.
3. En **Settings > Pages**, selecciona **Deploy from a branch**, rama `main` y
   carpeta `/ (root)`.
4. La URL prevista es:
   `https://rmigliolo.github.io/Invitacion-Baby-Paulo/`

Si cambias usuario o nombre del repositorio, actualiza en `index.html` las URL de
`canonical`, `og:url`, `og:image` y `twitter:image`.

## 3. Vista previa de WhatsApp

WhatsApp toma la tarjeta desde los metadatos Open Graph de `index.html`. La imagen
activa es `preview-invitacion.jpg`: mide 1200 × 630 px y está optimizada para
pesar menos de 300 KB. Después de publicar, comparte la URL completa con
`https://`. Si WhatsApp conserva una versión anterior, incrementa `?v=4` en
las rutas de la vista previa y vuelve a publicar.

## 4. Lista de invitados confirmados

GitHub Pages no tiene base de datos: por sí solo únicamente abre WhatsApp. Para
tener una lista automática se incluyó `google-apps-script.gs`.

1. Crea una hoja nueva en Google Sheets.
2. Abre **Extensiones > Apps Script**.
3. Sustituye el contenido por `google-apps-script.gs`.
4. Elige **Implementar > Nueva implementación > Aplicación web**.
5. Configura **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona**.
6. Autoriza el script y copia la URL que termina en `/exec`.
7. En `script.js`, pega esa URL en `sheetsEndpoint`.
8. Publica los cambios y realiza una confirmación de prueba.

La hoja creará automáticamente estas columnas: fecha, nombre, asistencia, adultos,
predicción, mensaje y evento. WhatsApp seguirá abriéndose como comprobante para el
invitado.

## 5. Datos ya configurados

- Evento: Baby Shower · Baby Paulo
- Fecha: sábado 26 de septiembre de 2026
- Hora: 2:00 p. m.
- Lugar: Jardín Briselys
- Dirección: Av. Adolfo López Mateos 53, San Juan, 54900 Tultitlán de Mariano
  Escobedo, Estado de México
- WhatsApp: 56 3106 4309
- Modalidad: celebración solo para adultos

Antes de compartir, verifica en Google Maps que el marcador del enlace corresponda
exactamente a la entrada del jardín.
