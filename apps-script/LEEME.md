# Hoja de pedidos (Google Apps Script)

El archivo [Codigo.gs](Codigo.gs) es el programa que vive dentro de la hoja de Google. Hace dos cosas:

- Cuando alguien confirma un pedido en la página, lo anota como una fila nueva en la pestaña **Pedidos**.
- Le dice a la página cuántas galletas quedan de cada producto, usando la pestaña **Inventario**.

Este archivo es solo una copia de respaldo. El que funciona de verdad es el que está pegado en la hoja de Google. Si se cambia uno, hay que cambiar el otro.

---

## 1. Pestaña "Pedidos"

Cree una pestaña llamada exactamente **Pedidos** (con P mayúscula). En la **fila 1** escriba estos encabezados, uno por celda, en este orden:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Fecha | Pedido # | Nombre | Teléfono | Entrega | Costo entrega | Señas | Mapa | Productos | Total | Adelanto | Notas | Estado | bolsita | cajita | latita |

- Respete tildes, la ñ, mayúsculas y espacios. Por ejemplo: `Teléfono` lleva tilde, `Señas` lleva ñ y `Pedido #` lleva un espacio antes del #.
- `bolsita`, `cajita` y `latita` van **en minúscula**. Son los mismos `id` de los productos en `app.js`.
- Desde la fila 2 en adelante no escriba nada: las filas las agrega el programa.

## 2. Pestaña "Inventario"

Cree otra pestaña llamada exactamente **Inventario**. Debe verse así:

| id | Producto | Disponibles | Apartados | Quedan |
|---|---|---|---|---|
| bolsita | Bolsita navideña | 20 | | |
| cajita | Cajita navideña | 15 | | |
| latita | Latita navideña | 10 | | |

- **Usted solo llena** `id`, `Producto` y `Disponibles` (cuántas va a hacer en total).
- **Apartados** y **Quedan** los llena el programa solo. No escriba en esas columnas.
- El `id` tiene que ser igual al encabezado de la pestaña Pedidos (`bolsita`, `cajita`, `latita`).
- Si hace más galletas, solo suba el número de **Disponibles**.

## 3. Pegar el programa

1. Abra la hoja de Google.
2. En el menú, vaya a **Extensiones → Apps Script**. Se abre otra pestaña con un editor.
3. Borre todo lo que aparezca en el editor (normalmente `function myFunction() {}`).
4. Copie **todo** el contenido de [Codigo.gs](Codigo.gs) y péguelo.
5. Presione el ícono del disquete (**Guardar**) o `Ctrl + S`.

## 4. Probar que funciona

1. En la barra de arriba del editor, junto al botón **Ejecutar**, elija la función **probarPedido**.
2. Presione **Ejecutar**.
3. La primera vez, Google pide permiso: **Revisar permisos** → elija su cuenta → **Configuración avanzada** → **Ir a (nombre del proyecto)** → **Permitir**. Es normal que diga que la app no está verificada, porque es un programa propio y no de una empresa.
4. Abajo debe aparecer algo como `{"ok":true,"quedan":{...}}`.
5. Vuelva a la hoja: en **Pedidos** debe haber una fila nueva con el pedido `GN-PRUEBA-0001`, y en **Inventario** la cajita debe tener 1 apartada.
6. **Borre esa fila de prueba**: clic derecho sobre el número de la fila → **Borrar fila**. Las existencias se recalculan solas.

## 5. Publicar (para que la página lo pueda usar)

**La primera vez:**

1. En el editor, presione **Implementar → Nueva implementación**.
2. En el engranaje de "Seleccionar tipo", elija **Aplicación web**.
3. **Ejecutar como:** Yo. **Quién tiene acceso:** Cualquier usuario.
4. Presione **Implementar** y copie la **URL de la aplicación web** (termina en `/exec`).
5. Pegue esa URL en `app.js`, en `CONFIG.urlPedidos`.

**Cada vez que cambie el programa:**

1. Guarde los cambios.
2. Vaya a **Implementar → Administrar implementaciones**.
3. Presione el lápiz (**Editar**).
4. En **Versión**, elija **Nueva versión** y presione **Implementar**.

Así **la URL `/exec` no cambia** y no hay que tocar `app.js`. Si en vez de esto usa "Nueva implementación", se crea una URL distinta y la página seguiría usando el programa viejo.

## 6. Cancelar un pedido

En la pestaña **Pedidos**, cambie la columna **Estado** de ese pedido a **Cancelado**. Las unidades vuelven solas al inventario.

- Escríbalo exactamente así: `Cancelado`, con C mayúscula y sin espacios al final. `cancelado` en minúscula **no** cuenta como cancelado.
- Puede usar otros estados para llevar el control (por ejemplo `Pagado` o `Entregado`). Solo `Cancelado` devuelve las unidades.

## 7. Si un dato queda en blanco

Si un pedido llega pero alguna columna queda vacía, casi siempre es porque **el encabezado está escrito distinto** a la lista del punto 1. El programa busca cada columna por su nombre exacto. Revise:

- Tildes y ñ: `Senas` sin ñ no recibe las señas, y `Telefono` sin tilde no recibe el teléfono.
- Mayúsculas: `costo entrega` no es lo mismo que `Costo entrega`.
- Espacios de más al inicio o al final (haga clic en la celda y revise la barra de fórmulas).
- `Pedido #` necesita el espacio antes del `#`.
- Las columnas de productos: `bolsita`, `cajita` y `latita` en minúscula.

Es normal que algunas columnas queden vacías:

- **Señas** y **Mapa**, cuando el pedido es para recoger en el salón.
- **Total** y **Adelanto**, cuando el costo de entrega quedó "Por confirmar".
- **Notas**, si la persona no escribió nada.

Si las existencias no bajan, revise que el `id` de la pestaña Inventario sea igual al encabezado de la columna del producto en Pedidos.
