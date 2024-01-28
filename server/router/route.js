const express = require('express')

//THIS IS A MIDDLEWARE WHERE WE CHECK IF THE REQUEST FROM FRONTEND IS SECURE AND FROM AUTHORIZED USER 
const logger = require('../middleware/loger')

//THIS IS A EXPRESS ROUTER TO CREATE ROUTES FOR FRONTEND
const router = express.Router()
//DEPENDENCY TO CONNECT SQL WITH NODEJS
const sql = require("mssql")

//ACCESSING THE CONFIG FILE FOR DATABASE CONNECTION
const config = require('../db/db')

//JWT DEPENDENCY TO AUTHENTICATE AND AUTHORIZE USER 
const jwt = require("jsonwebtoken")
const e = require('express')

//MULTER DEPENDENCY
const multer = require('multer')
const upload = multer({dest:'uploads/'})

//FS DEPENDENCY
const fs = require('fs');

//THIS IS A ROUTE TO REGISTER A USER BUT NOT SQL INJETION PROVE
// router.post('/userregister',async (req,res)=>{
//   const {fullname,email,password} = req.body;
//   try {
//         await sql.connect(config)
//         const oldUser = await sql.query(`SELECT * FROM users WHERE email = '${email}'`)
//         console.log(oldUser.recordset)
//         if(oldUser.recordset[0]!=null){
//           console.log(oldUser.recordset);
//           res.sendStatus(400);
//         }
//         else{
//           const result = await sql.query(`INSERT INTO users VALUES ('${fullname}','${email}','${password}')`)
//           if(result){
            
//         const insertedUser = await sql.query(`SELECT * FROM users WHERE email = '${email}'`)
//         console.log(insertedUser.recordsets[0])
//             res.json(insertedUser.recordsets[0]);
//           }else{
//             res.sendStatus(404);
//           }
//         }
          
//   } catch (error) {
//     console.log(error);
//   } finally{
//     await sql.close()
//   }
// })


//SQL INJECTION SECURE ROUTE
router.post('/userregister', upload.single('picture'),async (req, res) => {
  const { fullname, email, password } = req.body;
  const userPicture = req.file;
  if(!fullname, !email, !password){
    res.sendStatus(404);
  }
  else{


  try {
    await sql.connect(config);
    const fileData = fs.readFileSync(userPicture.path);
    // Use parameterized query to prevent SQL injection
    const request = new sql.Request();
    request.input('fullname', sql.VarChar, fullname);
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    request.input('picture', sql.VarBinary, fileData);

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = @email';
    const checkUserResult = await request.query(checkUserQuery);
    if (checkUserResult.recordset.length > 0) {
      return res.sendStatus(400);
    }

    // Insert the user into the database
    const insertUserQuery = 'INSERT INTO users (fullname, email, password,picture) VALUES (@fullname, @email, @password,@picture)';
    const insertUserResult = await request.query(insertUserQuery);
    if (insertUserResult.rowsAffected.length > 0) {
    const checkUserAgain = 'SELECT * FROM users WHERE email = @email';
    const checkUserResultAgain = await request.query(checkUserAgain);
      return res.json(checkUserResultAgain.recordsets[0]);
    } else {
      return res.sendStatus(404);
    }
  }

  catch (error) {
    console.log(error);
    return res.sendStatus(500);
  } finally {
    await sql.close();
  }
}
});


///////////////////////////////////////////////////////////////////////////RESERVED
// router.post('/userregister', async (req, res) => {
//   const { fullname, email, password } = req.body;
//   if(!fullname, !email, !password){
//     res.sendStatus(404);
//   }
//   else{


//   try {
//     await sql.connect(config);

//     // Use parameterized query to prevent SQL injection
//     const request = new sql.Request();
//     request.input('fullname', sql.VarChar, fullname);
//     request.input('email', sql.VarChar, email);
//     request.input('password', sql.VarChar, password);

//     // Check if user already exists
//     const checkUserQuery = 'SELECT * FROM users WHERE email = @email';
//     const checkUserResult = await request.query(checkUserQuery);
//     if (checkUserResult.recordset.length > 0) {
//       return res.sendStatus(400);
//     }

//     // Insert the user into the database
//     const insertUserQuery = 'INSERT INTO users (fullname, email, password) VALUES (@fullname, @email, @password)';
//     const insertUserResult = await request.query(insertUserQuery);
//     if (insertUserResult.rowsAffected.length > 0) {
//     const checkUserAgain = 'SELECT * FROM users WHERE email = @email';
//     const checkUserResultAgain = await request.query(checkUserAgain);
//       return res.json(checkUserResultAgain.recordsets[0]);
//     } else {
//       return res.sendStatus(404);
//     }
//   }

//   catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   } finally {
//     await sql.close();
//   }
// }
// });

//Route For User Authorization
router.post('/userauthorization/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    const getOldUser = await request.query('SELECT * FROM users WHERE id = @id')
    if(getOldUser.recordset.length >0){
        res.json(getOldUser.recordset)
    }
    else{
      res.sendStatus(401)
    }

  } catch (error) {
    console.log(error);
  }
})


//Route to assign 
router.post('/assignrole/:id',async (req,res)=>{
  const id = req.params.id
  const {check1,check2,check3,check4,check5} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
        request.input('id',sql.BigInt,id)
        const checkUser = await request.query('SELECT * FROM users where id = @id') 
        console.log(checkUser.recordset);
        if(checkUser.recordset[0].purchaseid==null && checkUser.recordset[0].saleid==null &&checkUser.recordset[0].accountid==null &&checkUser.recordset[0].branch==null &&checkUser.recordset[0].masterdata==null){
          
          const UpdatedUser = await  sql.query(`UPDATE users SET purchaseid =${check3?1:0}, saleid =${ check4?1:0}, accountid = ${check2?1:0},branch =${ check1?1:0},masterdata =${ check5?1:0} WHERE id = ${id}`)
          res.sendStatus(200)
         
    }
    else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
      const Updatepurchase = await  sql.query(`UPDATE users SET saleid = ${check4?1:0}, accountid = ${check2?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
          res.sendStatus(200)
      console.log("🚀 ~ file: route.js:135 ~ router.post ~ Updatepurchase:", Updatepurchase)
    }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const Updatedsale = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, accountid = ${check2?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:140 ~ router.post ~ Updatedsale:", Updatedsale)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const Updatedaccount = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:146 ~ router.post ~ Updatedaccount:", Updatedaccount)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const UpdatedBranch = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0}, accountid = ${check2?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:152 ~ router.post ~ UpdatedBranch:", UpdatedBranch)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const UpdatedMaster = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0}, accountid = ${check2?1:0},branch=${check1?1:0}WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:158 ~ router.post ~ UpdatedMaster:", UpdatedMaster)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const update1 = await  sql.query(`UPDATE users SET  accountid = ${check2?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:164 ~ router.post ~ update1:", update1)


      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const Updated2 = await  sql.query(`UPDATE users SET  saleid = ${check4?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        console.log("🚀 ~ file: route.js:171 ~ router.post ~ Updated2:", Updated2)


      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const Updated3 = await  sql.query(`UPDATE users SET  saleid = ${check4?1:0}, accountid = ${check2?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)


      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const Updated4 = await  sql.query(`UPDATE users SET  saleid = ${check4?1:0}, accountid = ${check2?1:0},branch=${check1?1:0}, WHERE id = ${id}`)
        res.sendStatus(200)


      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const Updated5 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0},branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const Updated6 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, accountid = ${check2?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const Updated7 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, accountid = ${check2?1:0},branch=${check1?1:0}, WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const Updated8 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const Updated9 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0},branch=${check1?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==1){
        const Updated10 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0},WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==0){
        const Updated11 = await  sql.query(`UPDATE users SET branch=${check1?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const Updated12 = await  sql.query(`UPDATE users SET  accountid = ${check2?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const Updated13 = await  sql.query(`UPDATE users SET accountid = ${check2?1:0},branch=${check1?1:0},WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        const Updated14 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0},masterdata = ${check5?1:0} WHERE id = ${id}`)

        res.sendStatus(200)
      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        const Updated15 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0},branch=${check1?1:0}, WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==1){
        const Updated16 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0}, saleid = ${check4?1:0}, WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==0){
        
        const Updated17 = await  sql.query(`UPDATE users SET ,masterdata = ${check5?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==0 &&checkUser.recordset[0].masterdata==1){
        
        const Updated18 = await  sql.query(`UPDATE users SET branch=${check1?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        
      }
      else if(checkUser.recordset[0].purchaseid==0 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==1){
        
        const Updated19 = await  sql.query(`UPDATE users SET purchaseid = ${check3?1:0} WHERE id = ${id}`)
        res.sendStatus(200)

        
      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==0 &&checkUser.recordset[0].accountid==1 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==1){
        
        const Updated20 = await  sql.query(`UPDATE users SET  saleid = ${check4?1:0} WHERE id = ${id}`)
        res.sendStatus(200)
        
      }
      else if(checkUser.recordset[0].purchaseid==1 && checkUser.recordset[0].saleid==1 &&checkUser.recordset[0].accountid==0 &&checkUser.recordset[0].branch==1 &&checkUser.recordset[0].masterdata==1){
        
        const Updated21 = await  sql.query(`UPDATE users SET accountid = ${check2?1:0} WHERE id = ${id}`)

        res.sendStatus(200)
        
      }
      
  }
      catch(error) {
    console.log(error);
  }
})

//ROUTE TO LOGIN A USER AND SEND A JWT TOKEN AND STORING IN COOKIES
router.post('/getusers',async (req,res)=>{
  try {
    const {email,password} = req.body;
if(!email || !password){
  res.sendStatus(400)
}
      // Connect to the database
      await sql.connect(config);
      const request = new sql.Request();

      request.input('email', sql.VarChar, email);
      request.input('password', sql.VarChar, password);
      // Execute a query to retrieve data
      // const result = await sql.query('SELECT * FROM users WHERE email = @email AND password = @password');
      const result = await request.query('SELECT * FROM users WHERE email = @email AND password = @password')
      if(result.recordset.length>0){
        const token = jwt.sign(result.recordset[0].fullname,process.env.SECRET_KEY)
        res.cookie("JWT",token)
        res.json(result.recordset)
      }
      else{
        res.sendStatus(404)
      }
  } catch (arr){
      console.log(arr);
  } finally{
    await sql.close();
  }
})


//ROUTE TO GET ALL THE USERS FROM DATABASE
  router.get('/api/users',logger, async (req, res) => {
    try {
      // Connect to the database
      await sql.connect(config);
      // Execute a query to retrieve data
      const result = await sql.query('SELECT * FROM users');
      // Return the retrieved data
      res.json(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    } finally {
      // Close the database connection
      sql.close();
    }
  });
//ROUTE TO ADD CUSTOMERS
  router.post("/addcustomer",logger,async (req,res)=>{
    const {customercode,customername,customerlegalentity,
      customeraddress,customerphone,customeremail,
      customerindustry,customerbillingaddress,
      customershippingaddress,customerpaymentterm,
      customercreditlimit,customervatnumber,city,province,
      postalcode,country,ntn,stn,cnic,openingdate,
      openingbalance,discount,filer,glaccount} = req.body;
    try {
      await sql.connect(config)
      const request = new sql.Request();
      
              request.input('customercode',sql.VarChar,customercode)
              request.input('customername',sql.VarChar,customername)
              request.input('city',sql.VarChar,city)
              request.input('province',sql.VarChar,province)
              request.input('postalcode',sql.VarChar,postalcode)
              request.input('country',sql.VarChar,country)
              request.input('ntn',sql.VarChar,ntn)
              request.input('stn',sql.VarChar,stn)
              request.input('cnic',sql.VarChar,cnic)
              request.input('openingdate',sql.Date,openingdate)
              request.input('customerlegalentity',sql.VarChar,customerlegalentity)
              request.input('customeraddress',sql.VarChar,customeraddress)
              request.input('customerphone',sql.VarChar,customerphone)
              request.input('customeremail',sql.VarChar,customeremail)
              request.input('customerindustry',sql.VarChar,customerindustry)
              request.input('customerbillingaddress',sql.VarChar,customerbillingaddress)
              request.input('customershippingaddress',sql.VarChar,customershippingaddress)
              request.input('customerpaymentterm',sql.VarChar,customerpaymentterm)
              request.input('customercreditlimit',sql.VarChar,customercreditlimit)
              request.input('customervatnumber',sql.VarChar,customervatnumber)
              request.input('openingbalance',sql.Float,openingbalance)
              request.input('discount',sql.Float,discount)
              request.input('glaccount',sql.BigInt,glaccount)
if(!customercode){
  res.sendStatus(400)
}
else{

  const checkCustomer = await request.query("SELECT *  FROM customer WHERE cutomercode = @customercode or customername = @customername")
  if(checkCustomer.recordset.length > 0){
    res.sendStatus(404)
  }
  else{
        const result =await request.query(`INSERT INTO customer VALUES (@customercode,@customername,@customerlegalentity,@customeraddress,@customerphone,@customeremail,@customerindustry,@customerbillingaddress,@customershippingaddress,@customerpaymentterm,@customercreditlimit,@customervatnumber,@city,@province,@postalcode,@country,@ntn,@stn,@cnic,@openingdate,@openingbalance,@discount, ${filer?1:0},@glaccount)`);
      if( result.rowsAffected.length > 0){
        const customer =await request.query("SELECT * from customer WHERE cutomercode = @customercode")
        res.json(customer.recordsets[0])
      }else{
        res.sendStatus(400)
      }
    }
    
  }
    
    } catch (error) {
        console.log(error);
      } finally{
        await sql.close()
      }
    })

  router.delete('/deletecustomer/:id',async (req,res)=>{
    const id = req.params.id
    try {
      await sql.connect(config)
      const request = new sql.Request()
      request.input('id',sql.VarChar,id)
      const deleteCustomer = await request.query('DELETE FROM customer WHERE cutomercode = @id')
      if(deleteCustomer.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(402)
      }
    } catch (error) {
      console.log(error);
    }
  })

//ROUTE TO ADD PRODUCTS
  router.post("/addproduct",logger,async (req,res)=>{
    const {productid,productname,productcategory,productdescription,productweight,
      productsalesdata,productquantity,productpreviouspurchaseprice,
      productcurrentpurchaseprice,productmanufacturedate,productexpirydate,
      producttypeid,minimumstocklevel,reorderquantity,
      supplierid,customerid,partnumber,unitofmeasure,glsaleaccount,glinventoryaccount,glcosaccount,productlocation,productposition} = req.body;
    try {
      await sql.connect(config)
      const request = new sql.Request();
              request.input('supplierid',sql.BigInt,supplierid)
              request.input('customerid',sql.BigInt,customerid)
              request.input('productid',sql.VarChar,productid)
              request.input('partnumber',sql.VarChar,partnumber)
              request.input('productquantity',sql.VarChar,productquantity)
              request.input('productpreviouspurchaseprice',sql.VarChar,productpreviouspurchaseprice)
              request.input('productcurrentpurchaseprice',sql.VarChar,productcurrentpurchaseprice)
              request.input('productmanufacturedate',sql.Date,productmanufacturedate)
              request.input('productexpirydate',sql.Date,productexpirydate)
              request.input('productname',sql.VarChar,productname)
              request.input('minimumstocklevel',sql.VarChar,minimumstocklevel)
              request.input('reorderquantity',sql.VarChar,reorderquantity)
              request.input('productlocation',sql.VarChar,productlocation)
              request.input('productposition',sql.VarChar,productposition)
              request.input('productcategory',sql.VarChar,productcategory)
              request.input('productdescription',sql.VarChar,productdescription)
              request.input('unitofmeasure',sql.VarChar,unitofmeasure)
            request.input('productweight',sql.VarChar,productweight)
            request.input('productsalesdata',sql.VarChar,productsalesdata)
            request.input('producttypeid',sql.BigInt,producttypeid)
            request.input('glsaleaccount',sql.BigInt,glsaleaccount)
            request.input('glinventoryaccount',sql.BigInt,glinventoryaccount)
            request.input('glcosaccount',sql.BigInt,glcosaccount)

if(true){

  const checkProduct = await request.query("SELECT * FROM products WHERE productid = @productid or productname = @productname")
  if(checkProduct.recordset.length > 0){
    res.sendStatus(404)
  }
  else{
        const result = 
        await request.query(`INSERT INTO products 
        (productname,
          productcategory,
          productdescription,
          productsalesdata,
          productquantity,
          productpreviouspurchaseprice,
          productcurrentpurchaseprice,
          productmanufacturedate,
          productexpirydate,
          producttypeid,
          minimumstocklevel,
          reorderquantity,
          preferredvendorid,
          buyerid,
          partnumber,
          productunitofmeasure,
          productweight,
          glsaleaccountid,
          glinventoryaccountid,
          glcosaccountid,
          productlocation,
          productposition)
          
          VALUES
          
          (@productname,
            @productcategory,
            @productdescription,
            @productsalesdata,
            @productquantity,
            @productpreviouspurchaseprice,
            @productcurrentpurchaseprice,
            @productmanufacturedate,
            @productexpirydate,
            @producttypeid,
            @minimumstocklevel,
            @reorderquantity,
            @supplierid,
            @customerid,
            @partnumber,
            @unitofmeasure,
            @productweight,
            @glsaleaccount,
            @glinventoryaccount,
            @glcosaccount,
            @productlocation,
            @productposition)
            
            `);          

      if( result.rowsAffected.length > 0){
        const customer =await request.query("SELECT * from products WHERE productid = @productid")
        res.json(customer.recordsets[0])
      }else{
        res.sendStatus(400)
      }
    }
    
  }
    
    } catch (error) {
        console.log(error);
      } finally{
        await sql.close()
      }
    })

//Unit of measure
 router.post("/addunitofmeasure",async(req,res)=>{
      const {unitofmeasurename,unitofmeasuretitle} = req.body;
      try {
        await sql.connect(config)
        const request = new sql.Request()
        request.input('unitofmeasurename',sql.VarChar,unitofmeasurename)
        request.input('unitofmeasuretitle',sql.VarChar,unitofmeasuretitle)
        if(!unitofmeasurename || !unitofmeasuretitle){
          res.sendStatus(400)
        }else{
          const checkAccount = await request.query('SELECT * FROM unitofmeasure WHERE unitname = @unitofmeasurename OR unittitle = @unitofmeasuretitle')
          
          if(checkAccount.recordset.length > 0){
            res.sendStatus(401)
        }
        else{
          const newAccountHead =await request.query('INSERT INTO unitofmeasure (unitname,unittitle) VALUES (@unitofmeasurename,@unitofmeasuretitle)')
          
          if(newAccountHead.rowsAffected.length > 0){
            res.sendStatus(200)
          }else{
            res.sendStatus(402)
          }
        }
      }
      } catch (error) {
        console.log(error);
      }finally{
        await sql.close()
      }
    })

    router.get('/getunitofmeasure',async (req,res)=>{
      try {
        await sql.connect(config)
        const request = new sql.Request() 
        const getunitofmeasres = await request.query('SELECT * from unitofmeasure')
        res.json(getunitofmeasres.recordset)
      } catch (error) {
        console.log(error);
      }
    })
//ROUTE TO GET PRODUCTS
router.get('/getproducts',async (req,res)=>{
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const getproducts = await sql.query("SELECT * FROM products");
    if(getproducts.recordset.length > 0){
      res.json(getproducts.recordsets[0])
    }else{
      res.sendStatus(404)
    }

  } catch (error) {
    
  }   
})

//ROUTE TO GET CUSTOMERS
router.get('/getcustomers',async (req,res)=>{
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const getcustomers = await sql.query("SELECT * FROM customer");

    if(getcustomers.recordset.length > 0){
      res.json(getcustomers.recordsets[0])
    }else{
      res.sendStatus(404)
    }

  } catch (error) {
    
  } finally {
    await sql.close()
  }
})

//ROUTE TO ADD PRODUCT CATEGORY
router.post("/addproductcategory",async (req,res)=>{
  const {productcategoryid, productcategoryname} = req.body;
  if(!productcategoryid || !productcategoryname){
    res.sendStatus(400);
  }
  else{
    try {
      await sql.connect(config)
      const request = new sql.Request()
      request.input('productcategoryid',sql.VarChar,productcategoryid)
      request.input('productcategoryname',sql.VarChar,productcategoryname)

      const checkProduct = await request.query("SELECT * FROM productcategory where productcategoryid = @productcategoryid")
      if(checkProduct.recordset.length > 0){
        res.sendStatus(401)
      }
      else{
        const newProductCategory = await request.query("INSERT INTO productcategory VALUES (@productcategoryid,@productcategoryname,'','','')")
        console.log("🚀 ~ file: route.js:291 ~ router.post ~ newProductCategory:", newProductCategory)
        // res.json(newProductCategory.recordset[0])
        if(newProductCategory.rowsAffected[0]>0){
          const insertedProduct = await request.query("SELECT * FROM productcategory where productcategoryid = @productcategoryid")
          if(insertedProduct.recordset.length > 0){
            res.json(insertedProduct.recordset[0])
          }
        } 
      }

    } catch (error) {
      console.log(error);
    }
    finally{
      await sql.close()
    }
  }
})

router.get('/getproductscategory',async (req,res)=>{
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const getproducts = await sql.query("SELECT * FROM productcategory");

    if(getproducts.recordset.length > 0){
      res.json(getproducts.recordsets[0])
    }else{
      res.sendStatus(404)
    }

  } catch (error) {
    
  } finally {
    await sql.close()
  }
})

//ROUTE TO GET EDITED PRODUCT CATEGORY
router.get('/getproductscategory/:id',async (req,res)=>{
  const id = req.params.id
  console.log(id);
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('productcategoryid',sql.VarChar,id)
    const getproducts = await request.query("SELECT * FROM productcategory WHERE productcategoryid = @productcategoryid")
    console.log(getproducts);
    if(getproducts.recordset.length > 0){
      console.log(getproducts);
      res.json(getproducts.recordsets[0])
    }else{
      res.sendStatus(404)
    }

  } catch (error) {
    
  } finally {
    await sql.close()
  }
})

//ROUTE TO UPDATE PRODUCTS 
router.post('/updateproduct/:id',async(req,res)=>{
  const id = req.params.id;
  const {productcategoryname} = req.body;
try {
  await sql.connect(config);
  const request = new sql.Request()
  request.input('productcategoryid',sql.VarChar,id)
  request.input('productcategoryname',sql.VarChar,productcategoryname)
  const update = await request.query('UPDATE productcategory SET productcategoryname = @productcategoryname WHERE productcategoryid = @productcategoryid')
  console.log("🚀 ~ file: route.js:362 ~ router.post ~ update:", update)
  if(update.rowsAffected.length > 0){
    res.sendStatus(200)
  }
} catch (error) {
  
}finally{
  await sql.close()
}
})

//ROUTE TO DELETE PRODUCTS
router.delete('/deleteproducts/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('productid',sql.VarChar,id)
    const deleteproduct = await request.query('DELETE FROM products WHERE productid = @productid')
    if(deleteproduct.rowsAffected.length > 0){
      res.sendStatus(200)
      }else{
        res.sendStatus(402);
      }

  } catch (error) {
    console.log(error);
  }
})

//ROUTE TO GET EDITED PRODUCTS
router.get('/getproducts/:id',async (req,res)=>{
  const id = req.params.id
  console.log(id);
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('productid',sql.VarChar,id)
    const getproducts = await request.query("SELECT * FROM products WHERE productid = @productid")
    console.log(getproducts);
    if(getproducts.recordset.length > 0){
      console.log(getproducts);
      res.json(getproducts.recordsets[0])
    }else{
      res.sendStatus(404)
    }

  } catch (error) {
    
  } finally {
    await sql.close()
  }
})

//ROUTE TO UPDATE PRODUCT CATEGORY
router.post('/updateproducts/:id',async(req,res)=>{
  const id = req.params.id;
  const {productname,productcategory,productdescription,productunitofmeasure,productprice,productavailability,productweight,productsupplier,productsalesdata} = req.body;
try {
  await sql.connect(config);
  const request = new sql.Request()
  request.input('productid',sql.VarChar,id)
  request.input('productname',sql.VarChar,productname)
  request.input('productcategory',sql.VarChar,productcategory)
  request.input('productdescription',sql.VarChar,productdescription)
  request.input('productunitofmeasure',sql.VarChar,productunitofmeasure)
  request.input('productprice',sql.VarChar,productprice)
  request.input('productavailability',sql.VarChar,productavailability)
  request.input('productweight',sql.VarChar,productweight)
  request.input('productsupplier',sql.VarChar,productsupplier)
  request.input('productsalesdata',sql.VarChar,productsalesdata)
  const update = await request.query('UPDATE products SET productname = @productname,productcategory = @productcategory, productdescription = @productdescription, productunitofmeasure = @productunitofmeasure, productprice = @productprice,productavailability = @productavailability,productweight = @productweight,productsupplier = @productsupplier,productsalesdata = @productsalesdata  WHERE productid = @productid')
  if(update.rowsAffected.length > 0){
    res.sendStatus(200)
  }
} catch (error) {
  
}finally{
  await sql.close()
}
})

/*******************************************PRODUCT TYPE ROUTES*****************************************/

router.get('/getproducttype',async (req,res)=>{
  try {
      await sql.connect(config)
      const request = new sql.Request()
      const getTypes = await request.query('SELECT * FROM producttype')
      if(getTypes.recordset.length > 0){
        res.json(getTypes.recordset)
      }else{
        res.sendStatus(402)
      }

  } catch (error) {
    console.log(error);
  }
})

/*******************************************SALE PRODUCT ROUTES*****************************************/

router.get('/getsaleproducts',async (req,res)=>{
  try {
      await sql.connect(config)
      const request = new sql.Request()
      const getSaleProduct = await request.query('SELECT * FROM products WHERE producttypeid = 2')
      if(getSaleProduct.recordset.length > 0){
        res.json(getSaleProduct.recordset)
      }
else{
  res.sendStatus(403)
}
  } catch (error) {
    console.log(error);
  }
})



/*******************************************BRANCH TYPE ROUTES*****************************************/
router.post('/addbranchtype',async(req,res)=>{
  const {branchtypename} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchtypename',sql.VarChar,branchtypename);
    const oldbranch =await  request.query('SELECT * FROM branchtype WHERE branchtypename = @branchtypename');
    console.log(oldbranch);
    if(oldbranch.recordset.length >= 1){
      res.sendStatus(401);
    }else{
      const newBranch =await  request.query('INSERT INTO branchtype VALUES (@branchtypename)')
      console.log(newBranch);
      if(newBranch.rowsAffected[0]>=1){
        res.sendStatus(200)
      }
    }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.get('/getbranchtype',async (req,res)=>{
  try {
    await sql.connect(config)
    const branchtypes = await sql.query('SELECT * FROM branchtype')
    if(branchtypes.recordset.length >=1){
      res.json(branchtypes.recordset)
    }else{
      req.sendStatus(401)
    }
  } catch (error) {
    console.log(error.message);
  }finally{
    await sql.close()
  }
})

router.post('/getbranchtypes/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchtypeid',sql.TinyInt, id)
    const checkbranch = await request.query('SELECT * FROM branchtype where branchtypeid = @branchtypeid')
    if(checkbranch.recordset.length > 0){
      res.json(checkbranch.recordset)
    }
  } catch (error) {
    
  }
})

router.delete('/deletebranchtype/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchtypeid',sql.BigInt,id)
    const deletebranch = await request.query('DELETE FROM branchtype WHERE branchtypeid = @branchtypeid')
    console.log("🚀 ~ file: route.js:748 ~ router.delete ~ deletebranch:", deletebranch)
    if(deletebranch.rowsAffected.length > 0){
      res.sendStatus(200)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/updatebranchtype/:id',async(req,res)=>{
  const id = req.params.id
  const {branchtypename} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchtypeid',sql.TinyInt,id)
    request.input('branchtypename',sql.VarChar,branchtypename)
    const checkbranch =await request.query('SELECT * FROM branchtype WHERE branchtypename = @branchtypename')
    if(checkbranch.recordset.length > 0){
      res.sendStatus(402)
    }
    else{

      const query = await request.query("UPDATE branchtype SET branchtypename = @branchtypename WHERE branchtypeid = @branchtypeid")
      if(query.rowsAffected.length>0){
        res.sendStatus(200)
      }
      else{
        res.sendStatus(401)
      }
    }

  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})




/****************************************ACCOUNT ACTIVITY ROUTES****************************************/

router.post('/addaccountactivity',async (req,res)=>{
  const {accountactivityname,balance} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountactivityname',sql.VarChar,accountactivityname)
    request.input('balance',sql.Float,balance)
    const checkAccount = await request.query('SELECT * FROM accountactivity WHERE accountactivityname = @accountactivityname')
    if(checkAccount.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newAccount = await request.query('INSERT INTO accountactivity VALUES(@accountactivityname,@balance)')
      if(newAccount.rowsAffected.length > 0){
        res.sendStatus(200)

      }else{
        res.sendStatus(402)
      }
    }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.get('/getaccountasset',async(req,res)=>{

  try {
    await sql.connect(config)
    const allAccount = await sql.query("SELECT * FROM accountsubcontrol WHERE accountcontrolid = 4042 or accountcontrolid = 4085")
    if(allAccount.recordset.length > 0){
      res.json(allAccount.recordset)
    }
  } catch (error) {
    console.log(error);
  }

})

router.get('/getaccountbank',async(req,res)=>{

  try {
    await sql.connect(config)
    const allAccount = await sql.query("SELECT * FROM accountsubcontrol WHERE accountcontrolid = 4085")
    if(allAccount.recordset.length > 0){
      res.json(allAccount.recordset)
    }
  } catch (error) {
    console.log(error);
  }

})

router.post('/getaccountactivity/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountactivityid',sql.TinyInt,id)
    const checkAccount = await request.query('SELECT * FROM accountactivity WHERE accountactivityid = @accountactivityid')
    if(checkAccount.recordset.length > 0){
      res.json(checkAccount.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.post('/updateaccountactivity/:id',async (req,res)=>{
  const id = req.params.id
  const {accountactivityname} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountactivityid',sql.TinyInt,id)
    request.input('accountactivityname',sql.VarChar,accountactivityname)
    const checkAccount = await request.query('SELECT * FROM accountactivity WHERE accountactivityid = @accountactivityid')
    if(checkAccount.recordset.length>0)
    {
      const updatedAccount  = await request.query('UPDATE accountactivity SET accountactivityname = @accountactivityname WHERE accountactivityid = @accountactivityid')
      if(updatedAccount.rowsAffected.length > 0)
      {
        res.sendStatus(200)
      }else{
        res.sendStatus(401)
      }
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }finally{await sql.close()}
})


/***************************************************BANK PAYMENTS AND RECEIPTS***************************************/
router.post('/addbankpayment',async (req,res)=>{
  const {bankcode,date,mode,nominalaccount,refno,detail,amount,userid} = req.body;
  try {
    await sql.connect(config)
    const request =  new sql.Request()
    request.input('bankcode',sql.VarChar,bankcode)
    request.input('userid',sql.BigInt,userid)
    request.input('date',sql.Date,date)
    request.input('mode',sql.VarChar,mode)
    request.input('nominalaccount',sql.VarChar,nominalaccount)
    request.input('refno',sql.VarChar,refno)
    request.input('detail',sql.VarChar,detail)
    request.input('amount',sql.Float,amount)

    const transaction = new sql.Transaction()
    transaction.begin()
    // Create a new Date object with the current date and time
const currentDate = new Date();

// Get the individual components of the date
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Add 1 to the result to get the standard format (1-12)
const day = currentDate.getDate();

// Format the date in "MM/DD/YYYY" format
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    const getsubcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @bankcode`)
    if(getsubcontrols.recordset.length > 0){
      const getsubnominalcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @nominalaccount`)
        if(getsubnominalcontrols.recordset.length > 0){

          const insertinto = await request.query(`INSERT INTO bankpayments (bankid,nominalaccountid,detail,refno,amount,paymentdate,mode,userid) VALUES (${getsubcontrols.recordset[0].accountsubcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},@detail,@refno,@amount,@date,@mode,@userid)`)
          if(insertinto.rowsAffected.length > 0){
            const getinsertedbankpayment = await request.query(`SELECT * FROM bankpayments WHERE paymentdate = @date and bankid = ${getsubcontrols.recordset[0].accountsubcontrolid} and nominalaccountid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
            if(getinsertedbankpayment.recordset.length > 0){
      

              const getyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
              const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubcontrols.recordset[0].accountheadid},${getsubcontrols.recordset[0].accountcontrolid},${getsubcontrols.recordset[0].accountsubcontrolid},'2','2',@amount,'0',@date,'Bank Payment ${getsubcontrols.recordset[0].accountsubcontrolname}',@userid,'BP ${getinsertedbankpayment.recordset[0].bankpaymentsid}','${formattedDate}')`)
              if(transaction1.rowsAffected > 0){
                const updatebank = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubcontrols.recordset[0].currentbalance} - @amount WHERE accountsubcontrolid = ${getsubcontrols.recordset[0].accountsubcontrolid}`)
                const updatenominal = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubnominalcontrols.recordset[0].currentbalance} + @amount WHERE accountsubcontrolid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
            
                const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubnominalcontrols.recordset[0].accountheadid},${getsubnominalcontrols.recordset[0].accountcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},'2','2','0',@amount,@date,'Bank Payment nominal account ${getsubnominalcontrols.recordset[0].accountsubcontrolname}',@userid,'BP ${getinsertedbankpayment.recordset[0].bankpaymentsid}','${formattedDate}')`)
                res.sendStatus(200)
              }else{
                res.sendStatus(402)
                transaction.rollback()
              }
            }
            else{
              res.sendStatus(405)
              transaction.rollback()
            }
          }
          else{
            res.sendStatus(405)
            transaction.rollback()
          }
        }else{
          transaction.rollback()
        }
    }
else{
  res.sendStatus(405)
  transaction.rollback()
}
  } catch (error) {
    console.log(error);
  }
})

router.get('/getbankpayments',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getpayments = await request.query(`SELECT * FROM bankpayments`)
    if(getpayments.recordset.length > 0){
      res.json(getpayments.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})

/***************************************************BANK Receipts AND RECEIPTS***************************************/
router.post('/addbankreceipts',async (req,res)=>{
  const {bankcode,date,mode,nominalaccount,refno,detail,amount,userid} = req.body;
  try {
    await sql.connect(config)
    const request =  new sql.Request()
    request.input('bankcode',sql.VarChar,bankcode)
    request.input('userid',sql.BigInt,userid)
    request.input('date',sql.Date,date)
    request.input('mode',sql.VarChar,mode)
    request.input('nominalaccount',sql.VarChar,nominalaccount)
    request.input('refno',sql.VarChar,refno)
    request.input('detail',sql.VarChar,detail)
    request.input('amount',sql.Float,amount)
    
    if(bankcode == nominalaccount){
      res.sendStatus(409)
    }else{

      
      const transaction = new sql.Transaction()
    transaction.begin()
    // Create a new Date object with the current date and time
    const currentDate = new Date();
    
// Get the individual components of the date
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Add 1 to the result to get the standard format (1-12)
const day = currentDate.getDate();

// Format the date in "MM/DD/YYYY" format
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

const getsubcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @bankcode`)
    if(getsubcontrols.recordset.length > 0){
      const getsubnominalcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @nominalaccount`)
        if(getsubnominalcontrols.recordset.length > 0){
          
          const insertinto = await request.query(`INSERT INTO bankreceipts (bankid,nominalaccountid,detail,refno,amount,paymentdate,mode,userid) VALUES (${getsubcontrols.recordset[0].accountsubcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},@detail,@refno,@amount,@date,@mode,@userid)`)
          if(insertinto.rowsAffected.length > 0){
            const getinsertedbankpayment = await request.query(`SELECT * FROM bankreceipts WHERE paymentdate = @date and bankid = ${getsubcontrols.recordset[0].accountsubcontrolid} and nominalaccountid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
            if(getinsertedbankpayment.recordset.length > 0){
      

              const getyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
              const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubcontrols.recordset[0].accountheadid},${getsubcontrols.recordset[0].accountcontrolid},${getsubcontrols.recordset[0].accountsubcontrolid},'2','2','0',@amount,@date,'Bank Receipts ${getsubcontrols.recordset[0].accountsubcontrolname}',@userid,'BR ${getinsertedbankpayment.recordset[0].bankreceiptsid}','${formattedDate}')`)
              if(transaction1.rowsAffected > 0){
                const updatebank = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubcontrols.recordset[0].currentbalance} + @amount WHERE accountsubcontrolid = ${getsubcontrols.recordset[0].accountsubcontrolid}`)
                const updatenominal = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubnominalcontrols.recordset[0].currentbalance} - @amount WHERE accountsubcontrolid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
                
                const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubnominalcontrols.recordset[0].accountheadid},${getsubnominalcontrols.recordset[0].accountcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},'2','2',@amount,'0',@date,'Bank Receipts nominal account ${getsubnominalcontrols.recordset[0].accountsubcontrolname}',@userid,'BR ${getinsertedbankpayment.recordset[0].bankreceiptsid}','${formattedDate}')`)
                res.sendStatus(200)
              }else{
                res.sendStatus(402)
                transaction.rollback()
              }
            }
            else{
              res.sendStatus(405)
              transaction.rollback()
            }
          }
          else{
            res.sendStatus(405)
            transaction.rollback()
          }
        }else{
          transaction.rollback()
        }
    }
else{
  res.sendStatus(405)
  transaction.rollback()
}
}
} catch (error) {
  console.log(error);
}
})

router.get('/getbankreceipt',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getpayments = await request.query(`SELECT * FROM bankreceipts`)
    if(getpayments.recordset.length > 0){
      res.json(getpayments.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})



/***************************************************BANK TRANSFER AND RECEIPTS***************************************/
router.post('/addbanktransfer',async (req,res)=>{
  const {transferdate,frombankcode,tobankcode,refno,mode,description,amount,userid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('transferdate',sql.Date,transferdate)
    request.input('frombankcode',sql.VarChar,frombankcode)
    request.input('tobankcode',sql.VarChar,tobankcode)
    request.input('refno',sql.VarChar,refno)
    request.input('mode',sql.VarChar,mode)
    request.input('description',sql.VarChar,description)
    request.input('amount',sql.Float,amount)
    request.input('userid',sql.BigInt,userid)
    if(frombankcode == tobankcode){
      res.sendStatus(409)
    }else{

      
      const transaction = new sql.Transaction()
      transaction.begin()
    // Create a new Date object with the current date and time
    const currentDate = new Date();
    
// Get the individual components of the date
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Add 1 to the result to get the standard format (1-12)
const day = currentDate.getDate();

// Format the date in "MM/DD/YYYY" format
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    const getsubcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @frombankcode`)
    if(getsubcontrols.recordset.length > 0){
      if(getsubcontrols.recordset[0].currentbalance < amount){
        res.sendStatus(405)
      }else{

      
      const getsubnominalcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @tobankcode`)
        if(getsubnominalcontrols.recordset.length > 0){

          const insertinto = await request.query(`INSERT INTO banktransfers (frombankid,tobankid,description,refno,amount,transferdate,createdon,mode,userid) VALUES (${getsubcontrols.recordset[0].accountsubcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},@description,@refno,@amount,@transferdate,'${formattedDate}',@mode,@userid)`)
          if(insertinto.rowsAffected.length > 0){
            const getinsertedbankpayment = await request.query(`SELECT * FROM banktransfers WHERE transferdate = @transferdate and frombankid = ${getsubcontrols.recordset[0].accountsubcontrolid} and tobankid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
            if(getinsertedbankpayment.recordset.length > 0){
      

              const getyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
              const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubcontrols.recordset[0].accountheadid},${getsubcontrols.recordset[0].accountcontrolid},${getsubcontrols.recordset[0].accountsubcontrolid},'2','2',@amount,'0',@transferdate,'Bank Transfer ${getsubcontrols.recordset[0].accountsubcontrolname}',@userid,'BT ${getinsertedbankpayment.recordset[0].banktransfersid}','${formattedDate}')`)
              if(transaction1.rowsAffected > 0){
                const updatebank = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubcontrols.recordset[0].currentbalance} - @amount WHERE accountsubcontrolid = ${getsubcontrols.recordset[0].accountsubcontrolid}`)
                const updatenominal = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubnominalcontrols.recordset[0].currentbalance} + @amount WHERE accountsubcontrolid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
                
                const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubnominalcontrols.recordset[0].accountheadid},${getsubnominalcontrols.recordset[0].accountcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},'2','2','0',@amount,@transferdate,'Bank Transfer nominal Bank ${getsubnominalcontrols.recordset[0].accountsubcontrolname}',@userid,'BT ${getinsertedbankpayment.recordset[0].banktransfersid}','${formattedDate}')`)
                res.sendStatus(200)
              }else{
                res.sendStatus(402)
                transaction.rollback()
              }
            }
            else{
              res.sendStatus(405)
              transaction.rollback()
            }
          }
          else{
            res.sendStatus(405)
            transaction.rollback()
          }
        }else{
          transaction.rollback()
        }}
    }
else{
  res.sendStatus(405)
  transaction.rollback()
}
}
  } catch (error) {
    console.log(error);
  }
})

router.get('/getbanktransfer',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getpayments = await request.query(`SELECT * FROM banktransfers`)
    if(getpayments.recordset.length > 0){
      res.json(getpayments.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})


/******************************************************JOURNAL ENTRY*****************************************************/
router.post('/addjournalentry',async (req,res)=>{
  const {transferdate,frombankcode,tobankcode,refno,mode,description,amount,userid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('transferdate',sql.Date,transferdate)
    request.input('frombankcode',sql.VarChar,frombankcode)
    request.input('tobankcode',sql.VarChar,tobankcode)
    request.input('refno',sql.VarChar,refno)
    request.input('mode',sql.VarChar,mode)
    request.input('description',sql.VarChar,description)
    request.input('amount',sql.Float,amount)
    request.input('userid',sql.BigInt,userid)
    if(frombankcode == tobankcode){
      res.sendStatus(409)
    }else{

      
      const transaction = new sql.Transaction()
      transaction.begin()
    // Create a new Date object with the current date and time
    const currentDate = new Date();
    
// Get the individual components of the date
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Add 1 to the result to get the standard format (1-12)
const day = currentDate.getDate();

// Format the date in "MM/DD/YYYY" format
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    const getsubcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @frombankcode`)
    if(getsubcontrols.recordset.length > 0){
      if(getsubcontrols.recordset[0].currentbalance < amount){
        res.sendStatus(405)
      }else{

      
      const getsubnominalcontrols = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolcode = @tobankcode`)
        if(getsubnominalcontrols.recordset.length > 0){

          const insertinto = await request.query(`INSERT INTO journalentry (debitaccount,creditaccount,description,refno,amount,journaldate,createdon,mode,userid) VALUES (${getsubcontrols.recordset[0].accountsubcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},@description,@refno,@amount,@transferdate,'${formattedDate}',@mode,@userid)`)
          if(insertinto.rowsAffected.length > 0){
            const getinsertedbankpayment = await request.query(`SELECT * FROM journalentry WHERE journaldate = @transferdate and debitaccount = ${getsubcontrols.recordset[0].accountsubcontrolid} and creditaccount = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
            if(getinsertedbankpayment.recordset.length > 0){
      

              const getyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
              const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubcontrols.recordset[0].accountheadid},${getsubcontrols.recordset[0].accountcontrolid},${getsubcontrols.recordset[0].accountsubcontrolid},'2','2',@amount,'0',@transferdate,'Journal Entry ${getsubcontrols.recordset[0].accountsubcontrolname}',@userid,'JE ${getinsertedbankpayment.recordset[0].journalentryid}','${formattedDate}')`)
              if(transaction1.rowsAffected > 0){
                const updatebank = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubcontrols.recordset[0].currentbalance} - @amount WHERE accountsubcontrolid = ${getsubcontrols.recordset[0].accountsubcontrolid}`)
                const updatenominal = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsubnominalcontrols.recordset[0].currentbalance} + @amount WHERE accountsubcontrolid = ${getsubnominalcontrols.recordset[0].accountsubcontrolid}`)
                
                const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid,voucher,createdon) VALUES (${getyear.recordset[0].financialyearid},${getsubnominalcontrols.recordset[0].accountheadid},${getsubnominalcontrols.recordset[0].accountcontrolid},${getsubnominalcontrols.recordset[0].accountsubcontrolid},'2','2','0',@amount,@transferdate,'Journal Entry ${getsubnominalcontrols.recordset[0].accountsubcontrolname}',@userid,'JE ${getinsertedbankpayment.recordset[0].journalentryid}','${formattedDate}')`)
                res.sendStatus(200)
              }else{
                res.sendStatus(402)
                transaction.rollback()
              }
            }
            else{
              res.sendStatus(405)
              transaction.rollback()
            }
          }
          else{
            res.sendStatus(405)
            transaction.rollback()
          }
        }else{
          transaction.rollback()
        }}
    }
else{
  res.sendStatus(405)
  transaction.rollback()
}
}
  } catch (error) {
    console.log(error);
  }
})

router.get('/getjournalentry',async (req,res)=>{
  try {
    await sql.connect(config)
    const alljournals =await sql.query(`SELECT * FROM journalentry`)
    if(alljournals.recordset.length > 0){
      res.json(alljournals.recordset);
    }
  } catch (error) {
    console.log(error);
  }
})
/****************************************ACCOUNT HEAD ROUTES****************************************/

router.post("/addaccounthead",async(req,res)=>{
  const {accountheadname,accountheadcode,userid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadname',sql.VarChar,accountheadname)
    request.input('accountheadcode',sql.BigInt,accountheadcode)
    request.input('userid',sql.BigInt,userid)
    if(!accountheadname || !accountheadcode){
      res.sendStatus(400)
    }else{
      const checkAccount = await request.query('SELECT * FROM accounthead WHERE accountheadname = @accountheadname OR accountheadcode = @accountheadcode')
      if(checkAccount.recordset.length > 0){
        res.sendStatus(401)
    }
    else{
      const newAccountHead =await request.query('INSERT INTO accounthead (accountheadname,accountheadcode,userid) VALUES (@accountheadname,@accountheadcode,@userid)')
      if(newAccountHead.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(402)
      }
    }
  }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.get('/getaccounthead',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const accounthead = await request.query('SELECT * FROM accounthead')
    if(accounthead.recordset.length > 0){
      res.json(accounthead.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/getaccounthead/:id',async (req,res)=>{
  const id  = req.params.id
try {
  await sql.connect(config)
  const request = new sql.Request()
  const getAccountHead = await request.query(`SELECT * FROM accounthead where accountheadid = ${id}`)
  if(getAccountHead.recordset.length > 0){
    res.json(getAccountHead.recordset)
  }else{
    res.sendStatus(401)
  }
} catch (error) {
  console.log(error);
}finally{
  await sql.close()
}
})

router.post('/updateaccounthead/:id',async (req,res)=>{
  try {
    const id = req.params.id
    const {accountheadname,accountheadcode,userid} = req.body;
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadid',sql.BigInt,id)
    request.input('userid',sql.BigInt,userid)
    request.input('accountheadname',sql.VarChar,accountheadname)
    request.input('accountheadcode',sql.BigInt,accountheadcode)
    if(!accountheadname || !accountheadcode){
      res.sendStatus(401)
    }else{
    
      const checkaccount  = await request.query('SELECT * FROM accounthead WHERE accountheadname = @accountheadname')
      if(checkaccount.recordset.length > 0){
        res.sendStatus(401)
    }else{
      const updatedaccount = await request.query('UPDATE accounthead SET accountheadname = @accountheadname, accountheadcode = @accountheadcode, userid = @userid WHERE accountheadid = @accountheadid')
      console.log(updatedaccount);
      if(updatedaccount.rowsAffected.length > 0){
        res.sendStatus(200)
      }
      else{
        res.sendStatus(402)
      }
    }
  }


  } catch (error) {
    console.log(error);
  }
})




/****************************************FINANCIAL YEAR ROUTES****************************************/

router.get('/getfinancialyear',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getfinancialyear = await request.query('SELECT * FROM financialyear')
    if(getfinancialyear.recordset.length > 0){
      res.json(getfinancialyear.recordset)
    }else
    {
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.post('/addfinancialyear',async (req,res)=>{

  const {financialyear,startdate,enddate,userid,isactive} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('financialyear',sql.VarChar,financialyear)
    request.input('startdate',sql.VarChar,startdate)
    request.input('enddate',sql.VarChar,enddate)
    request.input('userid',sql.BigInt,userid)
    request.input('isactive',sql.VarChar,isactive)
    const checkyear = await request.query('SELECT * FROM financialyear WHERE financialyear = @financialyear')
    if(checkyear.recordset.length>0 ){
      res.sendStatus(401)
    }else{
      const checkActiveState = await request.query('SELECT * FROM financialyear WHERE isactive = 1')
      if(checkActiveState.recordset.length>0){
        if(isactive==1){
          const UpdateFinancialyear = await request.query(`UPDATE financialyear SET isactive = 0 WHERE financialyearid = ${checkActiveState.recordset[0].financialyearid}`)  
        }
      }
      const newyear = await request.query('INSERT INTO financialyear (financialyear,startdate,enddate,userid,isactive) VALUES (@financialyear,@startdate,@enddate,@userid,@isactive)')
      if(newyear.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }
  } catch (error) {
    console.log(error);
  }

})

router.delete('/deletefinancialyear/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('fid',sql.BigInt,id)
    const deleteFinanacialyear = await request.query(`DELETE FROM financialyear WHERE financialyearid = @fid and isactive = 0`)
    if(deleteFinanacialyear.rowsAffected.length > 0){
      res.sendStatus(200)
    }else {
      res.sendStatus(404)
    }
  } catch (error) {
    console.log(error);
  }
})


/****************************************Branch ROUTES****************************************/

router.post("/addbranch",async (req,res)=>{
  const {branchname,branchtypeid,branchcontact,branchaddress} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchname',sql.VarChar,branchname)
    request.input('branchcontact',sql.VarChar,branchcontact)
    request.input('branchaddress',sql.VarChar,branchaddress)
    request.input('branchtypeid',sql.BigInt,branchtypeid)
    const oldBranch = await request.query('SELECT * FROM branch WHERE branchname = @branchname')
    if(oldBranch.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newBranch = await request.query('INSERT INTO branch (branchname,branchcontact,branchaddress,branchtypeid) VALUES (@branchname,@branchcontact,@branchaddress,@branchtypeid)')
      if(newBranch.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }
  } catch (error) {
    console.log(error);
  }finally {
    await sql.close()
  }
} )

router.get('/getbranch',async (req,res)=>{
  try {
    await sql.connect(config)
    const getbranch = await sql.query('SELECT * FROM branch')
    if(getbranch.recordset.length > 0){
      res.json(getbranch.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getbranch/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('branchid',sql.BigInt,id)
    const getBranch = await request.query('SELECT * FROM branch WHERE branchid = @branchid')
    if(getBranch.recordset.length > 0){
      res.json(getBranch.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/updatebranch/:id',async (req,res)=>{
  const id  = req.params.id
  const {branchname,branchcontact,branchaddress} = req.body;
  try {
    await sql.connect(config)
    const request  = new sql.Request()
    request.input('branchid',sql.BigInt,id)
    request.input('branchname',sql.VarChar,branchname)
    request.input('branchcontact',sql.VarChar,branchcontact)
    request.input('branchaddress',sql.VarChar,branchaddress)
    const checkbranch =await request.query('SELECT * FROM branch WHERE branchid = @branchid')
    if(checkbranch.recordset.length > 0){
      const checkname = await request.query('SELECT * FROM branch WHERE branchname = @branchname')
      if(checkname.recordset.length > 0){
        res.sendStatus(400)
      }else{

        const updatebranch =await  request.query('UPDATE branch SET branchname = @branchname, branchcontact = @branchcontact, branchaddress = @branchaddress WHERE branchid = @branchid')
        if(updatebranch.rowsAffected.length > 0){
          res.sendStatus(200)
        }
        else{
          res.sendStatus(401)
        }
      }
      }else{
        res.sendStatus(402)
      }
      
  } catch (error) {
    console.log(error);
  }
})



/****************************************Employees ROUTES****************************************/

router.post('/addemployee',async (req,res)=>{
  const {employeename,employeecontact,employeeemail,employeeaddress,employeecnic,employeedesignation,employeedescription,employeemonthlysalary,branchid,companyid,userid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('employeename',sql.VarChar,employeename)
    request.input('employeecontact',sql.VarChar,employeecontact)
    request.input('employeeemail',sql.VarChar,employeeemail)
    request.input('employeeaddress',sql.VarChar,employeeaddress)
    request.input('employeecnic',sql.VarChar,employeecnic)
    request.input('employeedesignation',sql.VarChar,employeedesignation)
    request.input('employeedescription',sql.VarChar,employeedescription)
    request.input('employeemonthlysalary',sql.VarChar,employeemonthlysalary)
    request.input('branchid',sql.BigInt,branchid)
    request.input('companyid',sql.BigInt,companyid)
    request.input('userid',sql.BigInt,userid)

    const checkemployee = await request.query('SELECT * FROM employee WHERE employeeemail = @employeeemail')
    if(checkemployee.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newemployee = await request.query('INSERT INTO employee VALUES (@employeename,@employeecontact,@employeeemail,@employeeaddress,@employeecnic,@employeedesignation,@employeedescription,@employeemonthlysalary,@branchid,@companyid,@userid)')
      if(newemployee.rowsAffected.length > 0){
      res.sendStatus(200)
      }
    }

  } catch (error) {
    console.log(error);
  }
})

router.get('/getemployee',async (req,res)=>{
  try {
    await sql.connect(config)
    const request  = new sql.Request()
    const getEmployees = await request.query('SELECT * FROM employee')
    console.log(getEmployees);
    if(getEmployees.recordset.length > 0){
      res.json(getEmployees.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.post('/getemployee/:id',async (req,res)=> {
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('employeeid',sql.BigInt,id)
    const checkemployee = await request.query('SELECT * from employee WHERE employeeid = @employeeid')
    if(checkemployee.recordset.length > 0){
      res.json(checkemployee.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/updateemployee/:id',async (req,res)=>{
  const id = req.params.id
  const {employeename,employeecontact,employeeemail,employeeaddress,employeecnic,employeemonthlysalary} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('employeeid',sql.BigInt,id)
    request.input('employeename',sql.VarChar,employeename);
    request.input('employeecontact',sql.VarChar,employeecontact);
    request.input('employeeemail',sql.VarChar,employeeemail);
    request.input('employeeaddress',sql.VarChar,employeeaddress);
    request.input('employeecnic',sql.VarChar,employeecnic);
    request.input('employeemonthlysalary',sql.VarChar,employeemonthlysalary);
    const checkEmployee = await request.query("SELECT * from employee WHERE employeeid = @employeeid")
    if(checkEmployee.recordset.length > 0){
      const updateEmployee = await request.query('UPDATE employee SET employeename = @employeename,employeecontact = @employeecontact ,employeeemail = @employeeemail,employeeaddress = @employeeaddress,employeecnic = @employeecnic,employeemonthlysalary = @employeemonthlysalary WHERE employeeid = @employeeid')
      if(updateEmployee.rowsAffected.length > 0){
        res.sendStatus(200)
      }
      else{
        res.sendStatus(401)
      }
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

/****************************************Company ROUTES****************************************/

router.post('/addcompany',async (req,res)=>{
  const {username,password,confirmpassword,employeename,employeecontact,email,cnic,designation,salary,address,companyname} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('username',sql.VarChar,username)
    request.input('password',sql.VarChar,password)
    request.input('confirmpassword',sql.VarChar,confirmpassword)
    request.input('employeename',sql.VarChar,employeename)
    request.input('employeecontact',sql.VarChar,employeecontact)
    request.input('email',sql.VarChar,email)
    request.input('cnic',sql.VarChar,cnic)
    request.input('designation',sql.VarChar,designation)
    request.input('salary',sql.VarChar,salary)
    request.input('address',sql.VarChar,address)
    request.input('companyname',sql.VarChar,companyname)

    let company = await request.query('SELECT * from company where companyname = @companyname')
    if(company.recordset.length > 0){
      res.sendStatus(401)
    }
    else{
      const newCompany = await request.query('INSERT INTO company VALUES (@companyname)')  
      
      if(newCompany.rowsAffected.length > 0){
        const effectedCompany = await request.query("SELECT * from company WHERE companyname = @companyname") 
        const checkEmail = await request.query('SELECT * FROM employee WHERE employeeemail = @email')
        if(checkEmail.recordset.length > 0){
          res.sendStatus(402)

        }else{
          const newEmployee = await request.query(`INSERT INTO employee VALUES (@employeename,@employeecontact,@email,@address,@cnic,@designation,'',@salary,'1',${effectedCompany.recordset[0].companyid},'0')`)
          if(newEmployee.rowsAffected.length > 0){
            res.sendStatus(200)
          }
        }
        }
    }

  } catch (error) {
    console.log(error);
  }
    
})

router.get('/getcompanies',async (req,res)=> {
  try {
    await sql.connect(config)
    let query = "select distinct companyname as name from company"
    const request = new sql.Request()
    var data =await request.query(query)
    if(data.recordset.length > 0){
      res.json(data.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})


/****************************************Account Control ROUTES****************************************/

router.post('/addaccountcontrol',async (req,res)=>{
  const {accountheadid,accountcontrolname,userid,accountcontrolcode} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadid',sql.BigInt,accountheadid)
    request.input('userid',sql.BigInt,userid)
    request.input('accountcontrolcode',sql.BigInt,accountcontrolcode)
    request.input('accountcontrolname',sql.VarChar,accountcontrolname)
    const checkOldaccount = await request.query('SELECT * from accountcontrol WHERE accountcontrolname = @accountcontrolname')
    if(checkOldaccount.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newAccountcontrol = await request.query(`INSERT INTO accountcontrol (accountcontrolname,accountheadid,userid,accountcontrolcode) VALUES (@accountcontrolname,@accountheadid,@userid,@accountcontrolcode)`)
      if(newAccountcontrol.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(402)
      }
    }

  } catch (error) {
    console.log(error);
  }
})


router.get('/getaccountcontrol',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const accountControls = await request.query('SELECT * FROM accountcontrol')
    if(accountControls.recordset.length > 0){
      res.json(accountControls.recordset);
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/getaccountcontrol/:id',async (req,res)=>{
  const id  = req.params.id
try {
  await sql.connect(config)
  const request = new sql.Request()
  request.input('accountcontrolid',sql.BigInt,id)
  const getAccountHead = await request.query(`SELECT * FROM accountcontrol where accountcontrolid = @accountcontrolid`)
  if(getAccountHead.recordset.length > 0){
    res.json(getAccountHead.recordset)
  }else{
    res.sendStatus(401)
  }
} catch (error) {
  console.log(error);
}finally{
  await sql.close()
}
})

router.get('/getaccountcontrolhead/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadid',sql.BigInt,id)
    const fetchcontrolHeads = await request.query('SELECT accountcontrolname,accountcontrolid,accountcontrolcode FROM accountcontrol as ac,accounthead as ah WHERE ac.accountheadid = ah.accountheadid and ah.accountheadid = @accountheadid')
    if(fetchcontrolHeads.recordset.length > 0){
      res.json(fetchcontrolHeads.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {

    console.log(error);
  }
})

router.post('/getaccountcontrolnamewithaccounthead',async (req,res)=>{
  const {accountheadid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadid',sql.BigInt,accountheadid)
    const getcontrols = await request.query('SELECT * FROM accountcontrol WHERE accountheadid = @accountheadid')
    if(getcontrols.recordset.length > 0){
      res.json(getcontrols.recordset)
    }
    else{
      res.sendStatus(405)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/updateaccountcontrol/:id',async (req,res)=>{
  try {
    const id = req.params.id
    const {accountcontrolname,accountcontrolcode,userid} = req.body;
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountcontrolid',sql.BigInt,id)
    request.input('userid',sql.BigInt,userid)
    request.input('accountcontrolname',sql.VarChar,accountcontrolname)
    request.input('accountcontrolcode',sql.BigInt,accountcontrolcode)
    if(!accountcontrolname || !accountcontrolcode){
      res.sendStatus(401)
    }else{
    
      const checkaccount  = await request.query('SELECT * FROM accountcontrol WHERE accountcontrolname = @accountcontrolname')
      if(checkaccount.recordset.length > 0){
        res.sendStatus(401)
    }else{
      const updatedaccount = await request.query('UPDATE accountcontrol SET accountcontrolname = @accountcontrolname, accountcontrolcode = @accountcontrolcode, userid = @userid WHERE accountcontrolid = @accountcontrolid')
      console.log(updatedaccount);
      if(updatedaccount.rowsAffected.length > 0){
        res.sendStatus(200)
      }
      else{
        res.sendStatus(402)
      }
    }
  }


  } catch (error) {
    console.log(error);
  }
})
/****************************************Account Sub Control ROUTES****************************************/

router.post('/addaccountsubcontrol',async (req,res)=>{
  const {accountcontrolid,accountsubcontrolname,accountheadid, userid,accountsubcontrolcode,accountopeningbalance,accounttype,accountactive} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountcontrolid',sql.BigInt,accountcontrolid)
    request.input('accountheadid',sql.BigInt,accountheadid)
    request.input('userid',sql.BigInt,userid)
    request.input('accountsubcontrolcode',sql.BigInt,accountsubcontrolcode)
    request.input('accountopeningbalance',sql.Float,accountopeningbalance)
    request.input('accountsubcontrolname',sql.VarChar,accountsubcontrolname)
    request.input('accounttype',sql.VarChar,accounttype)
    if(!accountsubcontrolname || !accountsubcontrolname){
      res.sendStatus(403)
    }
    else{

      const checkAccount = await request.query('SELECT * FROM accountsubcontrol where accountsubcontrolname = @accountsubcontrolname and accountsubcontrolcode = @accountsubcontrolcode')
      if(checkAccount.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newSubControl =await  request.query(`INSERT INTO accountsubcontrol (accountsubcontrolname,accountheadid,accountcontrolid,userid,accountsubcontrolcode,currentbalance,openingbalance,accounttype,isactive) VALUES (@accountsubcontrolname,@accountheadid,@accountcontrolid,@userid,@accountsubcontrolcode,@accountopeningbalance,@accountopeningbalance,@accounttype,${accountactive?0:1})`)
      if(newSubControl.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }
  }

  } catch (error) {
    console.log(error);
  }
})

router.get('/getaccountsubcontrol',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getaccountsubcontrol = await request.query('SELECT * FROM accountsubcontrol')
    if(getaccountsubcontrol.recordset.length > 0){
      res.json(getaccountsubcontrol.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
} )

router.post('/getaccountsubcontrolwithheadcontrol',async (req,res)=>{
  const {accountheadid,accountcontrolid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountheadid',sql.BigInt,accountheadid)
    request.input('accountcontrolid',sql.BigInt,accountcontrolid)
    const getsubcontrols = await request.query('SELECT * FROM accountsubcontrol WHERE accountheadid = @accountheadid and accountcontrolid = @accountcontrolid')
    if(getsubcontrols.recordset.length > 0){
      res.json(getsubcontrols.recordset)
    }else{
      res.sendStatus(404)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/getaccountsubcontrol/:id',async (req,res)=>{
  const id  = req.params.id
try {
  await sql.connect(config)
  const request = new sql.Request()
  request.input('accountsubcontrolid',sql.BigInt,id)
  const getAccountHead = await request.query(`SELECT * FROM accountsubcontrol where accountsubcontrolid = @accountsubcontrolid`)
  if(getAccountHead.recordset.length > 0){
    res.json(getAccountHead.recordset)
  }else{
    res.sendStatus(401)
  }
} catch (error) {
  console.log(error);
}finally{
  await sql.close()
}
})

router.post('/updateaccountsubcontrol/:id',async (req,res)=>{
  try {
    const id = req.params.id
    const {accountsubcontrolname,accountsubcontrolcode,userid} = req.body;
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountsubcontrolid',sql.BigInt,id)
    request.input('userid',sql.BigInt,userid)
    request.input('accountsubcontrolname',sql.VarChar,accountsubcontrolname)
    request.input('accountsubcontrolcode',sql.BigInt,accountsubcontrolcode)
    if(!accountsubcontrolname || !accountsubcontrolcode){
      res.sendStatus(401)
    }else{
    
      const checkaccount  = await request.query('SELECT * FROM accountsubcontrol WHERE accountsubcontrolname = @accountsubcontrolname')
      if(checkaccount.recordset.length > 0){
        res.sendStatus(401)
    }else{
      const updatedaccount = await request.query('UPDATE accountsubcontrol SET accountsubcontrolname = @accountsubcontrolname, accountsubcontrolcode = @accountsubcontrolcode, userid = @userid WHERE accountsubcontrolid = @accountsubcontrolid')
      console.log(updatedaccount);
      if(updatedaccount.rowsAffected.length > 0){
        res.sendStatus(200)
      }
      else{
        res.sendStatus(402)
      }
    }
  }


  } catch (error) {
    console.log(error);
  }
})
/****************************************Account Sub Control ROUTES****************************************/

router.get('/getaccountsubcontrolhead/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('accountcontrolid',sql.BigInt,id)
    const getAccountsubcontrol = await request.query('select * from accountcontrol as ac, accountsubcontrol as ascs where ascs.accountcontrolid = ac.accountcontrolid  and ac.accountcontrolid = @accountcontrolid')
    if(getAccountsubcontrol.recordset.length > 0){
      res.json(getAccountsubcontrol.recordset)
    }else{
      res.sendStatus(401)
    }

  } catch (error) {
    console.log(error);
  }
})

router.post('/addaccountflowsetting',async (req,res)=>{
  const {accountheadid,accountcontrolid,accountsubcontrolid,accountactivityid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input("accountheadid",sql.BigInt,accountheadid)
    request.input("accountcontrolid",sql.BigInt,accountcontrolid)
    request.input("accountsubcontrolid",sql.BigInt,accountsubcontrolid)
    request.input("accountactivityid",sql.BigInt,accountactivityid)

    const checkAccountsetting = await request.query('SELECT * FROM accountflowsetting WHERE accountheadid = @accountheadid and accountcontrolid = @accountcontrolid and accountsubcontrolid = @accountsubcontrolid and accountactivityid = @accountactivityid')
    if(checkAccountsetting.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newFlowsetting = await request.query('INSERT INTO accountflowsetting (accountheadid,accountcontrolid,accountsubcontrolid,accountactivityid) VALUES (@accountheadid,@accountcontrolid,@accountsubcontrolid,@accountactivityid)')
      if(newFlowsetting.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(402)
      }
    }

  } catch (error) {
    console.log(error);
  }
})


router.get("/getaccountflowsetting",async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getAccountFlowSetting = await request.query('SELECT * FROM accountflowsetting')
    if(getAccountFlowSetting.recordset.length > 0){
      res.json(getAccountFlowSetting.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})


/****************************************Account Sub Control ROUTES****************************************/

router.post('/addsupplier',async (req,res)=>{
  const {suppliername,supplieremail,suppliercontact,supplieraddress,
    supplierdescription,supplierindustry,supplierpaymentterm,
    suppliercreditlimit,supplierntn,suppliersaletax,openingdate,
    openingbalance,cnic,supplierstn,createdby,bankname,accountnumber,
    accountname,iban,swiftcode,bankaddress,suppliercity,
    supplierprovince,supplierpostalcode,suppliercountry,suppliercoacode} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    console.log(suppliercoacode);
    request.input('suppliername',sql.VarChar,suppliername)
    request.input('supplieremail',sql.VarChar,supplieremail)
    request.input('suppliercontact',sql.VarChar,suppliercontact)
    request.input('supplieraddress',sql.VarChar,supplieraddress)
    request.input('supplierindustry',sql.VarChar,supplierindustry)
    request.input('supplierpaymentterm',sql.VarChar,supplierpaymentterm)
    request.input('suppliercreditlimit',sql.VarChar,suppliercreditlimit)
    request.input('bankname',sql.VarChar,bankname)
    request.input('accountnumber',sql.VarChar,accountnumber)
    request.input('accountname',sql.VarChar,accountname)
    request.input('iban',sql.VarChar,iban)
    request.input('swiftcode',sql.VarChar,swiftcode)
    request.input('bankaddress',sql.VarChar,bankaddress)
    request.input('suppliercity',sql.VarChar,suppliercity)
    request.input('supplierprovince',sql.VarChar,supplierprovince)
    request.input('supplierpostalcode',sql.VarChar,supplierpostalcode)
    request.input('suppliercountry',sql.VarChar,suppliercountry)
    request.input('supplierntn',sql.VarChar,supplierntn)
    request.input('suppliersaletax',sql.VarChar,suppliersaletax)
    request.input('suppliercoacode',sql.VarChar,suppliercoacode)
    request.input('openingdate',sql.Date,openingdate)
    request.input('openingbalance',sql.Float,openingbalance)
    request.input('cnic',sql.BigInt,cnic)
    request.input('createdby',sql.BigInt,createdby)
    request.input('supplierstn',sql.Int,supplierstn)
    request.input('supplierdescription',sql.VarChar,supplierdescription)
    function getCurrentDateAndTime() {
      const now = new Date();
    
      // Get the current year, month, and day
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
    
      // Get the current hours and minutes
      let hours = now.getHours();
      let minutes = now.getMinutes();
    
      // Format the time to 12-hour clock with "am" or "pm"
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12; // Convert to 12-hour format
    
      // Format the hours and minutes with leading zeros if necessary
      hours = String(hours).padStart(2, '0');
      minutes = String(minutes).padStart(2, '0');
    
      // Concatenate the date and time in the desired format
      const formattedDateAndTime = `${year}-${month}-${day} ${hours}:${minutes}${ampm}`;
    
      return formattedDateAndTime;
    }
    
    const currentDateAndTime = getCurrentDateAndTime();
    
    const checkSupplier = await request.query('SELECT * FROM supplier WHERE suppliername = @suppliername or supplieremail = @supplieremail')
    if(checkSupplier.recordset.length > 0){
      res.sendStatus(401)
    }else{
      const newSupplier = await request.query(`INSERT INTO supplier (suppliername,
        supplieremail,suppliercontact,supplieraddress,
        supplierdescription,supplierindustry,
        supplierpaymentterm,suppliercreditlimit,
        supplierntn,suppliersaletax,
        openingdate,openingbalance,
        cnic,supplierstn,createdby,
        createdon,bankname,accountnumber,
        accountname,iban,swiftcode,
        bankaddress,suppliercity,
        supplierprovince,supplierpostalcode,
        suppliercountry,suppliercoacode) 
        VALUES 
        (@suppliername,@supplieremail,@suppliercontact,
          @supplieraddress,@supplierdescription,@supplierindustry,
          @supplierpaymentterm,@suppliercreditlimit,@supplierntn,
          @suppliersaletax,@openingdate,@openingbalance,@cnic,
          @supplierstn,@createdby,'${currentDateAndTime}',@bankname,
          @accountnumber,@accountname,@iban,@swiftcode,
          @bankaddress,@suppliercity,@supplierprovince,
          @supplierpostalcode,@suppliercountry,@suppliercoacode)`)
      if(newSupplier.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(402)
      }
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getsupplierglcode',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getglcode =await request.query(`SELECT * FROM accountsubcontrol WHERE accountcontrolid = 2016`)
    if(getglcode.recordset.length > 0){
      res.json(getglcode.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getsupplier',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getSupplier = await request.query('SELECT * FROM supplier')
    if(getSupplier.recordset.length > 0){
      res.json(getSupplier.recordset)
    }

  } catch (error) {
    console.log(error);
  }
})

router.get('/getsupplier/:id',async (req,res)=>{
  const id = req.params.id;
  try {
    await sql.connect(config)
    const getSupplierwithid = await sql.query(`SELECT * FROM supplier WHERE supplierid = ${id}`)
    res.json(getSupplierwithid.recordset)
  } catch (error) {
    console.log(error);
  }
})

router.post('/updatesupplier/:id',async (req,res)=>{
  const id = req.params.id
  const  {suppliername,suppliercontact,supplieremail,supplierindustry,supplierpaymentterm,suppliercreditlimit} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    request.input('suppliername',sql.VarChar,suppliername)
    request.input('suppliercontact',sql.VarChar,suppliercontact)
    request.input('supplieremail',sql.VarChar,supplieremail)
    request.input('supplierindustry',sql.VarChar,supplierindustry)
    request.input('supplierpaymentterm',sql.VarChar,supplierpaymentterm)
    request.input('suppliercreditlimit',sql.VarChar,suppliercreditlimit)
    const getsupplier = await request.query(`SELECT * FROM supplier WHERE supplierid = @id`)
    if(getsupplier.recordset.length > 0){
      //update query
      const updateSupplier =await  request.query(`UPDATE supplier SET suppliername = @suppliername,suppliercontact = @suppliercontact,supplieremail = @supplieremail,supplierindustry = @supplierindustry,supplierpaymentterm = @supplierpaymentterm,suppliercreditlimit = @suppliercreditlimit WHERE supplierid = @id `)
      if(updateSupplier.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }else{
      res.sendStatus(402)
    }

  } catch (error) {
    console.log(error);
  }
})

router.delete('/deletesupplier/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    const deleteSupplier = await request.query('DELETE FROM supplier WHERE supplierid = @id');
    if(deleteSupplier.rowsAffected.length > 0){
      res.sendStatus(200)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

/****************************************Purchase Cart ROUTES****************************************/

router.post('/addpurchasecart',async (req,res)=>{

  const {productid ,purchasecartquantity,purchasecartcurrentpurchaseprice ,companyid ,branchid ,userid ,purchasecartdescription,saletax,discount,nettotal} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('productid',sql.BigInt,productid)
    request.input('companyid',sql.BigInt,companyid)
    request.input('branchid',sql.BigInt,branchid)
    request.input('userid',sql.BigInt,userid)
    request.input('saletax',sql.Float,saletax)
    request.input('discount',sql.Float,discount)
    request.input('nettotal',sql.Float,nettotal)
    request.input('purchasecartquantity',sql.VarChar,purchasecartquantity)
    request.input('purchasecartcurrentpurchaseprice',sql.VarChar,purchasecartcurrentpurchaseprice)
    
    request.input('purchasecartdescription',sql.VarChar,purchasecartdescription)
    const checkPurchase = await request.query("SELECT * FROM purchasecart WHERE productid = @productid")
    if(checkPurchase.recordset.length > 0){
      res.sendStatus(401)
    }
    else{
      const newPurchase = await request.query('INSERT INTO purchasecart (productid ,purchasecartquantity,purchasecartcurrentpurchaseprice ,companyid ,branchid ,userid,purchasecartdescription,saletax,discount,nettotal) VALUES (@productid ,@purchasecartquantity,@purchasecartcurrentpurchaseprice  ,@companyid ,@branchid ,@userid ,@purchasecartdescription,@saletax,@discount,@nettotal)')
      console.log(newPurchase.rowsAffected);
      if(newPurchase.rowsAffected.length > 0){
        res.sendStatus(200)
      }else{
        res.sendStatus(403)
      }
    }
  } catch (error) {
    console.log(error);
  }
})


router.get('/getpurchasecart',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
     const getpurchasecart =  await request.query('SELECT * FROM purchasecart')
    if(getpurchasecart.recordset.length > 0){
      res.json(getpurchasecart.recordset)
    }else{
        res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.delete('/deletepurchasecart/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('purchasecartid',sql.BigInt,id)
    const deletePurchasecart = await request.query('DELETE FROM purchasecart WHERE purchasecartid = @purchasecartid')
    if(deletePurchasecart.rowsAffected.length > 0){
      res.sendStatus(200)
    }
  } catch (error) {
    console.log(error);
  }
})

// router.post("/addcheckout",async (req,res)=>{
//   let {supplierid,companyid,invoiceno,branchid,totalamount,ordertotal,invoicedate,supplierinvoicedescription,date,userid,saletax,shippingfee,subtotalamount,payment} = req.body;
// console.log(payment);
//   try {
//     const madeinvoiceno = 'PUR' + Date.now().toString();
//     invoiceno = madeinvoiceno;
//     console.log(madeinvoiceno);
//     console.log(String(totalamount));
//     console.log(ordertotal);
//     console.log(subtotalamount);
//     console.log(shippingfee);
//     await sql.connect(config)
//     const request = new sql.Request()
//     request.input('supplierid',sql.BigInt,supplierid)
//     request.input('companyid',sql.BigInt,companyid)
//     request.input('userid',sql.BigInt,userid)
//     request.input('branchid',sql.BigInt,branchid)
//     request.input('invoiceno',sql.VarChar,invoiceno)
//     request.input('shippingfee',sql.VarChar,shippingfee)
//     request.input('totalamount',sql.VarChar,totalamount)
//     request.input('ordertotal',sql.VarChar,ordertotal)
//     request.input('saletax',sql.VarChar,saletax)
//     request.input('subtotalamount',sql.VarChar,subtotalamount)
//     request.input('supplierinvoicedescription',sql.VarChar,supplierinvoicedescription)
//     request.input('invoicedate',sql.Date,invoicedate)
//     const getSupplierInvoice = await request.query("SELECT * FROM supplierinvoice WHERE invoiceno = @invoiceno")
//     if(getSupplierInvoice.recordset.length > 0){
//       res.sendStatus(401)
//     }
//     else{
//       const newSupplierinvoice = await request.query('INSERT INTO supplierinvoice (supplierid,companyid,branchid,totalamount,invoicedate,supplierinvoicedescription,userid,saletax,subtotalamount,shippingfee,invoiceno) VALUES (@supplierid,@companyid,@branchid,@totalamount,@invoicedate,@supplierinvoicedescription,@userid,@saletax,@subtotalamount,@shippingfee,@invoiceno)')
//       console.log(newSupplierinvoice.rowsAffected);
//       if(newSupplierinvoice.rowsAffected.length > 0){
// const getInsertedInvoice = await request.query("SELECT * FROM supplierinvoice WHERE invoiceno = @invoiceno")
// if(getInsertedInvoice.recordset.length > 0){
//   const getPurchaseCart = await request.query("SELECT * FROM purchasecart")
//   getPurchaseCart.recordset.map(async (ele)=>{
//      await sql.query(`INSERT INTO supplierinvoicedetail (supplierinvoiceid, productid,purchasequantity,purchaseunitprice,previouspurchaseunitprice) VALUES (${getInsertedInvoice.recordset[0].supplierinvoiceid},${ele.productid},${ele.purchasecartquantity},${ele.purchasecartcurrentpurchaseprice},${ele.purchasecartpreviouspurchaseprice})`);
//     //  await sql.query(`INSERT INTO supplierinvoicedetail (supplierinvoiceid, productid,purchasequantity,purchaseunitprice,previouspurchaseunitprice,manufacturedate) VALUES (4,5,'sad','asd','2023-3-04','2023-4-05')`);
//     await sql.query(`UPDATE products SET productquantity = productquantity + ${Number(ele.purchasecartquantity)},productcurrentpurchaseprice = ${ele.purchasecartcurrentpurchaseprice},productsalesdata = ${ele.purchasecartsalesdata} WHERE productid = ${ele.productid}`)
//   })

//   if (payment) {
//     const newmadeinvoicepayment = 'PPP' + Date.now().toString();
//     const now = new Date();
// const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
//     const supplierpayment = await sql.query(`INSERT INTO supplierpayment (supplierid, supplierinvoiceid, companyid, branchid, invoiceno, totalamount, paymentamount, remainingbalance, userid, invoicedate) VALUES (${supplierid},${getInsertedInvoice.recordset[0].supplierinvoiceid},'${companyid}','${branchid}','${newmadeinvoicepayment}','${ordertotal}', '${ordertotal}', '0', '${userid}', '${formattedDate}')`);
  
//     if (supplierpayment.rowsAffected.length > 0) {
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(407);
//     }
//   }else{
//     res.sendStatus(200)
//   }

// }else{
//   res.sendStatus(404)
// }
//       }else{
//         res.sendStatus(402)
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }

// })

router.post("/addcheckout", async (req, res) => {
  let { supplierid, companyid, invoiceno, branchid,
     totalamount, ordertotal, invoicedate,
      supplierinvoicedescription, userid,
       saletax, shippingfee, subtotalamount,
        payment,accountactivityid,incometax,
      duedate } = req.body;
if(ordertotal==0 || totalamount == 0){
  res.sendStatus(500)
}
else{
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();
    const getCounter = await sql.query('SELECT * FROM purchasecounter')
    const madeinvoiceno = 'PUR' + '000' + `${getCounter.recordset[0].countervalue}`;
    const updateCounter = await sql.query(`UPDATE purchasecounter SET countervalue = ${getCounter.recordset[0].countervalue} + 1`)
    invoiceno = madeinvoiceno;
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      request.input('supplierid', sql.BigInt, supplierid);
      request.input('companyid', sql.BigInt, companyid);
      request.input('userid', sql.BigInt, userid);
      request.input('branchid', sql.BigInt, branchid);
      request.input('invoiceno', sql.VarChar, invoiceno);
      request.input('shippingfee', sql.VarChar, shippingfee);
      request.input('totalamount', sql.VarChar, totalamount);
      request.input('ordertotal', sql.VarChar, ordertotal);
      request.input('saletax', sql.VarChar, saletax);
      request.input('subtotalamount', sql.VarChar, subtotalamount);
      request.input('supplierinvoicedescription', sql.VarChar, supplierinvoicedescription);
      request.input('invoicedate', sql.Date, invoicedate);
      request.input('duedate', sql.Date, duedate);
      request.input('incometax', sql.Float, incometax);

      const now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDay()
      const currentDate = `${year}-${month<10? '0'+month:month}-${day<10? '0'+day:day}`

      const getSupplierInvoice = await request.query("SELECT * FROM supplierinvoice WHERE invoiceno = @invoiceno");
      if (getSupplierInvoice.recordset.length > 0) {
        await transaction.rollback();
        res.sendStatus(401);
        return;
      }

      const newSupplierinvoice = await request.query(`
        INSERT INTO supplierinvoice 
        (supplierid, 
          companyid,
          branchid,
          totalamount,
          invoicedate,
          supplierinvoicedescription,
          userid, 
          saletax, 
          subtotalamount, 
          shippingfee, 
          invoiceno,
          duedate)

        VALUES 

        (@supplierid, 
         @companyid, 
         @branchid, 
         @totalamount,
         @invoicedate, 
         @supplierinvoicedescription, 
         @userid, 
         @saletax, 
         @subtotalamount, 
         @shippingfee, 
         @invoiceno,
         @duedate)
      `);
      console.log("🚀 ~ file: route.js:2551 ~ router.post ~ newSupplierinvoice:", newSupplierinvoice)
      
      if (newSupplierinvoice.rowsAffected.length > 0) {
        const getInsertedInvoice = await request.query("SELECT * FROM supplierinvoice WHERE invoiceno = @invoiceno");
        
        if (getInsertedInvoice.recordset.length > 0) {
          const newSupplierremaininginvoice = await request.query(`
        INSERT INTO supplierremaininginvoice 
        (supplierid, 
        totalamount,
        invoicedate, 
        supplierinvoicedescription, 
        userid,
        saletax, 
        subtotalamount, 
        shippingfee,
        invoiceno,
        supplierinvoiceid,
        duedate)

        VALUES

        (@supplierid, 
        @totalamount, 
        @invoicedate,
        @supplierinvoicedescription, 
        @userid,
        @saletax, 
        @subtotalamount, 
        @shippingfee,
        @invoiceno,
        ${getInsertedInvoice.recordset[0].supplierinvoiceid},
        @duedate)
      `);
          const getPurchaseCart = await request.query("SELECT * FROM purchasecart");
          
          for (const ele of getPurchaseCart.recordset) {
            await request.query(`
              INSERT INTO supplierinvoicedetail (supplierinvoiceid, productid, purchasequantity, purchaseunitprice)
              VALUES (${getInsertedInvoice.recordset[0].supplierinvoiceid}, ${ele.productid}, ${ele.purchasecartquantity}, ${ele.purchasecartcurrentpurchaseprice})
            `);

            await request.query(`
              UPDATE products
              SET productquantity = productquantity + ${Number(ele.purchasecartquantity)},
                  productcurrentpurchaseprice = ${ele.purchasecartcurrentpurchaseprice},
                  productsalesdata = ${ele.purchasecartcurrentpurchaseprice}
              WHERE productid = ${ele.productid}
            `);
          }
          var accountheadid = 0
          var accountcontrolid = 0
          var accountsubcontrolid = 0

          const debitentry = await sql.query('SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7')
          
          if(debitentry.recordset.length > 0){
              accountheadid = debitentry.recordset[0].accountheadid
              accountcontrolid = debitentry.recordset[0].accountcontrolid
              accountsubcontrolid = debitentry.recordset[0].accountsubcontrolid
              const financialYear = await sql.query("SELECT * FROM financialyear where isactive = 1")
     
              if(financialYear.recordset.length > 0){
                const supplier = await sql.query(`SELECT * FROM supplier WHERE supplierid = ${supplierid}`)
                if(supplier.recordset.length>0){
                  const now1 = new Date();
                  const formattedDate = now1.toISOString().slice(0, 19).replace("T", " ");
                  var transactionInvoice ="PPP" + formattedDate;
                  const transactionTitle = 'PURCHASE from ' + supplier.recordset[0].suppliername;
                  const setdebitentry = 
                  await sql.query(`INSERT INTO transactions
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid,
                    createdon)
                     VALUES 
                     ('${financialYear.recordset[0].financialyearid}',
                     '${accountheadid}',
                     '${accountcontrolid}',
                     '${accountsubcontrolid}',
                     '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                     '${companyid}',
                     '${ordertotal}',
                     '0',
                     '${invoicedate}',
                     '${transactionTitle}',
                     '${userid}',
                     '${formattedDate}'
                     )`)                 
                     
                  if(setdebitentry.rowsAffected.length > 0){
                    const updatecontrol = 
                    await 
                    request.query(
                      `UPDATE accountsubcontrol 
                      SET currentbalance = ${debitentry.recordset[0].currentbalance} + ${ordertotal}
                     WHERE accountsubcontrolid = ${debitentry.recordset[0].accountsubcontrolid}`)
                    const getAccountpendingActivity = await sql.query("SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 90")
                    
                    if(getAccountpendingActivity.recordset.length > 0){
                      accountheadid = getAccountpendingActivity.recordset[0].accountheadid;
                      accountcontrolid = getAccountpendingActivity.recordset[0].accountcontrolid;
                      accountsubcontrolid = getAccountpendingActivity.recordset[0].accountsubcontrolid;
                      //Credit Entry Payment Pending Entity
                      const transactionTitlecredit = 'PURCHASE Payment Is Pending ' + supplier.recordset[0].suppliername;
                      const setcreditentry =
                       await sql.query(`INSERT INTO transactions
                        (financialyearid,
                          accountheadid,
                          accountcontrolid,
                          accountsubcontrolid,
                          voucher,
                          companyid,
                          credit,
                          debit,
                          transactiondate,
                          transactiontitle,
                          userid,
                          createdon)
                           VALUES 
                           ('${financialYear.recordset[0].financialyearid}',
                           '${accountheadid}',
                           '${accountcontrolid}',
                           '${accountsubcontrolid}',
                           '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                           '${companyid}',
                           '0',
                           '${(ordertotal*(10**2))/10**2}',
                           '${invoicedate}',
                           '${transactionTitlecredit}',
                           '${userid}',
                           '${formattedDate}'')`)
                      if(setcreditentry.rowsAffected.length > 0){
                        
                        const updatecontrol2 = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getAccountpendingActivity.recordset[0].currentbalance} + ${Math.floor(ordertotal)} WHERE accountsubcontrolid = ${getAccountpendingActivity.recordset[0].accountsubcontrolid}`)
                        const getAccounttax =
                  await request.query(`SELECT * From accountsubcontrol 
                  Where accountsubcontrolid = 9`)
                  const taxentry = await 
                  sql.query(`INSERT INTO
                  transactions 
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid,
                      createdon
                      )
                      VALUES
                      ('${financialYear.recordset[0].financialyearid}',
                      '${getAccounttax.recordset[0].accountheadid}',
                      '${getAccounttax.recordset[0].accountcontrolid}',
                      '${getAccounttax.recordset[0].accountsubcontrolid}',
                      '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                      '${companyid}',
                      '0',
                      '${ parseFloat(saletax,10)}',
                       '${invoicedate}',
                       'TAX ENTRY 1',
                       '${userid}',
                       '${formattedDate}'
                       )`)
                       const getAccounttaxupdate =
                       await request.query(`UPDATE accountsubcontrol 
                       SET currentbalance = ${getAccounttax.recordset[0].currentbalance} + ${Math.floor(saletax)}
                       Where accountsubcontrolid = 9`)
                       const getagaincreditors = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 90`)
                    const taxentry2 =
                    await 
                    sql.query(`INSERT
                    INTO transactions
                       (financialyearid,
                        accountheadid,
                        accountcontrolid,
                        accountsubcontrolid,
                        voucher,
                        companyid,
                        credit,
                        debit,
                        transactiondate,
                        transactiontitle,
                        userid,
                        createdon)
                        VALUES
                        ('${financialYear.recordset[0].financialyearid}',
                        '${getagaincreditors.recordset[0].accountheadid}',
                        '${getagaincreditors.recordset[0].accountcontrolid}',
                        '${getagaincreditors.recordset[0].accountsubcontrolid}',
                        '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                        '${companyid}',
                        '${saletax}',
                        '0',
                        '${invoicedate}',
                        'TAX ENTRY 2',
                        '${userid}',
                        '${formattedDate}'
                        )`)
                        const getAccountcreditorupdate =
                        await request.query(`UPDATE accountsubcontrol 
                        SET currentbalance = ${getagaincreditors.recordset[0].currentbalance} - ${Math.floor(saletax)}
                        Where accountsubcontrolid = 90`)
                              
                      }
                    }else{
                      transaction.rollback()
                      res.sendStatus(410)
                    }
                  }
                }else{
                  transaction.rollback()
                  res.sendStatus(409)
                }
              }else{
                transaction.rollback()
                res.sendStatus(408)
              }
              
          const truncatePurchaseCart = await sql.query("truncate table purchasecart")
            }else{
            transaction.rollback()
            res.sendStatus(405)
          }

          if (payment) {
            if(incometax){
            const newmadeinvoicepayment = 'PPP' + Date.now().toString();
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
            const supplierpayment = await request.query(`
            INSERT INTO supplierpayment 
            (supplierid, 
            supplierinvoiceid, 
            companyid, 
            branchid, 
            invoiceno, 
            totalamount, 
            paymentamount, 
            remainingbalance, 
            userid, 
            invoicedate,
            createdon)
            VALUES 
            (${supplierid}, 
              ${getInsertedInvoice.recordset[0].supplierinvoiceid}, 
              '${companyid}', 
              '${branchid}', 
              '${newmadeinvoicepayment}', 
              '${ordertotal}', 
              '${ordertotal}', 
              '0', 
              '${userid}', 
              '${invoicedate}',
              '${formattedDate}')
            `);
            if (supplierpayment.rowsAffected.length > 0) {
              //Payment Paid Transaction
              const getAccountPaid = await sql.query(`SELECT * From accountsubcontrol Where accountsubcontrolid = ${accountactivityid}`)
              if(getAccountPaid.recordset.length > 0){
                const supplier2 = await sql.query(`SELECT * FROM supplier where supplierid = ${supplierid}`)
                const transactionTitlepaid = 'PURCHASE Payment Is Paid ' + supplier2.recordset[0].suppliername;
                
                const financialyear = await sql.query('SELECT * FROM financialyear where isactive = 1')
                
                const setcreditentry = await sql.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES
                  ('${financialyear.recordset[0].financialyearid}',
                    '${getAccountPaid.recordset[0].accountheadid}',
                    '${getAccountPaid.recordset[0].accountcontrolid}',
                    '${getAccountPaid.recordset[0].accountsubcontrolid}',
                    '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                    '${companyid}',
                    '${ordertotal - incometax}',
                    '0',
                    '${invoicedate}',
                    '${transactionTitlepaid}',
                    '${userid}',
                    '${formattedDate}')`)
                
                    if(setcreditentry.rowsAffected.length > 0){
                  
                const getAccountPaidupdate = await sql.query(`UPDATE accountsubcontrol SET currentbalance = ${getAccountPaid.recordset[0].currentbalance} - (${Math.floor(ordertotal) - Math.floor(incometax)}) Where accountsubcontrolid = ${accountactivityid}`)
                
                
                if(getAccountPaidupdate.rowsAffected.length > 0){

                  const getAccountsetting =
                  await request.query(`SELECT * From accountsubcontrol 
                Where accountsubcontrolid = 7`)
                
                
                const setcreditentry = 
                await request.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES 
                  ('${financialyear.recordset[0].financialyearid}',
                  '${getAccountsetting.recordset[0].accountheadid}',
                  '${getAccountsetting.recordset[0].accountcontrolid}',
                  '${getAccountsetting.recordset[0].accountsubcontrolid}',
                  '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                  '${companyid}',
                  '0',
                  '${ordertotal - incometax}',
                  '${invoicedate}',
                  '${transactionTitlepaid}',
                  '${userid}',
                  '${formattedDate}'
                  )`)
                  
                  const getAccountsettingupdate =
                  await request.query(`UPDATE accountsubcontrol 
                  SET currentbalance = ${getAccountsetting.recordset[0].currentbalance} - ${Math.floor(ordertotal) - Math.floor(incometax)}
                  Where accountsubcontrolid = 7`)
                  
                  const gettaxaccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)
                  const incometaxentry = 
                await request.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES 
                  ('${financialyear.recordset[0].financialyearid}',
                  '${gettaxaccount.recordset[0].accountheadid}',
                  '${gettaxaccount.recordset[0].accountcontrolid}',
                  '${gettaxaccount.recordset[0].accountsubcontrolid}',
                  '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                  '${companyid}',
                  '${incometax}',
                  '0',
                  '${invoicedate}',
                  'Income Tax In Tax Account',
                  '${userid}',
                  '${formattedDate}'
                  )`)
                  const updatetaxaccount = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${gettaxaccount.recordset[0].currentbalance} + ${incometax} WHERE accountsubcontrolid = ${gettaxaccount.recordset[0].accountsubcontrolid}` )
                  const getsuppliertaxaccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
                  const incometaxsupplierentry = 
                await request.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES 
                  ('${financialyear.recordset[0].financialyearid}',
                  '${getsuppliertaxaccount.recordset[0].accountheadid}',
                  '${getsuppliertaxaccount.recordset[0].accountcontrolid}',
                  '${getsuppliertaxaccount.recordset[0].accountsubcontrolid}',
                  '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                  '${companyid}',
                  '0',
                  '${incometax}',
                  '${invoicedate}',
                  'Income Tax From Supplier',
                  '${userid}',
                  '${formattedDate}'
                  )`)
                  const updatesupplieraccount = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getsuppliertaxaccount.recordset[0].currentbalance} - ${incometax} WHERE accountsubcontrolid = ${getsuppliertaxaccount.recordset[0].accountsubcontrolid}`)
                      }
                  
             
                    }
              }
              await transaction.commit();
              res.sendStatus(200);
            } else {
              await transaction.rollback();
              res.sendStatus(407);
            }
            await sql.query(`delete from supplierremaininginvoice where supplierinvoiceid = ${getInsertedInvoice.recordset[0].supplierinvoiceid}`)
          } else{

            console.log("INSIDE");
            const newmadeinvoicepayment = 'PPP' + Date.now().toString();
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
            const supplierpayment = await request.query(`
            INSERT INTO supplierpayment 
            (supplierid, 
            supplierinvoiceid, 
            companyid, 
            branchid, 
            invoiceno, 
            totalamount, 
            paymentamount, 
            remainingbalance, 
            userid, 
            invoicedate)
            VALUES 
            (${supplierid}, 
              ${getInsertedInvoice.recordset[0].supplierinvoiceid}, 
              '${companyid}', 
              '${branchid}', 
              '${newmadeinvoicepayment}', 
              '${ordertotal}', 
              '${ordertotal}', 
              '0', 
              '${userid}', 
              '${formattedDate}')
            `);
            if (supplierpayment.rowsAffected.length > 0) {
              //Payment Paid Transaction
              const getAccountPaid = await sql.query(`SELECT * From accountsubcontrol Where accountsubcontrolid = ${accountactivityid}`)
              if(getAccountPaid.recordset.length > 0){
                const supplier2 = await sql.query(`SELECT * FROM supplier where supplierid = ${supplierid}`)
                const transactionTitlepaid = 'PURCHASE Payment Is Paid ' + supplier2.recordset[0].suppliername;
                
                const financialyear = await sql.query('SELECT * FROM financialyear where isactive = 1')
                
                const setcreditentry = await sql.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES
                  ('${financialyear.recordset[0].financialyearid}',
                    '${getAccountPaid.recordset[0].accountheadid}',
                    '${getAccountPaid.recordset[0].accountcontrolid}',
                    '${getAccountPaid.recordset[0].accountsubcontrolid}',
                    '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                    '${companyid}',
                    '${Math.floor(totalamount)}',
                    '0',
                    '${invoicedate}',
                    '${transactionTitlepaid}',
                    '${userid}',
                    '${formattedDate}')`)
                
                    if(setcreditentry.rowsAffected.length > 0){
                  
                const getAccountPaidupdate = await sql.query(`UPDATE accountsubcontrol SET currentbalance = ${getAccountPaid.recordset[0].currentbalance} - ${Math.floor(totalamount)} Where accountsubcontrolid = ${accountactivityid}`)
                
                console.log("🚀 ~ file: route.js:2723 ~ router.post ~ getAccountPaidupdate:", getAccountPaidupdate)
                if(getAccountPaidupdate.rowsAffected.length > 0){

                  const getAccountsetting =
                  await request.query(`SELECT * From accountsubcontrol 
                Where accountsubcontrolid = 7`)
                console.log("🚀 ~ file: route.js:2732 ~ router.post ~ getAccountsetting:", getAccountsetting)
                
                const setcreditentry = 
                await sql.query(`INSERT INTO transactions 
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid,
                  createdon)
                  VALUES 
                  ('${financialyear.recordset[0].financialyearid}',
                  '${getAccountsetting.recordset[0].accountheadid}',
                  '${getAccountsetting.recordset[0].accountcontrolid}',
                  '${getAccountsetting.recordset[0].accountsubcontrolid}',
                  '${getInsertedInvoice.recordset[0].supplierinvoiceid}',
                  '${companyid}',
                  '0',
                  '${Math.round(totalamount)}',
                  '${invoicedate}',
                  '${transactionTitlepaid}',
                  '${userid}',
                  '${formattedDate}'
                  )`)
                  console.log("🚀 ~ file: route.js:2737 ~ router.post ~ setcreditentry:", setcreditentry)
                  const getAccountsettingupdate =
                  await request.query(`UPDATE accountsubcontrol 
                  SET currentbalance = ${getAccountsetting.recordset[0].currentbalance} + ${Math.floor(totalamount)}
                  Where accountsubcontrolid = 7`)
                  console.log("🚀 ~ file: route.js:2757 ~ router.post ~ getAccountsettingupdate:", getAccountsettingupdate)
                  
                      }
                  
             
                    }
              }
              await transaction.commit();
              res.sendStatus(200);
            } else {
              await transaction.rollback();
              res.sendStatus(407);
            }
            await sql.query(`delete from supplierremaininginvoice where supplierinvoiceid = ${getInsertedInvoice.recordset[0].supplierinvoiceid}`)
          }
          } 
          else {
            await transaction.commit();
            res.sendStatus(200);
          }
        } else {
          await transaction.rollback();
          res.sendStatus(404);
        }
      } else {
        await transaction.rollback();
        res.sendStatus(402);
      }
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
}

);

/****************************************Purchase Cart ROUTES****************************************/

router.get('/getsupplierinvoice',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getInvoices = await request.query("SELECT * FROM supplierinvoice")
    if(getInvoices.recordset.length > 0){
      res.json(getInvoices.recordset)
    }
else{
  res.sendStatus(401)
}

  } catch (error) {
    console.log(error);
  }
})

router.get('/getsupplierinvoicedetail',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getInvoices = await request.query("SELECT * FROM supplierinvoicedetail")
    if(getInvoices.recordset.length > 0){
      res.json(getInvoices.recordset)
    }
else{
  res.sendStatus(401)
}

  } catch (error) {
    console.log(error);
  }
})



router.get('/getremainingsupplierinvoices',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const remainingInvoices = await request.query('SELECT * FROM supplierremaininginvoice')
    if(remainingInvoices.recordset.length>0){
      res.json(remainingInvoices.recordset)
    }else{
      res.sendStatus(402)
    }

  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedinvoice/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierinvoiceid',sql.BigInt,id)
    const getsupplierinvoice = await request.query('SELECT * FROM supplierinvoice WHERE supplierinvoiceid = @supplierinvoiceid')
    if(getsupplierinvoice.recordset.length > 0){
     const data1 = getsupplierinvoice.recordset
     const data2 = getsupplierinvoice.recordset[0].picture
      res.json({data1,data2})
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getsupplierinvoicedetailselected/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierinvoiceid',sql.BigInt,id)
    const getSupplierinvoicedetail = await request.query('SELECT * FROM supplierinvoicedetail WHERE supplierinvoiceid = @supplierinvoiceid')
    if(getSupplierinvoicedetail.recordset.length > 0){
      res.json(getSupplierinvoicedetail.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getpendingsupplierinvoices',async (req,res)=>{
  var pendinginvoices = []
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getPendingSupplierinvoices = await request.query('SELECT * FROM supplierinvoice')
    if(getPendingSupplierinvoices.recordset.length>0){
      for (const iterator of getPendingSupplierinvoices.recordset) {
        const getTransactions = await sql.query(`SELECT * FROM transactions WHERE invoiceno = '${iterator.supplierinvoiceid}'`)
        if(getTransactions.rowsAffected[0]==2){
          const pendInvoice = await sql.query(`SELECT * FROM supplierinvoice WHERE supplierinvoiceid = ${iterator.supplierinvoiceid}`)
          pendinginvoices.push(pendInvoice.recordset)
        }
      }
      res.json(pendinginvoices)
      
    }
    else
    {

    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getpendingcustomerinvoices',async (req,res)=>{
  var pendinginvoices = []
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getPendingCustomerinvoices = await request.query('SELECT * FROM customerinvoice')
    if(getPendingCustomerinvoices.recordset.length>0){
      for (const iterator of getPendingCustomerinvoices.recordset) {
        const getTransactions = await sql.query(`SELECT * FROM transactions WHERE invoiceno = '${iterator.customerinvoiceid}'`)
        if(getTransactions.rowsAffected[0]==2){
          const pendInvoice = await sql.query(`SELECT * FROM customerinvoice WHERE customerinvoiceid = ${iterator.customerinvoiceid}`)
          pendinginvoices.push(pendInvoice.recordset)
        }
      }
      res.json(pendinginvoices)
      
    }
    else
    {

    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/paypendinginvoice/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierinvoiceid1`')
    const getSupplierinvoice = await request.query('')
  } catch (error) {
    console.log(error);
  }
})






/****************************************Sale Cart ROUTES****************************************/

router.post('/addsalecart',async (req,res)=>{
  const { productid,
    purchasecartquantity,
    purchasecartsalesdata,
    companyid,
    branchid,discount,
    description,
    itemtax,
    userid,
    productnet} = req.body;
try {
    await sql.connect(config)
    const request =  new sql.Request()
    request.input('Productid',sql.BigInt,productid)
    request.input('purchasecartquantity',sql.BigInt,purchasecartquantity)
    request.input('purchasecartsalesdata',sql.Float,purchasecartsalesdata)
    request.input('companyid',sql.BigInt,companyid)
    request.input('branchid',sql.BigInt,branchid)
    request.input('userid',sql.BigInt,userid)
    request.input('discount',sql.Float,discount)
    request.input('productnet',sql.Float,productnet)
    request.input('description',sql.VarChar,description)
    request.input('itemtax',sql.Float,itemtax)
    const checkcart = await request.query(`SELECT * FROM salecart WHERE productid = @productid`)
    if(checkcart.recordset.length > 0){
      res.sendStatus(403)
    }else{

      const checkProduct = await request.query('SELECT * FROM products WHERE productquantity >= @purchasecartquantity and productid = @productid')
      if(checkProduct.recordset.length > 0){
        const addsalecart = await request.query('INSERT INTO salecart (productid,salequantity,saleunitprice,companyid,branchid,userid,discount,description,saletax,nettotal) VALUES (@productid,@purchasecartquantity,@purchasecartsalesdata,@companyid,@branchid,@userid,@discount,@description,@itemtax,@productnet)')
        if(addsalecart.rowsAffected.length > 0){
          res.sendStatus(200)
        }
        else{
          res.sendStatus(401)
        }
      
    }else{
      res.sendStatus(500)
    }
  }
    
} catch (error) {
  console.log(error);
}
})

router.get('/getsalecart',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getsalecart = await request.query("SELECT * FROM salecart")
    if(getsalecart.recordset.length > 0){
      res.json(getsalecart.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getpurchaseproduct',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getpurchaseproduct = await request.query("SELECT * FROM products WHERE producttypeid=1")
    if(getpurchaseproduct.recordset.length > 0){
      res.json(getpurchaseproduct.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post("/addsalecheckout", async (req, res) => {
  let { supplierid, companyid, invoiceno, branchid,
    totalamount, ordertotal, invoicedate,
    customerinvoicedescription, date,
    userid, saletax, shippingfee, subtotalamount,
    payment,incometax,duedate,bankid } = req.body;
  console.log(payment);
if(ordertotal==0 || totalamount == 0){
  res.sendStatus(500)
}
else{
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();
    
    try {
      await transaction.begin();
      const salecounter =await sql.query('SELECT * FROM salecounter')
      const madeinvoiceno = 'SAL' + '000' + `${salecounter.recordset[0].countervalue}`;
      invoiceno = madeinvoiceno;
      const updateSaleCounter = sql.query(`UPDATE salecounter SET countervalue = ${salecounter.recordset[0].countervalue} + 1 WHERE salecounterid = ${salecounter.recordset[0].salecounterid}`)

      const request = new sql.Request();
      request.input('customercode', sql.BigInt, supplierid);
      request.input('companyid', sql.BigInt, companyid);
      request.input('userid', sql.BigInt, userid);
      request.input('branchid', sql.BigInt, branchid);
      request.input('invoiceno', sql.VarChar, invoiceno);
      request.input('customerinvoicedescription', sql.VarChar, customerinvoicedescription);
      request.input('shippingfee', sql.Float, shippingfee);
      request.input('totalamount', sql.Float, totalamount);
      request.input('ordertotal', sql.Float, ordertotal);
      request.input('incometax', sql.Float, incometax);
      request.input('saletax', sql.Float, saletax);
      request.input('subtotalamount', sql.Float, subtotalamount);
      request.input('invoicedate', sql.Date, invoicedate);
      request.input('duedate', sql.Date, duedate);
      const getCustomerInvoice = await request.query("SELECT * FROM customerinvoice WHERE invoiceno = @invoiceno");
      console.log("🚀 ~ file: route.js:1932 ~ router.post ~ r:", getCustomerInvoice)
      console.log(customerinvoicedescription);
      if (getCustomerInvoice.recordset.length > 0) {
        await transaction.rollback();
        res.sendStatus(401);
        return;
      }

      const newCustomerinvoice = await request.query(`
        INSERT INTO customerinvoice (customerid,  companyid, branchid,  totalamount, invoicedate, userid,tax, subtotalamount, shippingfee, invoiceno,duedate,customerinvoicedescription)
        VALUES (@customercode, @companyid, @branchid, @totalamount, @invoicedate, @userid, @saletax, @subtotalamount, @shippingfee, @invoiceno,@duedate,'${customerinvoicedescription}')
      `);

      if (newCustomerinvoice.rowsAffected.length > 0) {
       
        const getInsertedInvoice = await request.query("SELECT * FROM customerinvoice WHERE invoiceno = @invoiceno");

        if (getInsertedInvoice.recordset.length > 0) {
          const newCustomerremaininginvoice = await request.query(`
          INSERT INTO customerremaininginvoice (customerid, totalamount, invoicedate, userid,tax, subtotalamount, shippingfee,customerinvoiceid,invoiceno)
          VALUES (@customercode, @totalamount, @invoicedate, @userid, @saletax, @subtotalamount, @shippingfee,${getInsertedInvoice.recordset[0].customerinvoiceid},@invoiceno)
        `);
          const getSaleCart = await request.query("SELECT * FROM salecart");

          for (const ele of getSaleCart.recordset) {
          const check =   await sql.query(`
              INSERT INTO customerinvoicedetail (customerinvoiceid, productid, salequantity, saleunitprice,previoussaleprice)
              VALUES (${getInsertedInvoice.recordset[0].customerinvoiceid}, ${ele.productid}, ${ele.salequantity}, ${ele.saleunitprice},${ele.saleunitprice})
            `);
            
              const checkproduct = await sql.query(`SELECT * FROM products WHERE productquantity >= ${ele.salequantity}`)
              if(checkproduct.recordset.length > 0){

                const check2 =   await request.query(`
                UPDATE products
                SET productquantity = productquantity - ${ele.salequantity},
                productcurrentpurchaseprice = ${ele.saleunitprice},
                productsalesdata = ${ele.saleunitprice}
                WHERE productid = ${ele.productid}
                `);
              }else{
                res.sendStatus(500)
                transaction.rollback()
              }
          // const check2 =   await request.query(`
          //     UPDATE products
          //     SET productquantity = productquantity - 2,
          //         productcurrentpurchaseprice = 234,
          //         productsalesdata = 324
          //     WHERE productid = 5002
          //   `);
          }
          var accountheadid = 0
          var accountcontrolid = 0
          var accountsubcontrolid = 0

          const debitentry = await sql.query('SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 68')
          console.log("🚀 ~ file: route.js:1972 ~ router.post ~ debitentry:", debitentry)
          if(debitentry.recordset.length > 0){
              accountheadid = debitentry.recordset[0].accountheadid
              accountcontrolid = debitentry.recordset[0].accountcontrolid
              accountsubcontrolid = debitentry.recordset[0].accountsubcontrolid
              const financialYear = await sql.query("SELECT * FROM financialyear where isactive = 1")
              console.log(financialYear.recordset);
              if(financialYear.recordset.length > 0){
                const supplier = await sql.query(`SELECT * FROM customer WHERE cutomercode = ${supplierid}`)
                console.log("🚀 ~ file: route.js:2007 ~ router.post ~ supplier:", supplier)
                if(supplier.recordset.length>0){
                  const now1 = new Date();
                  const formattedDate = now1.toISOString().slice(0, 19).replace("T", " ");
                  const transactionTitle = 'Sale To ' + supplier.recordset[0].customername;
                  const setdebitentry = 
                  await sql.query(`INSERT INTO transactions
                   (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                    
                    VALUES 
                    
                    ('${financialYear.recordset[0].financialyearid}',
                    '${accountheadid}',
                    '${accountcontrolid}',
                    '${accountsubcontrolid}',
                    'SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                    '${companyid}',
                    '0',
                    '${totalamount}',
                    '${formattedDate}',
                    '${transactionTitle}',
                    '${userid}')
                    `)
                  console.log(setdebitentry.rowsAffected);
          const updatedebitentry = 
          await request.query(`UPDATE accountsubcontrol 
          SET currentbalance = ${debitentry.recordset[0].currentbalance + totalamount} 
          WHERE accountsubcontrolid = 68`)

                  if(setdebitentry.rowsAffected.length > 0){
                    const getAccountpendingActivity = await sql.query("SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46")
                    console.log(getAccountpendingActivity.recordset);
                    if(getAccountpendingActivity.recordset.length > 0){
                      accountheadid = getAccountpendingActivity.recordset[0].accountheadid;
                      accountcontrolid = getAccountpendingActivity.recordset[0].accountcontrolid;
                      accountsubcontrolid = getAccountpendingActivity.recordset[0].accountsubcontrolid;
                      //Credit Entry Payment Pending Entity
                      const transactionTitlecredit = 'Sale Payment Is Pending ' + supplier.recordset[0].customername;
                      const setcreditentry =
                       await sql.query(`INSERT INTO transactions
                        (financialyearid,
                          accountheadid,
                          accountcontrolid,
                          accountsubcontrolid,
                          voucher,
                          companyid,
                          credit,
                          debit,
                          transactiondate,
                          transactiontitle,
                          userid)
                          
                          VALUES
                          
                          ('${financialYear.recordset[0].financialyearid}',
                          '${accountheadid}',
                          '${accountcontrolid}',
                          '${accountsubcontrolid}',
                          'SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                          '${companyid}',
                          '${totalamount}',
                          '0',
                          '${formattedDate}',
                          '${transactionTitlecredit}',
                          '${userid}')
                          `)
                    const updategetAccountpendingActivity = 
                    await request.query(`UPDATE accountsubcontrol 
                    SET currentbalance = ${getAccountpendingActivity.recordset[0].currentbalance + totalamount} 
                    WHERE accountsubcontrolid = 46`)

                    const getAccountsaletax = await sql.query("SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 4002")
                    const setsaletaxentry =
                    await sql.query(`INSERT INTO transactions
                     (financialyearid,
                       accountheadid,
                       accountcontrolid,
                       accountsubcontrolid,
                       voucher,
                       companyid,
                       credit,
                       debit,
                       transactiondate,
                       transactiontitle,
                       userid)
                       
                       VALUES
                       
                       ('${financialYear.recordset[0].financialyearid}',
                       '${getAccountsaletax.recordset[0].accountheadid}',
                       '${getAccountsaletax.recordset[0].accountcontrolid}',
                       '${getAccountsaletax.recordset[0].accountsubcontrolid}',
                       'SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                       '${companyid}',
                       '${saletax}',
                       '0',
                       '${formattedDate}',
                       '${transactionTitlecredit}',
                       '${userid}')
                       `)
                       const updatesaletax = 
                    await request.query(`UPDATE accountsubcontrol 
                    SET currentbalance = ${getAccountsaletax.recordset[0].currentbalance + saletax} 
                    WHERE accountsubcontrolid = 4002`)

                    const getAccountsaletaxsale = await sql.query("SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 68")
                    const setsaletaxentrysale =
                    await sql.query(`INSERT INTO transactions
                     (financialyearid,
                       accountheadid,
                       accountcontrolid,
                       accountsubcontrolid,
                       voucher,
                       companyid,
                       credit,
                       debit,
                       transactiondate,
                       transactiontitle,
                       userid)
                       
                       VALUES
                       
                       ('${financialYear.recordset[0].financialyearid}',
                       '${getAccountsaletaxsale.recordset[0].accountheadid}',
                       '${getAccountsaletaxsale.recordset[0].accountcontrolid}',
                       '${getAccountsaletaxsale.recordset[0].accountsubcontrolid}',
                       'SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                       '${companyid}',
                       '0',
                       '${saletax}',
                       '${formattedDate}',
                       '${transactionTitlecredit}',
                       '${userid}')
                       `)
                       const updatesaletaxsale = 
                    await request.query(`UPDATE accountsubcontrol 
                    SET currentbalance = ${getAccountsaletaxsale.recordset[0].currentbalance - saletax} 
                    WHERE accountsubcontrolid = 68`)
                  }else{
                      transaction.rollback()
                      res.sendStatus(410)
                    }
                  }
                }else{
                  transaction.rollback()
                  res.sendStatus(409)
                }
              }else{
                transaction.rollback()
                res.sendStatus(408)
              }
              
          const truncatePurchaseCart = await sql.query("truncate table salecart")
            }else{
            transaction.rollback()
            res.sendStatus(405)
          }

          if (payment) {
            const newmadeinvoicepayment = 'SSS' + Date.now().toString();
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
            const supplierpayment = await request.query(`
            INSERT INTO customerpayment (customerid, customerinvoiceid, companyid, branchid, invoiceno, totalamount, paidamount, userid,remainingbalance)
            VALUES (${supplierid}, ${getInsertedInvoice.recordset[0].customerinvoiceid}, '${companyid}', '${branchid}', '${newmadeinvoicepayment}', '${ordertotal}', '${ordertotal}', '${userid}','0')
            `);
            console.log("🚀 ~ file: route.js:2055 ~ router.post ~ supplierpayment:", supplierpayment)
            if (supplierpayment.rowsAffected.length > 0) {
              //Payment Paid Transaction
              const getAccountPaid = await sql.query(`SELECT * From accountsubcontrol Where accountsubcontrolid = ${bankid}`)
              if(getAccountPaid.recordset.length > 0){
                const supplier2 = await sql.query(`SELECT * FROM customer where cutomercode = ${supplierid}`)
                const transactionTitlepaid = 'Sale Payment Is Paid From ' + supplier2.recordset[0].customername;
                const transactionTitlepaidbank = 'Sale Payment Is Paid To ' + bankid;
                const financialyear = await sql.query('SELECT * FROM financialyear where isactive = 1')
    
                const setcreditentry = 
                await sql.query(`INSERT INTO transactions
                 (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid)
                   VALUES 
                   ('${financialyear.recordset[0].financialyearid}',
                   '${getAccountPaid.recordset[0].accountheadid}',
                   '${getAccountPaid.recordset[0].accountcontrolid}',
                   '${getAccountPaid.recordset[0].accountsubcontrolid}',
                   ' SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                   '${companyid}',
                   '0',
                   '${totalamount}',
                   '${formattedDate}',
                   '${transactionTitlepaidbank}',
                   '${userid}')
                   `)
              const updategetAccountPaid = 
              await request.query(`UPDATE accountsubcontrol 
              SET currentbalance = ${getAccountPaid.recordset[0].currentbalance + totalamount} 
              Where accountsubcontrolid = ${bankid}`)
              const getdebitors = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
                const setcreditentry2 =
                 await sql.query(`INSERT INTO transactions
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                     VALUES
                      ('${financialyear.recordset[0].financialyearid}',
                      '${getdebitors.recordset[0].accountheadid}',
                      '${getdebitors.recordset[0].accountcontrolid}',
                      '${getdebitors.recordset[0].accountsubcontrolid}',
                      ' SP ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                      '${companyid}',
                      '${totalamount}',
                      '0',
                      '${formattedDate}',
                      '${transactionTitlepaid}',
                      '${userid}')
                      `)
              const updatedebitors = 
              await request.query(`UPDATE accountsubcontrol 
              SET currentbalance = ${getdebitors.recordset[0].currentbalance - totalamount} 
              Where accountsubcontrolid = 46`)
if(incometax){
  const getincometaxaccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)

                const taxentry =
                 await sql.query(`INSERT INTO transactions

                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                     VALUES 
                     ('${financialyear.recordset[0].financialyearid}',
                     '${getincometaxaccount.recordset[0].accountheadid}',
                     '${getincometaxaccount.recordset[0].accountcontrolid}',
                     '${getincometaxaccount.recordset[0].accountsubcontrolid}',
                     ' TE ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                     '${companyid}',
                     '0',
                     '${incometax}',
                     '${formattedDate}',
                     'Income Tax Paid To Customer',
                     '${userid}')
                     `)
                     const updateincometaxaccount = await request.query(`UPDATE accountsubcontrol SET currentbalance = ${getincometaxaccount.recordset[0].currentbalance - incometax} WHERE accountsubcontrolid = 61`)
                     const getagainbank = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
                const taxentry2 =
                 await sql.query(`INSERT INTO transactions
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                     VALUES 
                     ('${financialyear.recordset[0].financialyearid}',
                     '${getagainbank.recordset[0].accountheadid}',
                     '${getagainbank.recordset[0].accountcontrolid}',
                     '${getagainbank.recordset[0].accountsubcontrolid}',
                     ' TE ${getInsertedInvoice.recordset[0].customerinvoiceid}',
                     '${companyid}',
                     '${incometax}',
                     '0',
                     '${formattedDate}',
                     'Income Tax Paid To Customer',
                     '${userid}')
                     `)
                     const updatebankagain = 
                     await request.query(`UPDATE accountsubcontrol 
                     SET currentbalance = ${getagainbank.recordset[0].currentbalance - incometax} 
                     WHERE accountsubcontrolid = ${bankid}`)
                  }
                  
             
              }
              await transaction.commit();
              res.sendStatus(200);
            } else {
              await transaction.rollback();
              res.sendStatus(407);
            }
            await sql.query(`delete from customerremaininginvoice where customerinvoiceid = ${getInsertedInvoice.recordset[0].customerinvoiceid}`)
          } 
          else {
            await transaction.commit();
            res.sendStatus(200);
          }
        } else {
          await transaction.rollback();
          res.sendStatus(404);
        }
      } else {
        await transaction.rollback();
        res.sendStatus(402);
      }
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
}
);

router.delete('/deletesalecartcart/:id',async (req,res)=>{
  const id = req.params.id
  try {
      await sql.connect(config)
      const request = new sql.Request()
      request.input('productid',sql.BigInt,id)
      const deleteProduct = await request.query('DELETE FROM salecart WHERE productid = @productid')
      if(deleteProduct.rowsAffected.length > 0){
        res.sendStatus(200)
      }


  } catch (error) {
    console.log(error);
  }
})

router.get('/getpendingcustomerinoives',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getPendingInvoices = await request.query('SELECT * FROM customerremaininginvoice')
    if(getPendingInvoices.recordset.length>0){
      res.json(getPendingInvoices.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedsupplierpendinginvoices/:id',async (req,res)=>{
  const id = req.params.id 
  try {
   await sql.connect(config)
   const request = new sql.Request()
   request.input('supplierid',sql.BigInt,id)
   const getPendinginvoices = await request.query('SELECT * FROM supplierremaininginvoice WHERE supplierid = @supplierid')
   if(getPendinginvoices.recordset.length > 0){
     res.json(getPendinginvoices.recordset)
   }else{
     res.sendStatus(403)
   }
  } catch (error) {
   console.log(error);
  }
 })

router.get('/getselectedremainingsupplierinvoice/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierremaininginvoiceid',sql.BigInt,id)
    const getInvoices = await request.query('SELECT * FROM supplierremaininginvoice WHERE supplierremaininginvoice = @supplierremaininginvoiceid')
    if(getInvoices.recordset.length > 0){
      res.json(getInvoices.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/addremainingreturnpayment/:id',async (req,res)=>{
  const id = req.params.id
  const {payamount,transactiondate} = req.body;
try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierreturnremaininginvoiceid',sql.BigInt,id)
    request.input('payamount',sql.BigInt,payamount)
    request.input('transactiondate',sql.Date,transactiondate)
    const getRemainingreturninvoice = await request.query('SELECT * FROM supplierreturnremaininginvoice WHERE supplierreturnremaininginvoice = @supplierreturnremaininginvoiceid')
    console.log("🚀 ~ file: route.js:2287 ~ router.post ~ getRemainingreturninvoice:", getRemainingreturninvoice)
    if(getRemainingreturninvoice.recordset.length > 0){
      const getPayment = await request.query(`SELECT * FROM supplierpayment WHERE supplierreturninvoiceid = ${getRemainingreturninvoice.recordset[0].supplierreturninvoiceid}`)
      if(getPayment.recordset.length > 0){
        let checkamount = getRemainingreturninvoice.recordset[0].paidamount? parseInt(getRemainingreturninvoice.recordset[0].paidamount):0
        console.log(checkamount);
        console.log(parseInt( payamount,10));
        console.log(getRemainingreturninvoice.recordset[0].totalamount);
        console.log(checkamount + parseInt( payamount,10) > getRemainingreturninvoice.recordset[0].totalamount);
        
        if(checkamount + parseInt( payamount,10) > getRemainingreturninvoice.recordset[0].totalamount + getRemainingreturninvoice.recordset[0].tax){
          res.sendStatus(406)
        }
        else if( checkamount + Math.floor(payamount) == Math.floor(getRemainingreturninvoice.recordset[0].totalamount + parseInt(getRemainingreturninvoice.recordset[0].tax))){
          const updatePayment = await request.query(`UPDATE supplierpayment SET returnamount = ${checkamount} + @payamount WHERE supplierpaymentid = ${getPayment.recordset[0].supplierpaymentid}`)
          const deleteEntity = await request.query(`DELETE FROM supplierreturnremaininginvoice WHERE supplierreturnremaininginvoice = ${getRemainingreturninvoice.recordset[0].supplierreturnremaininginvoice}`)
          
        }
        else{
          const updatePayment = await request.query(`UPDATE supplierpayment SET returnamount = ${checkamount} + @payamount WHERE supplierpaymentid = ${getPayment.recordset[0].supplierpaymentid}`)  
          const updateemainingTable = await request.query(`UPDATE supplierreturnremaininginvoice SET paidamount = ${getRemainingreturninvoice.recordset[0].paidamount} + @payamount WHERE supplierreturnremaininginvoice = ${getRemainingreturninvoice.recordset[0].supplierreturnremaininginvoice}`)
          
        }
      }
      /******************************************************TRANSACTIONS********************************************************/
      const againgetremaining = await request.query(`SELECT * FROM supplierreturnremaininginvoice WHERE supplierreturnremaininginvoice = @supplierreturnremaininginvoiceid `)
      if(againgetremaining.recordset.length > 0){
        if(Math.floor(againgetremaining.recordset[0].totalamount + againgetremaining.recordset[0].tax) <= Math.floor(againgetremaining.recordset[0].paidamount)){
          const deleteen = await request.query(`DELETE FROM supplierreturnremaininginvoice WHERE supplierreturnremaininginvoice = @supplierreturnremaininginvoiceid`)

        }
      }
      const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,voucher,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid) values (4,0,0,0,'SP ${getRemainingreturninvoice.recordset[0].supplierreturninvoiceid}',2,2,0,@payamount,@transactiondate,'DEMO TITLE','5006')`)
      const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,voucher,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid) values (4,0,0,0,'SP ${getRemainingreturninvoice.recordset[0].supplierreturninvoiceid}',2,2,@payamount,0,@transactiondate,'DEMO TITLE','5006')`)
      
      
      if(transaction2.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }

} catch (error) {
  console.log(error);
}
})

//Supplier invoice picture
router.post('/supplierinvoicepic/:id',upload.single('picture'),async(req,res)=>{
  const id = req.params.id
  try {
    const picture  =req.file;
    const pictureData = fs.readFileSync(picture.path)
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierinvoiceid',sql.BigInt,id)
    request.input('picture',sql.VarBinary,pictureData)
    const getSupplierinvoice = await request.query('SELECT * FROM supplierinvoice WHERE supplierinvoiceid = @supplierinvoiceid')
    if(getSupplierinvoice.recordset.length > 0){
      const updatepicture = await request.query('UPDATE supplierinvoice SET picture = @picture WHERE supplierinvoiceid = @supplierinvoiceid')
      if(updatepicture.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }
  } catch (error) {
    console.log(error);
  }
})
/**********************************************************Pay Pending Invoices HERE***********************************************************/ 
router.post('/paypendingsupplierinvoice',async (req,res)=>{
  const {payamount1,invoiceno,bankid,incometax,paymentdate,remarks,bankname} = req.body;
  try {
    const payamount = payamount1
    await sql.connect(config)
    const transaction = new sql.Transaction()
    transaction.begin()
    const request = new sql.Request()
    request.input('invoiceno',sql.BigInt,invoiceno)
    request.input('bankid',sql.BigInt,bankid)
    request.input('payamount',sql.Float,payamount)
    request.input('incometax',sql.Float,incometax)
    request.input('paymentdate',sql.Date,paymentdate)
    request.input('remarks',sql.VarChar,remarks)
    const getSupplierpayment = await request.query('SELECT * FROM supplierpayment WHERE supplierinvoiceid = @invoiceno')
    console.log("🚀 ~ file: route.js:3692 ~ router.post ~ getSupplierpayment:", getSupplierpayment)
    var remainindex = getSupplierpayment.recordset.length
    if(getSupplierpayment.recordset.length>0){
      if(getSupplierpayment.recordset[0].remainingbalance<=0){
       
        transaction.rollback()
      }else{
        console.log(getSupplierpayment.recordset[remainindex-1].paymentamount + payamount);
        if(getSupplierpayment.recordset[remainindex-1].totalamount< parseInt(getSupplierpayment.recordset[remainindex-1].paymentamount,10) + parseInt(payamount,10)){
          transaction.rollback()
        }else{  
          const updatePayment = 
          await request.query(`UPDATE supplierpayment
           SET paymentamount = ${getSupplierpayment.recordset[remainindex-1].paymentamount} + @payamount,
           remainingbalance = ${getSupplierpayment.recordset[remainindex-1].totalamount} -${(parseInt(getSupplierpayment.recordset[remainindex-1].paymentamount,10) + parseInt(payamount,10))},
           paymentdate = @paymentdate,
           remarks = @remarks
            WHERE supplierpaymentid = ${getSupplierpayment.recordset[remainindex-1].supplierpaymentid}`)
        }
      }
    }else{
      const getInvoice = await request.query('SELECT * FROM supplierinvoice WHERE supplierinvoiceid = @invoiceno')
      const now2 = new Date();
      const formattedDate2 = now2.toISOString().slice(0, 19).replace("T", " ");
      const newEntry = 
      await request.query(`INSERT INTO supplierpayment
       (supplierid,
        supplierinvoiceid,
        companyid,
        branchid,
        invoiceno,
        totalamount,
        paymentamount,
        remainingbalance,
        userid,
        invoicedate,
        paymentdate,
        remarks)
        
        VALUES 
        
        (${getInvoice.recordset[0].supplierid},
          ${getInvoice.recordset[0].supplierinvoiceid},
          ${getInvoice.recordset[0].companyid},
          ${getInvoice.recordset[0].branchid},
          '${getInvoice.recordset[0].invoiceno}',
          ${ Math.round(getInvoice.recordset[0].totalamount)},
          ${payamount},
          ${Math.round(getInvoice.recordset[0].totalamount)}-${payamount},
          '0',
          '${formattedDate2.slice(0,10)}',
          @paymentdate,
          @remarks)
          `)
    }
     
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          let accountheadid = 0
          const newmadeinvoicepayment = 'PPP' + Date.now().toString();
          const now = new Date();
          const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
          
            //Payment Paid Transaction
            const getAccountPaid = await request.query("SELECT * From accountsubcontrol Where accountsubcontrolid = @bankid")
            console.log("🚀 ~ file: route.js:3723 ~ router.post ~ getAccountPaid:", getAccountPaid)
            if(getAccountPaid.recordset.length > 0){
              
              accountcontrolid = getAccountPaid.recordset[0].accountcontrolid
              accountsubcontrolid = getAccountPaid.recordset[0].accountsubcontrolid
              accountheadid = getAccountPaid.recordset[0].accountheadid
              const getInvoice = await request.query('SELECT * FROM supplierinvoice WHERE supplierinvoiceid = @invoiceno')
              console.log("🚀 ~ file: route.js:3730 ~ router.post ~ getInvoice:", getInvoice)
              const supplier2 = await sql.query(`SELECT * FROM supplier where supplierid = ${getInvoice.recordset[0].supplierid}`)
              const transactionTitlepaid = 'PURCHASE Payment Is Partially Paying To ' + supplier2.recordset[0].suppliername;
              const transactionTitlepaidbank = 'PURCHASE Payment Is Partially Paying From ' + bankname;
              const financialyear = await sql.query('SELECT * FROM financialyear where isactive = 1')
              // const transa = await sql.query(`SELECT * FROM transactions WHERE voucher = ${getInvoice.recordset[0].supplierinvoiceid}`)              
              
              const setcreditentry = 
              await request.query(`INSERT INTO transactions
              (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                credit,
                debit,
                transactiondate,
                transactiontitle,
                userid)

                 VALUES 

                 ('${financialyear.recordset[0].financialyearid}',
                 '${accountheadid}',
                 '${accountcontrolid}',
                 '${accountsubcontrolid}',
                 'PP ${getInvoice.recordset[0].supplierinvoiceid}',
                 '0',
                 ${payamount-incometax},
                 '0',
                 '${formattedDate}',
                 '${transactionTitlepaidbank}',
                 '0')
                 `)
                 console.log("🚀 ~ file: route.js:3737 ~ router.post ~ setcreditentry:", setcreditentry)
                 const updatebankbalance = 
                 await request.query(`UPDATE accountsubcontrol 
                 SET currentbalance = ${getAccountPaid.recordset[0].currentbalance} - ${payamount - incometax}
                 WHERE accountsubcontrolid = ${bankid}`)
              if(setcreditentry.rowsAffected.length > 0){
                const getsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
                console.log("🚀 ~ file: route.js:3769 ~ router.post ~ getsupplieraccount:", getsupplieraccount)
                const setdeditentry = 
                await request.query(`INSERT INTO transactions
                (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid)

                   VALUES
                   
                   ('${financialyear.recordset[0].financialyearid}',
                   '${getsupplieraccount.recordset[0].accountheadid}',
                   '${getsupplieraccount.recordset[0].accountcontrolid}',
                   '${getsupplieraccount.recordset[0].accountsubcontrolid}',
                   'PP ${getInvoice.recordset[0].supplierinvoiceid}',
                   '0',
                   '0',
                   ${payamount - incometax},
                   '${formattedDate}',
                   '${transactionTitlepaid}',
                   '0')
                   `)
                   console.log("🚀 ~ file: route.js:3770 ~ router.post ~ setdeditentry:", setdeditentry)
                   const updatesupplier =
                    await request.query(`UPDATE accountsubcontrol 
                    SET currentbalance = ${getsupplieraccount.recordset[0].currentbalance} - ${payamount - incometax}
                    WHERE accountsubcontrolid = 7`)
                   if(incometax > 0){
                    const getincometaxaccount =
                    await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)
                    const settaxentry1 = 
                    await request.query(`INSERT INTO transactions
                     (financialyearid,
                      accountheadid,
                      accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid)
      
                       VALUES 
      
                       ('${financialyear.recordset[0].financialyearid}',
                       '${getincometaxaccount.recordset[0].accountheadid}',
                       '${getincometaxaccount.recordset[0].accountcontrolid}',
                       '${getincometaxaccount.recordset[0].accountsubcontrolid}',
                       'IP ${getInvoice.recordset[0].supplierinvoiceid}',
                       '0',
                       ${incometax},
                       '0',
                       '${formattedDate}',
                       'Income Tax from ${supplier2.recordset[0].suppliername}',
                       '0')
                       `) 
                       const updateTaxentry  = 
                       await request.query(`UPDATE accountsubcontrol 
                       SET currentbalance = ${getincometaxaccount.recordset[0].currentbalance} + ${incometax} WHERE accountsubcontrolid = 61`)
                       
                    const getincometaxsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
                    const settaxentry2 = 
                    await request.query(`INSERT INTO transactions
                     (financialyearid,
                      accountheadid,
                      accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid)
      
                       VALUES 
      
                       ('${financialyear.recordset[0].financialyearid}',
                       '${getincometaxsupplieraccount.recordset[0].accountheadid}',
                       '${getincometaxsupplieraccount.recordset[0].accountcontrolid}',
                       '${getincometaxsupplieraccount.recordset[0].accountsubcontrolid}',
                       'IP ${getInvoice.recordset[0].supplierinvoiceid}',
                       '0',
                       '0',
                       ${incometax},
                       '${formattedDate}',
                       'Income Tax ${supplier2.recordset[0].suppliername}',
                       '0')
                       `) 
                       const updateTaxentry2  = await request.query(`UPDATE accountsubcontrol
                        SET currentbalance = ${getincometaxsupplieraccount.recordset[0].currentbalance} - ${incometax}
                         WHERE accountsubcontrolid = 7`)

                   }
                   
              }
              const getremainingtoupdate = await request.query('SELECT * FROM supplierremaininginvoice WHERE supplierinvoiceid = @invoiceno')
              
              const updateremaining = 
              await request.query(`UPDATE supplierremaininginvoice
              SET paidamount = ${ Math.round(getremainingtoupdate.recordset[0].paidamount)==null? 0 +parseInt(payamount,10): getremainingtoupdate.recordset[0].paidamount + parseInt(payamount,10)} 
              WHERE supplierinvoiceid = @invoiceno`)
              
              if(updateremaining.rowsAffected.length > 0){  
                const checkremaining =
                await request.query('SELECT * FROM supplierremaininginvoice WHERE supplierinvoiceid = @invoiceno')
                if(checkremaining.recordset[0].paidamount >= Math.round(checkremaining.recordset[0].totalamount)){
                  const deletTable = 
                  await request.query('delete from supplierremaininginvoice WHERE supplierinvoiceid = @invoiceno')
                  res.sendStatus(200)
                }else{
                  res.sendStatus(200)
                }
              }
         
      }else{
        res.sendStatus(402)
        transaction.rollback()
      }

  } catch (error) {
    console.log(error);
  }
})

router.post('/payselectedsupplierremaininginvoice',async (req,res)=>{
  const {supplierid,bankid,incometaxrate,paymentdate,remarks} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierid',sql.BigInt,supplierid)
    request.input('paymentdate',sql.Date,paymentdate)
    request.input('remarks',sql.VarChar,remarks)
    const supplier = await request.query('SELECT * FROM supplier WHERE supplierid = @supplierid')
    const getSupplierremainingInvoice =await request.query('SELECT * FROM supplierremaininginvoice WHERE supplierid = @supplierid')
    for(ele of getSupplierremainingInvoice.recordset){
      const now2 = new Date();
      const formattedDate2 = now2.toISOString().slice(0, 19).replace("T", " ");
      const supplierinvoice = await request.query(`SELECT * FROM supplierinvoice WHERE supplierinvoiceid = ${ele.supplierinvoiceid}`)
      const supplierremaining = await request.query(`SELECT * FROM supplierremaininginvoice where supplierinvoiceid = ${ele.supplierinvoiceid}`)
      const supplierpayment = 
      await request.query(`INSERT INTO supplierpayment 
      (supplierid,
        supplierinvoiceid,
        companyid,
        branchid,
        invoiceno,
        totalamount,
        paymentamount,
        remainingbalance,
        userid,
        invoicedate,
        paymentdate,
        remarks)
        
        VALUES
        
        (${supplierremaining.recordset[0].supplierid},
          ${supplierremaining.recordset[0].supplierinvoiceid},
          ${supplierinvoice.recordset[0].companyid},
          '${supplierinvoice.recordset[0].branchid}',
          '${getSupplierremainingInvoice.recordset[0].invoiceno}',
          ${supplierremaining.recordset[0].totalamount},
          ${Math.round(supplierremaining.recordset[0].totalamount)} - ${Math.round(supplierremaining.recordset[0].paidamount)},
          '0',
          ${supplierremaining.recordset[0].userid},
          '${formattedDate2}',
          @paymentdate,
          @remarks)`)
      if(supplierpayment.rowsAffected.length > 0){
        const getYear = await request.query(`SELECT * FROM financialyear where isactive = 1`)
        const getFlow = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
          const newTransactionsEntry = 
          await request.query(`INSERT INTO transactions
           (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiontitle,
            userid)

             VALUES
             
             (${getYear.recordset[0].financialyearid},
              ${getFlow.recordset[0].accountheadid},
              ${getFlow.recordset[0].accountcontrolid},
              ${getFlow.recordset[0].accountsubcontrolid},
              ${supplierinvoice.recordset[0].supplierinvoiceid},
              ${supplierinvoice.recordset[0].companyid},
              ${supplierinvoice.recordset[0].branchid},
              ${ Math.round((supplierinvoice.recordset[0].totalamount) - (supplierinvoice.recordset[0].totalamount*incometaxrate/100))},
              '0',
              'PURCHASE PAYMENT PAID ${supplier.recordset[0].suppliername}',
              '5006')
              `)
              const updatebank = 
              await request.query(`UPDATE accountsubcontrol 
              SET currentbalance = ${getFlow.recordset[0].currentbalance} - ${ Math.round((supplierinvoice.recordset[0].totalamount) - (supplierinvoice.recordset[0].totalamount*incometaxrate/100))} 
              WHERE accountsubcontrolid = ${bankid}`)
          if(newTransactionsEntry.rowsAffected.length > 0){
            const gettradecreditors = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
            const newTransactionsDebit = 
            await sql.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiontitle,
              userid) 
              
              VALUES
              
              (${getYear.recordset[0].financialyearid},
                ${gettradecreditors.recordset[0].accountheadid},
                ${gettradecreditors.recordset[0].accountcontrolid},
                ${gettradecreditors.recordset[0].accountsubcontrolid},
                ${supplierinvoice.recordset[0].supplierinvoiceid},
                ${supplierinvoice.recordset[0].companyid},
                ${supplierinvoice.recordset[0].branchid},
                '0',
                ${ Math.round((supplierinvoice.recordset[0].totalamount) - (supplierinvoice.recordset[0].totalamount*incometaxrate/100))},
                'PURCHASE PAYMENT PAID ${supplier.recordset[0].suppliername}',
                '5006')`)
                const updatesupplieraccount = 
                await request.query(`UPDATE accountsubcontrol SET currentbalance = ${gettradecreditors.recordset[0].currentbalance} - ${ Math.round((supplierinvoice.recordset[0].totalamount) - (supplierinvoice.recordset[0].totalamount*incometaxrate/100))} 
                WHERE accountsubcontrolid = 7`)
            console.log("🚀 ~ file: route.js:2507 ~ router.post ~ newTransactionsEntry:", newTransactionsEntry)
            if(incometaxrate>0){
              const getFlow = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)
              const newTransactionsEntry = 
              await sql.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                branchid,
                credit,
                debit,
                transactiontitle,
                userid)
    
                 VALUES
                 
                 (${getYear.recordset[0].financialyearid},
                  ${getFlow.recordset[0].accountheadid},
                  ${getFlow.recordset[0].accountcontrolid},
                  ${getFlow.recordset[0].accountsubcontrolid},
                  ${supplierinvoice.recordset[0].supplierinvoiceid},
                  ${supplierinvoice.recordset[0].companyid},
                  ${supplierinvoice.recordset[0].branchid},
                  ${ Math.round((supplierinvoice.recordset[0].totalamount*incometaxrate/100))},
                  '0',
                  'INCOME TAX FROM ${supplier.recordset[0].suppliername}',
                  '5006')
                  `)
                  const updatebank = 
                  await request.query(`UPDATE accountsubcontrol 
                  SET currentbalance = ${getFlow.recordset[0].currentbalance} + ${ Math.round((supplierinvoice.recordset[0].totalamount*incometaxrate/100))} 
                  WHERE accountsubcontrolid = 61`)
              const getFlow2 = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
              const newTransactionsEntry2 = 
              await sql.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                branchid,
                credit,
                debit,
                transactiontitle,
                userid)
    
                 VALUES
                 
                 (${getYear.recordset[0].financialyearid},
                  ${getFlow2.recordset[0].accountheadid},
                  ${getFlow2.recordset[0].accountcontrolid},
                  ${getFlow2.recordset[0].accountsubcontrolid},
                  ${supplierinvoice.recordset[0].supplierinvoiceid},
                  ${supplierinvoice.recordset[0].companyid},
                  ${supplierinvoice.recordset[0].branchid},
                  '0',
                  ${ Math.round((supplierinvoice.recordset[0].totalamount*incometaxrate/100))},
                  'INCOME TAX FROM ${supplier.recordset[0].suppliername}',
                  '5006')
                  `)
                  const updatebank2 = 
                  await request.query(`UPDATE accountsubcontrol 
                  SET currentbalance = ${getFlow2.recordset[0].currentbalance} - ${ Math.round((supplierinvoice.recordset[0].totalamount*incometaxrate/100))} 
                  WHERE accountsubcontrolid = 7`)
            }
            const deleteRemaining = await sql.query(`DELETE FROM supplierremaininginvoice WHERE supplierremaininginvoice = ${ele.supplierremaininginvoice}`)
            console.log("🚀 ~ file: route.js:2510 ~ router.post ~ deleteRemaining:", deleteRemaining)
          }
      }
    }
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
  }
})

/****************************************Purchase Return ROUTES****************************************/

router.post('/addpurchasereturninvoice',async (req,res)=>{
  const {ordertotal,saletax,subtotalamount,quantities,ids,returndate,paid,selectedproduct,supplierid,bankid} = req.body;
  var totalquantities = 0;
  for (const key of quantities) {
    totalquantities = totalquantities + parseInt(key,10)?parseInt(key,10):0
  }
  try {
    await sql.connect(config)
    const transaction = new sql.Transaction()
    await transaction.begin()
  const request = new sql.Request()
    request.input('ordertotal',sql.Float,Math.floor(ordertotal))
    request.input('saletax',sql.Float,saletax)
    request.input('supplierid',sql.Float,supplierid)
    request.input('subtotalamount',sql.Float,subtotalamount)
    request.input('totalquantities',sql.Float,totalquantities)
    request.input('id',sql.BigInt,ids)
    request.input('returndate',sql.Date,returndate)
 
    const getReturnedInvoice = await request.query('SELECT * FROM supplierreturninvoice WHERE supplierinvoiceid = @id')
    
    const getInvoicedetail = await request.query('SELECT * FROM supplierinvoicedetail WHERE supplierinvoiceid = @id')
    
    const getdetailreturninvoice = await request.query('SELECT * FROM supplierreturninvoicedetail WHERE supplierinvoiceid = @id')
    var responses = false;
    
    if(getInvoicedetail.recordset.length > 0){
      if (getdetailreturninvoice.recordset.length > 0){
          for (const key in getInvoicedetail.recordset) {
            selectedproduct.map(async (row,index)=>{
              
              if(getInvoicedetail.recordset[key].productid == row  && row ==   getdetailreturninvoice.recordset[index].productid){                
                if(parseInt(getInvoicedetail.recordset[key].purchasequantity,10) < parseInt(quantities[index],10) + getdetailreturninvoice.recordset[index].returnquantity){ 
                  responses = true
                }  else{
                  
            const getProduct = await request.query(`SELECT * FROM products WHERE productid = ${row}`)
            const updateProduct = await request.query(`UPDATE products 
            SET productquantity = ${getProduct.recordset[0].productquantity - quantities[index]} 
            WHERE productid = ${getProduct.recordset[0].productid}`)
                }
              }
            }
          )
        }
    }
    else{   
      for(const key in getInvoicedetail.recordset) {
        selectedproduct.map(async (row,index)=>{
        if(getInvoicedetail.recordset[key].productid == row){
          if(getInvoicedetail.recordset[key].purchasequantity <  quantities[index]){ 
            responses = true
          } else{
            const getProduct = await request.query(`SELECT * FROM products WHERE productid = ${row}`)
            const updateProduct = await request.query(`UPDATE products 
            SET productquantity = ${getProduct.recordset[0].productquantity - quantities[index]} 
            WHERE productid = ${getProduct.recordset[0].productid}`)
          }
        }
      }
      )
    }
  }
}

if(responses){
  res.sendStatus(406)
  await transaction.rollback()
  
  console.log("Inside 406");
  return
}
else{
  console.log("inside execution");
  if(getReturnedInvoice.recordset.length > 0){
    const updateReturn = await request.query(`UPDATE supplierreturninvoice
     SET returnamount = ${getReturnedInvoice.recordset[0].returnamount} + @ordertotal, 
     returnquantity = ${getReturnedInvoice.recordset[0].returnquantity} + @totalquantities, 
     tax = ${getReturnedInvoice.recordset[0].tax} + @saletax 
     WHERE supplierinvoiceid = @id`)
      if(updateReturn.rowsAffected.length > 0){
        const updatepaymentTable = await request.query(`UPDATE supplierpayment 
        SET supplierreturninvoiceid = ${getReturnedInvoice.recordset[0].supplierreturninvoiceid} 
        WHERE supplierinvoiceid = @id`)
        const checkremainingreturndetail = await request.query('SELECT * FROM supplierreturninvoicedetail WHERE supplierinvoiceid = @id')
        console.log("🚀 ~ file: route.js:2418 ~ router.post ~ checkremainingreturndetail:", checkremainingreturndetail)
        if(checkremainingreturndetail.recordset.length > 0){
        for (const key in selectedproduct) {
            const updateRemaining  = 
            await request.query(`UPDATE supplierreturninvoicedetail 
            SET returnquantity = ${checkremainingreturndetail.recordset[0].returnquantity} + ${quantities[key]}, 
            returnunitprice = ${checkremainingreturndetail.recordset[0].returnunitprice} + @ordertotal 
            WHERE supplierinvoiceid = @id and productid = ${selectedproduct[key]}`)
            console.log("🚀 ~ file: route.js:4500 ~ router.post ~ updateRemaining:", updateRemaining)
          }
        }else{
          for (const key in selectedproduct) {
             
             await request.query(`INSERT INTO supplierreturninvoicedetail 
             (supplierreturninvoiceid,
              productid,
              returnquantity,
              returnunitprice,
              supplierinvoiceid,
              supplierid)
              
              VALUES 
              
              (${getReturnedInvoice.recordset[0].supplierreturninvoiceid},
                ${selectedproduct[key]},
                ${quantities[key]},
                @ordertotal,
                @id,
                @supplierid)
                `)
            }
        }
        var financialyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
        if(financialyear.recordset.length > 0){

          let accountheadid = 0
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 90`)
          console.log("🚀 ~ file: route.js:4536 ~ router.post ~ getFlowSetting:", getFlowSetting)
          accountheadid = getFlowSetting.recordset[0].accountheadid
          accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
          accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
          const transactionReturn = 
          await request.query(`INSERT INTO transactions
          (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiondate,
            transactiontitle,
            userid)
            
            VALUES 
            
            (${financialyear.recordset[0].financialyearid},
              ${accountheadid},
              ${accountcontrolid},
              ${accountsubcontrolid},
              ${getReturnedInvoice.recordset[0].supplierreturninvoiceid},
              '2',
              '2',
              @ordertotal,
              '0',
              @returndate,
              'PURCHASE RETURN ARRISE 1',
              '5006')
              `)
              console.log("🚀 ~ file: route.js:4540 ~ router.post ~ transactionReturn:", transactionReturn)
              var updategetFlowSetting = await request.query(`UPDATE accountsubcontrol 
              SET currentbalance = ${getFlowSetting.recordset[0].currentbalance - ordertotal}
              WHERE accountsubcontrolid = 90`)
              console.log("🚀 ~ file: route.js:4573 ~ router.post ~ updategetFlowSetting:", updategetFlowSetting)

          if(transactionReturn.rowsAffected.length > 0){
            const getsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
            console.log("🚀 ~ file: route.js:4578 ~ router.post ~ getsupplieraccount:", getsupplieraccount)
            const transactionReturn2 = 
            await request.query(`INSERT INTO transactions
            (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES 
              
              (${financialyear.recordset[0].financialyearid},
                ${getsupplieraccount.recordset[0].accountheadid},
                ${getsupplieraccount.recordset[0].accountcontrolid},
                ${getsupplieraccount.recordset[0].accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].supplierreturninvoiceid},
                '2',
                '2',
                '0',
                @ordertotal,
                @returndate,
                'PURCHASE RETURN ARRISE 2',
                '5006')
                `)
                console.log("🚀 ~ file: route.js:4579 ~ router.post ~ transactionReturn2:", transactionReturn2)
const updatesupplier = await request.query(`UPDATE accountsubcontrol
SET currentbalance = ${getsupplieraccount.recordset[0].currentbalance + ordertotal}
WHERE accountsubcontrolid = 7
`)
console.log("🚀 ~ file: route.js:4612 ~ router.post ~ updatesupplier:", updatesupplier)

            if(transactionReturn2.rowsAffected.length > 0){
              
            }

          }
        }
        
        if(paid){
          const updatepaymentTablepaid = 
          await request.query(`UPDATE supplierpayment 
          SET returnamount = @ordertotal 
          WHERE supplierinvoiceid = @id`)  

          if(updatepaymentTablepaid.rowsAffected.length > 0){    
          let accountheadid = 0
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
          accountheadid = getFlowSetting.recordset[0].accountheadid
          accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
          accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
          const transactionReturn = 
          await request.query(`INSERT INTO transactions 
          (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiondate,
            transactiontitle,
            userid)
            
            VALUES 
            
            (${financialyear.recordset[0].financialyearid},
              ${accountheadid},
              ${accountcontrolid},
              ${accountsubcontrolid},
              ${getReturnedInvoice.recordset[0].supplierreturninvoiceid},
              '2',
              '2',
              '0',
              @ordertotal,
              @returndate,
              'PURCHASE RETURN Paid 3',
              '5006')
              `)
              var updategetFlowSetting = await request.query(`UPDATE accountsubcontrol 
              SET currentbalance = ${getFlowSetting.recordset[0].currentbalance + ordertotal}
              WHERE accountsubcontrolid = ${bankid}`)
              console.log(transactionReturn.rowsAffected.length);
          if(transactionReturn.rowsAffected.length > 0){
            const getsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
            const transactionReturn2 = 
            await request.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES 
              
              (${financialyear.recordset[0].financialyearid},
                ${getsupplieraccount.recordset[0].accountheadid},
                ${getsupplieraccount.recordset[0].accountcontrolid},
                ${getsupplieraccount.recordset[0].accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].supplierreturninvoiceid},
                '2',
                '2',
                @ordertotal,
                '0',
                @returndate,
                'PURCHASE RETURN ARRISE 4',
                '5006')
                `)
const updatesupplier = await request.query(`UPDATE accountsubcontrol
SET currentbalance = ${getsupplieraccount.recordset[0].currentbalance - ordertotal}
WHERE accountsubcontrolid = 7
`)

            if(transactionReturn2.rowsAffected.length > 0){
              res.sendStatus(200)
            }

          }
          }
        }
        else{
          const getremaining =
          await request.query(`SELECT * FROM supplierreturnremaininginvoice 
          WHERE supplierreturninvoiceid = ${getReturnedInvoice.recordset[0].supplierreturninvoiceid}`)
          if(getremaining.recordset.length > 0){
            const updateremaining = await request.query(`UPDATE supplierreturnremaininginvoice 
            SET totalamount = ${getremaining.recordset[0].totalamount} + @ordertotal, 
            tax = ${getremaining.recordset[0].tax} + @saletax 
            WHERE supplierreturninvoiceid = ${getReturnedInvoice.recordset[0].supplierreturninvoiceid}`)
            res.sendStatus(200)
          }else{
             
            // const title = 'PRF' + Date.now();
            const newRemianing = 
            await request.query(`INSERT INTO supplierreturnremaininginvoice 
            VALUES (@supplierid,@id,@ordertotal,@returndate,'5006',@saletax,'${title}','0')`)
            
          }
        }
        
      }
    }else{
      const getCounterValue = await sql.query('SELECT * FROM purchasereturncounter')
    var title = 'PRTN' + '000' + getCounterValue.recordset[0].countervalue;
    const updateCounter = 
    await sql.query(`UPDATE purchasereturncounter 
    SET countervalue = ${getCounterValue.recordset[0].countervalue} + 1 
    WHERE purchasereturncounterid = ${getCounterValue.recordset[0].purchasereturncounterid}`) 
      const newReturnedInvoice = 
      await request.query(`INSERT INTO supplierreturninvoice
       (supplierinvoiceid,
        returnamount,
        returndate,
        returnquantity,
        tax,
        returninvoicetitle)
        
        VALUES
        
        (@id,
          @ordertotal,
          @returndate,
          @totalquantities,
          @saletax,
          '${title}')
          `)

      
      if(newReturnedInvoice.rowsAffected.length > 0){
        const getReturn = await request.query('SELECT * FROM supplierreturninvoice WHERE supplierinvoiceid = @id')
        
        const updatepaymentTable = 
        await request.query(`UPDATE supplierpayment 
        SET supplierreturninvoiceid = ${getReturn.recordset[0].supplierreturninvoiceid} 
        WHERE supplierinvoiceid = @id`)
        if(updatepaymentTable.rowsAffected.length > 0){
          const checkremainingreturndetail = await request.query('SELECT * FROM supplierreturninvoicedetail WHERE supplierinvoiceid = @id')
          if(checkremainingreturndetail.recordset.length > 0){
            for (const key in selectedproduct) {
                const updateRemaining  = 
                await request.query(`UPDATE supplierreturninvoicedetail 
                SET returnquantity = ${checkremainingreturndetail.recordset[0].returnquantity} + ${quantities[key]}, 
                returnunitprice = ${checkremainingreturndetail.recordset[0].returnunitprice} + @ordertotal 
                WHERE supplierinvoiceid = @id and productid = ${selectedproduct[key]}`)
              }
            }else{ 
              for (const key in selectedproduct) {
                const returndetailtable = 
                await request.query(`INSERT INTO supplierreturninvoicedetail
                 (supplierreturninvoiceid,
                  productid,
                  returnquantity,
                  returnunitprice,
                  supplierinvoiceid,
                  supplierid)
                  
                  VALUES
                  
                  (${getReturn.recordset[0].supplierreturninvoiceid},
                    ${selectedproduct[key]},
                    ${quantities[key]},
                    @ordertotal,
                    @id,
                    @supplierid)
                    `)

              }
            }
          
            var financialyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
          if(financialyear.recordset.length > 0){
            
            let accountheadid = 0
            let accountcontrolid = 0
            let accountsubcontrolid = 0
            var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 90`)
            accountheadid = getFlowSetting.recordset[0].accountheadid
            accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
            accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
            const transactionReturn = 
            await request.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES 
              
              (${financialyear.recordset[0].financialyearid},
                ${accountheadid},
                ${accountcontrolid},
                ${accountsubcontrolid},
                ${getReturn.recordset[0].supplierreturninvoiceid},
                '2',
                '2',
                @ordertotal,
                '0',
                @returndate,
                'PURCHASE RETURN ARRISE 5',
                '5006')
                `)
                var updategetFlowSetting = await request.query(`UPDATE accountsubcontrol 
                SET currentbalance = ${getFlowSetting.recordset[0].currentbalance - ordertotal}
                WHERE accountsubcontrolid = 90`)
  
            if(transactionReturn.rowsAffected.length > 0){
              const getsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
              const transactionReturn2 = 
              await request.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                branchid,
                credit,
                debit,
                transactiondate,
                transactiontitle,
                userid)
                
                VALUES 
                
                (${financialyear.recordset[0].financialyearid},
                  ${getsupplieraccount.recordset[0].accountheadid},
                  ${getsupplieraccount.recordset[0].accountcontrolid},
                  ${getsupplieraccount.recordset[0].accountsubcontrolid},
                  ${getReturn.recordset[0].supplierreturninvoiceid},
                  '2',
                  '2',
                  '0',
                  @ordertotal,
                  @returndate,
                  'PURCHASE RETURN From Spplier 6',
                  '5006')
                  `)
  const updatesupplier = await request.query(`UPDATE accountsubcontrol
  SET currentbalance = ${getsupplieraccount.recordset[0].currentbalance + ordertotal}
  WHERE accountsubcontrolid = 7
  `)
  
              if(transactionReturn2.rowsAffected.length > 0){
                
                const returnremaininginvoices = 
                await request.query(`INSERT INTO supplierreturnremaininginvoice
                 (supplierid,
                  supplierreturninvoiceid,
                  totalamount,
                  invoicedate,
                  userid,
                  tax,
                  invoicetitle,
                  paidamount)
                  
                  VALUES
                  
                  (@supplierid,
                    ${getReturn.recordset[0].supplierreturninvoiceid},
                    @ordertotal,
                    @returndate,
                    5006,
                    @saletax,
                    '${title}',
                    '0')
                    `)
                console.log("🚀 ~ file: route.js:2649 ~ router.post ~ returnremaininginvoices:", returnremaininginvoices)
        
                if(paid){
                  const updatepaymentTablepaid = 
                  await request.query(`UPDATE supplierpayment 
                  SET returnamount = @ordertotal 
                  WHERE supplierinvoiceid = @id`)  
        
                  if(updatepaymentTablepaid.rowsAffected.length > 0){    
                  let accountheadid = 0
                  let accountcontrolid = 0
                  let accountsubcontrolid = 0
                  var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
                  accountheadid = getFlowSetting.recordset[0].accountheadid
                  accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
                  accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
                  const transactionReturn = 
                  await request.query(`INSERT INTO transactions 
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    branchid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                    
                    VALUES 
                    
                    (${financialyear.recordset[0].financialyearid},
                      ${accountheadid},
                      ${accountcontrolid},
                      ${accountsubcontrolid},
                      ${getReturn.recordset[0].supplierreturninvoiceid},
                      '2',
                      '2',
                      '0',
                      @ordertotal,
                      @returndate,
                      'PURCHASE RETURN Paid 6',
                      '5006')
                      `)
                      var updategetFlowSetting = await request.query(`UPDATE accountsubcontrol 
                      SET currentbalance = ${getFlowSetting.recordset[0].currentbalance + ordertotal}
                      WHERE accountsubcontrolid = ${bankid}`)
                  if(transactionReturn.rowsAffected.length > 0){
                    const getsupplieraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 7`)
                    const transactionReturn2 = 
                    await request.query(`INSERT INTO transactions
                     (financialyearid,
                      accountheadid,
                      accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      branchid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid)
                      
                      VALUES 
                      
                      (${financialyear.recordset[0].financialyearid},
                        ${getsupplieraccount.recordset[0].accountheadid},
                        ${getsupplieraccount.recordset[0].accountcontrolid},
                        ${getsupplieraccount.recordset[0].accountsubcontrolid},
                        ${getReturn.recordset[0].supplierreturninvoiceid},
                        '2',
                        '2',
                        @ordertotal,
                        '0',
                        @returndate,
                        'PURCHASE RETURN ARRISE 7',
                        '5006')
                        `)
        const updatesupplier = await request.query(`UPDATE accountsubcontrol
        SET currentbalance = ${getsupplieraccount.recordset[0].currentbalance - ordertotal}
        WHERE accountsubcontrolid = 7
        `)
        
                    if(transactionReturn2.rowsAffected.length > 0){
                      console.log("🚀 ~ file: route.js:2614 ~ router.post ~ transactionReturn2:", transactionReturn2)
                      const truncateremaining = 
                      await request.query(`DELETE FROM supplierreturnremaininginvoice WHERE supplierreturninvoiceid = ${getReturn.recordset[0].supplierreturninvoiceid}`)
                      console.log("🚀 ~ file: route.js:2615 ~ router.post ~ truncateremaining:", truncateremaining)

                      res.sendStatus(200)
                    }
                  }
                }
              }
              else{
                res.sendStatus(200)
              }
            }
          }
        }
      }
    }
  }
  }

  } catch (error) {
    console.log(error);
  }


})


router.get('/getpendingreturns',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getresult = await request.query('SELECT * FROM supplierreturnremaininginvoice')
    if(getresult.recordset.length > 0){
      res.json(getresult.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedreturnremaining/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierreturninvoiceid',sql.Float,id)
    const getselected = await request.query('SELECT * FROM supplierreturnremaininginvoice WHERE supplierreturninvoiceid = @supplierreturninvoiceid')
    if(getselected.recordset.length > 0){
      res.json(getselected.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getreturnsupplierinvoice',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getreturnedinvoices = await request.query('SELECT * FROM supplierreturninvoice')
    if(getreturnedinvoices.recordset.length > 0){
      res.json(getreturnedinvoices.recordset)
    }
  } catch (error) {
    
  }
})

router.get('/getselectedreturninvoice/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    const getselectedInvoice = await request.query('SELECT * FROM supplierreturninvoice WHERE supplierinvoiceid = @id')
    if(getselectedInvoice.recordset.length > 0){
      res.json(getselectedInvoice.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedreturninvoicedetail/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    const getselectedInvoice = await request.query('SELECT * FROM supplierreturninvoicedetail WHERE supplierinvoiceid = @id')
    if(getselectedInvoice.recordset.length > 0){
      res.json(getselectedInvoice.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

/****************************************Sale invoice Cart ROUTES****************************************/

router.get('/getcustomerinvoice',async  (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getCustomerInvoice = await request.query('SELECT * FROM customerinvoice')
    if(getCustomerInvoice.recordset.length > 0){
      res.json(getCustomerInvoice.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getcustomerinvoicedetail',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = await sql.Request()
    const getcustomerinvoicedetail = await request.query('SELECT * FROM customerinvoicedetail')
    if(getcustomerinvoicedetail.recordset.length > 0){
      res.json(getcustomerinvoicedetail.recordset)
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedcustomerinvoice/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const getcustomerinvoice = await sql.query(`SELECT * FROM customerinvoice WHERE customerinvoiceid = ${id}`)
    if(getcustomerinvoice.recordset.length > 0){
      res.json(getcustomerinvoice.recordset)
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getcustomerinvoicedetailselected/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const getcustomerinvoicedetailsel = await sql.query(`SELECT * FROM customerinvoicedetail WHERE customerinvoiceid = ${id}`)
    if(getcustomerinvoicedetailsel.recordset.length > 0){
      res.json(getcustomerinvoicedetailsel.recordset)
    }else{
      res.sendStatus(402)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedcustomerpendinginvoices/:id',async (req,res)=>{
  const id = req.params.id 
  try {
   await sql.connect(config)
   const request = new sql.Request()
   request.input('customerid',sql.BigInt,id)
   const getPendinginvoices = await request.query('SELECT * FROM customerremaininginvoice WHERE customerid = @customerid')
   if(getPendinginvoices.recordset.length > 0){
     res.json(getPendinginvoices.recordset)
   }else{
     res.sendStatus(403)
   }
  } catch (error) {
   console.log(error);
  }
 })

router.get('/getselectedcustomerpendingpayinvoices/:id',async (req,res)=>{
  const id = req.params.id 
  try {
   await sql.connect(config)
   const request = new sql.Request()
   request.input('customerremaininginvoiceid',sql.BigInt,id)
   const getPendinginvoices = await request.query('SELECT * FROM customerremaininginvoice WHERE customerremaininginvoiceid = @customerremaininginvoiceid')
   if(getPendinginvoices.recordset.length > 0){
     res.json(getPendinginvoices.recordset)
   }else{
     res.sendStatus(403)
   }
  } catch (error) {
   console.log(error);
  }
 })

 router.post('/paypendingcustomerinvoice',async (req,res)=>{
  const {payamount1,invoiceno,incometax,bankid,remarks,paymentdate,bankname} = req.body;
  try {
    const payamount = payamount1
    await sql.connect(config)
    const transaction = new sql.Transaction()
   await transaction.begin()
    const request = new sql.Request(transaction)
    request.input('invoiceno',sql.BigInt,invoiceno)
    request.input('payamount',sql.Float,payamount)
    const getSupplierpayment = await request.query('SELECT * FROM customerpayment WHERE customerinvoiceid = @invoiceno')
    console.log("🚀 ~ file: route.js:2470 ~ router.post ~ getSupplierpayment:", getSupplierpayment)
    var remainindex = getSupplierpayment.recordset.length
    if(getSupplierpayment.recordset.length>0){
      if(getSupplierpayment.recordset[0].remainingbalance<=0){
        res.sendStatus(403)
        await transaction.rollback()
      }else{
        if(getSupplierpayment.recordset[remainindex-1].totalamount<= parseInt(getSupplierpayment.recordset[remainindex-1].paymentamount) + parseInt(payamount,10)){
          res.sendStatus(404)
          await transaction.rollback()
        }else{  
          const updatePayment = 
          await request.query(`UPDATE customerpayment 
          SET paidamount = ${getSupplierpayment.recordset[remainindex-1].paidamount} + @payamount,
          remainingbalance = ${getSupplierpayment.recordset[remainindex-1].totalamount} -${ parseInt(getSupplierpayment.recordset[remainindex-1].paidamount) +  parseInt(payamount)},
         remarks = '${remarks}',
         paymentdate = '${paymentdate}'
          WHERE customerpaymentid = ${getSupplierpayment.recordset[remainindex-1].customerpaymentid}`)
          console.log("🚀 ~ file: route.js:2483 ~ router.post ~ updatePayment:", updatePayment)
        }
      }
      
    }else{
      const getInvoice = await request.query('SELECT * FROM customerinvoice WHERE customerinvoiceid = @invoiceno')
      console.log("🚀 ~ file: route.js:2488 ~ router.post ~ getInvoice:", getInvoice)
      const now2 = new Date();
      const formattedDate2 = now2.toISOString().slice(0, 19).replace("T", " ");
      const newEntry = 
      await request.query(`INSERT INTO customerpayment 
      (customerid,
        customerinvoiceid,
        branchid,
        companyid,
        invoiceno,
        totalamount,
        paidamount,
        remainingbalance,
        userid,
        remarks,
        paymentdate
        ) 
        
        VALUES
        
        (
          ${getInvoice.recordset[0].customerid},
          ${getInvoice.recordset[0].customerinvoiceid},
          ${getInvoice.recordset[0].companyid},
          ${getInvoice.recordset[0].branchid},
          '${getInvoice.recordset[0].invoiceno}',
          ${ Math.round(getInvoice.recordset[0].totalamount)},
          @payamount,
          ${Math.round(getInvoice.recordset[0].totalamount)}-${payamount},
          '0',
          '${remarks}',
          '${paymentdate}'
          )`)

      console.log("🚀 ~ file: route.js:2493 ~ router.post ~ newEntry:", newEntry)
    }
     
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          let accountheadid = 0
          const newmadeinvoicepayment = 'PPP' + Date.now().toString();
          const now = new Date();
          const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
          
            //Payment Paid Transaction
            const getAccountPaid = await sql.query(`SELECT * From accountsubcontrol Where accountsubcontrolid = ${bankid}`)
            console.log("🚀 ~ file: route.js:2504 ~ router.post ~ getAccountPaid:", getAccountPaid)
            if(getAccountPaid.recordset.length > 0){
              accountcontrolid = getAccountPaid.recordset[0].accountcontrolid
              accountsubcontrolid = getAccountPaid.recordset[0].accountsubcontrolid
              accountheadid = getAccountPaid.recordset[0].accountheadid
              const getInvoice = await request.query('SELECT * FROM customerinvoice WHERE customerinvoiceid = @invoiceno')
              const supplier2 = await sql.query(`SELECT * FROM customer where cutomercode = ${getInvoice.recordset[0].customerid}`)
              const transactionTitlepaid = 'Sale Receipt Is Partially Receiving From ' + supplier2.recordset[0].customername;
              const transactionTitlepaidbank = 'Sale Receipt Is Partially Receiving To  ' + bankname;
              const financialyear = await sql.query('SELECT * FROM financialyear where isactive = 1')
              const setcreditentry = 
              await request.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                credit,
                debit,
                transactiondate,
                transactiontitle,
                userid)
                
                VALUES 
                
                ('${financialyear.recordset[0].financialyearid}',
                '${accountheadid}',
                '${accountcontrolid}',
                '${accountsubcontrolid}',
                'SP ${getInvoice.recordset[0].customerinvoiceid}',
                '0',
                '0',
                ${payamount},
                '${formattedDate}',
                '${transactionTitlepaidbank}',
                '0')
                `)
            const updategetAccountPaid = await sql.query(`UPDATE accountsubcontrol 
            SET currentbalance = ${getAccountPaid.recordset[0].currentbalance + payamount}
             Where accountsubcontrolid = ${bankid}`)
                
              if(setcreditentry.rowsAffected.length > 0){
                const getdebtors = await request.query('SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46')
                console.log("🚀 ~ file: route.js:2516 ~ router.post ~ setcreditentry:", setcreditentry)
                const setdeditentry = 
                await request.query(`INSERT INTO transactions
                 (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid)

                   VALUES

                    ('${financialyear.recordset[0].financialyearid}',
                    '${accountheadid}',
                    '${accountcontrolid}',
                    '${accountsubcontrolid}',
                    'SP ${getInvoice.recordset[0].customerinvoiceid}',
                    '0',
                    ${payamount},
                    '0',
                    '${formattedDate}',
                    '${transactionTitlepaid}',
                    '0')
                    `)
                    const updategetdebtors = 
                    await request.query(`UPDATE accountsubcontrol
                    SET currentbalance = ${getdebtors.recordset[0].currentbalance - payamount}
                    WHERE accountsubcontrolid = 46`)
                    if(updategetdebtors.rowsAffected.length > 0){
                      if(incometax>0){
                        const getincometaxaccount =await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)
                        const setdeditentry = 
                await request.query(`INSERT INTO transactions
                 (financialyearid,
                  accountheadid,
                  accountcontrolid,
                  accountsubcontrolid,
                  voucher,
                  companyid,
                  credit,
                  debit,
                  transactiondate,
                  transactiontitle,
                  userid)

                   VALUES

                    ('${financialyear.recordset[0].financialyearid}',
                    '${getincometaxaccount.recordset[0].accountheadid}',
                    '${getincometaxaccount.recordset[0].accountcontrolid}',
                    '${getincometaxaccount.recordset[0].accountsubcontrolid}',
                    'SP ${getInvoice.recordset[0].customerinvoiceid}',
                    '0',
                    '0',
                    ${incometax},
                    '${formattedDate}',
                    '${`Income Tax To Customer ${supplier2.recordset[0].customername}`}',
                    '0')
                    `)
                    const updategetincometaxaccount = await request.query(`UPDATE accountsubcontrol 
                    SET currentbalance = ${getincometaxaccount.recordset[0].currentbalance - incometax}
                    WHERE accountsubcontrolid = 61`)

                    const getbankaccountagain = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
                    const setcredit = 
                    await request.query(`INSERT INTO transactions
                     (financialyearid,
                      accountheadid,
                      accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid)
    
                       VALUES
    
                        ('${financialyear.recordset[0].financialyearid}',
                        '${getbankaccountagain.recordset[0].accountheadid}',
                        '${getbankaccountagain.recordset[0].accountcontrolid}',
                        '${getbankaccountagain.recordset[0].accountsubcontrolid}',
                        'SP ${getInvoice.recordset[0].customerinvoiceid}',
                        '0',
                        ${incometax},
                        '0',
                        '${formattedDate}',
                        '${`Income Tax From ${bankname}`}',
                        '0')
                        `)
                    const updategetbankaccountagain = await request.query(`UPDATE accountsubcontrol
                    SET currentbalance = ${getbankaccountagain.recordset[0].currentbalance - incometax}
                    WHERE accountsubcontrolid = ${bankid}`)
                      }
                    }
                console.log("🚀 ~ file: route.js:2519 ~ router.post ~ setdeditentry:", setdeditentry)
              }
              const getremainingtoupdate = await request.query('SELECT * FROM customerremaininginvoice WHERE customerinvoiceid = @invoiceno')
              const updateremaining = 
              await request.query(`UPDATE customerremaininginvoice 
              SET paidamount = ${ Math.round(getremainingtoupdate.recordset[0].paidamount)==null? 0 +parseInt(payamount,10): getremainingtoupdate.recordset[0].paidamount + parseInt(payamount,10)} 
              WHERE customerinvoiceid = @invoiceno`)
              if(updateremaining.rowsAffected.length > 0){
                console.log("🚀 ~ file: route.js:2523 ~ router.post ~ updateremaining:", updateremaining)
                const checkremaining = await request.query('SELECT * FROM customerremaininginvoice WHERE customerinvoiceid = @invoiceno')
                if(Math.round(checkremaining.recordset[0].totalamount) <= Math.round(checkremaining.recordset[0].paidamount)){
                  const deletTable = await request.query('delete from customerremaininginvoice WHERE customerinvoiceid = @invoiceno')
                  console.log("🚀 ~ file: route.js:2526 ~ router.post ~ deletTable:", deletTable)
                  res.sendStatus(200)
                  await transaction.commit()
                }else{
                  await transaction.commit()
                  res.sendStatus(200)
                }
              }  
      }else{res.sendStatus(402)
  await transaction.rollback()}
  } catch (error) {
    console.log(error);
  }
})


router.post('/payselectedcustomerremaininginvoice',async (req,res)=>{
  const {supplierid,bankid,paymentdate,remarks,taxdropid} = req.body;
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierid',sql.BigInt,supplierid)
    const supplier = await request.query('SELECT * FROM customer WHERE cutomercode = @supplierid')
    const getSupplierremainingInvoice =await request.query('SELECT * FROM customerremaininginvoice WHERE customerid = @supplierid')
    for(ele of getSupplierremainingInvoice.recordset){
      const now2 = new Date();
      const formattedDate2 = now2.toISOString().slice(0, 19).replace("T", " ");
      const supplierinvoice = await sql.query(`SELECT * FROM customerinvoice WHERE customerinvoiceid = ${ele.customerinvoiceid}`)
      const supplierremaining = await sql.query(`SELECT * FROM customerremaininginvoice where customerinvoiceid = ${ele.customerinvoiceid}`)
      const supplierpayment = 
      await sql.query(`INSERT INTO customerpayment 
      (customerid,
        customerinvoiceid,
        companyid,
        branchid,
        invoiceno,
        totalamount,
        paidamount,
        remainingbalance,
        userid,
        remarks,
        paymentdate)
        
        VALUES
        
        (${supplierremaining.recordset[0].customerid},
          ${supplierremaining.recordset[0].customerinvoiceid},
          ${supplierinvoice.recordset[0].companyid},
          '${supplierinvoice.recordset[0].branchid}',
          '0',
          ${supplierremaining.recordset[0].totalamount},
          ${Math.round(supplierremaining.recordset[0].totalamount)} - ${Math.round(supplierremaining.recordset[0].paidamount)},
          '0',
          ${supplierremaining.recordset[0].userid},
          '${remarks}',
          '${paymentdate}')
          `)
      if(supplierpayment.rowsAffected.length > 0){
        const getYear = await sql.query(`SELECT * FROM financialyear where isactive = 1`)
        const getFlow = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
          const newTransactionsEntry = 
          await sql.query(`INSERT INTO transactions
           (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiontitle,
            userid)
            
            VALUES
            
            (${getYear.recordset[0].financialyearid},
              ${getFlow.recordset[0].accountheadid},
              ${getFlow.recordset[0].accountcontrolid},
              ${getFlow.recordset[0].accountsubcontrolid},
              ${supplierinvoice.recordset[0].customerinvoiceid},
              ${supplierinvoice.recordset[0].companyid},
              ${supplierinvoice.recordset[0].branchid},
              '0',
              ${ Math.round(supplierremaining.recordset[0].totalamount)} - ${ Math.round(supplierremaining.recordset[0].paidamount)},
              'SALE PAYMENT PAID ${supplier.recordset[0].customername}',
              '5006')
              `)
        const updategetFlow = await sql.query(`UPDATE accountsubcontrol 
        SET currentbalance = ${getFlow.recordset[0].currentbalance + Math.round(supplierremaining.recordset[0].totalamount)} - ${ Math.round(supplierremaining.recordset[0].paidamount)}
        WHERE accountsubcontrolid = ${bankid}`)

          if(newTransactionsEntry.rowsAffected.length > 0){
            const getcustomeraccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
            const newTransactionsDebit = 
            await sql.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiontitle,
              userid)
              
              VALUES
              
              (${getYear.recordset[0].financialyearid},
                ${getcustomeraccount.recordset[0].accountheadid},
                ${getcustomeraccount.recordset[0].accountcontrolid},
                ${getcustomeraccount.recordset[0].accountsubcontrolid},
                ${supplierinvoice.recordset[0].customerinvoiceid},
                ${supplierinvoice.recordset[0].companyid},
                ${supplierinvoice.recordset[0].branchid},
                ${ Math.round(supplierremaining.recordset[0].totalamount)} - ${ Math.round(supplierremaining.recordset[0].paidamount)},
                '0',
                'SALE PAYMENT PAID ${supplier.recordset[0].customername}',
                '5006')
                `)
            const updategetcustomeraccount = await request.query(`UPDATE accountsubcontrol 
            SET currentbalance = ${Math.round(supplierremaining.recordset[0].totalamount)} - ${ Math.round(supplierremaining.recordset[0].paidamount)}
            WHERE accountsubcontrolid = 46`)
            console.log("🚀 ~ file: route.js:2507 ~ router.post ~ newTransactionsEntry:", newTransactionsEntry)
            if(taxdropid > 0){
              let incometrax = (Math.round(supplierremaining.recordset[0].totalamount)-Math.round(supplierremaining.recordset[0].paidamount))*taxdropid/100
              const getFlow = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
              const newTransactionsEntry = 
              await sql.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                branchid,
                credit,
                debit,
                transactiontitle,
                userid)
                
                VALUES
                
                (${getYear.recordset[0].financialyearid},
                  ${getFlow.recordset[0].accountheadid},
                  ${getFlow.recordset[0].accountcontrolid},
                  ${getFlow.recordset[0].accountsubcontrolid},
                  ${supplierinvoice.recordset[0].customerinvoiceid},
                  ${supplierinvoice.recordset[0].companyid},
                  ${supplierinvoice.recordset[0].branchid},
                  '0',
                  ${incometrax},
                  'Income tax paid from bank',
                  '5006')
                  `)
            const updategetFlow = await sql.query(`UPDATE accountsubcontrol 
            SET currentbalance = ${getFlow.recordset[0].currentbalance - incometrax}
            WHERE accountsubcontrolid = ${bankid}`)
    
              const getFlowtaxaccount = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 61`)
              const newTransactionsEntry1 = 
              await sql.query(`INSERT INTO transactions
               (financialyearid,
                accountheadid,
                accountcontrolid,
                accountsubcontrolid,
                voucher,
                companyid,
                branchid,
                credit,
                debit,
                transactiontitle,
                userid)
                
                VALUES
                
                (${getYear.recordset[0].financialyearid},
                  ${getFlowtaxaccount.recordset[0].accountheadid},
                  ${getFlowtaxaccount.recordset[0].accountcontrolid},
                  ${getFlowtaxaccount.recordset[0].accountsubcontrolid},
                  ${supplierinvoice.recordset[0].customerinvoiceid},
                  ${supplierinvoice.recordset[0].companyid},
                  ${supplierinvoice.recordset[0].branchid},
                  '0',
                  ${incometrax},
                  'Income tax paid from bank',
                  '5006')
                  `)
            const updategetFlowtaxaccount = await sql.query(`UPDATE accountsubcontrol 
            SET currentbalance = ${getFlow.recordset[0].currentbalance - incometrax}
            WHERE accountsubcontrolid = 61`)
            }
            
            const deleteRemaining = await sql.query(`DELETE FROM customerremaininginvoice WHERE customerremaininginvoiceid = ${ele.customerremaininginvoiceid}`)
            console.log("🚀 ~ file: route.js:2510 ~ router.post ~ deleteRemaining:", deleteRemaining)
          }
      }
    }
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
  }
})

/*********************************************************SALE RETURN*********************************************************/
router.post('/addsalereturninvoice',async (req,res)=>{
  const {ordertotal,saletax,subtotalamount,quantities,ids,returndate,paid,selectedproduct,supplierid,bankid} = req.body;
  var totalquantities = 0;
  for (const key of quantities) {
    totalquantities = totalquantities + parseInt(key,10)?parseInt(key,10):0
  }
  try {
    await sql.connect(config)
    
  const request = new sql.Request()
    request.input('ordertotal',sql.Float,Math.floor(ordertotal))
    request.input('saletax',sql.Float,saletax)
    request.input('supplierid',sql.Float,supplierid)
    request.input('subtotalamount',sql.Float,subtotalamount)
    request.input('totalquantities',sql.Float,totalquantities)
    request.input('id',sql.BigInt,ids)
    request.input('returndate',sql.Date,returndate)
 
    const getReturnedInvoice = await request.query('SELECT * FROM customerreturninvoice WHERE customerinvoiceid = @id')
    console.log("🚀 ~ file: route.js:3019 ~ router.post ~ getReturnedInvoice:", getReturnedInvoice)
    
    const getInvoicedetail = await request.query('SELECT * FROM customerinvoicedetail WHERE customerinvoiceid = @id')
    console.log("🚀 ~ file: route.js:3022 ~ router.post ~ getInvoicedetail:", getInvoicedetail)
    
    const getdetailreturninvoice = await request.query('SELECT * FROM customerreturninvoicedetail WHERE customerinvoiceid = @id')
    console.log("🚀 ~ file: route.js:3025 ~ router.post ~ getdetailreturninvoice:", getdetailreturninvoice)
    var responses = false;
    if(getInvoicedetail.recordset.length > 0){
      if (getdetailreturninvoice.recordset.length > 0){
          for (const key in getInvoicedetail.recordset) {
            selectedproduct.map (async(row,index)=>{
              if(getInvoicedetail.recordset[key].productid == row  && row ==   getdetailreturninvoice.recordset[index].productid){
                if(parseInt(getInvoicedetail.recordset[key].salequantity,10) < parseInt(quantities[index],10) + getdetailreturninvoice.recordset[index].returnquantity){ 
                  responses = true
                } else{
                  const getProduct = await request.query(`SELECT * FROM products WHERE productid = ${row}`)
                  const updateProduct = await request.query(`UPDATE products SET productquantity = ${ parseInt(getProduct.recordset[0].productquantity,10) + parseInt(quantities[index],10)} WHERE productid = ${getProduct.recordset[0].productid}`)
                }
              }
            }
          )
        }
    }
    else{   
      for(const key in getInvoicedetail.recordset) {
        selectedproduct.map(async(row,index)=>{
        if(getInvoicedetail.recordset[key].productid == row){
          if(getInvoicedetail.recordset[key].salequantity <  quantities[index]){ 
            responses = true
          }  else{
            const getProduct = await request.query(`SELECT * FROM products WHERE productid = ${row}`)
            const updateProduct = await request.query(`UPDATE products SET productquantity = ${ parseInt(getProduct.recordset[0].productquantity,10) + parseInt(quantities[index],10)} WHERE productid = ${getProduct.recordset[0].productid}`)
            
          }
        }
      }
      )
    }
  }
}

if(responses){
  res.sendStatus(406)
  console.log("Inside 406");
  return
}
else{
  console.log("inside execution");
  if(getReturnedInvoice.recordset.length > 0){
    const updateReturn = 
    await request.query(`UPDATE customerreturninvoice 
    SET returnamount = ${getReturnedInvoice.recordset[0].returnamount} + @ordertotal, 
    returnquantity = ${getReturnedInvoice.recordset[0].returnquantity} + @totalquantities, 
    tax = ${getReturnedInvoice.recordset[0].tax} + @saletax 
    WHERE customerinvoiceid = @id`)
      if(updateReturn.rowsAffected.length > 0){
        const updatepaymentTable = await request.query(`UPDATE customerpayment SET customerreturninvoiceid = ${getReturnedInvoice.recordset[0].customerreturninvoiceid} WHERE customerinvoiceid = @id`)
        const checkremainingreturndetail = await request.query('SELECT * FROM customerreturninvoicedetail WHERE customerinvoiceid = @id')
        console.log("🚀 ~ file: route.js:2418 ~ router.post ~ checkremainingreturndetail:", checkremainingreturndetail)
        if(checkremainingreturndetail.recordset.length > 0){
        for (const key in selectedproduct) {
            const updateRemaining  = await request.query(`UPDATE customerreturninvoicedetail 
            SET returnquantity = ${checkremainingreturndetail.recordset[0].returnquantity} + ${quantities[key]}, 
            returnunitprice = ${checkremainingreturndetail.recordset[0].returnunitprice} + @ordertotal 
            WHERE customerinvoiceid = @id and productid = ${selectedproduct[key]}`)
            console.log("🚀 ~ file: route.js:5723 ~ router.post ~ updateRemaining:", updateRemaining)
          }
        }else{
          for (const key in selectedproduct) {
             await request.query(`INSERT INTO customerreturninvoicedetail
              (customerreturninvoiceid,
                productid,
                returnquantity,
                returnunitprice,
                customerinvoiceid,
                customerid)
                
                VALUES
                
                (${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                  ${selectedproduct[key]},
                  ${quantities[key]},
                  @ordertotal,
                  @id,
                  @supplierid)
                  `)
            }
        }
        var financialyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
        if(financialyear.recordset.length > 0){

          let accountheadid = 0
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          var getFlowSetting = await request.query(`select * from accountsubcontrol WHERE accountsubcontrolid = 68`)
          accountheadid = getFlowSetting.recordset[0].accountheadid
          
          accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
          accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
          const transactionReturn = 
          await request.query(`INSERT INTO transactions 
          (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiondate,
            transactiontitle,
            userid)
            
            VALUES
             
            (${financialyear.recordset[0].financialyearid},
              ${accountheadid},
              ${accountcontrolid},
              ${accountsubcontrolid},
              ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
              '2',
              '2',
              @ordertotal,
              '0',
              @returndate,
              'Sale RETURN ARRISE 1',
              '5006')
              `)
const updateSale = await request.query(`UPDATE accountsubcontrol 
SET currentbalance = ${getFlowSetting.recordset[0].currentbalance} - ${ordertotal}
WHERE accountsubcontrolid = 68
`)
          if(transactionReturn.rowsAffected.length > 0){
            const getdebtorsaccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
            const transactionReturn2 = 
            await request.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES
              
              (${financialyear.recordset[0].financialyearid},
                ${getdebtorsaccount.recordset[0].accountheadid},
                ${getdebtorsaccount.recordset[0].accountcontrolid},
                ${getdebtorsaccount.recordset[0].accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                '2',
                '2',
                '0',
                @ordertotal,
                @returndate,
                'Sale RETURN ARRISE',
                '5006')
                `)
const updateDebitors = await request.query(`UPDATE accountsubcontrol 
SET currentbalance = ${getdebtorsaccount.recordset[0].currentbalance + ordertotal} WHERE accountsubcontrolid = 46

`)
            if(transactionReturn2.rowsAffected.length > 0){

              res.sendStatus(200)
            }

          }
        }
        
        if(paid){
          const updatepaymentTablepaid = 
          await request.query(`UPDATE customerpayment 
          SET returnamount = @ordertotal WHERE customerinvoiceid = @id`)  
          if(updatepaymentTablepaid.rowsAffected.length > 0){    
          let accountheadid = 0
          let accountcontrolid = 0
          let accountsubcontrolid = 0
          var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
          accountheadid = getFlowSetting.recordset[0].accountheadid
          accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
          accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
          const transactionReturn = 
          await request.query(`INSERT INTO transactions 
          (financialyearid,
            accountheadid,
            accountcontrolid,
            accountsubcontrolid,
            voucher,
            companyid,
            branchid,
            credit,
            debit,
            transactiondate,
            transactiontitle,
            userid)
            
            VALUES
            
            (${financialyear.recordset[0].financialyearid},
              ${accountheadid},
              ${accountcontrolid},
              ${accountsubcontrolid},
              ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
              '2',
              '2',
              @ordertotal,
              '0',
              @returndate,
              'SALE RETURN Paid FROM BANK',
              '5006')
              `)
              const updateBank = await request.query(`UPDATE accountsubcontrol
              SET currentbalance = ${getFlowSetting.recordset[0].currentbalance - ordertotal} 
              WHERE accountsubcontrolid = ${bankid}
              `)
          if(transactionReturn.rowsAffected.length > 0){
            const getdebtorsagain = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
            const transactionReturn2 = 
            await request.query(`INSERT INTO transactions 
            (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES
              
              (${financialyear.recordset[0].financialyearid},
                ${getdebtorsagain.recordset[0].accountheadid},
                ${getdebtorsagain.recordset[0].accountcontrolid},
                ${getdebtorsagain.recordset[0].accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                '2',
                '2',
                '0',
                @ordertotal,
                @returndate,
                'SALE RETURN Paid',
                '5006')
                `)
                const updatedebtors = await request.query(`UPDATE accountsubcontrol
                SET currentbalance = ${getdebtorsagain.recordset[0].currentbalance - ordertotal} 
                WHERE accountsubcontrolid = 46
                `)
            if(transactionReturn2.rowsAffected.length > 0){
            }

          }
          }
        }
        else{
          const getremaining = 
          await request.query(`SELECT * FROM customerreturnremaininginvoice 
          WHERE customerreturninvoiceid = ${getReturnedInvoice.recordset[0].customerreturninvoiceid}`)
          if(getremaining.recordset.length > 0){
            const updateremaining = await request.query(`UPDATE customerreturnremaininginvoice 
            SET totalamount = ${getremaining.recordset[0].totalamount} + @ordertotal, 
            tax = ${getremaining.recordset[0].tax} + @saletax 
            WHERE customerreturninvoiceid = ${getReturnedInvoice.recordset[0].customerreturninvoiceid}`)

            res.sendStatus(200)
          }else{
             
            // const title = 'PRF' + Date.now();
            const newRemianing = 
            await request.query(`INSERT INTO customerreturnremaininginvoice
             VALUES
             
             (@supplierid,
              @id,
              @ordertotal,
              @returndate,
              '5006',
              @saletax,
              '${title}',
              '0')
              `)

            
          }
        }
        
      }
    }else{
      const getCounterValue = await sql.query('SELECT * FROM salereturncounter')
    var title = 'SRTN' + '000' + getCounterValue.recordset[0].countervalue;
    const updateCounter = 
    await sql.query(`UPDATE salereturncounter 
    SET countervalue = ${getCounterValue.recordset[0].countervalue} + 1 
    WHERE salereturncounterid = ${getCounterValue.recordset[0].salereturncounterid}`) 
      const newReturnedInvoice = 
      await request.query(`INSERT INTO customerreturninvoice
       (customerinvoiceid,
        returnamount,
        returndate,
        returnquantity,
        tax,
        returninvoicetitle)
        
        VALUES
        
        (@id,
          @ordertotal,
          @returndate,
          @totalquantities,
          @saletax,
          '${title}')
          `)
      
      if(newReturnedInvoice.rowsAffected.length > 0){
        const getReturn = await request.query('SELECT * FROM customerreturninvoice WHERE customerinvoiceid = @id')
        
        const updatepaymentTable = 
        await request.query(`UPDATE customerpayment 
        SET customerreturninvoiceid = ${getReturn.recordset[0].customerreturninvoiceid} 
        WHERE customerinvoiceid = @id`)
        if(updatepaymentTable.rowsAffected.length > 0){
          const checkremainingreturndetail = await request.query('SELECT * FROM customerreturninvoicedetail WHERE customerinvoiceid = @id')
          if(checkremainingreturndetail.recordset.length > 0){
            for (const key in selectedproduct) {
                const updateRemaining  = 
                await request.query(`UPDATE customerreturninvoicedetail
                 SET returnquantity = ${checkremainingreturndetail.recordset[0].returnquantity} + ${quantities[key]}, 
                 returnunitprice = ${checkremainingreturndetail.recordset[0].returnunitprice} + @ordertotal 
                 WHERE customerinvoiceid = @id and productid = ${selectedproduct[key]}`)
              }
            }else{ 
              for (const key in selectedproduct) {
                const returndetailtable = 
                await request.query(`INSERT INTO customerreturninvoicedetail
                 (customerreturninvoiceid,
                  productid,
                  returnquantity,
                  returnunitprice,
                  customerinvoiceid,
                  customerid)
                  
                  VALUES
                  
                  (${getReturn.recordset[0].customerreturninvoiceid},
                    ${selectedproduct[key]},
                    ${quantities[key]},
                    @ordertotal,
                    @id,
                    @supplierid)
                    `)

              }
            }
          
            var financialyear = await request.query(`SELECT * FROM financialyear WHERE isactive = 1`)
          if(financialyear.recordset.length > 0){
    const getReturnedInvoice = await request.query('SELECT * FROM customerreturninvoice WHERE customerinvoiceid = @id')
            let accountheadid = 0
            let accountcontrolid = 0
            let accountsubcontrolid = 0
            var getFlowSetting = await request.query(`select * from accountsubcontrol WHERE accountsubcontrolid = 68`)
            accountheadid = getFlowSetting.recordset[0].accountheadid
            
            accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
            accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
            const transactionReturn = 
            await request.query(`INSERT INTO transactions 
            (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES
               
              (${financialyear.recordset[0].financialyearid},
                ${accountheadid},
                ${accountcontrolid},
                ${accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                '2',
                '2',
                @ordertotal,
                '0',
                @returndate,
                'Sale RETURN ARRISE 1',
                '5006')
                `)
  const updateSale = await request.query(`UPDATE accountsubcontrol 
  SET currentbalance = ${getFlowSetting.recordset[0].currentbalance} - ${ordertotal}
  WHERE accountsubcontrolid = 68
  `)
            if(transactionReturn.rowsAffected.length > 0){
              
              const getdebtorsaccount = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
            const transactionReturn2 = 
            await request.query(`INSERT INTO transactions
             (financialyearid,
              accountheadid,
              accountcontrolid,
              accountsubcontrolid,
              voucher,
              companyid,
              branchid,
              credit,
              debit,
              transactiondate,
              transactiontitle,
              userid)
              
              VALUES
              
              (${financialyear.recordset[0].financialyearid},
                ${getdebtorsaccount.recordset[0].accountheadid},
                ${getdebtorsaccount.recordset[0].accountcontrolid},
                ${getdebtorsaccount.recordset[0].accountsubcontrolid},
                ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                '2',
                '2',
                '0',
                @ordertotal,
                @returndate,
                'Sale RETURN ARRISE',
                '5006')
                `)
const updateDebitors = await request.query(`UPDATE accountsubcontrol 
SET currentbalance = ${getdebtorsaccount.recordset[0].currentbalance + ordertotal} WHERE accountsubcontrolid = 46

`)
              if(transactionReturn2.rowsAffected.length > 0){
                
                const returnremaininginvoices = await request.query(`INSERT INTO customerreturnremaininginvoice (customerid,customerreturninvoiceid,totalamount,invoicedate,userid,tax,invoicetitle,paidamount) VALUES (@supplierid,${getReturn.recordset[0].customerreturninvoiceid},@ordertotal,@returndate,5006,@saletax,'${title}','0')`)
                console.log("🚀 ~ file: route.js:2649 ~ router.post ~ returnremaininginvoices:", returnremaininginvoices)
                if(paid){
                  const updatepaymentTablepaid = await request.query(`UPDATE customerpayment SET returnamount = @ordertotal WHERE customerinvoiceid = @id`)  
                  if(updatepaymentTablepaid.rowsAffected.length > 0){
                    
                  let accountheadid = 0
                  let accountcontrolid = 0
                  let accountsubcontrolid = 0
                  var getFlowSetting = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = ${bankid}`)
                  accountheadid = getFlowSetting.recordset[0].accountheadid
        
                  accountcontrolid = getFlowSetting.recordset[0].accountcontrolid
                  accountsubcontrolid = getFlowSetting.recordset[0].accountsubcontrolid
                  const transactionReturn = await request.query(`INSERT INTO transactions 
                  (financialyearid,
                    accountheadid,
                    accountcontrolid,
                    accountsubcontrolid,
                    voucher,
                    companyid,
                    branchid,
                    credit,
                    debit,
                    transactiondate,
                    transactiontitle,
                    userid)
                    
                    VALUES
                    
                    (${financialyear.recordset[0].financialyearid},
                      ${accountheadid},
                      ${accountcontrolid},
                      ${accountsubcontrolid},
                      ${getReturn.recordset[0].customerreturninvoiceid},
                      '2',
                      '2',
                      @ordertotal,
                      '0',
                      @returndate,
                      'SALE RETURN Paid',
                      '5006')
                      `)
                      const updatebank = await request.query(`UPDATE accountsubcontrol
                      SET currentbalance = ${getFlowSetting.recordset[0].currentbalance - ordertotal} 
                      WHERE accountsubcontrolid = ${bankid}`)
                  if(transactionReturn.rowsAffected.length > 0){
                    const getdebtorsagain = await request.query(`SELECT * FROM accountsubcontrol WHERE accountsubcontrolid = 46`)
                    const transactionReturn2 = 
                    await request.query(`INSERT INTO transactions 
                    (financialyearid,
                      accountheadid,
                      accountcontrolid,
                      accountsubcontrolid,
                      voucher,
                      companyid,
                      branchid,
                      credit,
                      debit,
                      transactiondate,
                      transactiontitle,
                      userid)
                      
                      VALUES
                      
                      (${financialyear.recordset[0].financialyearid},
                        ${getdebtorsagain.recordset[0].accountheadid},
                        ${getdebtorsagain.recordset[0].accountcontrolid},
                        ${getdebtorsagain.recordset[0].accountsubcontrolid},
                        ${getReturnedInvoice.recordset[0].customerreturninvoiceid},
                        '2',
                        '2',
                        '0',
                        @ordertotal,
                        @returndate,
                        'SALE RETURN Paid',
                        '5006')
                        `)
                        const updatedebtors = await request.query(`UPDATE accountsubcontrol
                        SET currentbalance = ${getdebtorsagain.recordset[0].currentbalance - ordertotal} 
                        WHERE accountsubcontrolid = 46
                        `)
                    if(transactionReturn2.rowsAffected.length > 0){
                      console.log("🚀 ~ file: route.js:2614 ~ router.post ~ transactionReturn2:", transactionReturn2)
                      const truncateremaining = await request.query(`DELETE FROM customerreturnremaininginvoice WHERE customerreturninvoiceid = ${getReturn.recordset[0].customerreturninvoiceid}`)
                      console.log("🚀 ~ file: route.js:2615 ~ router.post ~ truncateremaining:", truncateremaining)

                      res.sendStatus(200)
                    }
                  }
                }
              }
              else{
                res.sendStatus(200)
              }
            }
          }
        }
      }
    }
  }
  }

  } catch (error) {
    console.log(error);
  }


})

router.get('/getselectedcustomerreturninvoicedetail/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('id',sql.BigInt,id)
    const getRecord = await request.query(`SELECT * FROM customerreturninvoicedetail WHERE customerinvoiceid = @id`)
    if(getRecord.recordset.length > 0){
      res.json(getRecord.recordset)
    }
    else{
      res.sendStatus(400)
    }

  } catch (error) {
    console.log(error);
  }
})

router.get('/getreturncustomerinvoice',async (req,res)=>{
  try {
      await sql.connect(config)
      const request = new sql.Request()
      const getreturnsaleinvoices = await sql.query('SELECT * FROM customerreturninvoice')
      if(getreturnsaleinvoices.recordset.length > 0){
          res.json(getreturnsaleinvoices.recordset)
      }

  } catch (error) {
    console.log(error);
  }finally{
    await sql.close()
  }
})

router.get('/getselectedsalereturninvoicedetail/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request();
    request.input('salereturnid',sql.BigInt,id)
    const getDetailinvoices = await request.query('SELECT * FROM customerreturninvoicedetail WHERE customerreturninvoiceid = @salereturnid')
    if(getDetailinvoices.recordset.length > 0){
      res.json(getDetailinvoices.recordset)
    }else{
      res.sendStatus(200)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getpendingsalereturns',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    const getresult = await request.query('SELECT * FROM customerreturnremaininginvoice')
    if(getresult.recordset.length > 0){
      res.json(getresult.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getselectedsalereturnremaining/:id',async (req,res)=>{
  const id = req.params.id
  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierreturninvoiceid',sql.Float,id)
    const getselected = await request.query('SELECT * FROM customerreturnremaininginvoice WHERE CUSTOMERreturninvoiceid = @supplierreturninvoiceid')
    if(getselected.recordset.length > 0){
      res.json(getselected.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})


/**************************************************************SALE RETURN PAY******************************************************/
router.post('/addremainingsalereturnpayment/:id',async (req,res)=>{
  const id = req.params.id
  const {payamount,transactiondate} = req.body;
try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('supplierreturnremaininginvoiceid',sql.BigInt,id)
    request.input('payamount',sql.BigInt,payamount)
    request.input('transactiondate',sql.Date,transactiondate)
    const getRemainingreturninvoice = await request.query('SELECT * FROM customerreturnremaininginvoice WHERE customerreturnremaininginvoice = @supplierreturnremaininginvoiceid')
    console.log("🚀 ~ file: route.js:2287 ~ router.post ~ getRemainingreturninvoice:", getRemainingreturninvoice)
    if(getRemainingreturninvoice.recordset.length > 0){
      const getPayment = await request.query(`SELECT * FROM customerpayment WHERE customerreturninvoiceid = ${getRemainingreturninvoice.recordset[0].customerreturninvoiceid}`)
      if(getPayment.recordset.length > 0){
        let checkamount = getRemainingreturninvoice.recordset[0].paidamount? parseInt(getRemainingreturninvoice.recordset[0].paidamount):0
        console.log(checkamount);
        console.log(parseInt( payamount,10));
        console.log(getRemainingreturninvoice.recordset[0].totalamount);
        console.log(checkamount + parseInt( payamount,10) > getRemainingreturninvoice.recordset[0].totalamount);
        
        if(checkamount + parseInt( payamount,10) > getRemainingreturninvoice.recordset[0].totalamount + getRemainingreturninvoice.recordset[0].tax){
          res.sendStatus(406)
        }
        else if( checkamount + Math.floor(payamount) == Math.floor(getRemainingreturninvoice.recordset[0].totalamount + parseInt(getRemainingreturninvoice.recordset[0].tax))){
          const updatePayment = await request.query(`UPDATE customerpayment SET returnamount = ${checkamount} + @payamount WHERE customerpaymentid = ${getPayment.recordset[0].customerpaymentid}`)
          const deleteEntity = await request.query(`DELETE FROM customerreturnremaininginvoice WHERE customerreturnremaininginvoice = ${getRemainingreturninvoice.recordset[0].customerreturnremaininginvoice}`)
          
        }
        else{
          const updatePayment = await request.query(`UPDATE customerpayment SET returnamount = ${checkamount} + @payamount WHERE customerpaymentid = ${getPayment.recordset[0].customerpaymentid}`)  
          const updateemainingTable = await request.query(`UPDATE customerreturnremaininginvoice SET paidamount = ${getRemainingreturninvoice.recordset[0].paidamount} + @payamount WHERE customerreturnremaininginvoice = ${getRemainingreturninvoice.recordset[0].customerreturnremaininginvoice}`)
          
        }
      }
      /******************************************************TRANSACTIONS********************************************************/
      const againgetremaining = await request.query(`SELECT * FROM customerreturnremaininginvoice WHERE customerreturnremaininginvoice = @supplierreturnremaininginvoiceid `)
      if(againgetremaining.recordset.length > 0){
        if(Math.floor(againgetremaining.recordset[0].totalamount + againgetremaining.recordset[0].tax) <= Math.floor(againgetremaining.recordset[0].paidamount)){
          const deleteen = await request.query(`DELETE FROM customerreturnremaininginvoice WHERE customerreturnremaininginvoice = @supplierreturnremaininginvoiceid`)
 
        }
      }
      const transaction1 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,voucher,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid) values (4,0,0,0,'${getRemainingreturninvoice.recordset[0].customerreturninvoiceid}',2,2,0,@payamount,@transactiondate,'SALE DEMO TITLE','5006')`)
      const transaction2 = await request.query(`INSERT INTO transactions (financialyearid,accountheadid,accountcontrolid,accountsubcontrolid,voucher,companyid,branchid,credit,debit,transactiondate,transactiontitle,userid) values (4,0,0,0,'${getRemainingreturninvoice.recordset[0].customerreturninvoiceid}',2,2,@payamount,0,@transactiondate,'SALE DEMO TITLE','5006')`)
      
      
      if(transaction2.rowsAffected.length > 0){
        res.sendStatus(200)
      }
    }

} catch (error) {
  console.log(error);
}
})





















/******************************************************WORKING WITH PICTURES********************************************/
router.post('/postpicture', upload.single('picture'), async (req, res) => {
  try {
    const file = req.file;
    const fileData = fs.readFileSync(file.path);

    await sql.connect(config);
    const request = new sql.Request();
    request.input('picid', sql.VarBinary, fileData);

    const insert = await request.query('INSERT INTO picturetest VALUES (@picid)');
    if (insert.rowsAffected.length > 0) {
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
  }
});


router.get('/getpicture/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sql.connect(config);
    const request = new sql.Request();
    request.input('id', sql.VarChar, id);

    const result = await request.query('SELECT * FROM users WHERE email = @id');
    if (result.recordset.length > 0) {
      const pictureData = result.recordset[0].picture;

      res.send(pictureData);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});




/*******************************************************ACCOUNT SPECIFIC ROUTES*******************************************************/
router.get('/getglsaleaccounts',async (req,res)=>{
  try {
    await sql.connect(config)
    const getglsalesaccount = await sql.query('SELECT * FROM accountsubcontrol WHERE accountcontrolid = 3012')
    if(getglsalesaccount.recordset.length > 0){
      res.json(getglsalesaccount.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})


router.get('/getstockaccount',async (req,res)=>{
  try {
    await sql.connect(config)
    const getstockaccount =await  sql.query(`SELECT * FROM accountsubcontrol WHERE accountcontrolid = 4034`)
    if(getstockaccount.recordset.length > 0){
      res.json(getstockaccount.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})

router.get('/getcosaccount',async (req,res)=>{
  try {
    await sql.connect(config)
    const getcosaccount = await sql.query(`SELECT * FROM accountsubcontrol WHERE accountcontrolid = 4048`)
    if(getcosaccount.recordset.length > 0){
      res.json(getcosaccount.recordset)
    }
  } catch (error) {
    console.log(error);
  }
})


/****************************************************BALANCE SHEET************************************************/
router.get('/getbalancesheet',async (req,res)=>{
  try {
    await sql.connect(config)
    const request = new sql.Request()
    
  } catch (error) {
    console.log(error);
  }
})




/****************************************************REPORTING************************************************/
/***********************************************DAY BOOK PURCHASE************************************************/
router.post('/getpurchasedaybook',async (req,res)=>{
  const {startdate,enddate,supplierid} = req.body;
  try {
    await sql.connect(config);
    if(!startdate || !enddate){
      res.sendStatus(404);
    }
    else{
      if(supplierid && supplierid > 0){
        const purdaybook = await sql.query(`SELECT * FROM supplierinvoice WHERE invoicedate >= '${startdate}' AND invoicedate <= '${enddate}'  AND supplierid = ${supplierid}`)
        if(purdaybook.recordset.length > 0){
          res.json(purdaybook.recordset)
        }else{
          res.sendStatus(402);
        }

      }else{

        const purdaybook = await sql.query(`SELECT * FROM supplierinvoice WHERE invoicedate >= '${startdate}' AND invoicedate <= '${enddate}'`)
        if(purdaybook.recordset.length > 0){
          res.json(purdaybook.recordset)
        }else{
          res.sendStatus(402);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
})

/***********************************************SALE RECEIPT REPORT************************************************/
router.get('/getalltransactions',async (req,res)=>{
  try {
    await sql.connect(config)
    const alltransactions = await sql.query(`SELECT* FROM transactions`);
    if(alltransactions.recordset.length > 0){
      //      res.status(201).json({message:"success",data:alltransactions});
      res.json(alltransactions.recordset);
    }else{
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/getcustomerinvoicedated',async (req,res)=>{
  const {startdate,enddate,customerid} = req.body;
  try {
    await sql.connect(config)
    if(!startdate || !enddate){
    res.sendStatus(402);
    }else{
      if(customerid && customerid > 0){
        const getinvoices = await sql.query(`SELECT * FROM customerinvoice WHERE invoicedate >= '${startdate}' and invoicedate <= '${enddate}' and customerid = ${customerid}`);
        if(getinvoices.recordset.length > 0){
          res.json(getinvoices.recordset)
        }
      }else{
        const getinvoices = await sql.query(`SELECT * FROM customerinvoice WHERE invoicedate >= '${startdate}' and invoicedate <= '${enddate}'`);
        if(getinvoices.recordset.length > 0){
          res.json(getinvoices.recordset)
        }

      }
    }
  } catch (error) {
    console.log(error);
  }
})

/***********************************************JOURNAL ENTRY REPORT************************************************/
router.post('/getjournalentrydate',async (req,res)=>{
  const {startdate,enddate,id}=req.body;
  try {
    await sql.connect(config)
    if(startdate && enddate){
      const getjournalentries = await sql.query(`SELECT * FROM journalentry WHERE journaldate >= '${startdate}' and journaldate <= '${enddate}'`) 
      if(getjournalentries.recordset.length > 0){
        res.json(getjournalentries.recordset);
      }else{
        res.sendStatus(403);
      }
    }
    if(id && id>0){
      const getjournalentries = await sql.query(`SELECT * FROM journalentry WHERE journalentryid = ${id}`) 
      if(getjournalentries.recordset.length > 0){
        res.json(getjournalentries.recordset);
      }else{
        res.sendStatus(404);
      }
    }
  } catch (error) {
    console.log(error);
  }
})



//ROUTE TO GET AUTHENTIC USER
router.get('/a',logger,(req,res)=>{
  result= req.result;
  res.json(result.recordset)
})

module.exports = router;