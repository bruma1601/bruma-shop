# Tienda de galletas navideñas

Página para encargar galletas: la persona elige presentaciones, las agrega al carrito, llena sus datos y envía el pedido por WhatsApp. Paga el adelanto por SINPE Móvil.

## Cómo abrirla

Doble clic en `index.html`. No hace falta instalar nada.
Se necesita internet para las letras, la animación de nieve y la hoja de Google.

## Dónde se cambia cada cosa

Todo está al **inicio del archivo `app.js`**. Ábralo con el Bloc de notas o VS Code. Cambie solo lo que está entre comillas o los números, y guarde.

### Datos de la tienda (`CONFIG`)

| Qué | Dónde | Ejemplo |
|---|---|---|
| Nombre de la tienda | `nombreTienda` | `"Bruma"` (título de la pestaña y texto del logo) |
| Logo | `logo` | `"img/logo.png"` (PNG con fondo transparente) |
| WhatsApp que recibe pedidos | `whatsapp` | `"50686485190"` (con 506, sin + ni espacios) |
| SINPE Móvil | `sinpe` | `{ numero: "8648-5190", nombre: "María Pérez" }` |
| Porcentaje de adelanto | `porcentajeAdelanto` | `50` |
| Último día de pedidos | `fechaLimitePedidos` | `"15 de diciembre"` |
| Hoja de Google | `urlPedidos` | `"https://script.google.com/macros/s/.../exec"` |

### Precios

Busque el producto en `PRODUCTOS` y cambie `precio`. Va solo el número, sin ₡ ni espacios:

```js
precio: 4500,
```

Si pone `precio: null`, aparece "Precio por confirmar".

### Sabores

Cada presentación trae sabores fijos. El cliente no los elige.

```js
sabores: [
  { nombre: "Brownie", cantidad: 2 },
  { nombre: "Mantequilla", cantidad: 2 }
],
```

Cambie también `galletas` (cuántas trae en total) para que coincida.

### Fotos

1. Copie la foto a la carpeta `img/`. Un nombre corto, sin espacios ni tildes, por ejemplo `latita.jpg`.
2. En el producto, escriba la ruta:

```js
foto: "img/latita.jpg",
```

Lo ideal son fotos cuadradas o apaisadas, de unos 1200 px de ancho y menos de 300 KB.
Sin foto (`foto: ""`) se ve un espacio que dice "Foto próximamente".

### Entrega

En `CONFIG.entrega` se configura el costo de entrega a domicilio:

- `direccionSalon`: la dirección del salón de uñas para quien elige "Recoger en el salón". Vacía = no se muestra.
- `origenes`: coordenadas del salón (desde donde salen las entregas). **Mientras estén en 0, el costo sale "por confirmar".**
  Para obtenerlas: en Google Maps, mantenga presionado el lugar y copie los dos números (ej.: `9.9325, -84.0796`). No se muestran en la página.
- `centroMapa`: dónde empieza el mapa (ahora Santiago de Puriscal) y su nivel de zoom.
- `costoPorKm`, `valorHora`, `minimo`, `redondeo`: cómo se calcula el precio.
- `distanciaMaximaKm`: si la entrega queda más lejos, dice "Te confirmamos el costo por WhatsApp".
- `diaEntrega`: por ejemplo `"sábado 20 de diciembre"`.
- `entregaGratisDesde`: por ejemplo `25000` para dar entrega gratis desde ₡25 000 en productos. `null` = no aplica.

### Noah, la perrita mascota

Noah aparece al confirmar un pedido y cuando alguien toca el logo. Si tocan el logo 5 veces seguidas, sale un mensaje secreto.
Sus mensajes se cambian en `CONFIG.noah`:

```js
mensajes: [
  "¡Guau! Soy Noah, la catadora oficial de galletas.",
  "Psst… las de chocolate son mis favoritas."
],
```

Las imágenes son `img/noah.webp` y `img/noah.png` (con fondo transparente).

### Importante

- **No cambie los `id`** (`bolsita`, `cajita`, `latita`). Deben ser iguales a los de la hoja de Google.
- Respete comas, comillas y llaves. Si la página queda en blanco después de un cambio, probablemente falta una coma o una comilla.

## Hoja de Google (opcional)

Si `urlPedidos` está vacío, todo se ve disponible y el pedido se envía solo por WhatsApp.

Con la URL puesta, la página espera esto del Apps Script:

- **GET** a la URL responde las existencias:
  `{"ok": true, "quedan": {"bolsita": 5, "cajita": 0, "latita": 12}}`
- **POST** a la URL (texto JSON) registra el pedido con estos campos: `pedido`, `nombre`, `telefono`, `entrega` (`salón` o `domicilio`), `costoEntrega`, `senas`, `enlaceMapa`, `productos`, `total`, `adelanto`, `notas` e `items` (por ejemplo `{"bolsita": 2}`). Responde una de estas dos:
  - `{"ok": true}` si se registró.
  - `{"ok": false, "agotados": ["cajita"]}` si algo se agotó.

En la página, 0 existencias muestra "Agotado" y del 1 al 5 muestra "¡Quedan N!".
