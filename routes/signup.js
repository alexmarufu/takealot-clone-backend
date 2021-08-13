const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//const shortId = require("shortid");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
const db = require("../db")


const createToken = (userId, firstName, email) => {
  return jwt.sign({userId, firstName, email}, "tokensecret", /*{expiresIn: "1d"}*/)
}


router.post("/", async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  if (firstName == "" && lastName == "" && email == "" && password == "") return  res.json({ error: "fill up black spaces"});
  
  const sql = `SELECT * FROM users`

  db.query(sql, async (err, result) => {

    const user = result.find((item) => item.email === email);

   if (user) {
      res.json({error: "user already exists"});
     } else {
 
    const hashed_password = await bcrypt.hash(password, 10)

    const userId = uuidv4()
   
    db.query(
        `INSERT INTO users (userId, first_name, last_name, email, password) VALUES (?,?,?,?,?)`,
        [userId, firstName, lastName, email, hashed_password], (err, result) => {
        if (err) {
           res.json({ error: err });
        } else {        
          const token = createToken(userId, firstName, email)
          
          res.status(201).json({token, user: {userId, firstName, lastName, email}});
          console.log(token, user = {userId, firstName, lastName, email})
        } 
      });

   }
  });

})

module.exports = router;