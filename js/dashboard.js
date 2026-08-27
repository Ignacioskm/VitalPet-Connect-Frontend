// dashboard.js
// este archivo lo usan las vistas del panel, por eso antes de
// ejecutar algo reviso si el elemento existe en la pagina

// datos con los que trabaja la pagina
let listaMascotas = [];


// ---------- funciones que uso en varias partes ----------

// el correo tiene que terminar en alguno de los dominios permitidos
function correoValido(correo) {
  correo = correo.toLowerCase();
  for (let i = 0; i < dominiosPermitidos.length; i++) {
    if (correo.endsWith(dominiosPermitidos[i])) {
      return true;
    }
  }
  return false;
}

// pinta el error debajo del campo
function marcarError(idCampo, idError, mensaje) {
  const campo = document.getElementById(idCampo);
  document.getElementById(idError).textContent = mensaje;
  campo.classList.add("campo-malo");
  campo.classList.remove("campo-bueno");
  return false;
}

function marcarOk(idCampo, idError) {
  const campo = document.getElementById(idCampo);
  document.getElementById(idError).textContent = "";
  campo.classList.remove("campo-malo");
  campo.classList.add("campo-bueno");
  return true;
}

// localStorage solo guarda texto, por eso el stringify
function guardarEnLocal(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// si ya hay algo guardado en el navegador uso eso, si no parto con
// los datos de mock-data.js
function cargarDatos() {
  const mascotasGuardadas = localStorage.getItem("vp_mascotas");
  if (mascotasGuardadas) {
    listaMascotas = JSON.parse(mascotasGuardadas);
  } else {
    listaMascotas = mascotas;
    guardarEnLocal("vp_mascotas", listaMascotas);
  }
}

// deja los datos como estaban al principio
function restaurarDatos() {
  if (confirm("Se van a borrar los cambios y volverán los datos de prueba. ¿Continuar?")) {
    localStorage.removeItem("vp_mascotas");
    location.reload();
  }
}


// ---------- vista inicio ----------

function mostrarResumen() {
  let activas = 0;
  let perros = 0;
  let gatos = 0;

  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].estado === "Activo") {
      activas++;
    }
    if (listaMascotas[i].especie === "Perro") perros++;
    if (listaMascotas[i].especie === "Gato") gatos++;
  }

  document.getElementById("totalMascotas").textContent = listaMascotas.length;
  document.getElementById("mascotasActivas").textContent = activas;
  document.getElementById("totalPerros").textContent = perros;
  document.getElementById("totalGatos").textContent = gatos;

  // aviso si hay fichas inactivas
  const inactivas = listaMascotas.length - activas;
  if (inactivas > 0) {
    document.getElementById("avisoInactivas").classList.remove("d-none");
    document.getElementById("textoAviso").textContent =
      "Hay " + inactivas + " ficha(s) inactiva(s) en el sistema.";
  }
}

// las ultimas 5 que se registraron
function mostrarUltimasMascotas() {
  const cuerpo = document.getElementById("tablaUltimas");
  let html = "";

  let desde = listaMascotas.length - 5;
  if (desde < 0) {
    desde = 0;
  }

  for (let i = listaMascotas.length - 1; i >= desde; i--) {
    const m = listaMascotas[i];

    let color = "bg-secondary";
    if (m.estado === "Activo") {
      color = "bg-success";
    }

    html += "<tr>" +
      "<td>" + m.nombre + "</td>" +
      "<td>" + m.especie + "</td>" +
      "<td>" + m.raza + "</td>" +
      "<td>" + m.duenio + "</td>" +
      "<td><span class='badge " + color + "'>" + m.estado + "</span></td>" +
      "</tr>";
  }

  cuerpo.innerHTML = html;
}


// ---------- vista mascotas ----------

// si le paso un texto muestra solo las que coinciden
function mostrarTablaMascotas(texto) {
  const cuerpo = document.getElementById("tablaMascotas");
  let html = "";
  let encontradas = 0;

  for (let i = 0; i < listaMascotas.length; i++) {
    const m = listaMascotas[i];

    // busca por el nombre de la mascota o del dueno
    if (texto !== "") {
      const buscar = texto.toLowerCase();
      const coincide = m.nombre.toLowerCase().includes(buscar) ||
                       m.duenio.toLowerCase().includes(buscar);
      if (!coincide) {
        continue;
      }
    }

    encontradas++;

    let colorMascota = "bg-secondary";
    if (m.estado === "Activo") {
      colorMascota = "bg-success";
    }

    html += "<tr>" +
      "<td>" + m.id + "</td>" +
      "<td>" + m.nombre + "</td>" +
      "<td>" + m.especie + "</td>" +
      "<td>" + m.raza + "</td>" +
      "<td>" + m.edad + "</td>" +
      "<td>" + m.duenio + "</td>" +
      "<td>" + m.correo + "</td>" +
      "<td><span class='badge " + colorMascota + "'>" + m.estado + "</span></td>" +
      "<td><button class='btn btn-sm btn-outline-danger' onclick='eliminarMascota(" + m.id + ")'>Eliminar</button></td>" +
      "</tr>";
  }

  if (encontradas === 0) {
    html = "<tr><td colspan='9' class='text-center text-muted py-3'>" +
           "No se encontraron mascotas con ese criterio.</td></tr>";
  }

  cuerpo.innerHTML = html;
  document.getElementById("contadorMascotas").textContent = encontradas;
}

function buscarMascota() {
  const texto = document.getElementById("buscador").value;
  mostrarTablaMascotas(texto);
}

function eliminarMascota(id) {
  if (!confirm("¿Seguro que quieres eliminar esta mascota?")) {
    return;
  }

  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id === id) {
      listaMascotas.splice(i, 1);
      break;
    }
  }

  guardarEnLocal("vp_mascotas", listaMascotas);
  document.getElementById("buscador").value = "";
  mostrarTablaMascotas("");
}

// validaciones del formulario de mascota

function validarNombreMascota() {
  const valor = document.getElementById("mNombre").value.trim();
  if (valor === "") {
    return marcarError("mNombre", "errNombre", "El nombre es obligatorio.");
  }
  if (valor.length > 50) {
    return marcarError("mNombre", "errNombre", "Máximo 50 caracteres.");
  }
  return marcarOk("mNombre", "errNombre");
}

function validarEspecie() {
  const valor = document.getElementById("mEspecie").value;
  if (valor === "") {
    return marcarError("mEspecie", "errEspecie", "Selecciona una especie.");
  }
  return marcarOk("mEspecie", "errEspecie");
}

function validarRaza() {
  const valor = document.getElementById("mRaza").value.trim();
  // la raza es opcional, solo reviso el largo
  if (valor.length > 100) {
    return marcarError("mRaza", "errRaza", "Máximo 100 caracteres.");
  }
  return marcarOk("mRaza", "errRaza");
}

function validarEdad() {
  const valor = document.getElementById("mEdad").value;
  if (valor === "") {
    return marcarError("mEdad", "errEdad", "La edad es obligatoria.");
  }
  const numero = Number(valor);
  if (isNaN(numero) || numero < 0) {
    return marcarError("mEdad", "errEdad", "Debe ser un número mayor o igual a 0.");
  }
  if (!Number.isInteger(numero)) {
    return marcarError("mEdad", "errEdad", "Solo se aceptan números enteros.");
  }
  if (numero > 30) {
    return marcarError("mEdad", "errEdad", "Revisa la edad, el máximo permitido es 30.");
  }
  return marcarOk("mEdad", "errEdad");
}

function validarDuenio() {
  const valor = document.getElementById("mDuenio").value.trim();
  if (valor === "") {
    return marcarError("mDuenio", "errDuenio", "El nombre del dueño es obligatorio.");
  }
  if (valor.length > 100) {
    return marcarError("mDuenio", "errDuenio", "Máximo 100 caracteres.");
  }
  return marcarOk("mDuenio", "errDuenio");
}

function validarCorreoMascota() {
  const valor = document.getElementById("mCorreo").value.trim();
  if (valor === "") {
    return marcarError("mCorreo", "errCorreo", "El correo es obligatorio.");
  }
  if (valor.length > 100) {
    return marcarError("mCorreo", "errCorreo", "Máximo 100 caracteres.");
  }
  if (!correoValido(valor)) {
    return marcarError("mCorreo", "errCorreo",
      "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  }
  return marcarOk("mCorreo", "errCorreo");
}

function guardarMascota(evento) {
  evento.preventDefault(); // sin esto el formulario recarga la pagina

  // llamo a todas primero, asi se marcan todos los errores juntos
  const ok1 = validarNombreMascota();
  const ok2 = validarEspecie();
  const ok3 = validarRaza();
  const ok4 = validarEdad();
  const ok5 = validarDuenio();
  const ok6 = validarCorreoMascota();

  if (!(ok1 && ok2 && ok3 && ok4 && ok5 && ok6)) {
    return;
  }

  // el id nuevo es el mayor que haya + 1
  let ultimoId = 0;
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id > ultimoId) {
      ultimoId = listaMascotas[i].id;
    }
  }

  let raza = document.getElementById("mRaza").value.trim();
  if (raza === "") {
    raza = "Sin especificar";
  }

  const nueva = {
    id: ultimoId + 1,
    nombre: document.getElementById("mNombre").value.trim(),
    especie: document.getElementById("mEspecie").value,
    raza: raza,
    edad: Number(document.getElementById("mEdad").value),
    duenio: document.getElementById("mDuenio").value.trim(),
    correo: document.getElementById("mCorreo").value.trim(),
    estado: "Activo"
  };

  listaMascotas.push(nueva);
  guardarEnLocal("vp_mascotas", listaMascotas);

  limpiarFormulario("formMascota");
  mostrarTablaMascotas("");
  mostrarMensajeOk("Mascota registrada correctamente.");
}

function limpiarFormulario(idFormulario) {
  document.getElementById(idFormulario).reset();
  const campos = document.querySelectorAll("#" + idFormulario + " input, #" + idFormulario + " select, #" + idFormulario + " textarea");
  for (let i = 0; i < campos.length; i++) {
    campos[i].classList.remove("campo-bueno");
    campos[i].classList.remove("campo-malo");
  }
  const errores = document.querySelectorAll("#" + idFormulario + " .vp-error");
  for (let i = 0; i < errores.length; i++) {
    errores[i].textContent = "";
  }
}

// mensaje verde que se esconde solo
function mostrarMensajeOk(texto) {
  const caja = document.getElementById("mensajeOk");
  caja.textContent = texto;
  caja.classList.remove("d-none");
  setTimeout(function () {
    caja.classList.add("d-none");
  }, 3000);
}


// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", function () {
  cargarDatos();

  // inicio
  if (document.getElementById("totalMascotas")) {
    mostrarResumen();
    mostrarUltimasMascotas();
  }

  // mascotas
  if (document.getElementById("tablaMascotas")) {
    mostrarTablaMascotas("");

    // las especies salen del arreglo de mock-data.js
    const selectEspecie = document.getElementById("mEspecie");
    for (let i = 0; i < especies.length; i++) {
      const opcion = document.createElement("option");
      opcion.value = especies[i];
      opcion.textContent = especies[i];
      selectEspecie.appendChild(opcion);
    }

    document.getElementById("buscador").addEventListener("input", buscarMascota);
    document.getElementById("formMascota").addEventListener("submit", guardarMascota);

    // validacion en tiempo real
    document.getElementById("mNombre").addEventListener("input", validarNombreMascota);
    document.getElementById("mEspecie").addEventListener("change", validarEspecie);
    document.getElementById("mRaza").addEventListener("input", validarRaza);
    document.getElementById("mEdad").addEventListener("input", validarEdad);
    document.getElementById("mDuenio").addEventListener("input", validarDuenio);
    document.getElementById("mCorreo").addEventListener("input", validarCorreoMascota);
  }
});
