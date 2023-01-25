import { Router } from 'express';
import userModel from '../dao/models/userModel.js';

const router = Router();


//API PARA REGISTRAR USUARIO
router.post('/register', async (request, response) => {
	const newUser = request.body;
	const user = new userModel(newUser);
	await user.save();
	response.redirect('/views/login');
});

router.post('/login', async(request, response) => {
	console.log('data form: ',request.body)
	const { username, password } = request.body;

	const user = await userModel.findOne({username, password}).lean().exec();
	console.log('user db: ', user);

	if(!user){
		//error de autenticación
		response.render('');
	}
	console.log('Usuario logueado: ', user);
	request.session.user = user;
	response.redirect('/views/products')
});

router.get('/logout', (request, response) => {
	request.session.destroy(err => {
		if(!err) response.redirect('../views/products')
		else response.send('error en logout')
	})
});

export default router;