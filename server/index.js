//EXPRESS SERVER
const express = require('express')
//DOTENV TO CONFIG THE .ENV FILE
require('dotenv').config()
const app = express();

//COOKIE PARSER TO RETRIEVE THE COOKIE FROM FRONT END JUST BY REQ.COOKIE
const cookieParser = require('cookie-parser');

//EXPRESS JSON TO GET FRONTEND VALUES AS JSON
app.use(express.json())

//USING THE COOKIES
app.use(cookieParser())

//FILE WHERE THE SQL SERVER IS CONNECTD TO SERVER
require('./db/db')

//FILE OF ROUTES OR API TO REQUEST FROM FRONTEND
app.use(require('./router/route'))

//SERVER STARTED AT PORT 8000
app.listen(process.env.PORT,()=>{
    console.log("server is listening at port 8000");
})