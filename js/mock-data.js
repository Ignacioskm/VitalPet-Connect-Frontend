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

const especies = ["Perro", "Gato", "Ave", "Conejo", "Otro"];

// correos que acepta el sistema
const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
