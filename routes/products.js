const express = require("express");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");
const { v4: uuidv4 } = require('uuid');




router.post("/addproduct", (req, res) => {

    const { name, price, description, quantity, productImage, category } = req.body;

    if ((name == "") || (price == "") || (description == "") || (quantity == "") || (productImage == "") || (category == "")) return res.json({ error: "fill up black spaces"});

    const productId = uuidv4();
    const slug = slugify(name);

     const prodSql = "SELECT * FROM products";
     db.query(prodSql, (error, result) => {
        if(error) {
            return res.json({ error: error})
        } else if(result) {
            const product = result.find((item) => item.slug === slug);
            console.log(product);
            if(product) {
                return res.json({ error: "product already exists " });
            } else {
                const sql = "INSERT INTO products (ProductId, name, slug, price, description, quantity, productImage, category) VALUES (?,?,?,?,?,?,?,?)"
                db.query(sql, [productId, name, slug, price, description, quantity, productImage, category], (error, result) => {
                      if (error) {
                        return res.json({ error: error});
                      } else {
                        return res.json({ message: "product created successfully" });
                      }          
                })
            }
        } else {
            return res.json({ error: "something went wrong" })
        }
    })
 
})


router.get("/getproducts", (req, res) => {
     const sql = "SELECT * FROM products"
     db.query(sql, (error, result) => {
         if(error) {
             res.json({error: error});
         } else {
            res.json({products: result});
         }
     })
})

router.get("/getproduct/:id", (req, res) => {
    const sql = "SELECT * FROM products"
    db.query(sql, (error, result) => {
        if(error) {
            res.json({error: error});
        } else {
            const product = result.find(item => item.productId === req.params.id);
            res.json({productDetails: product});
        }
    })
})


module.exports = router