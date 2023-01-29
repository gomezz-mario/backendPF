import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../dao/models/userModel.js';
import { createHash, isValidPassword } from '../../utils.js';

const LocalStrategy = passportLocal.Strategy;

const inicializeLocalStrategies = () => {
	passport.use('login', new LocalStrategy(
		{ usernameField: 'email'},
		async(username, password, done) => {
			try {
				const user = await UserModel.findOne({email: username, social: 'local'}).lean().exec();
				if(!user) return done(null, false);
				if(!isValidPassword(user, password)) return done(null, false);
				return done(null, user);	
			} catch (error) {
				return({error: 'Error en login local strategy'});	
			}
		}
	));
	passport.use('signup', new LocalStrategy({passReqToCallback: true,usernameField: 'email'},
		async(request, username, password, done) => {
			try {
				const user = await UserModel.findOne({email: username, social: 'local'}).lean().exec();
				if(user) return done(null, false);
				const userData = {
					first_name: request.body.first_name || '',
					last_name: request.body.last_name || '',
					username: request.body.username || '',
					email: username,
					password: createHash(password),
					social: 'local',
				}
				const createdUser = await UserModel.create(userData);
				return done(null, createdUser);
			} catch (error) {
				return done({error: 'Error en Signup Local Strategy'})
			}
		}
	));
};

export default inicializeLocalStrategies;