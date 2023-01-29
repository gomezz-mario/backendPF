import server from "./server.js";
import connectToDb from "./connect.js";
import dotenv from 'dotenv';
//import { Server as SocketServer } from 'socket.io';
//import sockets from './sockets.js';

dotenv.config();
const port = process.env.PORT || 8080;

connectToDb()
	.then(() => {
		//console.log('Conexión a Mongo Atlas: Ok');
		const httpServer = server.listen(port);
		//console.log('Servidor escuchando.');
		//sockets(new SocketServer(httpServer));
		//console.log('Sockets escuchando.');
	})
	.catch(error => {
		console.log('Ha fallado la conexión a Mongo Atlas. ', error);
	});


/*
npm i express-sesions

import sesions from 'express-sesions'

app.use(sesions({
	secret: 'llave',
	resave: true,
	saveUninitialized: true
}));

function auth(req, res, next){
	if(req.session?.user === 'igna' && req.session?.admin){
		return next()
	}
	return res.status(401).send('Error de autenticacion");
}

app.get('/login', (req, res) => {
	const {username, password} = req.query;
	--> validacion de campos.
	req.session.user = username;
	req.session.admin = true;
	res.send('loggin')
})

app.get('/private', auth, (req, res) => {
	esta ruta es privada.. solo para admins...
	la funcion auth es un mediador..
	si verifica el usuario y es admin.. retorna next...
	este caso lo que sigue..
	sino.. la funcion auth retorn una error de auth 401
})

app.get('/logout', (req, res) => {
	req.session.destroy( err => {
		if(!err) res.send('ok')
		else res.send({status: 'error logout', body: err});
	})
})


*/