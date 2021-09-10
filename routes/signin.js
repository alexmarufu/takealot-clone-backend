const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db")


const createToken = (userId, firstName, email) => {
  return jwt.sign({userId, firstName, email}, "tokensecret", /*{expiresIn: "1d"}*/)
}


router.post("/", (req, res) => {

  const { email, password } = req.body;
  
  if (email == "" && password == "") return  res.json({ error: "fill up black spaces"});

  const sql = `SELECT * FROM users`
  //'SELECT * FROM users WHERE email = ? AND password = ?', [email, password],
  
    
    db.query(sql, async (err, result) => {
         if(err) {
           res.status(400).json({ error: err })
         } else {

            const user = result.some((item) => item.email === email);
              console.log(user)
            if(user) {
              const verifiedPassword = await bcrypt.compare(password, user.password);
           
              if(verifiedPassword) {
                const token = createToken(user.userId, user.firstName, user.email)
                   const userObj = {   
                    id: user.id,
                    userId: user.userId,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                  }
                 res.status(201).json({ token, user: userObj})
                 console.log(user)
              } else {
                  res.json({ error: "wrong email or password"});             
              }
                
            } else {
              res.json({ error: "user doesn't exist" })
            }

         } 
      });             
  })

module.exports = router;
