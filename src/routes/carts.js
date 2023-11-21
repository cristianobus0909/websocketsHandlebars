import express from 'express'
import bodyParser from 'body-parser';
import cartManager from '../classes/cartManager.js';

const routerCarts = express.Router();

routerCarts.use(bodyParser.json());


routerCarts.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(200).json({ newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

routerCarts.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    const cartProducts = cartManager.readCarts(cartId);
    res.json(cartProducts);
});


routerCarts.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const result = cartManager.addProductToCart(cartId, productId, quantity);

    if (result) {
    res.json({ message: "Producto agregado al carrito" });
    } else {
    res.status(404).json({ error: "Carrito no encontrado" });
    }
});
export default routerCarts;
