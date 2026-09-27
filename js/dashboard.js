// dashboard.js - logica del panel

let listaMascotas = [];
let listaCitas = [];

// muestra un mensaje de error debajo de un campo
function mostrarError(id, mensaje) {
  document.getElementById(id).textContent = mensaje;
}

// revisa que el correo termine en un dominio permitido
function correoValido(correo) {
  correo = correo.toLowerCase();
  for (let i = 0; i < dominiosPermitidos.length; i++) {
    if (correo.endsWith(dominiosPermitidos[i])) {
      return true;
    }
  }
  return false;
}

// llena un select con las opciones de una lista
function llenarSelect(id, lista) {
  const select = document.getElementById(id);
  for (let i = 0; i < lista.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = lista[i];
    opcion.textContent = lista[i];
    select.appendChild(opcion);
  }
}

function guardar(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// carga lo guardado, o los datos de mock-data si es la primera vez
function cargarDatos() {
  if (localStorage.getItem("vp_mascotas")) {
    listaMascotas = JSON.parse(localStorage.getItem("vp_mascotas"));
  } else {
    listaMascotas = mascotas;
  }
  if (localStorage.getItem("vp_citas")) {
    listaCitas = JSON.parse(localStorage.getItem("vp_citas"));
  } else {
    listaCitas = citas;
  }
}

// color del badge segun el estado de la cita
function colorEstado(estado) {
  if (estado === "Confirmada") return "bg-success";
  if (estado === "Pendiente") return "bg-warning text-dark";
  if (estado === "Atendida") return "bg-secondary";
  return "bg-danger";
}


// ===== inicio =====

function mostrarInicio() {
  let activas = 0;
  let pendientes = 0;
  let confirmadas = 0;

  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].estado === "Activo") activas++;
  }
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].estado === "Pendiente") pendientes++;
    if (listaCitas[i].estado === "Confirmada") confirmadas++;
  }

  document.getElementById("totalMascotas").textContent = listaMascotas.length;
  document.getElementById("mascotasActivas").textContent = activas;
  document.getElementById("citasPendientes").textContent = pendientes;
  document.getElementById("citasConfirmadas").textContent = confirmadas;

  // aviso si hay muchas citas sin confirmar
  if (pendientes >= 3) {
    document.getElementById("avisoPendientes").classList.remove("d-none");
    document.getElementById("textoAviso").textContent = "Hay " + pendientes + " citas pendientes por confirmar.";
  }

  // tabla con las proximas citas
  let html = "";
  for (let i = 0; i < listaCitas.length; i++) {
    const c = listaCitas[i];
    if (c.estado === "Pendiente" || c.estado === "Confirmada") {
      html += "<tr><td>" + c.mascota + "</td><td>" + c.duenio + "</td><td>" + c.fecha +
        "</td><td>" + c.hora + "</td><td>" + c.veterinario +
        "</td><td><span class='badge " + colorEstado(c.estado) + "'>" + c.estado + "</span></td></tr>";
    }
  }
  document.getElementById("tablaProximas").innerHTML = html;
}


// ===== mascotas =====

// dibuja la tabla, si le paso texto filtra por nombre o dueno
function mostrarTablaMascotas(texto) {
  let html = "";
  let total = 0;

  for (let i = 0; i < listaMascotas.length; i++) {
    const m = listaMascotas[i];

    if (texto !== "") {
      const buscar = texto.toLowerCase();
      if (!m.nombre.toLowerCase().includes(buscar) && !m.duenio.toLowerCase().includes(buscar)) {
        continue;
      }
    }

    total++;
    let color = "bg-secondary";
    if (m.estado === "Activo") color = "bg-success";

    html += "<tr><td>" + m.id + "</td><td>" + m.nombre + "</td><td>" + m.especie +
      "</td><td>" + m.raza + "</td><td>" + m.edad + "</td><td>" + m.duenio + "</td><td>" + m.correo +
      "</td><td><span class='badge " + color + "'>" + m.estado + "</span></td>" +
      "<td><button class='btn btn-sm btn-outline-danger' onclick='eliminarMascota(" + m.id + ")'>Eliminar</button></td></tr>";
  }

  if (total === 0) {
    html = "<tr><td colspan='9' class='text-center text-muted py-3'>No se encontraron mascotas.</td></tr>";
  }

  document.getElementById("tablaMascotas").innerHTML = html;
  document.getElementById("contadorMascotas").textContent = total;
}

function buscarMascota() {
  mostrarTablaMascotas(document.getElementById("buscador").value);
}

function eliminarMascota(id) {
  if (!confirm("Seguro que quieres eliminar esta mascota?")) return;

  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id === id) {
      listaMascotas.splice(i, 1);
      break;
    }
  }
  guardar("vp_mascotas", listaMascotas);
  mostrarTablaMascotas("");
}

function guardarMascota(e) {
  e.preventDefault();

  // limpio los errores de antes
  mostrarError("errNombre", "");
  mostrarError("errEspecie", "");
  mostrarError("errEdad", "");
  mostrarError("errDuenio", "");
  mostrarError("errCorreo", "");

  const nombre = document.getElementById("mNombre").value.trim();
  const especie = document.getElementById("mEspecie").value;
  const edad = document.getElementById("mEdad").value;
  const duenio = document.getElementById("mDuenio").value.trim();
  const correo = document.getElementById("mCorreo").value.trim();

  let valido = true;

  if (nombre === "") { mostrarError("errNombre", "El nombre es obligatorio."); valido = false; }
  if (especie === "") { mostrarError("errEspecie", "Selecciona una especie."); valido = false; }
  if (edad === "" || Number(edad) < 0 || Number(edad) > 30) { mostrarError("errEdad", "Ingresa una edad entre 0 y 30."); valido = false; }
  if (duenio === "") { mostrarError("errDuenio", "El nombre del dueno es obligatorio."); valido = false; }
  if (correo === "") {
    mostrarError("errCorreo", "El correo es obligatorio."); valido = false;
  } else if (!correoValido(correo)) {
    mostrarError("errCorreo", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com."); valido = false;
  }

  if (!valido) return;

  // busco el id mas grande para que el nuevo sea +1
  let ultimoId = 0;
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id > ultimoId) ultimoId = listaMascotas[i].id;
  }

  let raza = document.getElementById("mRaza").value.trim();
  if (raza === "") raza = "Sin especificar";

  listaMascotas.push({
    id: ultimoId + 1,
    nombre: nombre,
    especie: especie,
    raza: raza,
    edad: Number(edad),
    duenio: duenio,
    correo: correo,
    estado: "Activo"
  });
  guardar("vp_mascotas", listaMascotas);

  document.getElementById("formMascota").reset();
  mostrarTablaMascotas("");
  alert("Mascota registrada correctamente.");
}


// ===== citas =====

function mostrarTablaCitas(filtro) {
  let html = "";
  let total = 0;

  for (let i = 0; i < listaCitas.length; i++) {
    const c = listaCitas[i];

    if (filtro !== "Todas" && c.estado !== filtro) continue;

    total++;

    // botones segun el estado de la cita
    let botones = "<span class='text-muted'>Sin acciones</span>";
    if (c.estado === "Pendiente") {
      botones = "<button class='btn btn-sm btn-vp me-1' onclick='cambiarEstadoCita(" + c.id + ", \"Confirmada\")'>Confirmar</button>" +
                "<button class='btn btn-sm btn-outline-danger' onclick='cambiarEstadoCita(" + c.id + ", \"Cancelada\")'>Cancelar</button>";
    } else if (c.estado === "Confirmada") {
      botones = "<button class='btn btn-sm btn-outline-secondary' onclick='cambiarEstadoCita(" + c.id + ", \"Atendida\")'>Marcar atendida</button>";
    }

    html += "<tr><td>" + c.id + "</td><td>" + c.mascota + "</td><td>" + c.duenio + "</td><td>" + c.fecha +
      "</td><td>" + c.hora + "</td><td>" + c.motivo + "</td><td>" + c.veterinario +
      "</td><td><span class='badge " + colorEstado(c.estado) + "'>" + c.estado + "</span></td><td>" + botones + "</td></tr>";
  }

  if (total === 0) {
    html = "<tr><td colspan='9' class='text-center text-muted py-3'>No hay citas con ese estado.</td></tr>";
  }

  document.getElementById("tablaCitas").innerHTML = html;
  document.getElementById("contadorCitas").textContent = total;
}

function cambiarEstadoCita(id, nuevoEstado) {
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id === id) {
      listaCitas[i].estado = nuevoEstado;
      break;
    }
  }
  guardar("vp_citas", listaCitas);
  filtrarCitas();
}

function filtrarCitas() {
  mostrarTablaCitas(document.getElementById("filtroEstado").value);
}

function guardarCita(e) {
  e.preventDefault();

  mostrarError("errMascotaCita", "");
  mostrarError("errFecha", "");
  mostrarError("errHora", "");
  mostrarError("errMotivo", "");
  mostrarError("errVeterinario", "");

  const mascota = document.getElementById("cMascota").value;
  const fecha = document.getElementById("cFecha").value;
  const hora = document.getElementById("cHora").value;
  const motivo = document.getElementById("cMotivo").value.trim();
  const veterinario = document.getElementById("cVeterinario").value;

  let valido = true;

  if (mascota === "") { mostrarError("errMascotaCita", "Selecciona una mascota."); valido = false; }
  if (fecha === "") {
    mostrarError("errFecha", "La fecha es obligatoria."); valido = false;
  } else if (fecha < obtenerFechaHoy()) {
    mostrarError("errFecha", "No se puede agendar en una fecha anterior a hoy."); valido = false;
  }
  if (hora === "") {
    mostrarError("errHora", "La hora es obligatoria."); valido = false;
  } else if (hora < "09:00" || hora > "19:00") {
    mostrarError("errHora", "El horario de atencion es de 09:00 a 19:00."); valido = false;
  }
  if (motivo === "") { mostrarError("errMotivo", "El motivo es obligatorio."); valido = false; }
  if (veterinario === "") { mostrarError("errVeterinario", "Selecciona un veterinario."); valido = false; }

  if (!valido) return;

  // busco el dueno de la mascota elegida
  let duenio = "";
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].nombre === mascota) {
      duenio = listaMascotas[i].duenio;
      break;
    }
  }

  let ultimoId = 100;
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id > ultimoId) ultimoId = listaCitas[i].id;
  }

  listaCitas.push({
    id: ultimoId + 1,
    mascota: mascota,
    duenio: duenio,
    fecha: fecha,
    hora: hora,
    motivo: motivo,
    veterinario: veterinario,
    estado: "Pendiente"
  });
  guardar("vp_citas", listaCitas);

  document.getElementById("formCita").reset();
  document.getElementById("filtroEstado").value = "Todas";
  mostrarTablaCitas("Todas");
  alert("Cita agendada para " + mascota + ".");
}

// devuelve la fecha de hoy en formato aaaa-mm-dd
function obtenerFechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// llena el select de mascotas del formulario de citas
function llenarMascotasCita() {
  const select = document.getElementById("cMascota");
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].estado === "Activo") {
      const opcion = document.createElement("option");
      opcion.value = listaMascotas[i].nombre;
      opcion.textContent = listaMascotas[i].nombre + " (" + listaMascotas[i].duenio + ")";
      select.appendChild(opcion);
    }
  }
}


// ===== configuracion =====

// valida el RUN calculando el digito verificador (modulo 11)
function runValido(run) {
  run = run.toUpperCase();
  if (run.length < 7 || run.length > 9) return false;

  const cuerpo = run.substring(0, run.length - 1);
  const dv = run.charAt(run.length - 1);

  // multiplico de derecha a izquierda por 2,3,4,5,6,7 y vuelvo al 2
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + Number(cuerpo[i]) * multiplo;
    multiplo++;
    if (multiplo > 7) multiplo = 2;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado = String(resto);
  if (resto === 11) dvEsperado = "0";
  if (resto === 10) dvEsperado = "K";

  return dv === dvEsperado;
}

// cuando cambio la region, relleno el select de comunas
function cambiarComunas() {
  const region = document.getElementById("uRegion").value;
  const selectComuna = document.getElementById("uComuna");
  selectComuna.innerHTML = "<option value=''>Selecciona una comuna</option>";

  for (let i = 0; i < regiones.length; i++) {
    if (regiones[i].nombre === region) {
      llenarSelect("uComuna", regiones[i].comunas);
      break;
    }
  }
}

function guardarPerfil(e) {
  e.preventDefault();

  mostrarError("errRun", "");
  mostrarError("errNombreU", "");
  mostrarError("errApellidos", "");
  mostrarError("errCorreoU", "");
  mostrarError("errTipo", "");
  mostrarError("errRegion", "");
  mostrarError("errComuna", "");
  mostrarError("errDireccion", "");

  const run = document.getElementById("uRun").value.trim();
  const nombre = document.getElementById("uNombre").value.trim();
  const apellidos = document.getElementById("uApellidos").value.trim();
  const correo = document.getElementById("uCorreo").value.trim();
  const tipo = document.getElementById("uTipo").value;
  const region = document.getElementById("uRegion").value;
  const comuna = document.getElementById("uComuna").value;
  const direccion = document.getElementById("uDireccion").value.trim();

  let valido = true;

  if (run === "") {
    mostrarError("errRun", "El RUN es obligatorio."); valido = false;
  } else if (!runValido(run)) {
    mostrarError("errRun", "El RUN no es valido, escribelo sin puntos ni guion. Ej: 123456785"); valido = false;
  }
  if (nombre === "") { mostrarError("errNombreU", "El nombre es obligatorio."); valido = false; }
  if (apellidos === "") { mostrarError("errApellidos", "Los apellidos son obligatorios."); valido = false; }
  if (correo === "") {
    mostrarError("errCorreoU", "El correo es obligatorio."); valido = false;
  } else if (!correoValido(correo)) {
    mostrarError("errCorreoU", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com."); valido = false;
  }
  if (tipo === "") { mostrarError("errTipo", "Selecciona el tipo de usuario."); valido = false; }
  if (region === "") { mostrarError("errRegion", "Selecciona una region."); valido = false; }
  if (comuna === "") { mostrarError("errComuna", "Selecciona una comuna."); valido = false; }
  if (direccion === "") { mostrarError("errDireccion", "La direccion es obligatoria."); valido = false; }

  if (!valido) return;

  guardar("vp_perfil", {
    run: run, nombre: nombre, apellidos: apellidos, correo: correo,
    tipo: tipo, region: region, comuna: comuna, direccion: direccion
  });
  alert("Los datos se guardaron correctamente.");
}


// ===== vista del cliente =====

// junta los nombres de los duenos sin repetir
function listaDeClientes() {
  const clientes = [];
  for (let i = 0; i < listaMascotas.length; i++) {
    if (clientes.indexOf(listaMascotas[i].duenio) === -1) {
      clientes.push(listaMascotas[i].duenio);
    }
  }
  return clientes;
}

function cambiarCliente() {
  const cliente = document.getElementById("selectCliente").value;
  document.getElementById("nombreCliente").textContent = cliente;

  // mis mascotas
  let html = "";
  for (let i = 0; i < listaMascotas.length; i++) {
    const m = listaMascotas[i];
    if (m.duenio === cliente) {
      html += "<tr><td>" + m.nombre + "</td><td>" + m.especie + "</td><td>" + m.raza + "</td><td>" + m.edad + "</td></tr>";
    }
  }
  if (html === "") html = "<tr><td colspan='4' class='text-center text-muted py-3'>No tienes mascotas registradas.</td></tr>";
  document.getElementById("tablaMisMascotas").innerHTML = html;

  // mis citas
  html = "";
  for (let i = 0; i < listaCitas.length; i++) {
    const c = listaCitas[i];
    if (c.duenio === cliente) {
      html += "<tr><td>" + c.mascota + "</td><td>" + c.fecha + "</td><td>" + c.hora + "</td><td>" + c.motivo + "</td><td>" + c.veterinario + "</td></tr>";
    }
  }
  if (html === "") html = "<tr><td colspan='5' class='text-center text-muted py-3'>No tienes citas agendadas.</td></tr>";
  document.getElementById("tablaMisCitas").innerHTML = html;
}


// ===== arranque =====
// el mismo archivo lo usan todas las vistas, por eso reviso que exista cada cosa

document.addEventListener("DOMContentLoaded", function () {
  cargarDatos();

  if (document.getElementById("totalMascotas")) {
    mostrarInicio();
  }

  if (document.getElementById("tablaMascotas")) {
    mostrarTablaMascotas("");
    llenarSelect("mEspecie", especies);
    document.getElementById("buscador").addEventListener("input", buscarMascota);
    document.getElementById("formMascota").addEventListener("submit", guardarMascota);
  }

  if (document.getElementById("tablaCitas")) {
    llenarMascotasCita();
    llenarSelect("cVeterinario", veterinarios);
    mostrarTablaCitas("Todas");
    document.getElementById("filtroEstado").addEventListener("change", filtrarCitas);
    document.getElementById("formCita").addEventListener("submit", guardarCita);
  }

  if (document.getElementById("tablaMisMascotas")) {
    llenarSelect("selectCliente", listaDeClientes());
    document.getElementById("selectCliente").addEventListener("change", cambiarCliente);
    cambiarCliente();
  }

  if (document.getElementById("formPerfil")) {
    llenarSelect("uRegion", nombresRegiones());
    document.getElementById("formPerfil").addEventListener("submit", guardarPerfil);
    document.getElementById("uRegion").addEventListener("change", cambiarComunas);
  }
});

// nombres de las regiones para el select
function nombresRegiones() {
  const lista = [];
  for (let i = 0; i < regiones.length; i++) {
    lista.push(regiones[i].nombre);
  }
  return lista;
}
