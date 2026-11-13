const PEDIDOS = "Pedidos", INVENTARIO = "Inventario";

// Evita que un texto que empieza con = + - @ se ejecute como fórmula
function limpiar(v) {
  const t = String(v ?? "");
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}
// Guarda números largos (teléfono, pedido) como texto, sin que la hoja los cambie
function texto(v) {
  const t = String(v ?? "");
  return t ? "'" + t : "";
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

// Calcula cuántas quedan de cada producto y lo escribe en Inventario
function existencias() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hInv = libro.getSheetByName(INVENTARIO);
  const quedan = {};
  if (!hInv) return quedan;
  const inv = hInv.getDataRange().getValues();
  const ped = libro.getSheetByName(PEDIDOS).getDataRange().getValues();
  const enc = ped[0].map(String);
  const iEstado = enc.indexOf("Estado");
  for (let r = 1; r < inv.length; r++) {
    const id = String(inv[r][0] || "").trim();
    if (!id) continue;
    const col = enc.indexOf(id);
    let apartados = 0;
    if (col >= 0) {
      for (let f = 1; f < ped.length; f++) {
        if (ped[f][iEstado] !== "Cancelado") apartados += Number(ped[f][col]) || 0;
      }
    }
    const q = Math.max(0, (Number(inv[r][2]) || 0) - apartados);
    quedan[id] = q;
    hInv.getRange(r + 1, 4, 1, 2).setValues([[apartados, q]]);
  }
  return quedan;
}

// La página pregunta cuántas quedan
function doGet() {
  return json({ ok: true, quedan: existencias() });
}

// La página envía un pedido
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const items = d.items || {};
    const quedan = existencias();
    const agotados = Object.keys(items).filter(id => id in quedan && Number(items[id]) > quedan[id]);
    if (agotados.length) return json({ ok: false, agotados, quedan });

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PEDIDOS);
    const enc = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String);
    const datos = {
      "Fecha": new Date(),
      "Pedido #": texto(d.pedido),
      "Nombre": limpiar(d.nombre),
      "Teléfono": texto(d.telefono),
      "Entrega": limpiar(d.entrega),
      "Costo entrega": d.costoEntrega === "" || d.costoEntrega == null ? "Por confirmar" : Number(d.costoEntrega),
      "Señas": limpiar(d.senas),
      "Mapa": limpiar(d.enlaceMapa),
      "Productos": limpiar(d.productos),
      "Total": d.total ?? "",
      "Adelanto": d.adelanto ?? "",
      "Notas": limpiar(d.notas),
      "Estado": "Pendiente de pago"
    };
    hoja.appendRow(enc.map(h => h in datos ? datos[h] : (items[h] != null ? Number(items[h]) : "")));
    return json({ ok: true, quedan: existencias() });
  } finally {
    lock.releaseLock();
  }
}

// Al cambiar algo a mano (cancelar un pedido, agregar existencias), recalcula
function onEdit() {
  existencias();
}

// PRUEBA: ejecútela desde el editor para ver si se crea una fila. Luego borre esa fila.
function probarPedido() {
  const r = doPost({ postData: { contents: JSON.stringify({
    pedido: "GN-PRUEBA-0001", nombre: "Prueba", telefono: "50688888888",
    entrega: "domicilio", costoEntrega: 2500, senas: "De la iglesia 200 m norte",
    enlaceMapa: "https://www.google.com/maps?q=9.8471,-84.3143",
    productos: "1 × Cajita navideña", total: 7500, adelanto: 3750,
    notas: "Esto es una prueba", items: { cajita: 1 }
  }) } });
  Logger.log(r.getContent());
}
