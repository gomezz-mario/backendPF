import { Router } from 'express';
import cartsModel from '../dao/models/cartsModel.js';

const router = Router();

router.get('/:cid', async(request, response) => {
	const cid = request.params.cid;
	try {
		const cart = await cartsModel.find({"_id" : cid});
		response.status(200).json(cart);
	} catch (error) {
		response.status(400).send('Ha ocurrido un error. El id no es válido.');
	}
});

router.post('/', async(request, response) => {
	try {
		const newCart = await cartsModel.create({});
		response.status(200).json(newCart);
	} catch (error) {
		response.status(400).send('Ha ocurrido un error al crear un nuevo carrito.');
	}
});

router.put('/:cid', async(request, response) => {	
	const cid = request.params.cid;
	const { products } = request.body;
	try {
		const a = await cartsModel.updateOne({"_id" : cid}, {$set: { products }});
		response.status(200).send('Carrito actualizado.')
	} catch (error) {
		response.status(400).send('Ha ocurrido un error');
	}
});

router.put('/:cid/products/:pid', async(request, response) => {
	const { cid, pid } = request.params;
	const quantity = request.body.quantity;
	try {
		const isProductOnCart = await cartsModel.findOne({$and : [{"_id" : cid}, {"products._id" : pid}]});
		if(isProductOnCart){
			await cartsModel.updateOne({"_id":cid }, {$set:{ "products.$[product].quantity": quantity}}, {arrayFilters: [{ "product._id": pid}]});
		} else{
			await cartsModel.updateOne({"_id":cid }, {$push:{ "products" : {"_id": pid, quantity}}});
		}
		response.status(200).send('Carrito actualizado.');	
	} catch (error) {
		response.status(400).send('Ha ocurrido un error');
	}
});

router.delete('/:cid', async (request, response) => {
	const cid = request.params.cid;
	try {
		await cartsModel.deleteOne({_id : cid});
		response.status(200).send('Carrito eliminado.');
	} catch (error) {
		response.status(400).send('Ha ocurrido un error.');
	}
});

export default router;