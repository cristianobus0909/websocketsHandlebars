import productManager from '../classes/ProductManager.js';
import express from "express";
import bodyParser from 'body-parser';


const routerProducts = express.Router();

routerProducts.use(bodyParser.json());


routerProducts.get('/', (req, res) => {
    try{
        const products = productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if(limit) {
            const limitedProducts = products.slice(0, limit);
            return res.status(200).send(limitedProducts)
        }else{
            return res.status(200).send({products})
        }
    }catch{
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
    
    res.json(products);
});

routerProducts.get('/:pid',(req, res)=>{
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        
        res.status(404).json({ error: 'Producto no encontrado' });
    }
})

routerProducts.post('/', (req, res) => {
    const {
        title,
        description,
        price,
        category,
        status,
        thumbnails,
        code,
        stock
    } = req.body;

    if (!title || !description || !price || !category  || !thumbnails || !code || stock === undefined ) {
        res.status(400).json({ error: 'Todos los campos son requeridos' });
    }else {
        productManager.addProduct(title, description, price, category, status, thumbnails, code, stock);
    }
    
    res.status(201).json({ message: 'Producto agregado con éxito' });
    
});
routerProducts.put('/:pid',(req, res)=>{
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);

    res.status(200).json({ message: 'Producto actualizado con éxito' });
});
routerProducts.delete('/:pid',(req, res)=>{
    const productId = parseInt(req.params.pid);
    productManager.deleteProduct(productId);

    res.status(200).json({ message: 'Producto eliminado con éxito' });
});


export default routerProducts;
