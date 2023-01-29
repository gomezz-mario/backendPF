import { Router } from 'express';
import productsModel from '../dao/models/productsModel.js';
import cartsModel from '../dao/models/cartsModel.js';

const router = Router();

router.get('/products', async (request, response) => {
	//if(!request.session.user) return response.redirect('/views/iniciarsesion');

	const url = `http://localhost:8080/api/products/?limit=${request.query.limit||10}&page=${request.page||1}
		${request.query.filter ? `&filter=${request.query.filter}` : ''}
		${request.query.sort ? `&sort=${request.query.sort}` : ''}
	`;
	//falta try catch
	const result = await(await fetch(url, {
     	method: 'GET',
      	headers: {
        	accept: 'application/json',
      	},
    })).json();
	response.render('home', {data: result});
});

router.get('/ok', (request, response) => {
	//console.log("HAGAN ALGOO")
	response.render('ok')}
);
router.get('/carts/:cid', async (request, response) => {
	const { cid } = request.params;
	try {
		const cart = await cartsModel.find({"_id" : cid});
		response.render('cart', cart);
	} catch (error) {
		const data = {
			status: 'error',
			message: 'Ha ocurrido un error en la consulta a base de datos.'
		};
		console.log('Ha ocurrido un error en la consulta a la base de datos. Error: ', error);
		response.render('error', data);
	}
});

router.get('/products/details/:pid', async (request, response) => {
	const { pid } = request.params;
	try {
		const url = `http://localhost:8080/api/products/${pid}`;
		const product = await(await fetch(url, {
			method: 'GET',
			 headers: {
			   accept: 'application/json',
			 },
	   	})).json();
		response.render('product_detail', {product});
	} catch (error) {
		const data = {
			status: 'error',
			message: 'Ha ocurrido en la consulta a /api/products.'
		};
		console.log('Ha ocurrido en la consulta a /api/products. Error: ', error);
		response.render('error', data);
	}
});

router.get('/iniciarsesion', (request, response) => {
	response.render('sessions/login_and_register');
});


router.get('/error', (request, response) => {
	const error = request.body.error;
	response.render('errors', {error});
})

export default router;