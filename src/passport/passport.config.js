import passport from "passport";
import inicializeLocalStrategies from "./strategies/local.strategies.js";
import inicialiceGithubStrategy from "./strategies/github.strategy.js";
import inicializeGoogleStrategy from "./strategies/google.strategy.js";
import UserModel from "../dao/models/userModel.js";

const initializePassport = () => {

	inicializeLocalStrategies();
	inicialiceGithubStrategy();
	inicializeGoogleStrategy();

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	//falla porque cuando busco un user de google o de github.. estos se guardan en otra coleccion...
	passport.deserializeUser( async(id, done) => {
		const user = await UserModel.findById(id);
		done(null, user);
	});
}

export default initializePassport;