import passport from 'passport';
import passportLocal from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import userModel from '../dao/models/userModel.js';
import GithubStrategy from 'passport-github2';

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
	
	//STRATEGY GITHUB
	passport.use('github', new GithubStrategy(
		{
			clientID: 'Iv1.e8e4441afe802db3',
			clientSecret: 'fc60ba8610e817271bdf0f21eeda64816f9a6463',
			callbackURL: 'http://localhost:8080/users/githubcallback'
		},
		async(accessToken, refreshToken, profile, done) => {
			console.log(profile);
			try {
				const user = await userModel.findOne({email: profile._json.email});
				if(user){
					console.log("El usuario existe");
					return done(null, user);
				}

				const newUser = {
					name: profile._json.name,
					email: profile._json.email,
					password: ''
				};

				const userCreated = await userModel.create(newUser);
				return done(null, userCreated);
			} catch (error) {
				return done('Error iniciar sesion github: ' + error);
			}
		}
	));


	//STRATEGY LOCAL
	passport.use('login', new LocalStrategy(
		{usernameField: 'email'},
		async(username, password, done) => {
			try {
				const user = await userModel.findOne({email: username}).lean().exec();
				if(!user){
					console.log('El usuario no existe');
					return done(null, false);
				}
				if(!isValidPassword(user, password)) return done(null, false);
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	));
	
	
	passport.use('register', new LocalStrategy({
		passReqToCallback: true,
		usernameField: 'email'
	},
		async(request, username, password, done) => {
			try {
				const user = await userModel.findOne({email: username});
				if(user){
					return done(null, false);
				}
				const newUser = {
					email: username,
					password: createHash(password)
				}
				const result = await userModel.create(newUser);
				return done(null, result);
			} catch (error) {
				return done(error)
			}
		}
	));

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser( async(id, done) => {
		const user = await userModel.findById(id);
		done(null, user);
	});
};


export default initializePassport;