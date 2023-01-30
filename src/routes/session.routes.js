import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/login-local', passport.authenticate('login', {failureRedirect: '/views/error'}), async(request, response) => {
	if(request.user){
		request.session.user = request.user;
		response.status(200).send('Login Ok');
	}
});
router.post('/signup-local', passport.authenticate('signup', {failureRedirect: '/views/error', successRedirect: '/views/ok'}), async(request, response) => {
	request.session.user = request.user;
	console.log('usuario registrado');
	response.status(200).send('Signup Ok');
});

router.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if(!err) return res.send('Logout Ok');
		res.send({status: 'error', body: err});
	});
})

router.get('/login-github', passport.authenticate('github', {scope: ['user:email']}, (request, response) => {}));
router.get('/login-google', passport.authenticate('google', {scope: ['email', 'profile']}, (request, response) => {}));


router.get('/githubcb', passport.authenticate('github', {failureRedirect: '/views/error'}), (request, response) => {
	request.session.user = request.user;
	response.redirect('/views/products');
});
router.get('/googlecb', passport.authenticate('google', {failureRedirect: '/views/error'}), (request, response) => {
	request.session.user = request.user;
	response.redirect('/views/products');
});

export default router;