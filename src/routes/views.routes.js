import { Router } from 'express';
import productsModel from '../dao/models/productsModel.js';
import cartsModel from '../dao/models/cartsModel.js';

const router = Router();

router.get('/products', async (request, response) => {

	const options = {};
  	options.limit = Number(request.query.limit)  || 10;
  	options.page = Number(request.query.page) || 1;
  
  	const metodoDeOrdenamiento = request.query.sort && request.query.sort === 'precio-ascendente' || request.query.sort === 'precio-ascendente' ? request.query.sort : null;
  	if(metodoDeOrdenamiento){
    	if(metodoDeOrdenamiento === 'precio-ascendente'){
      		options.sort = { price: 1 };
    	}
    	if(metodoDeOrdenamiento === 'precio-descendente'){
      		options.sort = { price: -1 };
    	}
  	}
  
  	let filter = {};
  	const metodoDeFiltrado = request.query.filter && request.query.filter === 'disponible' ? request.query.filter : null;
  	if(metodoDeFiltrado){  
    	if(metodoDeFiltrado === 'disponible'){
      		filter = { status: true };
    	}
  	}

	try {
		const {docs: payload, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, totalDocs} = await productsModel.paginate(filter, options);
		if(page <= totalPages){
			const data = {
				status: 'success',
				  totalDocs,
				  payload,
				  totalPages,
				  prevPage,
				  nextPage,
				  page,
				  hasPrevPage,
				  hasNextPage,
				  prevLink: hasPrevPage ? `/api/products/?page=${prevPage}&limit=${options.limit}${metodoDeFiltrado ? `&filter=${metodoDeFiltrado}`: ''}${metodoDeOrdenamiento ? `&sort=${metodoDeOrdenamiento}`:''}`: null,
				  nextLink: hasNextPage ? `/api/products/?page=${nextPage}&limit=${options.limit}${metodoDeFiltrado ? `&filter=${metodoDeFiltrado}`: ''}${metodoDeOrdenamiento ? `&sort=${metodoDeOrdenamiento}`:''}`: null,
			}
			//console.log('data: ', data);
			response.render('home', data);
		} else{
			const data = {
				status: 'error',
				message: 'Página no encontrada.'
			};
			response.render('error', data)
		}	
	} catch (error) {
		const data = {
			status: 'error',
			message: 'Ha ocurrido un error en la consulta a base de datos.'
		}
		console.log('Ha ocurrido un error en la consulta a la base de datos. Error: ', error);
		response.render('error', data);
	}
});

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
		const product = await productsModel.findOne({"_id" : pid});
		response.render('product_detail', product);
	} catch (error) {
		const data = {
			status: 'error',
			message: 'Ha ocurrido un error en la consulta a base de datos.'
		};
		console.log('Ha ocurrido un error en la consulta a la base de datos. Error: ', error);
		response.render('error', data);
	}
});

router.get('/login', (request, response) => {
	response.render('sessions/login');
});
router.get('/register', (request, response) => {
	response.render('sessions/register');
});

export default router;