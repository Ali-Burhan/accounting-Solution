import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./productcategory.css"
const ProductCategory = () => {
    const [productData,setProductData] = useState({productcategoryid:"",productcategoryname:""})
    const navigate = useNavigate()
    const handleChange = (e) => {
        setProductData({...productData, [e.target.name]:e.target.value})
        console.log(productData )
    }

    const handleSubmit =async (e) => {
        e.preventDefault()
        const {productcategoryid,productcategoryname} = productData;
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let bodyContent = JSON.stringify({
            productcategoryid,productcategoryname
           });
           
           let response = await fetch("/addproductcategory", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setProductData({productcategoryid:"",productcategoryname:""})
           navigate(-1)
    }

  return (
    <>
    <div className="container">
        <div className="row">
          <div className="col-4"></div>
            <div className="col-lg-4 jborder my-4">
              <div className="row category">
                <div className="col-12">
                  <div className="col-12">
                <h3 className='text-center categorytitle'>Product Category</h3>
                  </div>
                <input type="text" name='productcategoryid'  value={productData.productcategoryid} onChange={handleChange} placeholder='Enter category ID' className='customerinput'/>
                <input type="text" name='productcategoryname' value={productData.productcategoryname} onChange={handleChange} placeholder='Enter category name' className='my-2 customerinput'/>
                <button style={{width:"100%"}} onClick={handleSubmit} className='my-2 btn '>Create</button>
                </div>
              </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ProductCategory