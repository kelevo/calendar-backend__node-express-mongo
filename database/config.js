const mongoose = require('mongoose');

const dbConnection = async () => {

  try {

    console.log('Conexion => ', process.env.MONGO_CONNECTION);
    await mongoose.connect(process.env.MONGO_CONNECTION, { dbName: "mern_calendar" });

    console.log('DB Online');

  } catch (error) {
    console.log(error);
    throw new Error('Error al incializar BD')
  }

}

module.exports = {
  dbConnection
}