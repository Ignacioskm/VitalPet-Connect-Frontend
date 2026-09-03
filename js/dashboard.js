// dashboard.js
// este archivo lo usan todas las vistas del panel, por eso antes de
// ejecutar algo reviso si el elemento existe en la pagina

// datos con los que trabaja la pagina
let listaMascotas = [];
let listaCitas = [];

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

// casi todos los campos de texto se validan igual (requerido + largo maximo),
// asi que en vez de repetir el mismo if en cada campo lo hago una sola vez aca
function campoTexto(idCampo, idError, mensajeVacio, largoMax) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") {
    return marcarError(idCampo, idError, mensajeVacio);
  }
  if (valor.length > largoMax) {
    return marcarError(idCampo, idError, "Maximo " + largoMax + " caracteres.");
  }
  return marcarOk(idCampo, idError);
}

// lo mismo para los select: solo reviso que se haya elegido algo
function campoSelect(idCampo, idError, mensaje) {
  if (document.getElementById(idCampo).value === "") {
    return marcarError(idCampo, idError, mensaje);
  }
  return marcarOk(idCampo, idError);
}

// y para los correos: requerido, largo y dominio permitido
function campoCorreo(idCampo, idError) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") {
    return marcarError(idCampo, idError, "El correo es obligatorio.");
  }
  if (valor.length > 100) {
    return marcarError(idCampo, idError, "Maximo 100 caracteres.");
  }
  if (!correoValido(valor)) {
    return marcarError(idCampo, idError, "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  }
  return marcarOk(idCampo, idError);
}

// llena un select con las opciones de un arreglo simple
function llenarSelect(idSelect, lista) {
  const select = document.getElementById(idSelect);
  for (let i = 0; i < lista.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = lista[i];
    opcion.textContent = lista[i];
    select.appendChild(opcion);
  }
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

  const citasGuardadas = localStorage.getItem("vp_citas");
  if (citasGuardadas) {
    listaCitas = JSON.parse(citasGuardadas);
  } else {
    listaCitas = citas;
    guardarEnLocal("vp_citas", listaCitas);
  }
}

function colorEstado(estado) {
  if (estado === "Confirmada") return "bg-success";
  if (estado === "Pendiente")  return "bg-warning text-dark";
  if (estado === "Atendida")   return "bg-secondary";
  return "bg-danger";
}

// ---------- vista inicio ----------

function mostrarResumen() {
  let activas = 0;
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].estado === "Activo") {
      activas++;
    }
  }

  let pendientes = 0;
  let confirmadas = 0;
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].estado === "Pendiente")  pendientes++;
    if (listaCitas[i].estado === "Confirmada") confirmadas++;
  }

  document.getElementById("totalMascotas").textContent = listaMascotas.length;
  document.getElementById("mascotasActivas").textContent = activas;
  document.getElementById("citasPendientes").textContent = pendientes;
  document.getElementById("citasConfirmadas").textContent = confirmadas;

  // aviso amarillo si hay muchas citas sin confirmar
  const aviso = document.getElementById("avisoPendientes");
  if (pendientes >= 3) {
    aviso.classList.remove("d-none");
    document.getElementById("textoAviso").textContent =
      "Hay " + pendientes + " citas pendientes por confirmar.";
  }
}

function mostrarProximasCitas() {
  const cuerpo = document.getElementById("tablaProximas");
  let html = "";

  for (let i = 0; i < listaCitas.length; i++) {
    const cita = listaCitas[i];
    if (cita.estado === "Pendiente" || cita.estado === "Confirmada") {
      html += "<tr>" +
        "<td>" + cita.mascota + "</td>" +
        "<td>" + cita.duenio + "</td>" +
        "<td>" + cita.fecha + "</td>" +
        "<td>" + cita.hora + "</td>" +
        "<td>" + cita.veterinario + "</td>" +
        "<td><span class='badge " + colorEstado(cita.estado) + "'>" + cita.estado + "</span></td>" +
        "</tr>";
    }
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
  if (!confirm("Seguro que quieres eliminar esta mascota?")) {
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
  return campoTexto("mNombre", "errNombre", "El nombre es obligatorio.", 50);
}

function validarEspecie() {
  return campoSelect("mEspecie", "errEspecie", "Selecciona una especie.");
}

function validarEdad() {
  const valor = document.getElementById("mEdad").value;
  if (valor === "") {
    return marcarError("mEdad", "errEdad", "La edad es obligatoria.");
  }
  const numero = Number(valor);
  if (isNaN(numero) || numero < 0) {
    return marcarError("mEdad", "errEdad", "Debe ser un numero mayor o igual a 0.");
  }
  if (!Number.isInteger(numero)) {
    return marcarError("mEdad", "errEdad", "Solo se aceptan numeros enteros.");
  }
  if (numero > 30) {
    return marcarError("mEdad", "errEdad", "Revisa la edad, el maximo permitido es 30.");
  }
  return marcarOk("mEdad", "errEdad");
}

function validarDuenio() {
  return campoTexto("mDuenio", "errDuenio", "El nombre del dueno es obligatorio.", 100);
}

function validarCorreoMascota() {
  return campoCorreo("mCorreo", "errCorreo");
}

function guardarMascota(evento) {
  evento.preventDefault(); // sin esto el formulario recarga la pagina

  // llamo a todas primero, asi se marcan todos los errores juntos
  const ok1 = validarNombreMascota();
  const ok2 = validarEspecie();
  const ok3 = validarEdad();
  const ok4 = validarDuenio();
  const ok5 = validarCorreoMascota();

  if (!(ok1 && ok2 && ok3 && ok4 && ok5)) {
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

// ---------- vista citas ----------

function mostrarTablaCitas(estadoFiltro) {
  const cuerpo = document.getElementById("tablaCitas");
  let html = "";
  let encontradas = 0;

  for (let i = 0; i < listaCitas.length; i++) {
    const c = listaCitas[i];

    if (estadoFiltro !== "Todas" && c.estado !== estadoFiltro) {
      continue;
    }

    encontradas++;

    html += "<tr>" +
      "<td>" + c.id + "</td>" +
      "<td>" + c.mascota + "</td>" +
      "<td>" + c.duenio + "</td>" +
      "<td>" + c.fecha + "</td>" +
      "<td>" + c.hora + "</td>" +
      "<td>" + c.motivo + "</td>" +
      "<td>" + c.veterinario + "</td>" +
      "<td><span class='badge " + colorEstado(c.estado) + "'>" + c.estado + "</span></td>" +
      "<td>" + botonesDeEstado(c) + "</td>" +
      "</tr>";
  }

  if (encontradas === 0) {
    html = "<tr><td colspan='9' class='text-center text-muted py-3'>" +
           "No hay citas con ese estado.</td></tr>";
  }

  cuerpo.innerHTML = html;
  document.getElementById("contadorCitas").textContent = encontradas;
}

// muestro solo los botones que tienen sentido segun el estado
function botonesDeEstado(cita) {
  if (cita.estado === "Pendiente") {
    return "<button class='btn btn-sm btn-vp me-1' onclick='cambiarEstadoCita(" + cita.id + ", \"Confirmada\")'>Confirmar</button>" +
           "<button class='btn btn-sm btn-outline-danger' onclick='cambiarEstadoCita(" + cita.id + ", \"Cancelada\")'>Cancelar</button>";
  }
  if (cita.estado === "Confirmada") {
    return "<button class='btn btn-sm btn-outline-secondary' onclick='cambiarEstadoCita(" + cita.id + ", \"Atendida\")'>Marcar atendida</button>";
  }
  return "<span class='text-muted'>Sin acciones</span>";
}

function cambiarEstadoCita(id, nuevoEstado) {
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id === id) {
      listaCitas[i].estado = nuevoEstado;
      break;
    }
  }
  guardarEnLocal("vp_citas", listaCitas);
  filtrarCitas();
}

function filtrarCitas() {
  const estado = document.getElementById("filtroEstado").value;
  mostrarTablaCitas(estado);
}

// validaciones del formulario de cita

function validarMascotaCita() {
  return campoSelect("cMascota", "errMascotaCita", "Selecciona una mascota.");
}

function validarFecha() {
  const valor = document.getElementById("cFecha").value;
  if (valor === "") {
    return marcarError("cFecha", "errFecha", "La fecha es obligatoria.");
  }

  // no dejo agendar para un dia que ya paso
  const hoy = new Date();
  const fechaElegida = new Date(valor + "T00:00:00");
  hoy.setHours(0, 0, 0, 0);

  if (fechaElegida < hoy) {
    return marcarError("cFecha", "errFecha", "No se puede agendar en una fecha anterior a hoy.");
  }
  return marcarOk("cFecha", "errFecha");
}

function validarHora() {
  const valor = document.getElementById("cHora").value;
  if (valor === "") {
    return marcarError("cHora", "errHora", "La hora es obligatoria.");
  }

  // la clinica atiende de 09:00 a 19:00
  if (valor < "09:00" || valor > "19:00") {
    return marcarError("cHora", "errHora", "El horario de atencion es de 09:00 a 19:00.");
  }
  return marcarOk("cHora", "errHora");
}

function validarMotivo() {
  return campoTexto("cMotivo", "errMotivo", "El motivo es obligatorio.", 500);
}

function validarVeterinario() {
  return campoSelect("cVeterinario", "errVeterinario", "Selecciona un veterinario.");
}

function guardarCita(evento) {
  evento.preventDefault();

  const ok1 = validarMascotaCita();
  const ok2 = validarFecha();
  const ok3 = validarHora();
  const ok4 = validarMotivo();
  const ok5 = validarVeterinario();

  if (!(ok1 && ok2 && ok3 && ok4 && ok5)) {
    return;
  }

  const nombreMascota = document.getElementById("cMascota").value;

  // saco el dueno desde la lista de mascotas
  let duenio = "";
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].nombre === nombreMascota) {
      duenio = listaMascotas[i].duenio;
      break;
    }
  }

  let ultimoId = 100;
  for (let i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id > ultimoId) {
      ultimoId = listaCitas[i].id;
    }
  }

  const nuevaCita = {
    id: ultimoId + 1,
    mascota: nombreMascota,
    duenio: duenio,
    fecha: document.getElementById("cFecha").value,
    hora: document.getElementById("cHora").value,
    motivo: document.getElementById("cMotivo").value.trim(),
    veterinario: document.getElementById("cVeterinario").value,
    estado: "Pendiente"
  };

  listaCitas.push(nuevaCita);
  guardarEnLocal("vp_citas", listaCitas);

  limpiarFormulario("formCita");
  document.getElementById("filtroEstado").value = "Todas";
  mostrarTablaCitas("Todas");
  mostrarMensajeOk("Cita agendada correctamente para " + nombreMascota + ".");
}

function llenarSelectsDeCitas() {
  const selectMascota = document.getElementById("cMascota");
  for (let i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].estado === "Activo") {
      const opcion = document.createElement("option");
      opcion.value = listaMascotas[i].nombre;
      opcion.textContent = listaMascotas[i].nombre + " (" + listaMascotas[i].duenio + ")";
      selectMascota.appendChild(opcion);
    }
  }

  llenarSelect("cVeterinario", veterinarios);
}

// ---------- vista configuracion ----------

// valida el RUN calculando el digito verificador (modulo 11)
function runValido(run) {
  run = run.toUpperCase();

  if (run.length < 7 || run.length > 9) {
    return false;
  }

  const cuerpo = run.substring(0, run.length - 1);
  const dv = run.charAt(run.length - 1);

  // el cuerpo tiene que ser solo numeros
  for (let i = 0; i < cuerpo.length; i++) {
    if (cuerpo[i] < "0" || cuerpo[i] > "9") {
      return false;
    }
  }

  // multiplico de derecha a izquierda por 2,3,4,5,6,7 y vuelvo al 2
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + Number(cuerpo[i]) * multiplo;
    multiplo++;
    if (multiplo > 7) {
      multiplo = 2;
    }
  }

  const resto = 11 - (suma % 11);
  let dvEsperado = String(resto);
  if (resto === 11) dvEsperado = "0";
  if (resto === 10) dvEsperado = "K";

  return dv === dvEsperado;
}

function validarRun() {
  const valor = document.getElementById("uRun").value.trim().toUpperCase();
  if (valor === "") {
    return marcarError("uRun", "errRun", "El RUN es obligatorio.");
  }
  if (valor.indexOf(".") !== -1 || valor.indexOf("-") !== -1) {
    return marcarError("uRun", "errRun", "Escribe el RUN sin puntos ni guion. Ej: 123456785");
  }
  if (valor.length < 7 || valor.length > 9) {
    return marcarError("uRun", "errRun", "El RUN debe tener entre 7 y 9 caracteres.");
  }
  if (!runValido(valor)) {
    return marcarError("uRun", "errRun", "El RUN no es valido, revisa el digito verificador.");
  }
  return marcarOk("uRun", "errRun");
}

function validarNombreUsuario() {
  return campoTexto("uNombre", "errNombreU", "El nombre es obligatorio.", 50);
}

function validarApellidos() {
  return campoTexto("uApellidos", "errApellidos", "Los apellidos son obligatorios.", 100);
}

function validarCorreoUsuario() {
  return campoCorreo("uCorreo", "errCorreoU");
}

function validarTipoUsuario() {
  return campoSelect("uTipo", "errTipo", "Selecciona el tipo de usuario.");
}

function validarRegion() {
  return campoSelect("uRegion", "errRegion", "Selecciona una region.");
}

function validarComuna() {
  return campoSelect("uComuna", "errComuna", "Selecciona una comuna.");
}

function validarDireccion() {
  return campoTexto("uDireccion", "errDireccion", "La direccion es obligatoria.", 300);
}

function llenarRegiones() {
  const select = document.getElementById("uRegion");
  for (let i = 0; i < regiones.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = regiones[i].nombre;
    opcion.textContent = regiones[i].nombre;
    select.appendChild(opcion);
  }
}

// al cambiar la region hay que cambiar las comunas
function cambiarComunas() {
  const regionElegida = document.getElementById("uRegion").value;
  const selectComuna = document.getElementById("uComuna");

  // lo dejo vacio y despues le agrego las comunas de esa region
  selectComuna.innerHTML = "<option value=''>Selecciona una comuna</option>";

  for (let i = 0; i < regiones.length; i++) {
    if (regiones[i].nombre === regionElegida) {
      llenarSelect("uComuna", regiones[i].comunas);
      break;
    }
  }

  validarRegion();
}

function guardarPerfil(evento) {
  evento.preventDefault();

  const ok1 = validarRun();
  const ok2 = validarNombreUsuario();
  const ok3 = validarApellidos();
  const ok4 = validarCorreoUsuario();
  const ok5 = validarTipoUsuario();
  const ok6 = validarRegion();
  const ok7 = validarComuna();
  const ok8 = validarDireccion();

  if (!(ok1 && ok2 && ok3 && ok4 && ok5 && ok6 && ok7 && ok8)) {
    return;
  }

  const perfil = {
    run: document.getElementById("uRun").value.trim().toUpperCase(),
    nombre: document.getElementById("uNombre").value.trim(),
    apellidos: document.getElementById("uApellidos").value.trim(),
    correo: document.getElementById("uCorreo").value.trim(),
    nacimiento: document.getElementById("uNacimiento").value,
    tipo: document.getElementById("uTipo").value,
    region: document.getElementById("uRegion").value,
    comuna: document.getElementById("uComuna").value,
    direccion: document.getElementById("uDireccion").value.trim()
  };

  guardarEnLocal("vp_perfil", perfil);
  mostrarMensajeOk("Los datos del perfil se guardaron correctamente.");
}

// si ya habia guardado el perfil antes lo vuelvo a mostrar
function cargarPerfilGuardado() {
  const guardado = localStorage.getItem("vp_perfil");
  if (!guardado) {
    return;
  }

  const perfil = JSON.parse(guardado);
  document.getElementById("uRun").value = perfil.run;
  document.getElementById("uNombre").value = perfil.nombre;
  document.getElementById("uApellidos").value = perfil.apellidos;
  document.getElementById("uCorreo").value = perfil.correo;
  document.getElementById("uNacimiento").value = perfil.nacimiento;
  document.getElementById("uTipo").value = perfil.tipo;
  document.getElementById("uRegion").value = perfil.region;
  cambiarComunas();
  document.getElementById("uComuna").value = perfil.comuna;
  document.getElementById("uDireccion").value = perfil.direccion;
}


// ---------- vista del cliente (dashboard-user.html) ----------

// junta los nombres de los duenos sin repetirlos
function listaDeClientes() {
  const clientes = [];
  for (let i = 0; i < listaMascotas.length; i++) {
    if (clientes.indexOf(listaMascotas[i].duenio) === -1) {
      clientes.push(listaMascotas[i].duenio);
    }
  }
  return clientes;
}

function mostrarMisMascotas(cliente) {
  const cuerpo = document.getElementById("tablaMisMascotas");
  let html = "";
  let encontradas = 0;

  for (let i = 0; i < listaMascotas.length; i++) {
    const m = listaMascotas[i];
    if (m.duenio !== cliente) {
      continue;
    }

    encontradas++;

    let color = "bg-secondary";
    if (m.estado === "Activo") {
      color = "bg-success";
    }

    html += "<tr>" +
      "<td>" + m.nombre + "</td>" +
      "<td>" + m.especie + "</td>" +
      "<td>" + m.raza + "</td>" +
      "<td>" + m.edad + "</td>" +
      "<td><span class='badge " + color + "'>" + m.estado + "</span></td>" +
      "</tr>";
  }

  if (encontradas === 0) {
    html = "<tr><td colspan='5' class='text-center text-muted py-3'>" +
           "No tienes mascotas registradas.</td></tr>";
  }

  cuerpo.innerHTML = html;
}

function mostrarMisCitas(cliente) {
  const cuerpo = document.getElementById("tablaMisCitas");
  let html = "";
  let encontradas = 0;

  for (let i = 0; i < listaCitas.length; i++) {
    const c = listaCitas[i];
    if (c.duenio !== cliente) {
      continue;
    }

    encontradas++;

    html += "<tr>" +
      "<td>" + c.mascota + "</td>" +
      "<td>" + c.fecha + "</td>" +
      "<td>" + c.hora + "</td>" +
      "<td>" + c.motivo + "</td>" +
      "<td>" + c.veterinario + "</td>" +
      "<td><span class='badge " + colorEstado(c.estado) + "'>" + c.estado + "</span></td>" +
      "</tr>";
  }

  if (encontradas === 0) {
    html = "<tr><td colspan='6' class='text-center text-muted py-3'>" +
           "No tienes citas agendadas.</td></tr>";
  }

  cuerpo.innerHTML = html;
}

// redibuja las dos tablas con el cliente elegido en el select
function cambiarCliente() {
  const cliente = document.getElementById("selectCliente").value;
  document.getElementById("nombreCliente").textContent = cliente;
  mostrarMisMascotas(cliente);
  mostrarMisCitas(cliente);
}


// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", function () {
  cargarDatos();

  // inicio
  if (document.getElementById("totalMascotas")) {
    mostrarResumen();
    mostrarProximasCitas();
  }

  // mascotas
  if (document.getElementById("tablaMascotas")) {
    mostrarTablaMascotas("");

    // las especies salen del arreglo de mock-data.js
    llenarSelect("mEspecie", especies);

    document.getElementById("buscador").addEventListener("input", buscarMascota);
    document.getElementById("formMascota").addEventListener("submit", guardarMascota);

    // validacion en tiempo real
    document.getElementById("mNombre").addEventListener("input", validarNombreMascota);
    document.getElementById("mEspecie").addEventListener("change", validarEspecie);
    document.getElementById("mEdad").addEventListener("input", validarEdad);
    document.getElementById("mDuenio").addEventListener("input", validarDuenio);
    document.getElementById("mCorreo").addEventListener("input", validarCorreoMascota);
  }

  // citas
  if (document.getElementById("tablaCitas")) {
    llenarSelectsDeCitas();
    mostrarTablaCitas("Todas");

    document.getElementById("filtroEstado").addEventListener("change", filtrarCitas);
    document.getElementById("formCita").addEventListener("submit", guardarCita);

    document.getElementById("cMascota").addEventListener("change", validarMascotaCita);
    document.getElementById("cFecha").addEventListener("change", validarFecha);
    document.getElementById("cHora").addEventListener("change", validarHora);
    document.getElementById("cMotivo").addEventListener("input", validarMotivo);
    document.getElementById("cVeterinario").addEventListener("change", validarVeterinario);

    document.getElementById("cMotivo").addEventListener("input", function () {
      const largo = document.getElementById("cMotivo").value.length;
      document.getElementById("contadorMotivo").textContent = largo + " / 500";
    });
  }

  // vista del cliente
  if (document.getElementById("tablaMisMascotas")) {
    llenarSelect("selectCliente", listaDeClientes());
    document.getElementById("selectCliente").addEventListener("change", cambiarCliente);
    cambiarCliente();
  }

  // configuracion
  if (document.getElementById("formPerfil")) {
    llenarRegiones();
    cargarPerfilGuardado();

    document.getElementById("formPerfil").addEventListener("submit", guardarPerfil);
    document.getElementById("uRegion").addEventListener("change", cambiarComunas);

    document.getElementById("uRun").addEventListener("input", validarRun);
    document.getElementById("uNombre").addEventListener("input", validarNombreUsuario);
    document.getElementById("uApellidos").addEventListener("input", validarApellidos);
    document.getElementById("uCorreo").addEventListener("input", validarCorreoUsuario);
    document.getElementById("uTipo").addEventListener("change", validarTipoUsuario);
    document.getElementById("uComuna").addEventListener("change", validarComuna);
    document.getElementById("uDireccion").addEventListener("input", validarDireccion);
  }
});
