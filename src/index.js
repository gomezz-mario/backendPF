import server from "./server.js";
import connectToDb from "./connect.js";
import dotenv from 'dotenv';
//import { Server as SocketServer } from 'socket.io';
//import sockets from './sockets.js';

dotenv.config();
const port = process.env.PORT || 4000;

connectToDb()
	.then(() => {
		console.log('Conexión a Mongo Atlas: Ok');
		const httpServer = server.listen(port);
		console.log('Servidor escuchando.');
		//sockets(new SocketServer(httpServer));
		//console.log('Sockets escuchando.');
	})
	.catch(error => {
		console.log('Ha fallado la conexión a Mongo Atlas. ', error);
	});


