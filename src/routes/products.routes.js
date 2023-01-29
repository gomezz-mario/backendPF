import { Router } from "express";
import productsModel from "../dao/models/productsModel.js";

const router = Router();

router.get('/', async(request, response) => {
 
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

  const {docs: payload, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, totalDocs} = await productsModel.paginate(filter, options);
  
  if(page <= totalPages){
    response.status(200).json({
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
    })
  } else{
    response.status(400).json({
      status: 'error',
      messageError: 'error de paginación'
    })
  }
}); 
 
router.get('/:pid', async(request, response) => {
  const pid = request.params.pid;
  const product = await productsModel.findById(pid).lean().exec();
  response.json(product);
});



router.post('/', async(request, response) => {});
router.put('/', async(request, response) => {});
router.delete('/', async(request, response) => {});

export default router;