const jwt = require("jsonwebtoken")
const sql = require('mssql')
const config = require('../db/db')
const logger = async (req, res, next) => {
  const cookieValue = req.cookies.JWT;
  // req.token =token
  const token = jwt.verify(cookieValue,process.env.SECRET_KEY)
  try {
  if(token){
      await sql.connect(config);
      // const request = new sql.Request();
      const request = new sql.Request();
      request.input('id',sql.BigInt,token.id)
      const result = await request.query('SELECT * FROM users WHERE id = @id')
      req.result = result
      } else{
        res.sendStatus(400)
      }
    } catch (error) {
      console.log(error);
    } 
    next();
  };


  module.exports = logger;