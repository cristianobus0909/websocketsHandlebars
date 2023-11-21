
import fs from 'fs'


class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.autoIncrementId = 1;
    }

    addProduct(title, description, price, category, status = true, thumbnails, code, stock) {
        if (!title || !description || !price || !category || !thumbnails || !code || stock === undefined ) {
            console.log("Todos los campos son obligatorios.");
            return;
        }
        if(this.products.some((product)=>product.code === code)){
            console.log(`El producto con el codigo:${code}, ya exixte.`);
            return;
        }
    
        let newProduct;
    
        const existingProduct = this.products.find((product) => product.code === code);
    
        if (existingProduct) {
            existingProduct.quantity++;
            console.log(`El producto con el código ${code} ahora tiene ${existingProduct.quantity} unidades.`);
        } else {
            newProduct = {
                id: this.autoIncrementId++,
                title,
                description,
                price,
                category,
                status,
                thumbnails,
                code,
                stock,
                quantity: 1 
            };
            this.products.push(newProduct);
        }
    
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            const productsFromFile = JSON.parse(data);
            if (existingProduct) {
                const existingProductIndex = productsFromFile.findIndex((product) => product.code === code);
                productsFromFile[existingProductIndex] = existingProduct;
            } else {
                productsFromFile.push(newProduct);
            }
            fs.writeFileSync(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8');
            return newProduct;
        } catch (error) {
            console.error("Error al leer o escribir en el archivo:", error);
        }
    
    }
    
    
    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            const productsFromFile = JSON.parse(data);
            return productsFromFile;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }  
    getProductById(id) {
        
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            const productsFromFile = JSON.parse(data);

            const product = productsFromFile.find((product) => product.id === id);
            if (!product) {
            console.log(`Producto con id:${id} no encontrado.`);
            }
            return product;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return null;
        }
    }
    updateProduct(productId, updatedFields) {
        
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            let productsFromFile = JSON.parse(data);
            
            const productIndex = productsFromFile ? productsFromFile.findIndex((product) => product.id === productId) : -1;
            if (productIndex === -1) {
                console.log("Producto no encontrado.");
                return;
            }
            updatedFields.id = productId;

            productsFromFile[productIndex] = {
                ...productsFromFile[productIndex],
                ...updatedFields,
            };
            
            fs.writeFileSync(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8');
        } catch (error) {
            console.error("Error al leer o escribir en el archivo:", error);
        }
    }
    deleteProduct(id) {
        
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            let productsFromFile = JSON.parse(data);
            
            const productIndex = productsFromFile.findIndex((product) => product.id === id);
            if (productIndex === -1) {
            console.log("Producto no encontrado.");
            return;
            }
            
            productsFromFile.splice(productIndex, 1);
            
            fs.writeFileSync(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8');
        } catch (error) {
            console.error("Error al leer o escribir en el archivo:", error);
        }
    }
}

const productManager = new ProductManager('../products.json');

export default productManager;

