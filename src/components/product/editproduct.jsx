import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
const EditProduct = () => {
  
  const [option,setOption] = useState([])
  const [selectedtitem,setSelectedItem] = useState('')
  const [selectedtitemid,setSelectedItemid] = useState('')
  const [productData,setproductData] = useState({productname:"",productcategory:"",productdescription:"",productunitofmeasure:"",productprice:"",productavailability:"",productweight:"",productsupplier:"",productsalesdata:""})
  const [product,setproduct] = useState([]);
  const {ids} = useParams()
  const navigate = useNavigate()
  const handleProducts = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        }
       
       let response = await fetch(`/getproducts/${ids}`, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
       setproduct(data)
       
}
useEffect(()=> {
  handleProducts();
},[])

const handledropdownitem = (itemname,itemid) => {
  console.log(itemid);
setSelectedItem(itemname)
setSelectedItemid(itemid)
}
const handleProductCategory = async () => {
  let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      // "Set-Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbG5hbWUiOiJBaG1hZCBTdWJoYW4iLCJlbWFpbCI6ImFobWFkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWhtYWQiLCJpYXQiOjE2ODYxNDIxMDB9.RyBFrvNaJkdq14p4e6DW9gZF2Y7QtkJhqAyRim03xxQ"
     }
     
     let response = await fetch("/getproductscategory", { 
       method: "GET",
       headers: headersList
     });
     
     let data = await response.json();
     setOption(data)
     console.log(option);
}
const handleChange = (e) =>{
  setproductData({...productData,[e.target.name]:e.target.value})
  console.log(productData);
}
useEffect(()=> {
  handleProductCategory();
},[])

const handleUpdate =async (e) => {
  const {productname,productcategory,productdescription,productunitofmeasure,productprice,productavailability,productweight,productsupplier,productsalesdata} = productData;
  e.preventDefault()
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json",
    }
   
   let bodyContent = JSON.stringify({
    productname,productcategory:selectedtitemid,productdescription,productunitofmeasure,productprice,productavailability,productweight,productsupplier,productsalesdata
   });
   
   let response = await fetch(`/updateproducts/${ids}`, { 
     method: "POST",
     body: bodyContent,
     headers: headersList
   });
   if(response.ok){
     navigate('/product')
    }
}
  return (
    <>
    
    <div className="cutomermain container">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="row decoeditpro">
              <div className="col-12">
        <div className="top branchtitle">
    <h4>Edit Product</h4>
        </div>
        </div>
        <div className="col-md-4 my-1">

        <div className="customerform">
            <span style={{fontWeight:'bold'}}>ID</span>
                <input type="text" value={ product.length > 0?  product[0].productid:""} readOnly className="customerinput" name='productid'/>
            
        </div>
        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:'bold'}}>Product Name</span>
                <input type="text" value={product.length > 0? productData.productname:""} placeholder={product.length > 0? product[0].productname:""} onChange={handleChange} className="customerinput" name='productname'/>
        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:'bold'}}>Category</span>

        <div className="customerform">
                
                {/* <input type="text" value={productData.productcategory} placeholder='product Category' onChange={handleChange} className="customerinput" name='productcategory'/> */}
                <Dropdown>
      <Dropdown.Toggle variant="info" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Select an option"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { option.map((ele)=>(
                       <Dropdown.Item onClick={()=>handledropdownitem(ele.productcategoryname,ele.productcategoryid)} key={option.value} href="#option1">{ele.productcategoryname}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
        </div>
        <div className="col-md-12 my-1">
        <span style={{fontWeight:'bold'}}>Product Description</span>

        <input type="text" value={productData.productdescription} onChange={handleChange}   placeholder={product.length > 0? product[0].productdescription:""} className=" customerinput" name='productdescription' />
        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:'bold'}}>Unit of Measure</span>
            <input type="text" value={productData.productunitofmeasure} onChange={handleChange}   placeholder={product.length > 0? product[0].productunitofmeasure:""} className="customerinput" name='productunitofmeasure' />
        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:'bold'}}>Product Price</span>
            <input type="text" value={productData.productprice}  onChange={handleChange}  placeholder={product.length > 0? product[0].productprice:""} className="customerinput" name='productprice' />
        </div>
        <div className="col-md-4 my-1">

        <span style={{fontWeight:'bold'}}>Product availability</span>
            <input type="text" value={productData.productavailability}  onChange={handleChange}  placeholder='product availability' className="customerinput"  name='productavailability'/>

        </div>
        <div className="col-md-12 my-1">
        <span style={{fontWeight:'bold'}}>Product Weight</span>
            <input type="text" value={productData.productweight} onChange={handleChange}   placeholder='product weight' className="customerinput" name='productweight' />

        </div>
        <div className="col-md-12 my-1">

        <span style={{fontWeight:'bold'}}>Product Supplier</span>
            <input type="text" value={productData.productsupplier}  onChange={handleChange}  name='productsupplier' placeholder='product supplier' className="customerinput" />

        </div>
        <div className="col-md-4 my-1">

        <span style={{fontWeight:'bold'}}>Product Sales Data</span>
            <input type="text" value={productData.productsalesdata} onChange={handleChange}   placeholder='product sales data' name='productsalesdata' className="customerinput" />

        </div>
        <div className="col-md-12">
          
            <button className='btn btn100 btn-success' onClick={handleUpdate}>Update</button>
        </div>
        </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default EditProduct