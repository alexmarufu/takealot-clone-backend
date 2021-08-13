const express = require("express");
const router = express.Router();
const db = require("../db");
const requireLogin = require("../middle-ware/index");
const shortid = require("shortid")
//const { v4: uuidv4 } = require('uuid');



router.post("/addcart", requireLogin, (req, res) => {
    
    const { productId, name, slug, price, description, quantity, productImage,  qty } = req.body;
    const userId = req.user.userId;
    //const slug = slugify(name);
     //console.log(userId)
    if ((productId == "") || (name == "") || (slug == "") || (price == "") || (quantity == null) || (productImage == "")) return  res.json({ error: "fill up black spaces"});

     const prodSql = "SELECT * FROM cart"
     db.query(prodSql, (error, result) => {
        if(error) {
            res.json({ error: error})
        } else {

            const myProducts = result.filter(item => item.userId === req.user.userId);

            const product = myProducts.find(item => item.slug === slug);
            
            console.log(product)
            if(product) {
                const newQuantity = product.quantity + qty;
                const qtySql = `UPDATE cart SET quantity = ${newQuantity} WHERE id = ${product.id}`
                db.query(qtySql, (error, result) => {
                    if(error){
                        res.json({ error: error });
                    } else {
                        res.json({ data: result });
                    }
                })
                
            } else {
                const shortId = shortid.generate();
                const sql = "INSERT INTO cart (userId, productId, name, slug, price, description, quantity, productImage, shortId ) VALUES (?,?,?,?,?,?,?,?,?)"
                db.query(sql, [userId, productId, name, slug, price, description, quantity, productImage, shortId ], (error, result) => {
                      if (error) {
                          res.json({ error: error});
                      } else {

                        db.query(prodSql, (error, result) => {
                            if(error) {
                                return res.json({ error: error})
                            } else  {
    
                                const myCart = result.filter(item => item.userId === req.user.userId);
                                res.status(201).json({ cartProducts: myCart  });
                            }
                         })

                      }          
                })
            }
        } 
    });
  
});



   
   


router.get("/getcart", requireLogin, (req, res) => {
    
    const sql = "SELECT * FROM cart"

    db.query(sql, (error, result) => {
        if(error) {
            res.json({error: error});
            console.log(error);
        } else {       
            const data = result.filter(item => item.userId === req.user.userId)
           res.status(202).json({cartProducts: data});
        } 
    })
});



router.delete("/removeitem/:id", requireLogin, (req, res) => {
    
    const sql = `DELETE FROM cart WHERE ID = ${req.params.id}`

    db.query(sql, (error, result) => {
        if(error) {
            res.json({error: error});
            console.log(error);
        } else {       
           res.json({cartProducts: result});
        } 
    })
});



router.post("/updatecart", requireLogin, (req, res) => {

    const items = JSON.parse(req.body.cart)
    //console.log(items);
    items.forEach((eachItem, index) => {
     
    //const { name, price, description, quantity, productImage, category } = req.body;

    //if ((name == "") || (price == "") || (description == "") || (quantity == "") || (productImage == "") || (category == "")) return res.json({ error: "fill up black spaces"});

    //const productId = uuidv4();
    
     const prodSql = "SELECT * FROM cart";
     db.query(prodSql, (error, result) => {
        if(error) {
            return 
        } else  {

            const userProducts = result.filter((item) => item.userId === req.user.userId);
            
            const product = userProducts.find((item) => item.productId === eachItem.productId);
            console.log(product);
            if(product) { 
                return 
            } else {
                const shortId = shortid.generate() + index;
                const userId = req.user.userId;
                const sql = "INSERT INTO cart (userId, productId, productImage, name, slug, price, description, quantity, shortId ) VALUES (?,?,?,?,?,?,?,?,?)"
                db.query(sql, [userId, eachItem.productId, eachItem.productImage, eachItem.name, eachItem.slug, eachItem.price, eachItem.description, eachItem.quantity, shortId ], (error, result) => {
               if (error) {
                 res.json({ error: error});
                } else {

                    db.query(prodSql, (error, result) => {
                        if(error) {
                            return res.json({ error: error})
                        } else  {

                            const myCart = result.filter(item => item.userId === req.user.userId);
                            res.status(201).json({ cartProducts: myCart  });
                        }
                     })
               
                  }          
               });
            }
        } 
    });

    })


});



module.exports = router;