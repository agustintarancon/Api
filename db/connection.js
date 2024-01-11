//Importamos moongose
const mongoose = require('mongoose');

//Funcion para realizar la conexion a la base de datos 
const connection = async () => {
  try {
    const conectionString = process.env.CONECTION_STRING; //Importamos el string desde el .env 
    await mongoose.connect(conectionString);
    console.log('Conexion exitosa');
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  connection,
}