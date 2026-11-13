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
- `factorCalle`, `costoPorKm`, `idaYVuelta`, `velocidadPromedio`, `valorHora`, `minimo`, `redondeo`: cómo se calcula el precio (ver abajo).
- `distanciaMaximaKm`: si la entrega queda a más de estos km **de viaje**, dice "Te confirmamos el costo por WhatsApp". Con 30 km de viaje, el límite queda a unos 20 km en línea recta.
- `diaEntrega`: por ejemplo `"sábado 20 de diciembre"`.
- `entregaGratisDesde`: por ejemplo `25000` para dar entrega gratis desde ₡25 000 en productos. `null` = no aplica.

#### Cómo se calcula el costo de entrega

1. La página mide la distancia en línea recta desde el salón hasta el punto que la persona marcó en el mapa.
2. Esa distancia se multiplica por `factorCalle` (1,5). En las carreteras de montaña de Puriscal, el camino real es como un 50 % más largo que la línea recta. El resultado son los **km de viaje**.
3. Se cobra la gasolina y el desgaste: km de viaje × `costoPorKm` (₡100). Como las entregas se hacen en ruta un solo día, solo se cobra la ida (`idaYVuelta: false`). El regreso se reparte entre todos los pedidos.
4. Se suma el tiempo de manejo: (km de viaje ÷ `velocidadPromedio`, 30 km/h) × `valorHora` (₡2 000 por hora).
5. Si el total da menos de `minimo` (₡1 500), se cobra el mínimo. Después se redondea hacia arriba al siguiente múltiplo de `redondeo` (₡500).

En resumen:

```
km de viaje = línea recta × factorCalle
costo = km de viaje × costoPorKm × (idaYVuelta ? 2 : 1) + (km de viaje ÷ velocidadPromedio) × valorHora
```

Con los valores actuales, cada km en línea recta cuesta unos ₡250. Por ejemplo: 8 km → ₡2 000, 10 km → ₡2 500, 15 km → ₡4 000.

#### Cambiar `costoPorKm` según el consumo del carro

`costoPorKm` sale de (precio del litro ₡806 ÷ 12 km/L del Suzuki Vitara) × 1,5 de desgaste. Si el carro rinde otra cosa, use esta tabla:

| Consumo real | `costoPorKm` |
|---|---|
| 10 km/L | 120 |
| 12 km/L | 100 |
| 14 km/L | 85 |
| 16 km/L | 75 |

**Cómo ver el consumo real:** en la computadora de viaje del carro (la pantalla del tablero), busque el consumo **promedio**. Se cambia de pantalla con el botón de la palanca del limpiador o del volante. Para que el dato sea confiable, conviene revisarlo después de varios días de manejo normal.

- Si sale en **km/L**, ese número se usa directo en la tabla.
- Si sale en **L/100 km**, haga 100 ÷ ese número para pasarlo a km/L. Ejemplo: 8,3 L/100 km → 100 ÷ 8,3 ≈ 12 km/L.

### Alérgenos

Cada producto en `PRODUCTOS` tiene tres datos de alérgenos. Se muestran en una caja "Alérgenos" de la ventana de detalle:

```js
alergenos: ["trigo (gluten)", "huevo", "leche", "nueces", "soya"],   // lo que CONTIENE
trazas: [],                                                         // lo que PUEDE CONTENER
contieneGelatina: true                                              // malvaviscos con gelatina
```

- `alergenos`: lo que el producto **contiene**. Se escribe cada cosa entre comillas, separada por comas. Si la lista incluye `"nueces"` (escrito así, en minúscula), la tarjeta muestra la línea "Contiene nueces".
- `trazas`: lo que **puede contener** porque todo se prepara en la misma cocina. Sale como "Puede contener trazas de: …". Si se deja vacío (`[]`), esa línea no aparece.
- `contieneGelatina`: `true` muestra "Las bombas de chocolate llevan malvaviscos con gelatina". `false` la oculta.

Revise siempre estas listas contra las etiquetas de los ingredientes que compre. El aviso general del pie de página está en `index.html`, en `pie__alergenos`.

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

**Cómo armar la hoja y pegar el programa:** vea [apps-script/LEEME.md](apps-script/LEEME.md). El código está en [apps-script/Codigo.gs](apps-script/Codigo.gs).

Con la URL puesta, la página espera esto del Apps Script:

- **GET** a la URL responde las existencias:
  `{"ok": true, "quedan": {"bolsita": 5, "cajita": 0, "latita": 12}}`
- **POST** a la URL (texto JSON) registra el pedido con estos campos: `pedido`, `nombre`, `telefono`, `entrega` (`salón` o `domicilio`), `costoEntrega`, `senas`, `enlaceMapa`, `productos`, `total`, `adelanto`, `notas` e `items` (por ejemplo `{"bolsita": 2}`). Responde una de estas dos:
  - `{"ok": true}` si se registró.
  - `{"ok": false, "agotados": ["cajita"]}` si algo se agotó.

En la página, 0 existencias muestra "Agotado" y del 1 al 5 muestra "¡Quedan N!".
