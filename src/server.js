import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import __dirname from './utils.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/views", viewsRouter);

export default server;