import passport from 'passport';
import passportGoogle from 'passport-google-oauth2';
import UserModel from '../../dao/models/userModel.js';

const GoogleStrategy = passportGoogle.Strategy;

const inicializeGoogleStrategy = () => {
	passport.use('google', new GoogleStrategy(
		{
			clientID: '490307388502-2tu6c975jtnt8k4cflt9oa3csd0t96l0.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'http://localhost:8080/api/sesion/googlecb',
			passReqToCallback: true
		},
		async(request, accessToken, refreshToken, profile, done) => {
			try {
				if(!profile.email) return done(null, false);
				const user = await UserModel.findOne({email: profile.email, social: 'google'}).lean().exec();
				//si existe podria actualizar mi base de datos...
				if(user) return done(null, user);
				const userData = {
					first_name: profile.given_name || '',
  					last_name: profile.family_name || '',
  					social: 'google',
  					username: '',
  					email: profile.email,
  					password: '',
				}
				const createdUser = await UserModel.create(userData);
				return done(null, createdUser);
			} catch (error) {
				return done({error: 'Error en Login Google Strategy'});
			}
		}
	));
};

export default inicializeGoogleStrategy;