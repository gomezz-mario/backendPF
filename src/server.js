import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import __dirname from './utils.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import usersRouter from './routes/users.routes.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const server = http.createServer(app);
//dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.use(session({
	store: MongoStore.create({
		mongoUrl: 'mongodb+srv://mario-eccomerce:U6cCAFfyksM66VkU@cluster0.qz30hpp.mongodb.net/?retryWrites=true&w=majority',
		dbName: 'Sesions',
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true	
		},
		ttl: 30
	}),
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/users', usersRouter);
app.use('/views', viewsRouter);

export default server;