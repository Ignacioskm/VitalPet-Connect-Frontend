// datos de prueba del panel
// cuando conectemos los microservicios esto se reemplaza por la respuesta de la API

const mascotas = [
  { id: 1, nombre: "Rocky", especie: "Perro", raza: "Labrador", edad: 4, duenio: "Camila Rojas", correo: "camila.rojas@gmail.com", estado: "Activo" },
  { id: 2, nombre: "Michi", especie: "Gato", raza: "Siames", edad: 2, duenio: "Diego Fuentes", correo: "d.fuentes@duoc.cl", estado: "Activo" },
  { id: 3, nombre: "Luna", especie: "Perro", raza: "Quiltro", edad: 7, duenio: "Ignacio Munoz", correo: "ig.munoz@duoc.cl", estado: "Activo" },
  { id: 4, nombre: "Kiwi", especie: "Ave", raza: "Catita", edad: 1, duenio: "Valentina Soto", correo: "vale.soto@gmail.com", estado: "Inactivo" },
  { id: 5, nombre: "Toby", especie: "Perro", raza: "Beagle", edad: 3, duenio: "Matias Perez", correo: "m.perez@duoc.cl", estado: "Activo" },
  { id: 6, nombre: "Nala", especie: "Gato", raza: "Mestizo", edad: 5, duenio: "Fernanda Lira", correo: "fer.lira@gmail.com", estado: "Activo" },
  { id: 7, nombre: "Copito", especie: "Conejo", raza: "Cabeza de leon", edad: 2, duenio: "Sebastian Vera", correo: "s.vera@profesor.duoc.cl", estado: "Activo" }
];

const citas = [
  { id: 101, mascota: "Rocky", duenio: "Camila Rojas", fecha: "2026-09-01", hora: "09:30", motivo: "Vacuna antirrabica", veterinario: "Dra. Paula Nunez", estado: "Pendiente" },
  { id: 102, mascota: "Michi", duenio: "Diego Fuentes", fecha: "2026-09-01", hora: "11:00", motivo: "Control de peso", veterinario: "Dr. Luis Carrasco", estado: "Confirmada" },
  { id: 103, mascota: "Luna", duenio: "Ignacio Munoz", fecha: "2026-09-02", hora: "16:15", motivo: "Revision de la pata trasera", veterinario: "Dra. Paula Nunez", estado: "Pendiente" },
  { id: 104, mascota: "Toby", duenio: "Matias Perez", fecha: "2026-08-28", hora: "10:00", motivo: "Desparasitacion", veterinario: "Dr. Luis Carrasco", estado: "Atendida" },
  { id: 105, mascota: "Nala", duenio: "Fernanda Lira", fecha: "2026-08-27", hora: "12:45", motivo: "Corte de unas", veterinario: "Dra. Paula Nunez", estado: "Cancelada" },
  { id: 106, mascota: "Copito", duenio: "Sebastian Vera", fecha: "2026-09-03", hora: "15:00", motivo: "Chequeo general", veterinario: "Dr. Luis Carrasco", estado: "Pendiente" }
];

const veterinarios = ["Dra. Paula Nunez", "Dr. Luis Carrasco", "Dra. Antonia Bravo"];

const especies = ["Perro", "Gato", "Ave", "Conejo", "Otro"];

// cada region con sus comunas, lo usa el select de configuracion
const regiones = [
  { nombre: "Region Metropolitana", comunas: ["Santiago", "Puente Alto", "Maipu", "La Florida", "Nunoa"] },
  { nombre: "Valparaiso", comunas: ["Valparaiso", "Vina del Mar", "Quilpue", "San Antonio"] },
  { nombre: "Biobio", comunas: ["Concepcion", "Talcahuano", "Los Angeles", "Chiguayante"] },
  { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"] },
  { nombre: "La Araucania", comunas: ["Temuco", "Villarrica", "Angol", "Pucon"] }
];

// correos que acepta el sistema
const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com","@duocuc.cl"];

const horasDisponibles = [
    "Lunes 12 Oct - 09:00 AM",
    "Lunes 12 Oct - 11:30 AM",
    "Martes 13 Oct - 03:00 PM",
    "Miércoles 14 Oct - 10:00 AM"
];
