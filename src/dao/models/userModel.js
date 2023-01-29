import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  social: String,
  username: String,
  email: String,
  password: String,
});

//Como cuando registro usuarios dependiendo la red social dejo en blanco el email o el username... no puedo ponerles la opcion unique...
//Voy a tener que validar que no se repitan con codigo

export default mongoose.model('users', userSchema);