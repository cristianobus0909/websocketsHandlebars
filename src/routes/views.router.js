import express from "express";
import productManager from "../classes/ProductManager.js";
import bodyParser from 'body-parser';
import { io } from "../app.js";
// import multer from "multer";


const router = express.Router();
router.use(bodyParser.json());


router.get('/', (req, res)=>{
    const products = productManager.getProducts()
    res.render('home',{products})
})

router.get('/chat', (req, res)=>{
    res.render('chat',{})
})

router.get('/realtimeproducts', (req, res)=>{
    const products = productManager.getProducts()
    res.render('realTimeProducts',{products})
})
router.post('/realtimeproducts', async(req, res)=>{
    const {
        title,
        description,
        price,
        category,
        thumbnails,
        code,
        stock
    } = req.body;
    
    const status = true
    try {
        const newProduct =  await productManager.addProduct(title, description, price, category, status, thumbnails, code, stock);
        console.log(newProduct);
        io.emit('productAdded', { product: newProduct });
        
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
    res.redirect('/realtimeproducts');
})
router.delete('/realtimeproducts', async(req, res)=>{
    const productId = req.body.id
    
    try {
        await productManager.deleteProduct(productId)
        
        io.emit('productDeleted', { message: `Producto  con ID: ${productId} eliminado` });
        res.status(200).send("Producto eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el producto:", error)
        res.status(500).send("Error interno del servidor al eliminar el producto");
    }
    res.redirect('/realtimeproducts');
    
})


export default router;
