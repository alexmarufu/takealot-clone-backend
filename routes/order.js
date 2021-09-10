const express = require("express")
const router = express.Router();
const db = require("../db");
const requireSignIn = require("../middle-ware/index");
const orderid = require('order-id')('mysecret');
const date = require('date-and-time');
const sendEmail = require("../middle-ware/sendemail");

router.post("/addorder", requireSignIn, (req, res) => {
    const { deliveryAddress, totalItems, totalPrice, orderItems, paymentMethod } = req.body

    const id = orderid.generate()

    const userId = req.user.userId;
    const orderId = orderid.getTime(id);
    const status = "pending";

    const now = new Date();
    const pattern = date.compile('ddd, MMM DD YYYY');
    const orderDate = date.format(now, pattern); 
    
    const sql = "SELECT * FROM orders";
    
    db.query(sql, (error, result) => {
        
        if(error) {
            res.json({error: error });
        } else {
            const orderExists = result.some((item) => item.orderId === orderId);
            if(orderExists) {
                res.json({ error: "order exists" });
            } else {
                const sqlDelete = `DELETE FROM cart WHERE userId = '${req.user.userId}'`
                db.query(sqlDelete, (error, result) => {
                if(error) {
                   res.json({error: error});
                   console.log(error);
                } else {       
                    const sql = "INSERT INTO orders (userId, orderId, totalItems, totalPrice, orderItems, deliveryAddress, status, paymentMethod, orderDate) VALUES (?,?,?,?,?,?,?,?,?)"
                    db.query(sql, [userId, orderId, totalItems, totalPrice, orderItems, deliveryAddress, status, paymentMethod, orderDate ], (error, result) => {
                        if(error) {
                            res.json({ error: error });
                        } else {
                            console.log(result)
                            res.status(201).json({ message: "order added" });
                            //sendEmail(req.user.email, "thank you", req.user.firstName, totalItems, totalPrice, status, orderId);
                        }
                    })
               } 
            });
               
            }
          }
      })

     })


  router.get("/getorders", (req, res) => {
    const sql = "SELECT * FROM orders"
    db.query(sql, (error, result) => {
        if(error) {
            res.json({error: error});
        } else {
           res.json({orders: result});
        }
     })
  })

router.get("/getorder", requireSignIn, (req, res) => {
   const sql = "SELECT * FROM orders"
   db.query(sql, (error, result) => {
       if(error) {
           res.json({error: error});
       } else {
           const orders = result.filter(item => item.userId === req.user.userId);
         
           res.status(202).json({ orders });
       }
     })
  });

router.get("/getorder/:orderId", requireSignIn, (req, res) => {
    const sql = "SELECT * FROM orders"
    db.query(sql, (error, result) => {
        if(error) {
            res.json({error: error});
        } else {
            const orderDetails = result.filter(item => item.orderId === req.params.orderId);
          
            res.status(202).json({ orderDetails });
        }
    })
 })
 

  
module.exports = router;
