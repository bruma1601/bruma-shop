/* =========================================================
   CONFIGURACIÓN GENERAL — edite aquí los datos de la tienda.
   ========================================================= */
const CONFIG = {
  // Nombre de la tienda (título de la pestaña y texto alternativo del logo).
  nombreTienda: "Bruma",

  // Logo de la tienda (encabezado y pie de página).
  logo: "img/logo.png",

  // WhatsApp que recibe los pedidos: con 506 adelante, sin + ni espacios.
  whatsapp: "50686485190",

  // Datos para el adelanto por SINPE Móvil.
  sinpe: { numero: "8648-5190", nombre: "Daniela Salazar" },

  // Porcentaje que se paga por adelantado para apartar el pedido.
  porcentajeAdelanto: 50,

  // Último día para hacer pedidos (texto libre, aparece en el pie de página).
  fechaLimitePedidos: "15 de diciembre",           // EJEMPLO: cambiar

  // URL de Google Apps Script (termina en /exec) para existencias y registro
  // de pedidos. Vacía ("") = no se usa la hoja: todo se ve disponible y el
  // pedido se envía solo por WhatsApp.
  urlPedidos: "",

  // Entrega. Opciones del formulario: "Recoger en el salón" (gratis)
  // o "Entrega a domicilio" (costo calculado con el mapa).
  //
  // Cómo se calcula el costo de entrega a domicilio:
  //   km de viaje = línea recta × factorCalle
  //   costo = km de viaje × costoPorKm × (idaYVuelta ? 2 : 1)
  //         + (km de viaje ÷ velocidadPromedio) × valorHora
  //   Luego se aplica el mínimo y se redondea hacia arriba.
  //
  // Si el consumo real del carro es otro, cambiar costoPorKm así:
  //   Consumo real → costoPorKm: 10 km/L → 120 · 12 km/L → 100 · 14 km/L → 85 · 16 km/L → 75
  entrega: {
    // Dirección del salón de uñas, para quien elige recogerlo. Se muestra debajo de
    // "Recoger en el salón" y en el resumen. Vacío ("") = no se muestra.
    direccionSalon: "",        // EJEMPLO: "Santiago de Puriscal, 100 m norte del parque"

    // Punto de salida de las entregas (el salón). Las coordenadas NO se muestran en la página.
    // Para obtenerlas: en Google Maps, mantener presionado el lugar y copiar los
    // números (ej.: 9.8471, -84.3143). Mientras estén en 0, el costo dice
    // "Te confirmamos el costo por WhatsApp".
    origenes: [
      { nombre: "Salón", lat: 0, lng: 0 }      // EJEMPLO: pegar coordenadas reales del salón
    ],
    // Dónde empieza el mapa antes de que la persona marque su casa
    centroMapa: { lat: 9.8467, lng: -84.3131, zoom: 15 },   // Santiago de Puriscal (centro)
    factorCalle: 1.5,          // carreteras de montaña: la ruta real es ~50 % más larga que la línea recta
    costoPorKm: 100,           // (precio del litro ₡806 ÷ 12 km/L del Suzuki Vitara) × 1,5 de desgaste
    idaYVuelta: false,         // un solo día de entregas en ruta: el regreso se reparte entre todos los pedidos
    velocidadPromedio: 30,     // km/h promedio en las rutas de Puriscal
    valorHora: 2000,           // ₡ por hora de manejo
    minimo: 1500,              // costo mínimo de entrega
    redondeo: 500,             // redondear hacia arriba a múltiplos de esto
    distanciaMaximaKm: 30,     // km DE VIAJE (no en línea recta); 30 ≈ 20 km en línea recta. Más lejos: "por confirmar"
    diaEntrega: "",            // ej. "sábado 20 de diciembre"; vacío = "Te avisamos el día de entrega"
    entregaGratisDesde: null   // ej. 25000 (₡ en productos); null = no aplica
  },

  // Noah, la perrita mascota. Aparece al confirmar un pedido y al tocar el logo.
  noah: {
    // Mensajes al azar al tocar el logo (nunca repite el mismo dos veces seguidas)
    mensajes: [
      "¡Guau! Soy Noah, la catadora oficial de galletas.",
      "Psst… las de mantequilla son mis favoritas.",
      "¡Feliz Navidad! Gracias por visitarnos.",
      "Yo no me como las galletas… casi nunca.",
      "¿Ya hiciste tu pedido? ¡Se acaban rápido!"
    ],
    mensajePedido: "¡Guau! Gracias por tu pedido",   // + huellita
    mensajeSecreto: "¡Me encontraste!",              // + arbolito, al tocar el logo varias veces
    toquesSecretos: 5,                               // cuántos toques seguidos
    segundos: 4                                      // cuánto se queda en pantalla
  },

  // Animación de fondo del encabezado (LottieFiles, .lottie o .json).
  // "" = sin animación. Actual: "Snow loop" de Valentin Minchenko (licencia Lottie Simple).
  // Un archivo local (ej.: "img/nieve.lottie") solo funciona con la página publicada.
  animacionFondo: "https://assets-v2.lottiefiles.com/a/ec5d8eb5-c82a-4409-a521-97e0689da8b9/izmTqjViYX.lottie"
};

/* =========================================================
   PRODUCTOS — precios, sabores y fotos.

   Campos de cada presentación:
   - id:          identificador único, sin espacios ni tildes. Debe ser IGUAL
                  al de la hoja de Google (existencias). No cambiarlo después.
   - nombre:      nombre visible.
   - descripcion: texto de la ventana de detalle.
   - precio:      colones, solo el número (ej.: 4500). null = "Precio por confirmar".
   - galletas:    cuántas unidades trae.
   - unidad:      (opcional) qué trae, en plural. Si no se pone, dice "galletas".
   - sabores:     lista fija de { nombre, cantidad }. El cliente no los elige.
   - foto:        ruta de la imagen (ej.: "img/bolsita.jpg"). "" = "Foto próximamente".
   - regalo:      true = insignia verde "Opción de regalo" y estilo especial.
   ========================================================= */
const PRODUCTOS = [
  {
    id: "bolsita",
    nombre: "Bolsita con batidor de globo",
    // EJEMPLO: cambiar
    descripcion: "Bolsita navideña con bombas de chocolate y un batidor de globo pequeño de regalo. Se ponen en leche caliente y se baten para un chocolate delicioso.",
    precio: null,
    galletas: 5,
    unidad: "bombas de chocolate",
    sabores: [
      { nombre: "Bombas de chocolate", cantidad: 5 }
    ],
    foto: "",              // ej.: "img/bolsita.jpg"
    regalo: false
  },
  {
    id: "cajita",
    nombre: "Cajita navideña de cartón",
    // EJEMPLO: cambiar
    descripcion: "Cajita de cartón con diseño navideño, ideal para compartir en la oficina, con la familia o con los vecinos.",
    precio: null,
    galletas: 6,
    sabores: [
      { nombre: "Brownie", cantidad: 2 },
      { nombre: "Mantequilla", cantidad: 2 },
      { nombre: "Bombas de chocolate", cantidad: 2 }
    ],
    foto: "",              // ej.: "img/cajita.jpg"
    regalo: false
  },
  {
    id: "latita",
    nombre: "Latita navideña",
    // EJEMPLO: cambiar
    descripcion: "Latita metálica decorada, reutilizable y lista para regalar. Nuestra presentación más especial.",
    precio: null,
    galletas: 12,
    sabores: [             // EJEMPLO: cambiar
      { nombre: "Brownie", cantidad: 4 },
      { nombre: "Mantequilla", cantidad: 4 },
      { nombre: "Bombas de chocolate", cantidad: 4 }
    ],
    foto: "",              // ej.: "img/latita.jpg"
    regalo: true
  }
];

/* =========================================================
   A partir de aquí: funcionamiento de la página.
   No hace falta tocar nada para cambiar datos.
   ========================================================= */

const CLAVE_CARRITO = "galletas-carrito-v1";
const CLAVE_PEDIDO = "galletas-pedido-final-v1";
const MAX_POR_PRODUCTO = 99;
const POCAS_EXISTENCIAS = 5;

const $ = (sel, raiz = document) => raiz.querySelector(sel);

const elTarjetas = $("#tarjetas");
const elContador = $("#contador-carrito");
const elContadorTexto = $("#contador-texto");
const elAviso = $("#aviso");
const dlgDetalle = $("#detalle");
const elDetalleContenido = $("#detalle-contenido");
const dlgCarrito = $("#carrito");
const elCarritoTitulo = $("#carrito-titulo");
const elCarritoAtras = $("#carrito-atras");
const elCarritoContenido = $("#carrito-contenido");
const elCarritoPie = $("#carrito-pie");
const elCarritoCuerpo = $("#carrito .hoja__cuerpo");
const elSeccionPedido = $("#tu-pedido");
const elPedidoContenido = $("#pedido-contenido");
const elBarra = $("#barra-pedido");
const elToast = $("#toast");

/* ---------- Utilidades ---------- */

/** Formato: ₡ 4 500 (con espacios que no se cortan de línea). */
function formatoColones(monto, espacio = " ") {
  const entero = Math.round(monto).toString().replace(/\B(?=(\d{3})+(?!\d))/g, espacio);
  return "₡" + espacio + entero;
}

function textoPrecio(precio) {
  return precio == null ? "Precio por confirmar" : formatoColones(precio);
}

function escapar(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function unidadDe(p) {
  return p.unidad || "galletas";
}

/** "12 galletas", "5 bombas de chocolate" */
function textoContenido(p) {
  return `${p.galletas} ${unidadDe(p)}`;
}

/** Ícono del espacio sin foto: galleta o taza (bombas de chocolate). */
function iconoDe(p) {
  return /galleta/i.test(unidadDe(p)) ? "#i-galleta" : "#i-taza";
}

function buscarProducto(id) {
  return PRODUCTOS.find((p) => p.id === id);
}

function avisar(texto) {
  elAviso.textContent = "";
  setTimeout(() => { elAviso.textContent = texto; }, 50);
}

function quiereMenosMovimiento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function leerGuardado(clave, defecto) {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : defecto;
  } catch {
    return defecto;
  }
}

function guardar(clave, valor) {
  try {
    if (valor == null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: la página funciona igual mientras esté abierta */
  }
}

/** fetch con tiempo máximo (ms). */
function fetchConTiempo(url, opciones = {}, ms = 10000) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ms);
  return fetch(url, { ...opciones, signal: control.signal }).finally(() => clearTimeout(reloj));
}

/** "8888 8888" / "8888-8888" → "8888-8888" */
function telefonoNormal(t) {
  const d = String(t).replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4)}` : String(t).trim();
}

/* ---------- Carrito (estado + localStorage) ---------- */

/** carrito = { idProducto: cantidad } */
let carrito = cargarCarrito();

function cargarCarrito() {
  const datos = leerGuardado(CLAVE_CARRITO, {});
  const limpio = {};
  if (datos && typeof datos === "object") {
    for (const [id, cant] of Object.entries(datos)) {
      const n = Math.floor(Number(cant));
      if (buscarProducto(id) && n > 0) limpio[id] = Math.min(n, MAX_POR_PRODUCTO);
    }
  }
  return limpio;
}

function guardarCarrito() {
  guardar(CLAVE_CARRITO, carrito);
}

function cantidadDe(id) {
  return carrito[id] || 0;
}

function totalUnidades() {
  return Object.values(carrito).reduce((a, b) => a + b, 0);
}

/* ---------- Existencias (hoja de Google) ---------- */

/** existencias = { idProducto: cuántas quedan }. Si un id no está: disponible sin límite. */
let existencias = {};

function quedanDe(id) {
  const q = existencias[id];
  return typeof q === "number" ? q : Infinity;
}

/** Problema de una línea del carrito: null, "agotado" o "excede". */
function problemaDe(id) {
  const cant = cantidadDe(id);
  const q = quedanDe(id);
  if (cant === 0 || cant <= q) return null;
  return q === 0 ? "agotado" : "excede";
}

function hayProblemas() {
  return Object.keys(carrito).some((id) => problemaDe(id));
}

async function cargarExistencias() {
  if (!CONFIG.urlPedidos) return;
  try {
    const r = await fetchConTiempo(CONFIG.urlPedidos, {}, 8000);
    const datos = await r.json();
    if (!datos || datos.ok !== true || typeof datos.quedan !== "object") return;
    const nuevas = {};
    for (const [id, q] of Object.entries(datos.quedan)) {
      const n = Number(q);
      if (q !== "" && q !== null && Number.isFinite(n)) nuevas[id] = Math.max(0, Math.floor(n));
    }
    existencias = nuevas;
    actualizarTodo();
  } catch {
    /* sin conexión con la hoja: se mantiene lo último conocido (al inicio, todo disponible) */
  }
}

/* ---------- Cambiar cantidades ---------- */

function cambiarCantidad(id, nueva) {
  const producto = buscarProducto(id);
  if (!producto) return;
  const antes = cantidadDe(id);
  nueva = Math.max(0, Math.min(MAX_POR_PRODUCTO, nueva));

  // No dejar subir por encima de lo que queda
  const q = quedanDe(id);
  if (nueva > antes && nueva > q) {
    avisar(q === 0 ? `${producto.nombre}: agotado.` : `Solo quedan ${q}.`);
    return;
  }
  if (nueva === antes) return;

  if (nueva === 0) delete carrito[id];
  else carrito[id] = nueva;

  guardarCarrito();
  actualizarTodo(nueva > antes);

  if (nueva === 0) avisar(`${producto.nombre}: quitada del carrito.`);
  else if (antes === 0) avisar(`${producto.nombre}: agregada al carrito.`);
  else avisar(`${producto.nombre}: ${nueva} en el carrito.`);
}

/* ---------- Entrega ---------- */

const TIPOS_ENTREGA = {
  salon:     { etiqueta: "Recoger en el salón", hoja: "salón" },
  domicilio: { etiqueta: "Entrega a domicilio", hoja: "domicilio" }
};

/** Distancia en línea recta entre dos puntos (km), fórmula de Haversine. */
function distanciaHaversine(lat1, lng1, lat2, lng2) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Costo de entrega a un punto (función pura: solo depende de sus datos y de CONFIG.entrega).
 * Devuelve { km, costo, origen } y además { costoNormal, gratis }.
 * - km: km de viaje (línea recta al origen más cercano × factorCalle)
 * - costo: ₡ redondeado; null = "Te confirmamos el costo por WhatsApp"
 * - subtotalProductos (opcional): para la entrega gratis desde cierto monto
 */
function calcularEntrega(lat, lng, subtotalProductos = null) {
  const c = CONFIG.entrega;
  const origenes = c.origenes.filter((o) => Number.isFinite(o.lat) && Number.isFinite(o.lng) && !(o.lat === 0 && o.lng === 0));
  if (!origenes.length || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { km: null, costo: null, origen: null, costoNormal: null, gratis: false };
  }
  // Origen más cercano
  let origen = origenes[0];
  let recta = Infinity;
  for (const o of origenes) {
    const d = distanciaHaversine(o.lat, o.lng, lat, lng);
    if (d < recta) { recta = d; origen = o; }
  }
  const km = recta * c.factorCalle;
  if (km > c.distanciaMaximaKm) {
    return { km, costo: null, origen: origen.nombre, costoNormal: null, gratis: false };
  }
  let costo = km * c.costoPorKm * (c.idaYVuelta ? 2 : 1) + (km / c.velocidadPromedio) * c.valorHora;
  costo = Math.max(costo, c.minimo);
  costo = Math.ceil(costo / c.redondeo) * c.redondeo;

  const gratis = c.entregaGratisDesde != null && subtotalProductos != null && subtotalProductos >= c.entregaGratisDesde;
  return { km, costo: gratis ? 0 : costo, origen: origen.nombre, costoNormal: costo, gratis };
}

/** Texto de km para mostrar: "Aprox. 8 km" */
function textoKm(km) {
  return `Aprox. ${Math.max(1, Math.round(km))} km`;
}

/** La entrega elegida en el formulario (null si todavía no la eligió). */
function entregaDelPedido(subtotalProductos) {
  if (!entregaElegida) return null;
  const tipo = datos.entrega;
  if (tipo !== "domicilio") return { tipo, km: null, costo: 0, costoNormal: 0, gratis: false, recoger: true };
  if (datos.lat == null) return { tipo, km: null, costo: null, costoNormal: null, gratis: false };
  return { tipo, ...calcularEntrega(datos.lat, datos.lng, subtotalProductos) };
}

/* ---------- Cálculo del pedido ---------- */

function calcularPedido() {
  const lineas = PRODUCTOS
    .filter((p) => cantidadDe(p.id) > 0)
    .map((p) => {
      const cant = cantidadDe(p.id);
      return { p, cant, subtotal: p.precio == null ? null : p.precio * cant };
    });
  const pendiente = lineas.some((l) => l.subtotal == null);
  const subtotalProductos = pendiente ? null : lineas.reduce((s, l) => s + l.subtotal, 0);
  const entrega = lineas.length ? entregaDelPedido(subtotalProductos) : null;
  // El total incluye la entrega; si el costo de entrega está por confirmar, el total también
  const total = subtotalProductos == null || (entrega && entrega.costo == null)
    ? null
    : subtotalProductos + (entrega ? entrega.costo : 0);
  // Adelanto (sobre el total CON entrega) redondeado hacia arriba a múltiplos de ₡50
  const adelanto = total == null ? null : Math.ceil((total * CONFIG.porcentajeAdelanto) / 100 / 50) * 50;
  const saldo = total == null ? null : total - adelanto;
  return { lineas, subtotalProductos, entrega, total, adelanto, saldo };
}

/** Texto del costo de entrega: "₡ 2 500", "Gratis", "Por confirmar". */
function textoCostoEntrega(e, espacio = " ") {
  if (e.recoger) return "Gratis";
  if (e.costo == null) return "Por confirmar";
  if (e.gratis) return "Gratis";
  return formatoColones(e.costo, espacio);
}

/** Etiqueta de la línea de entrega: "Entrega a domicilio (aprox. 8 km)". */
function etiquetaEntrega(e) {
  const base = TIPOS_ENTREGA[e.tipo].etiqueta;
  return e.km != null && e.tipo === "domicilio" ? `${base} (${textoKm(e.km).toLowerCase()})` : base;
}

/** HTML del valor de la línea de entrega (con precio tachado si es gratis). */
function htmlCostoEntrega(e) {
  if (e.gratis && e.costoNormal) {
    return `<span class="tachado"><s>${formatoColones(e.costoNormal)}</s></span> <strong class="gratis">Entrega gratis</strong>`;
  }
  return `<strong>${textoCostoEntrega(e)}</strong>`;
}

/* =========================================================
   PLANTILLAS
   ========================================================= */

function htmlInsigniaExistencias(id) {
  const q = quedanDe(id);
  if (q === 0) return `<span class="insignia insignia--der insignia--agotado">Agotado</span>`;
  if (q <= POCAS_EXISTENCIAS) return `<span class="insignia insignia--der insignia--pocas">¡Quedan ${q}!</span>`;
  return "";
}

function htmlFoto(producto) {
  const regalo = producto.regalo
    ? `<span class="insignia"><svg aria-hidden="true"><use href="#i-regalo"/></svg>Opción de regalo</span>`
    : "";
  const vacia = `
    <div class="foto__vacia">
      <svg aria-hidden="true"><use href="${iconoDe(producto)}"/></svg>
      <span>Foto próximamente</span>
    </div>`;
  // La imagen va encima del espacio "Foto próximamente"; si no carga, se quita.
  const imagen = producto.foto
    ? `<img src="${escapar(producto.foto)}" alt="${escapar(producto.nombre)}" loading="lazy" onerror="this.remove()">`
    : "";
  return `<div class="foto">${vacia}${imagen}${regalo}<span data-existencias="${producto.id}">${htmlInsigniaExistencias(producto.id)}</span></div>`;
}

/** Botón "Agregar" o selector − cantidad +. `clave` identifica el lugar (para devolver el foco). */
function htmlControl(id, clave, compacto = false) {
  const producto = buscarProducto(id);
  const cant = cantidadDe(id);
  const q = quedanDe(id);
  const nombre = escapar(producto.nombre);

  if (cant === 0) {
    if (q === 0) {
      return `
        <button type="button" class="btn btn--agregar" disabled>
          Agotado<span class="visualmente-oculto">: ${nombre}</span>
        </button>`;
    }
    return `
      <button type="button" class="btn btn--agregar" data-accion="agregar" data-id="${id}" data-clave="${clave}">
        <svg aria-hidden="true"><use href="#i-bolsa"/></svg>
        Agregar<span class="visualmente-oculto"> ${nombre} al carrito</span>
      </button>`;
  }

  const tope = cant >= Math.min(q, MAX_POR_PRODUCTO);
  let nota = "";
  if (!compacto && q !== Infinity) {
    if (q === 0) nota = `<p class="limite limite--error">Se agotó: quítala del carrito.</p>`;
    else if (cant > q) nota = `<p class="limite limite--error">Solo quedan ${q}: baja la cantidad.</p>`;
    else if (tope) nota = `<p class="limite">Solo quedan ${q}</p>`;
  }
  const etiquetaMas = tope && q !== Infinity ? `Solo quedan ${q} de ${nombre}` : `Agregar otra ${nombre}`;

  return `
    <div class="selector${compacto ? " selector--compacto" : ""}" role="group" aria-label="Cantidad de ${nombre}">
      <button type="button" class="selector__btn" data-accion="restar" data-id="${id}" data-clave="${clave}"
        aria-label="${cant === 1 ? "Quitar" : "Quitar una"} ${nombre}">−</button>
      <span class="selector__cant">${cant}<span class="visualmente-oculto"> en el carrito</span></span>
      <button type="button" class="selector__btn selector__btn--mas" data-accion="sumar" data-id="${id}" data-clave="${clave}"
        aria-label="${etiquetaMas}" ${tope ? "disabled" : ""}>+</button>
    </div>${nota}`;
}

function htmlPrecio(p) {
  return p.precio == null
    ? `<span class="precio precio--pendiente">Precio por confirmar</span>`
    : `<span class="precio">${formatoColones(p.precio)}</span>`;
}

function htmlTarjeta(p) {
  const sabores = p.sabores.map((s) => `<li>${s.cantidad} ${escapar(s.nombre)}</li>`).join("");
  return `
    <article class="tarjeta${p.regalo ? " tarjeta--regalo" : ""}" data-tarjeta="${p.id}">
      ${htmlFoto(p)}
      <div class="tarjeta__info">
        <h3 class="tarjeta__nombre">
          <button type="button" class="tarjeta__abrir" data-abrir="${p.id}" aria-haspopup="dialog">
            ${escapar(p.nombre)}<span class="visualmente-oculto">. Ver detalles</span>
          </button>
        </h3>
        <div class="tarjeta__meta">
          ${htmlPrecio(p)}
          <span class="cantidad-galletas">${escapar(textoContenido(p))}</span>
        </div>
        <ul class="sabores" aria-label="Sabores">${sabores}</ul>
      </div>
      <div class="tarjeta__accion" data-control="${p.id}" data-clave="tarjeta-${p.id}">
        ${htmlControl(p.id, `tarjeta-${p.id}`)}
      </div>
    </article>`;
}

function htmlDetalle(p) {
  const sabores = p.sabores
    .map((s) => `<li><span>${escapar(s.nombre)}</span><strong>${s.cantidad}</strong></li>`)
    .join("");
  return `
    <div class="detalle">
      <button type="button" class="btn-icono detalle__cerrar" data-cerrar aria-label="Cerrar detalle">
        <svg aria-hidden="true"><use href="#i-cerrar"/></svg>
      </button>
      ${htmlFoto(p)}
      <div class="detalle__info">
        <h2 class="detalle__nombre" id="detalle-nombre">${escapar(p.nombre)}</h2>
        <div class="tarjeta__meta">
          ${htmlPrecio(p)}
          <span class="cantidad-galletas">${escapar(textoContenido(p))}</span>
        </div>
        <p class="detalle__desc">${escapar(p.descripcion)}</p>
        <h3 class="detalle__subtitulo">Sabores incluidos</h3>
        <ul class="lista-sabores">${sabores}</ul>
        <div class="detalle__accion" data-control="${p.id}" data-clave="detalle">
          ${htmlControl(p.id, "detalle")}
        </div>
      </div>
    </div>`;
}

function htmlSinpe(adelanto) {
  const monto = adelanto == null
    ? `<p class="sinpe__monto">El monto del adelanto te lo confirmamos por WhatsApp.</p>`
    : `<p class="sinpe__monto">Adelanto (${CONFIG.porcentajeAdelanto}&nbsp;%): <strong>${formatoColones(adelanto)}</strong></p>`;
  return `
    <div class="sinpe">
      <p class="sinpe__titulo">Paga el adelanto por SINPE Móvil</p>
      <div class="sinpe__fila">
        <span class="sinpe__numero" id="sinpe-numero">${escapar(CONFIG.sinpe.numero)}</span>
        <button type="button" class="btn btn--copiar" data-accion="copiar-sinpe">Copiar número</button>
      </div>
      <p class="sinpe__nombre">A nombre de <strong>${escapar(CONFIG.sinpe.nombre)}</strong></p>
      ${monto}
      <p class="sinpe__ayuda" id="sinpe-ayuda" aria-live="polite"></p>
    </div>`;
}

/* =========================================================
   CARRITO Y PEDIDO (pasos dentro del mismo panel)
   paso: "carrito" → "datos" → "resumen" → "final"
   ========================================================= */

let paso = "carrito";
let avisoCarrito = "";        // mensaje destacado arriba del carrito (ej.: algo se agotó)
let numeroPedido = null;
let enviando = false;
// entrega: "salon" | "domicilio". lat/lng: punto del mapa (null = sin marcar).
let datos = { nombre: "", telefono: "", entrega: "salon", senas: "", lat: null, lng: null, notas: "" };
/** true cuando la persona ya eligió la entrega en el formulario (para mostrarla en los totales). */
let entregaElegida = false;
let errores = {};
/** Pedido ya apartado: se guarda para poder reabrir WhatsApp sin registrarlo de nuevo. */
let pedidoFinal = leerGuardado(CLAVE_PEDIDO, null);

const TITULOS = {
  carrito: "Tu carrito",
  datos: "Tus datos",
  resumen: "Revisa tu pedido",
  final: "¡Pedido apartado!"
};

function generarNumeroPedido() {
  const d = new Date();
  const mmdd = String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  const azar = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `GN-${mmdd}-${azar}`;
}

/* --- Paso 1: carrito ---
   UNA sola plantilla para las dos vistas del carrito:
   - "seccion": la sección "Tu pedido" de la página
   - "panel":   el panel lateral / hoja inferior del ícono del carrito
   Devuelve { cuerpo, pie }. Así las dos muestran siempre lo mismo. */
function htmlVistaCarrito(vista) {
  const aviso = avisoCarrito ? `<p class="banner banner--error">${escapar(avisoCarrito)}</p>` : "";
  const calc = calcularPedido();
  const { lineas, total, adelanto, saldo } = calc;

  if (lineas.length === 0) {
    return {
      cuerpo: `${aviso}
        <div class="carrito__vacio">
          <div class="carrito__vacio-icono"><svg aria-hidden="true"><use href="#i-galleta"/></svg></div>
          <h3>Tu pedido está vacío</h3>
          <p>Todavía no has elegido nada. Agrega una presentación arriba.</p>
          <button type="button" class="btn btn--rojo" data-accion="ver-presentaciones">Ver presentaciones</button>
        </div>`,
      pie: ""
    };
  }

  const items = lineas.map(({ p, cant, subtotal }) => {
    const clave = `${vista}-${p.id}`;
    const q = quedanDe(p.id);
    const problema = problemaDe(p.id);
    const mini = p.foto
      ? `<img src="${escapar(p.foto)}" alt="" onerror="this.remove()">`
      : `<svg aria-hidden="true"><use href="${iconoDe(p)}"/></svg>`;
    const sub = subtotal == null
      ? `<span class="linea__subtotal linea__subtotal--pendiente">Por confirmar</span>`
      : `<span class="linea__subtotal">${formatoColones(subtotal)}</span>`;
    let nota = "";
    if (problema === "agotado") nota = `<p class="linea__problema">Agotado: quítalo para continuar.</p>`;
    else if (problema === "excede") nota = `<p class="linea__problema">Solo quedan ${q}: ajusta la cantidad.</p>`;
    else if (cant === q) nota = `<p class="linea__limite">Solo quedan ${q}</p>`;

    const sabores = p.sabores.map((s) => `${s.cantidad} ${escapar(s.nombre)}`).join(" · ");

    return `
      <li class="linea${problema ? " linea--problema" : ""}">
        <div class="linea__mini">${mini}</div>
        <div class="linea__datos">
          <span class="linea__nombre">${escapar(p.nombre)}</span>
          <span class="linea__sabores">${sabores}</span>
          <span class="linea__unitario">${textoPrecio(p.precio)}${p.precio == null ? "" : " c/u"} · ${escapar(textoContenido(p))}</span>
          <div class="linea__controles" data-control="${p.id}" data-clave="${clave}">
            ${htmlControl(p.id, clave, true)}
            ${sub}
          </div>
          <div class="linea__pie">
            ${nota}
            <button type="button" class="btn-quitar" data-accion="quitar" data-id="${p.id}" data-clave="${clave}">
              <svg aria-hidden="true"><use href="#i-basura"/></svg>
              Quitar<span class="visualmente-oculto"> ${escapar(p.nombre)}</span>
            </button>
          </div>
        </div>
      </li>`;
  }).join("");

  const apartado = pedidoFinal
    ? `<p class="banner banner--info">Ya apartaste el pedido <strong>${escapar(pedidoFinal.numero)}</strong>. Puedes ver la confirmación y volver a abrir WhatsApp.</p>`
    : "";

  const problemas = hayProblemas();
  // La entrega va como línea aparte (cuando ya se eligió en el formulario)
  const filaEntrega = calc.entrega
    ? `<div class="totales__fila totales__entrega"><span>${escapar(etiquetaEntrega(calc.entrega))}</span><span>${htmlCostoEntrega(calc.entrega)}</span></div>`
    : "";
  const totales = filaEntrega + (total == null
    ? `<div class="carrito__total"><span>Total</span><strong class="pendiente">Total por confirmar</strong></div>
       <p class="totales__nota">Te confirmamos el total y el adelanto por WhatsApp.</p>`
    : `<div class="carrito__total"><span>Total</span><strong>${formatoColones(total)}</strong></div>
       <div class="totales__fila"><span>Adelanto (${CONFIG.porcentajeAdelanto}&nbsp;%)</span><strong>${formatoColones(adelanto)}</strong></div>
       <div class="totales__fila"><span>Saldo al recibir</span><strong>${formatoColones(saldo)}</strong></div>`);

  return {
    cuerpo: `${aviso}${apartado}<ul class="carrito__lista" aria-label="Productos en tu pedido">${items}</ul>`,
    pie: `
      <div class="totales">${totales}</div>
      ${problemas ? `<p class="carrito__alerta">Ajusta los productos marcados para poder continuar.</p>` : ""}
      <button type="button" class="btn btn--pedido" data-accion="hacer-pedido" ${problemas && !pedidoFinal ? "disabled" : ""}>
        ${pedidoFinal ? "Ver mi pedido apartado" : "Hacer pedido"}
      </button>
      <p class="carrito__nota">Se aparta con el ${CONFIG.porcentajeAdelanto}&nbsp;% por SINPE Móvil.</p>`
  };
}

/** Pinta las DOS vistas del carrito a partir del mismo estado. */
function pintarVistasCarrito() {
  const seccion = htmlVistaCarrito("seccion");
  elPedidoContenido.innerHTML = seccion.cuerpo + (seccion.pie ? `<div class="pedido__pie">${seccion.pie}</div>` : "");
  if (paso === "carrito") pintarCarrito();   // el panel, si está en el paso del carrito
  actualizarBarra();
}

/* --- Paso 2: datos --- */
function htmlCampoError(campo) {
  return errores[campo]
    ? `<p class="campo__error" id="error-${campo}">${escapar(errores[campo])}</p>`
    : "";
}

function atributosError(campo) {
  return errores[campo] ? `aria-invalid="true" aria-describedby="error-${campo}"` : "";
}

function htmlOpcionEntrega(valor, detalle) {
  const t = TIPOS_ENTREGA[valor];
  return `
    <label class="opcion opcion--tarjeta">
      <input type="radio" name="entrega" value="${valor}" ${datos.entrega === valor ? "checked" : ""}>
      <span class="opcion__texto"><strong>${t.etiqueta}</strong><small>${detalle}</small></span>
    </label>`;
}

/** Bloque del mapa y el costo de entrega (solo si elige "Entrega a domicilio"). */
function htmlDomicilio() {
  const domicilio = datos.entrega === "domicilio";
  return `
    <div class="domicilio" id="campo-domicilio" ${domicilio ? "" : "hidden"}>
      <p class="domicilio__ayuda" id="ayuda-mapa">Toca el mapa o arrastra el pin hasta tu casa.</p>
      <div class="domicilio__mapa-caja">
        <div class="mapa" id="mapa" role="application" aria-label="Mapa para marcar tu casa" aria-describedby="ayuda-mapa"></div>
        <div class="domicilio__resultado" id="entrega-resultado" aria-live="polite">${htmlResultadoEntrega()}</div>
      </div>
      <div class="domicilio__botones">
        <button type="button" class="btn btn--ubicacion" data-accion="usar-ubicacion">
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          Usar mi ubicación
        </button>
        <button type="button" class="btn-texto" data-accion="pin-al-centro">Poner el pin en el centro del mapa</button>
      </div>
      <p class="domicilio__aviso" id="ubicacion-aviso" aria-live="polite"></p>
      <p class="campo__error" id="error-ubicacion" ${errores.ubicacion ? "" : "hidden"}>${escapar(errores.ubicacion || "")}</p>
      <p class="privacidad">Usamos tu ubicación solo para calcular y hacer la entrega.</p>

      <div class="campo">
        <label for="f-senas">Señas para llegar <span class="obligatorio">(obligatorio)</span></label>
        <textarea id="f-senas" name="senas" rows="2" maxlength="300"
          placeholder="De la iglesia 200 m norte, casa verde con portón negro" ${atributosError("senas")}>${escapar(datos.senas)}</textarea>
        ${htmlCampoError("senas")}
      </div>
    </div>`;
}

/** Texto junto al mapa: km, costo y día de entrega. */
function htmlResultadoEntrega() {
  const dia = CONFIG.entrega.diaEntrega
    ? `Día de entrega: <strong>${escapar(CONFIG.entrega.diaEntrega)}</strong>`
    : "Te avisamos el día de entrega por WhatsApp.";
  if (datos.lat == null) {
    return `<p class="domicilio__costo">Marca tu casa en el mapa para calcular el costo de entrega.</p><p class="domicilio__dia">${dia}</p>`;
  }
  const { subtotalProductos } = calcularPedido();
  const e = calcularEntrega(datos.lat, datos.lng, subtotalProductos);
  let costo;
  if (e.km == null) costo = "Te confirmamos el costo de entrega por WhatsApp.";
  else if (e.costo == null) costo = `${textoKm(e.km)} · Te confirmamos el costo de entrega por WhatsApp.`;
  else if (e.gratis) costo = `${textoKm(e.km)} · Entrega: <s>${formatoColones(e.costoNormal)}</s> <strong class="gratis">Entrega gratis</strong>`;
  else costo = `${textoKm(e.km)} · Entrega: <strong>${formatoColones(e.costo)}</strong>`;
  return `
    <p class="domicilio__costo">${costo}</p>
    <p class="domicilio__dia">${dia}</p>
    <p class="domicilio__nota">Es un estimado; te lo confirmamos por WhatsApp.</p>`;
}

function htmlPasoDatos() {
  return `
    <form class="formulario" id="form-pedido" novalidate>
      <div class="campo">
        <label for="f-nombre">Nombre <span class="obligatorio">(obligatorio)</span></label>
        <input id="f-nombre" name="nombre" type="text" autocomplete="name" maxlength="80"
          value="${escapar(datos.nombre)}" ${atributosError("nombre")}>
        ${htmlCampoError("nombre")}
      </div>

      <div class="campo">
        <label for="f-telefono">Teléfono de WhatsApp <span class="obligatorio">(obligatorio)</span></label>
        <input id="f-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel-national"
          placeholder="8888-8888" maxlength="14" value="${escapar(datos.telefono)}" ${atributosError("telefono")}>
        ${htmlCampoError("telefono")}
      </div>

      <fieldset class="campo campo--opciones">
        <legend>¿Cómo lo recibes?</legend>
        ${htmlOpcionEntrega("salon", CONFIG.entrega.direccionSalon.trim()
          ? `Gratis · ${escapar(CONFIG.entrega.direccionSalon.trim())}`
          : "Gratis")}
        ${htmlOpcionEntrega("domicilio", "Costo según la distancia")}
      </fieldset>

      ${htmlDomicilio()}

      <div class="campo">
        <label for="f-notas">Notas <span class="opcional">(opcional)</span></label>
        <textarea id="f-notas" name="notas" rows="2" maxlength="300"
          placeholder="Ej.: es para regalo, sin nueces…">${escapar(datos.notas)}</textarea>
      </div>

      <p class="privacidad">Usamos tus datos solo para preparar y entregar tu pedido.</p>
    </form>`;
}

function htmlPieDatos() {
  return `<button type="submit" form="form-pedido" class="btn btn--pedido">Continuar</button>`;
}

function leerFormulario() {
  const form = $("#form-pedido");
  if (!form) return;
  const f = new FormData(form);
  const tipo = String(f.get("entrega") || "salon");
  datos = {
    ...datos,                     // conserva lat/lng del mapa
    nombre: String(f.get("nombre") || ""),
    telefono: String(f.get("telefono") || ""),
    entrega: TIPOS_ENTREGA[tipo] ? tipo : "salon",
    senas: String(f.get("senas") ?? datos.senas),
    notas: String(f.get("notas") || "")
  };
}

function validarDatos(d) {
  const e = {};
  if (d.nombre.trim().length < 2) e.nombre = "Escribe tu nombre.";
  const tel = d.telefono.trim();
  if (!tel) e.telefono = "Escribe tu número de WhatsApp.";
  else if (!/^\d{4}[ -]?\d{4}$/.test(tel)) e.telefono = "Debe tener 8 dígitos, por ejemplo 8888-8888.";
  if (d.entrega === "domicilio") {
    // Si el mapa no cargó (sin internet), no se exige el pin: el costo se confirma por WhatsApp
    if (d.lat == null && !mapaFallo) e.ubicacion = "Marca tu casa en el mapa: toca el mapa, arrastra el pin o usa tu ubicación.";
    if (d.senas.trim().length < 10) e.senas = "Escribe las señas para llegar (mínimo 10 caracteres).";
  }
  return e;
}

/* --- Paso 3: resumen --- */
function textoEntrega(d) {
  return TIPOS_ENTREGA[d.entrega].etiqueta;
}

function enlaceMapa(d) {
  return d.entrega === "domicilio" && d.lat != null
    ? `https://www.google.com/maps?q=${d.lat.toFixed(6)},${d.lng.toFixed(6)}`
    : "";
}

function htmlPasoResumen() {
  const { lineas, entrega, total, adelanto, saldo } = calcularPedido();
  const items = lineas.map(({ p, cant, subtotal }) => `
    <li><span>${cant} × ${escapar(p.nombre)}</span>
      <strong>${subtotal == null ? "Por confirmar" : formatoColones(subtotal)}</strong></li>`).join("") +
    (entrega ? `<li class="resumen__entrega"><span>${escapar(etiquetaEntrega(entrega))}</span><span>${htmlCostoEntrega(entrega)}</span></li>` : "");

  const montos = total == null
    ? `<p class="banner banner--info">Te confirmamos el total por WhatsApp.</p>`
    : `<dl class="montos">
         <div><dt>Total</dt><dd>${formatoColones(total)}</dd></div>
         <div class="montos__adelanto"><dt>Adelanto (${CONFIG.porcentajeAdelanto}&nbsp;%)</dt><dd>${formatoColones(adelanto)}</dd></div>
         <div><dt>Saldo al recibir</dt><dd>${formatoColones(saldo)}</dd></div>
       </dl>`;

  return `
    <div class="resumen">
      <p class="resumen__numero">Pedido <strong>${escapar(numeroPedido)}</strong></p>

      <h3 class="resumen__titulo">Tu pedido</h3>
      <ul class="resumen__lineas">${items}</ul>
      ${montos}

      ${htmlSinpe(adelanto)}

      <div class="resumen__datos">
        <div class="resumen__cabeza">
          <h3 class="resumen__titulo">Tus datos</h3>
          <button type="button" class="btn-texto" data-accion="atras">Editar</button>
        </div>
        <dl>
          <div><dt>Nombre</dt><dd>${escapar(datos.nombre.trim())}</dd></div>
          <div><dt>WhatsApp</dt><dd>${escapar(telefonoNormal(datos.telefono))}</dd></div>
          <div><dt>Entrega</dt><dd>${textoEntrega(datos)}</dd></div>
          ${datos.entrega === "salon" && CONFIG.entrega.direccionSalon.trim()
            ? `<div><dt>Dirección</dt><dd>${escapar(CONFIG.entrega.direccionSalon.trim())}</dd></div>` : ""}
          ${datos.entrega === "domicilio" ? `<div><dt>Señas</dt><dd>${escapar(datos.senas.trim())}</dd></div>` : ""}
          ${entrega && entrega.tipo === "domicilio" ? `<div><dt>Día</dt><dd>${CONFIG.entrega.diaEntrega ? escapar(CONFIG.entrega.diaEntrega) : "Te avisamos por WhatsApp"}</dd></div>` : ""}
          ${datos.notas.trim() ? `<div><dt>Notas</dt><dd>${escapar(datos.notas.trim())}</dd></div>` : ""}
        </dl>
      </div>
    </div>`;
}

function htmlPieResumen() {
  return `
    <p class="estado" id="estado-confirmar" aria-live="polite"></p>
    <button type="button" class="btn btn--pedido" data-accion="confirmar">Confirmar pedido</button>`;
}

/* --- Paso 4: final --- */
function urlWhatsApp(mensaje) {
  return `https://wa.me/${encodeURIComponent(CONFIG.whatsapp)}?text=${encodeURIComponent(mensaje)}`;
}

function htmlPasoFinal() {
  const f = pedidoFinal;
  const aviso = f.sinConfirmar
    ? `<p class="banner banner--info">No pudimos confirmar en línea, pero puedes enviar tu pedido por WhatsApp.</p>`
    : "";
  return `
    <div class="final">
      ${aviso}
      <!-- Espacio fijo: aquí aparece Noah al confirmar (sin mover los botones de abajo) -->
      <div class="final__noah" id="final-noah">
        <div class="final__icono"><svg aria-hidden="true"><use href="#i-regalo"/></svg></div>
      </div>
      <p class="final__texto">Tu número de pedido es</p>
      <p class="final__numero">${escapar(f.numero)}</p>
      <p class="final__adelanto">${f.adelanto == null
        ? "El adelanto te lo confirmamos por WhatsApp."
        : `Adelanto a pagar: <strong>${formatoColones(f.adelanto)}</strong>`}</p>

      ${htmlSinpe(f.adelanto)}

      <a class="btn btn--whatsapp" href="${escapar(urlWhatsApp(f.mensaje))}" target="_blank" rel="noopener">
        <svg aria-hidden="true"><use href="#i-whatsapp"/></svg>
        Enviar pedido por WhatsApp
      </a>
      <p class="final__recordatorio">
        <strong>Importante:</strong> envía el comprobante del SINPE por ese mismo chat de WhatsApp.
        Puedes volver a abrir WhatsApp con el botón verde cuando quieras.
      </p>
    </div>`;
}

function htmlPieFinal() {
  return `<button type="button" class="btn btn--secundario" data-accion="vaciar">Vaciar carrito y empezar de nuevo</button>`;
}

/** Mensaje de WhatsApp, en líneas. */
function construirMensaje(numero, d, calc) {
  const esp = " ";
  const lineas = [`Hola, soy ${d.nombre.trim()}. Pedido ${numero}:`];
  for (const { p, cant, subtotal } of calc.lineas) {
    lineas.push(`• ${cant} × ${p.nombre} — ${subtotal == null ? "precio por confirmar" : formatoColones(subtotal, esp)}`);
  }
  const e = calc.entrega;
  if (e && e.tipo === "domicilio") {
    const costo = e.costo == null ? "costo por confirmar" : e.gratis ? "gratis" : formatoColones(e.costo, esp);
    lineas.push(`• ${etiquetaEntrega(e)} — ${costo}`);
  }
  lineas.push("");
  if (calc.total == null) {
    lineas.push("Total: por confirmar");
    lineas.push(`Adelanto (${CONFIG.porcentajeAdelanto} %): por confirmar`);
  } else {
    lineas.push(`Total: ${formatoColones(calc.total, esp)}`);
    lineas.push(`Adelanto (${CONFIG.porcentajeAdelanto} %): ${formatoColones(calc.adelanto, esp)}`);
    lineas.push(`Saldo: ${formatoColones(calc.saldo, esp)}`);
  }
  lineas.push("");
  if (d.entrega === "domicilio") {
    const costo = !e || e.costo == null ? "por confirmar" : e.gratis ? "gratis" : formatoColones(e.costo, esp);
    lineas.push(`Entrega a domicilio (costo: ${costo})`);
    lineas.push(`Señas: ${d.senas.trim()}`);
    if (enlaceMapa(d)) lineas.push(`Ubicación: ${enlaceMapa(d)}`);
  } else {
    lineas.push(`${textoEntrega(d)} (gratis)`);
  }
  if (d.notas.trim()) lineas.push(`Notas: ${d.notas.trim()}`);
  lineas.push("");
  lineas.push("Te envío el comprobante del SINPE por aquí.");
  return lineas.join("\n");
}

/* --- Pintar el panel según el paso --- */
function pintarCarrito(enfocarTitulo = false) {
  elCarritoTitulo.textContent = TITULOS[paso];
  elCarritoAtras.hidden = !(paso === "datos" || paso === "resumen");

  let cuerpo, pie;
  if (paso === "carrito") ({ cuerpo, pie } = htmlVistaCarrito("panel"));
  else if (paso === "datos") { cuerpo = htmlPasoDatos(); pie = htmlPieDatos(); }
  else if (paso === "resumen") { cuerpo = htmlPasoResumen(); pie = htmlPieResumen(); }
  else { cuerpo = htmlPasoFinal(); pie = htmlPieFinal(); }

  quitarMapa();   // el contenido se reemplaza: liberar el mapa anterior
  elCarritoContenido.innerHTML = cuerpo;
  elCarritoPie.innerHTML = pie;
  if (paso === "datos" && datos.entrega === "domicilio") iniciarMapa();
  elCarritoPie.hidden = !pie;

  if (enfocarTitulo) {
    elCarritoCuerpo.scrollTop = 0;
    elCarritoTitulo.focus({ preventScroll: true });
  }
}

function irAPaso(nuevo) {
  paso = nuevo;
  pintarCarrito(true);
}

/* --- Confirmar --- */
async function confirmarPedido(boton) {
  if (enviando) return;
  enviando = true;
  boton.disabled = true;
  boton.textContent = "Confirmando…";
  const estado = $("#estado-confirmar");

  const calc = calcularPedido();
  const items = {};
  calc.lineas.forEach(({ p, cant }) => { items[p.id] = cant; });
  const cuerpo = {
    pedido: numeroPedido,
    nombre: datos.nombre.trim(),
    telefono: telefonoNormal(datos.telefono),
    entrega: TIPOS_ENTREGA[datos.entrega].hoja,                    // "salón" | "domicilio"
    costoEntrega: !calc.entrega ? "" : calc.entrega.costo == null ? "" : calc.entrega.costo,   // "" = por confirmar
    senas: datos.entrega === "domicilio" ? datos.senas.trim() : "",
    enlaceMapa: enlaceMapa(datos),
    productos: calc.lineas.map(({ p, cant }) => `${cant} × ${p.nombre}`).join(", "),
    total: calc.total == null ? "" : calc.total,
    adelanto: calc.adelanto == null ? "" : calc.adelanto,
    notas: datos.notas.trim(),
    items
  };

  if (!CONFIG.urlPedidos) {
    enviando = false;
    terminarPedido(calc, false);
    return;
  }

  if (estado) estado.textContent = "Confirmando tu pedido…";
  try {
    const r = await fetchConTiempo(CONFIG.urlPedidos, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(cuerpo)
    }, 10000);
    const resp = await r.json();

    if (resp && resp.ok === true) {
      terminarPedido(calc, false);
    } else if (resp && Array.isArray(resp.agotados) && resp.agotados.length) {
      manejarAgotados(resp.agotados);
    } else {
      terminarPedido(calc, true);
    }
  } catch {
    // Error de red o más de 10 s: se puede enviar igual por WhatsApp
    terminarPedido(calc, true);
  } finally {
    enviando = false;
  }
}

function manejarAgotados(ids) {
  const nombres = ids.map((id) => buscarProducto(id)?.nombre || id);
  ids.forEach((id) => { existencias[id] = 0; });   // mientras llega el dato real
  avisoCarrito = `Lo sentimos, mientras confirmábamos se agotó: ${nombres.join(", ")}. Ajusta tu carrito para continuar.`;
  numeroPedido = null;
  avisar(avisoCarrito);
  actualizarTodo();
  irAPaso("carrito");
  cargarExistencias();   // trae las existencias reales de la hoja
}

function terminarPedido(calc, sinConfirmar) {
  pedidoFinal = {
    numero: numeroPedido,
    adelanto: calc.adelanto,
    mensaje: construirMensaje(numeroPedido, datos, calc),
    sinConfirmar
  };
  guardar(CLAVE_PEDIDO, pedidoFinal);
  irAPaso("final");
  pintarVistasCarrito();   // la sección muestra que el pedido ya está apartado
  // Noah celebra, dentro del espacio reservado de la pantalla final
  mostrarNoah(CONFIG.noah.mensajePedido, "#i-huella", $("#final-noah"));
}

function vaciarYEmpezar() {
  carrito = {};
  guardarCarrito();
  pedidoFinal = null;
  guardar(CLAVE_PEDIDO, null);
  numeroPedido = null;
  avisoCarrito = "";
  datos = { ...datos, notas: "" };   // se recuerdan nombre, teléfono, entrega y señas
  errores = {};
  actualizarTodo();
  irAPaso("carrito");
  avisar("Carrito vacío. Puedes empezar un pedido nuevo.");
}

/* --- Copiar número de SINPE --- */
async function copiarSinpe(boton) {
  const texto = CONFIG.sinpe.numero.replace(/\D/g, "") || CONFIG.sinpe.numero;
  const ayuda = $("#sinpe-ayuda");
  let ok = false;
  try {
    await navigator.clipboard.writeText(texto);
    ok = true;
  } catch {
    // Respaldo para navegadores sin portapapeles moderno
    try {
      const area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
      boton.closest("dialog").append(area);
      area.select();
      area.setSelectionRange(0, texto.length);
      ok = document.execCommand("copy");
      area.remove();
    } catch { ok = false; }
  }
  if (ok) {
    boton.textContent = "¡Copiado!";
    if (ayuda) ayuda.textContent = "Número copiado.";
    setTimeout(() => { if (document.contains(boton)) boton.textContent = "Copiar número"; }, 2000);
  } else {
    // Último recurso: seleccionar el número para copiarlo a mano
    const num = $("#sinpe-numero");
    const sel = window.getSelection();
    const rango = document.createRange();
    rango.selectNodeContents(num);
    sel.removeAllRanges();
    sel.addRange(rango);
    if (ayuda) ayuda.textContent = "No se pudo copiar automáticamente. Mantén presionado el número para copiarlo.";
  }
}

/* =========================================================
   ACTUALIZAR LA PÁGINA
   ========================================================= */

function pintarTarjetas() {
  elTarjetas.innerHTML = PRODUCTOS.map(htmlTarjeta).join("");
}

function actualizarTodo(animarContador = false) {
  // Controles de tarjetas y detalle
  document.querySelectorAll(".tarjeta__accion[data-control], .detalle__accion[data-control]").forEach((el) => {
    el.innerHTML = htmlControl(el.dataset.control, el.dataset.clave);
  });
  // Insignias de existencias y tarjetas agotadas
  document.querySelectorAll("[data-existencias]").forEach((el) => {
    el.innerHTML = htmlInsigniaExistencias(el.dataset.existencias);
  });
  document.querySelectorAll("[data-tarjeta]").forEach((el) => {
    el.classList.toggle("tarjeta--agotada", quedanDe(el.dataset.tarjeta) === 0);
  });

  // Contador del encabezado
  const unidades = totalUnidades();
  elContador.textContent = unidades;
  elContador.classList.toggle("vacio", unidades === 0);
  elContadorTexto.textContent = unidades === 1 ? "unidad" : "unidades";
  if (animarContador && !quiereMenosMovimiento()) {
    elContador.classList.remove("salta");
    void elContador.offsetWidth; // reinicia la animación
    elContador.classList.add("salta");
  }

  // Sección "Tu pedido" + panel (el panel solo en el paso del carrito,
  // para no borrar un formulario a medias)
  pintarVistasCarrito();
}

/** Después de volver a pintar, devuelve el foco a un botón equivalente. */
function devolverFoco(clave, accion) {
  const contenedor = document.querySelector(`[data-control][data-clave="${clave}"]`);
  if (!contenedor) {
    // La línea desapareció: foco al siguiente botón de esa misma vista
    if (String(clave).startsWith("seccion-")) {
      (elPedidoContenido.querySelector("[data-accion]") || $("#titulo-pedido")).focus();
    } else {
      const siguiente = elCarritoContenido.querySelector("[data-accion]");
      (siguiente || $("[data-cerrar]", dlgCarrito)).focus();
    }
    return;
  }
  const preferido = { agregar: "sumar", sumar: "sumar", restar: "restar" }[accion];
  const destino =
    contenedor.querySelector(`[data-accion="${preferido}"]:not([disabled])`) ||
    contenedor.querySelector(`[data-accion="agregar"]`) ||
    contenedor.querySelector("[data-accion]:not([disabled])");
  if (destino) destino.focus();
}

/* =========================================================
   VENTANAS (detalle y carrito)
   ========================================================= */

/* Bloqueo del scroll de fondo (forma que también funciona en iPhone). */
let scrollGuardado = 0;
function bloquearScroll() {
  if (document.body.classList.contains("bloqueado")) return;
  scrollGuardado = window.scrollY;
  document.body.style.top = `-${scrollGuardado}px`;
  document.body.classList.add("bloqueado");
}
function desbloquearScroll() {
  if (dlgDetalle.open || dlgCarrito.open) return;
  if (!document.body.classList.contains("bloqueado")) return;
  document.body.classList.remove("bloqueado");
  document.body.style.top = "";
  const html = document.documentElement;
  const comportamiento = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, scrollGuardado);
  html.style.scrollBehavior = comportamiento;
}

function abrirDialogo(dlg, origen) {
  dlg._origen = origen || document.activeElement;
  dlg.classList.remove("cerrando");
  bloquearScroll();
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}

function cerrarDialogo(dlg) {
  if (!dlg.open || dlg.classList.contains("cerrando")) return;
  if (quiereMenosMovimiento()) { dlg.close(); return; }

  dlg.classList.add("cerrando");
  let listo = false;
  const terminar = () => {
    if (listo) return;
    listo = true;
    dlg.classList.remove("cerrando");
    dlg.close();
  };
  dlg.addEventListener("animationend", (e) => { if (e.target === dlg) terminar(); }, { once: true });
  setTimeout(terminar, 350);
}

function abrirDetalle(id, origen) {
  const p = buscarProducto(id);
  if (!p) return;
  elDetalleContenido.innerHTML = htmlDetalle(p);
  abrirDialogo(dlgDetalle, origen);
  elDetalleContenido.scrollTop = 0;
}

function abrirCarrito(origen) {
  avisoCarrito = "";
  if (paso !== "datos" && paso !== "resumen") paso = pedidoFinal ? "final" : "carrito";
  if (paso === "resumen" && !numeroPedido) paso = "carrito";
  // Si el carrito cambió desde la sección (vacío o con algo agotado), volver al carrito
  if ((paso === "datos" || paso === "resumen") && (totalUnidades() === 0 || hayProblemas())) paso = "carrito";
  pintarCarrito();
  abrirDialogo(dlgCarrito, origen);
  elCarritoCuerpo.scrollTop = 0;
  cargarExistencias();
}

[dlgDetalle, dlgCarrito].forEach((dlg) => {
  dlg.addEventListener("cancel", (e) => {   // tecla Escape
    e.preventDefault();
    // Si Noah está visible dentro del panel, Escape la cierra primero a ella
    if (noahVisible() && dlg.contains(elNoah)) { ocultarNoah(); return; }
    cerrarDialogo(dlg);
  });
  dlg.addEventListener("click", (e) => {    // tocar afuera
    if (e.target === dlg) cerrarDialogo(dlg);
  });
  dlg.addEventListener("close", () => {
    dlg.classList.remove("cerrando");
    if (dlg.contains(elNoah)) ocultarNoah(true);   // Noah se va con el panel
    desbloquearScroll();
    const origen = dlg._origen;
    if (origen && document.contains(origen)) origen.focus({ preventScroll: true });
  });
});

/* =========================================================
   EVENTOS
   ========================================================= */

document.addEventListener("click", (e) => {
  const btnCerrar = e.target.closest("[data-cerrar]");
  if (btnCerrar) {
    cerrarDialogo(btnCerrar.closest("dialog"));
    return;
  }

  const btnAbrir = e.target.closest("[data-abrir]");
  if (btnAbrir) {
    abrirDetalle(btnAbrir.dataset.abrir, btnAbrir);
    return;
  }

  const btn = e.target.closest("[data-accion]");
  if (!btn || btn.disabled) return;
  const { accion, id, clave } = btn.dataset;

  switch (accion) {
    case "agregar":
    case "sumar": {
      const antes = cantidadDe(id);
      cambiarCantidad(id, antes + 1);
      devolverFoco(clave, accion);
      // Aviso corto solo al agregar desde una tarjeta (sin bajar automáticamente)
      if (String(clave).startsWith("tarjeta-") && cantidadDe(id) > antes) mostrarToast();
      break;
    }
    case "restar":
      cambiarCantidad(id, cantidadDe(id) - 1);
      devolverFoco(clave, accion);
      break;
    case "quitar":
      cambiarCantidad(id, 0);
      devolverFoco(clave, accion);
      break;
    case "hacer-pedido":
      // Mismo flujo desde la sección o desde el panel: si el panel está cerrado, se abre.
      if (!dlgCarrito.open) abrirCarrito(btn);
      if (pedidoFinal) { irAPaso("final"); break; }   // ya apartado: mostrar confirmación
      if (hayProblemas() || totalUnidades() === 0) { irAPaso("carrito"); break; }
      avisoCarrito = "";
      errores = {};
      irAPaso("datos");
      break;
    case "atras":
      if (paso === "datos") { leerFormulario(); irAPaso("carrito"); }
      else if (paso === "resumen") irAPaso("datos");
      break;
    case "confirmar":
      confirmarPedido(btn);
      break;
    case "copiar-sinpe":
      copiarSinpe(btn);
      break;
    case "usar-ubicacion":
      usarMiUbicacion(btn);
      break;
    case "pin-al-centro":
      pinAlCentro();
      break;
    case "vaciar":
      vaciarYEmpezar();
      break;
    case "ver-presentaciones": {
      const habiaPanel = dlgCarrito.open;
      cerrarDialogo(dlgCarrito);
      dlgCarrito._origen = null;
      setTimeout(() => irASeccion($("#presentaciones")), habiaPanel && !quiereMenosMovimiento() ? 260 : 0);
      break;
    }
  }
});

/* ---------- Ir a la sección "Tu pedido" (enlace del encabezado, aviso y barra) ---------- */

function irASeccion(seccion) {
  seccion.scrollIntoView({ behavior: quiereMenosMovimiento() ? "auto" : "smooth", block: "start" });
  seccion.focus({ preventScroll: true });
}

document.addEventListener("click", (e) => {
  const enlace = e.target.closest('a[href="#tu-pedido"]');
  if (!enlace) return;
  e.preventDefault();
  ocultarToast();
  irASeccion(elSeccionPedido);
});

/* ---------- Aviso "Agregado a tu pedido" ---------- */

let relojToast = null;
function mostrarToast() {
  elToast.hidden = false;
  elToast.classList.remove("visible");
  void elToast.offsetWidth;
  elToast.classList.add("visible");
  clearTimeout(relojToast);
  relojToast = setTimeout(() => {
    // si la persona está usando el aviso con el teclado, no esconderlo
    if (elToast.contains(document.activeElement)) return;
    ocultarToast();
  }, 4000);
}
function ocultarToast() {
  clearTimeout(relojToast);
  elToast.classList.remove("visible");
  elToast.hidden = true;
}
elToast.addEventListener("focusout", (e) => {
  if (!elToast.contains(e.relatedTarget)) relojToast = setTimeout(ocultarToast, 1500);
});

/* ---------- Barra fija "Ver mi pedido" (celular) ---------- */

let seccionVisible = false;

function actualizarBarra() {
  const unidades = totalUnidades();
  const mostrar = unidades > 0 && !seccionVisible;
  if (mostrar) {
    const { total } = calcularPedido();
    const productos = `${unidades} ${unidades === 1 ? "producto" : "productos"}`;
    const precio = total == null ? "Total por confirmar" : formatoColones(total);
    $("#barra-texto").innerHTML =
      `<strong>Ver mi pedido</strong><span aria-hidden="true"> · </span><span>${productos}</span><span aria-hidden="true"> · </span><span>${precio}</span>`;
  }
  elBarra.hidden = !mostrar;
  document.body.classList.toggle("con-barra", mostrar);
}

if ("IntersectionObserver" in window) {
  new IntersectionObserver((entradas) => {
    seccionVisible = entradas[0].isIntersecting;
    actualizarBarra();
  }, { threshold: 0, rootMargin: "0px 0px -90px 0px" }).observe(elSeccionPedido);   // -90px: el alto de la barra
}

// Formulario: guardar lo escrito y mostrar/ocultar el mapa
elCarritoContenido.addEventListener("input", (e) => {
  if (!e.target.closest("#form-pedido")) return;
  leerFormulario();
  if (e.target.name === "entrega") {
    const domicilio = datos.entrega === "domicilio";
    $("#campo-domicilio").hidden = !domicilio;
    if (domicilio) iniciarMapa();
  }
  // Al corregir un campo, se quita su mensaje de error
  const campo = e.target.name;
  if (errores[campo] && !validarDatos(datos)[campo]) {
    delete errores[campo];
    e.target.removeAttribute("aria-invalid");
    e.target.removeAttribute("aria-describedby");
    $(`#error-${campo}`)?.remove();
  }
});

elCarritoContenido.addEventListener("submit", (e) => {
  if (e.target.id !== "form-pedido") return;
  e.preventDefault();
  leerFormulario();
  errores = validarDatos(datos);
  const campos = Object.keys(errores);
  if (campos.length) {
    pintarCarrito();
    const primero = campos[0] === "ubicacion"
      ? $('[data-accion="usar-ubicacion"]', elCarritoContenido)
      : $(`[name="${campos[0]}"]`, elCarritoContenido);
    if (primero) primero.focus();
    avisar(`Revisa el formulario: ${Object.values(errores).join(" ")}`);
    return;
  }
  entregaElegida = true;   // desde ahora la entrega aparece en los totales
  pintarVistasCarrito();
  if (!numeroPedido) numeroPedido = generarNumeroPedido();
  irAPaso("resumen");
});

elCarritoAtras.addEventListener("click", () => {
  if (paso === "datos") { leerFormulario(); irAPaso("carrito"); }
  else if (paso === "resumen") irAPaso("datos");
});

$("#abrir-carrito").addEventListener("click", (e) => abrirCarrito(e.currentTarget));

/* =========================================================
   NOMBRE, PIE DE PÁGINA Y ANIMACIÓN
   ========================================================= */

function aplicarConfig() {
  const nombre = CONFIG.nombreTienda.trim();
  document.querySelectorAll("[data-logo]").forEach((img) => {
    if (CONFIG.logo) img.src = CONFIG.logo;
    img.alt = nombre;
  });
  if (nombre) document.title = `${nombre} · Galletas navideñas hechas en casa`;

  const wa = $("#pie-whatsapp");
  const local = CONFIG.whatsapp.replace(/^506/, "");
  wa.href = `https://wa.me/${encodeURIComponent(CONFIG.whatsapp)}`;
  wa.textContent = `WhatsApp: ${local.slice(0, 4)}-${local.slice(4)}`;

  $("#pie-condiciones").textContent =
    `Los pedidos se apartan con el ${CONFIG.porcentajeAdelanto} % por SINPE Móvil. ` +
    `El resto se paga al recibir. Pedidos hasta el ${CONFIG.fechaLimitePedidos}.`;
}

function iniciarAnimacionFondo() {
  const canvas = $("#lottie-fondo");
  if (!CONFIG.animacionFondo || !canvas) return;

  import("https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.81.0/+esm")
    .then(({ DotLottie }) => {
      const quieta = quiereMenosMovimiento();
      const animacion = new DotLottie({
        canvas,
        src: CONFIG.animacionFondo,
        loop: true,
        autoplay: false,
        layout: { fit: "cover", align: [0.5, 0.5] },
        renderConfig: { autoResize: true, freezeOnOffscreen: true }
      });
      animacion.addEventListener("load", () => {
        // Empieza a mitad del ciclo para que la nieve ya esté en pantalla.
        animacion.setFrame(Math.floor(animacion.totalFrames / 2));
        if (!quieta) animacion.play();   // con "reducir movimiento" queda quieta
        canvas.classList.add("lista");
      });
      animacion.addEventListener("loadError", () => canvas.remove());
    })
    .catch(() => canvas.remove());   // sin internet: el encabezado se ve igual, sin animación
}

/* =========================================================
   MAPA DE ENTREGA (Leaflet 1.9.4 + OpenStreetMap)
   Se carga solo cuando eligen "Entrega a domicilio".
   ========================================================= */

const LEAFLET = {
  css: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  cssSri: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
  js: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  jsSri: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
};
let promesaLeaflet = null;
let mapa = null;
let pin = null;
let mapaFallo = false;

function cargarLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (promesaLeaflet) return promesaLeaflet;
  promesaLeaflet = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = LEAFLET.css;
    css.integrity = LEAFLET.cssSri;
    css.crossOrigin = "";
    document.head.append(css);
    const js = document.createElement("script");
    js.src = LEAFLET.js;
    js.integrity = LEAFLET.jsSri;
    js.crossOrigin = "";
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error("No cargó Leaflet"));
    document.head.append(js);
    setTimeout(() => reject(new Error("Leaflet tardó demasiado")), 15000);
  }).catch((err) => { promesaLeaflet = null; throw err; });
  return promesaLeaflet;
}

const SVG_PIN = `
  <svg viewBox="0 0 36 48" width="36" height="48" aria-hidden="true">
    <path d="M18 2C9.2 2 2 9 2 17.8 2 29.5 18 46 18 46s16-16.5 16-28.2C34 9 26.8 2 18 2z" fill="#D82E30" stroke="#9F0216" stroke-width="2"/>
    <circle cx="18" cy="17.5" r="6.5" fill="#fff"/>
  </svg>`;

async function iniciarMapa() {
  const caja = $("#mapa");
  if (!caja || mapa) return;
  let L;
  try {
    L = await cargarLeaflet();
  } catch {
    mostrarFalloMapa();
    return;
  }
  if (!document.contains(caja) || mapa) return;   // el formulario cambió mientras cargaba
  mapaFallo = false;

  const centro = CONFIG.entrega.centroMapa;
  const inicio = datos.lat != null ? [datos.lat, datos.lng] : [centro.lat, centro.lng];
  mapa = L.map(caja, {
    center: inicio,
    zoom: datos.lat != null ? 15 : centro.zoom,
    scrollWheelZoom: false   // la rueda del mouse sigue desplazando el panel
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(mapa);

  pin = L.marker(inicio, {
    draggable: true,
    autoPan: true,
    keyboard: true,
    title: "Tu casa (arrastra para moverlo)",
    alt: "Pin de tu casa",
    icon: L.divIcon({ className: "pin-entrega", html: SVG_PIN, iconSize: [36, 48], iconAnchor: [18, 46] })
  }).addTo(mapa);
  pin.on("dragend", () => fijarUbicacion(pin.getLatLng()));
  mapa.on("click", (e) => {
    pin.setLatLng(e.latlng);
    fijarUbicacion(e.latlng);
  });
  // El mapa nace dentro del panel: recalcular su tamaño ya visible
  setTimeout(() => { if (mapa) mapa.invalidateSize(); }, 80);
}

function quitarMapa() {
  if (mapa) mapa.remove();
  mapa = null;
  pin = null;
}

function mostrarFalloMapa() {
  mapaFallo = true;
  const caja = $("#mapa");
  if (caja) caja.innerHTML = `<p class="mapa__fallo">No se pudo cargar el mapa. Escribe tus señas y te confirmamos el costo de entrega por WhatsApp.</p>`;
  delete errores.ubicacion;
  $("#error-ubicacion")?.setAttribute("hidden", "");
}

/** Guarda el punto elegido y actualiza el costo mostrado. */
function fijarUbicacion(latlng) {
  datos.lat = Number(latlng.lat);
  datos.lng = Number(latlng.lng);
  if (errores.ubicacion) {
    delete errores.ubicacion;
    $("#error-ubicacion")?.setAttribute("hidden", "");
  }
  const aviso = $("#ubicacion-aviso");
  if (aviso) aviso.textContent = "";
  const res = $("#entrega-resultado");
  if (res) res.innerHTML = htmlResultadoEntrega();
}

function usarMiUbicacion(boton) {
  const aviso = $("#ubicacion-aviso");
  const fallo = () => {
    if (aviso) aviso.textContent = "No pudimos obtener tu ubicación. Mueve el pin hasta tu casa.";
  };
  if (!("geolocation" in navigator)) { fallo(); return; }
  const textoOriginal = boton.innerHTML;
  boton.disabled = true;
  boton.textContent = "Buscando tu ubicación…";
  const listo = () => {
    if (document.contains(boton)) { boton.disabled = false; boton.innerHTML = textoOriginal; }
  };
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const ll = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (mapa && pin) {
        pin.setLatLng(ll);
        mapa.setView(ll, 16);
      }
      fijarUbicacion(ll);
      listo();
    },
    () => { fallo(); listo(); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

/** Alternativa con teclado: mover el mapa con las flechas y poner el pin en el centro. */
function pinAlCentro() {
  if (!mapa || !pin) return;
  const c = mapa.getCenter();
  pin.setLatLng(c);
  fijarUbicacion(c);
}

/* =========================================================
   NOAH, la perrita mascota (sorpresa)
   - Un solo elemento (#noah) que se mueve de lugar: nunca se duplica.
   - "flotante": abajo a la derecha (al tocar el logo).
   - "incrustada": dentro del espacio reservado de "¡Pedido apartado!",
     así no tapa el botón de WhatsApp ni los datos de SINPE.
   ========================================================= */

const elNoah = $("#noah");
const elNoahTexto = $("#noah-texto");
let relojNoah = null;
let relojSalidaNoah = null;
let ultimoMensajeNoah = -1;
let toquesLogo = 0;
let relojToques = null;

function noahVisible() {
  return !elNoah.hidden && !elNoah.classList.contains("saliendo");
}

function mensajeAlAzar() {
  const lista = CONFIG.noah.mensajes;
  if (lista.length < 2) { ultimoMensajeNoah = 0; return lista[0] || ""; }
  let i;
  do { i = Math.floor(Math.random() * lista.length); } while (i === ultimoMensajeNoah);
  ultimoMensajeNoah = i;
  return lista[i];
}

/** Muestra a Noah. `icono`: "#i-huella", "#i-arbol" o null. `espacio`: contenedor donde incrustarla. */
function mostrarNoah(texto, icono = null, espacio = null) {
  clearTimeout(relojNoah);
  clearTimeout(relojSalidaNoah);

  const destino = espacio || document.body;
  document.querySelectorAll(".final__noah.con-noah").forEach((el) => el.classList.remove("con-noah"));
  if (elNoah.parentNode !== destino) destino.append(elNoah);   // se mueve, no se copia
  elNoah.classList.toggle("noah--incrustada", !!espacio);
  elNoah.classList.toggle("noah--flotante", !espacio);
  if (espacio) espacio.classList.add("con-noah");

  elNoahTexto.innerHTML = escapar(texto) +
    (icono ? ` <svg class="noah__icono" aria-hidden="true"><use href="${icono}"/></svg>` : "");

  // Reiniciar la animación si ya estaba en pantalla
  elNoah.hidden = false;
  elNoah.classList.remove("entrando", "saliendo");
  void elNoah.offsetWidth;
  elNoah.classList.add("entrando");

  // Anunciarlo a lectores de pantalla (dentro del panel si está abierto)
  const aviso = dlgCarrito.open && dlgCarrito.contains(elNoah) ? $("#noah-aviso-panel") : $("#noah-aviso");
  aviso.textContent = "";
  setTimeout(() => { aviso.textContent = `Noah dice: ${texto}`; }, 60);

  relojNoah = setTimeout(() => ocultarNoah(), CONFIG.noah.segundos * 1000);
}

function ocultarNoah(inmediato = false) {
  clearTimeout(relojNoah);
  clearTimeout(relojSalidaNoah);
  if (elNoah.hidden) return;
  const teniaFoco = elNoah.contains(document.activeElement);

  const terminar = () => {
    const espacio = elNoah.closest(".final__noah");
    if (espacio) espacio.classList.remove("con-noah");
    elNoah.hidden = true;
    elNoah.classList.remove("entrando", "saliendo");
    if (elNoah.parentNode !== document.body) document.body.append(elNoah);
    if (teniaFoco) {   // no dejar el foco perdido
      (dlgCarrito.open ? elCarritoTitulo : $("#logo-boton")).focus({ preventScroll: true });
    }
  };
  if (inmediato) { terminar(); return; }
  elNoah.classList.add("saliendo");
  relojSalidaNoah = setTimeout(terminar, quiereMenosMovimiento() ? 220 : 320);
}

/** Copitos y estrellitas que caen por 2 segundos (no con "reducir movimiento"). */
function lluviaDeCopos() {
  if (quiereMenosMovimiento()) return;
  document.querySelector(".lluvia")?.remove();
  const capa = document.createElement("div");
  capa.className = "lluvia";
  capa.setAttribute("aria-hidden", "true");
  const colores = ["#D82E30", "#0DA35E", "#F29294", "#F2C14E", "#9F0216"];
  let html = "";
  for (let i = 0; i < 24; i++) {
    const tam = 12 + Math.round(Math.random() * 14);
    const retraso = (Math.random() * 0.6).toFixed(2);
    const duracion = (0.9 + Math.random() * 0.5).toFixed(2);   // retraso + duración ≤ 2 s
    html += `<svg class="lluvia__copo" style="left:${(Math.random() * 96).toFixed(1)}%;width:${tam}px;height:${tam}px;` +
      `color:${colores[i % colores.length]};animation-delay:${retraso}s;animation-duration:${duracion}s"><use href="#i-estrella"/></svg>`;
  }
  capa.innerHTML = html;
  document.body.append(capa);
  setTimeout(() => capa.remove(), 2000);
}

// Tocar a Noah o su burbuja la despide
elNoah.addEventListener("click", () => ocultarNoah());

// Escape (fuera del panel; dentro del panel lo maneja el propio panel)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && noahVisible() && !elNoah.closest("dialog")) ocultarNoah();
});

// Easter egg: tocar el logo
$("#logo-boton").addEventListener("click", () => {
  toquesLogo++;
  clearTimeout(relojToques);
  relojToques = setTimeout(() => { toquesLogo = 0; }, 1500);   // "seguidos": menos de 1,5 s entre toques
  if (toquesLogo >= CONFIG.noah.toquesSecretos) {
    toquesLogo = 0;
    mostrarNoah(CONFIG.noah.mensajeSecreto, "#i-arbol");
    lluviaDeCopos();
    return;
  }
  mostrarNoah(mensajeAlAzar());
});

// Precargar la imagen de Noah un rato después de abrir la página (sin frenar la carga)
window.addEventListener("load", () => {
  setTimeout(() => { elNoah.querySelector("img").loading = "eager"; }, 3000);
});

/* ---------- Inicio ---------- */

aplicarConfig();
pintarTarjetas();
actualizarTodo();
cargarExistencias();
iniciarAnimacionFondo();

// Si el carrito cambia en otra pestaña, mantener todo sincronizado
window.addEventListener("storage", (e) => {
  if (e.key === CLAVE_CARRITO) {
    carrito = cargarCarrito();
    actualizarTodo();
  }
});
