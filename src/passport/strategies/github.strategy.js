import passport from 'passport';
import passportGithub from 'passport-github2'
import UserModel from '../../dao/models/userModel.js';

const GithubStrategy = passportGithub.Strategy;
const inicialiceGithubStrategy = () => {
	passport.use('github', new GithubStrategy(
		{
			clientID: 'Iv1.e8e4441afe802db3',
			clientSecret: 'fc60ba8610e817271bdf0f21eeda64816f9a6463',
			callbackURL: 'http://localhost:8080/api/sesion/githubcb'
		},
		async(accessToken, refreshToken, profile, done) => {
			try {	
				const username = profile.username;
				const email = profile._json.email;
				if(username || email){
					const searchOptions = email ? {email} : {username};
					searchOptions.social = 'github';
					const user = await UserModel.findOne(searchOptions).lean().exec();
					//podria pensar en actualizar el perfil...
					if(user) return done(null, user);
					const userData = {
						first_name: profile._json.name || '',
						last_name: '',
						social: 'github',
						username: username || '',
						email: email || '',
						password: '',
					}
					const createdUser = await UserModel.create(userData);
					return done(null, createdUser);
				}
				//no puedo registrar sin username ni email
				return done(null, false)
			} catch (error) {
				return done({error: 'Error en Login Github Strategy'});
			}
		}
	));
};

export default inicialiceGithubStrategy;