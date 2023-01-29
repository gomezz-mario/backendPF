import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/login-github', passport.authenticate(
	'github', 
	{scope: ['user:email']}), 
	async(request, response) => {}
);

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/users/failedlogin'}, async(request, response) => {
	//request.session.user = request.user;
	response.send('Login success');
}))

router.post('/login', passport.authenticate('login',{failureRedirect: '/users/failedlogin'}), async(request, response) => {
	if(!request.user) response.status(400).send('Eror login');
	request.session.user = request.user;
	response.status(200).send('Login success');
});

router.post('/signup', passport.authenticate('register', {failureRedirect: '/users/failedregister'}) ,async(request, response) => {
	response.status(200).send('Usuario registrado'); 
});

router.get('/failedregister', (request, response) => {
	response.send({error: 'Fallo de registro'});
});

router.get('/failedlogin', (request, response) => {
	response.send({error: 'Fallo de login'});
});

router.get('/logout', (request, response) => {
	request.session.destroy(err => {
		if(!err) response.redirect('/views/ok')
		else response.send('error en logout')
	})
});

export default router;