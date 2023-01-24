import mongoose from 'mongoose';
import dotenv from 'dotenv';

export default () => {
	dotenv.config();
	const url = process.env.MONGODB_URI;
	mongoose.set("strictQuery", false);
	return mongoose.connect(url, {dbName: 'eccomerce'});
}