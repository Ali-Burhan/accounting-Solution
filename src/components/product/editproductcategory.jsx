import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditProductCategory = () => {
    const [productCategory,setproductCategory] = useState([]);
    const [updatedName,setUpdatedName] = useState('')
    const navigate = useNavigate()
    const {ids} = useParams()
    const handleProductCategory = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            // "Set-Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbG5hbWUiOiJBaG1hZCBTdWJoYW4iLCJlbWFpbCI6ImFobWFkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWhtYWQiLCJpYXQiOjE2ODYxNDIxMDB9.RyBFrvNaJkdq14p4e6DW9gZF2Y7QtkJhqAyRim03xxQ"
           }
           
           let response = await fetch(`/getproductscategory/${ids}`, { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setproductCategory(data)
           console.log(productCategory);
           
    }

    const handleUpdate = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            }
           
           let bodyContent = JSON.stringify({
             productcategoryname:updatedName
           });
           
           let response = await fetch(`/updateproduct/${ids}`, { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           if(response.ok){

               navigate('/productcategory')
            }
           
    }

    useEffect(()=> {
        handleProductCategory();
    },[])
  return (
    
    <div className="container">
        <div className="row">
          <div className="col-lg-4"></div>
            <div className="col-lg-4 jborder p-4 my-4">

                <h3 className='branchtitle text-center'>Product Category</h3>
                <input type="text" name='productcategoryid' readOnly value={productCategory.length > 0? productCategory[0].productcategoryid : ""}  placeholder={productCategory.length >0? productCategory[0].productcategoryid:""} className='customerinput'/>
                <input type="text" name='productcategoryname' onChange={(e)=>setUpdatedName(e.target.value)} placeholder={productCategory.length > 0? productCategory[0].productcategoryname:""} className='my-2 customerinput'/>
                <button style={{width:"100%"}} onClick={handleUpdate}  className='my-2 btn btn-outline-success'>Update</button>
            </div>
        </div>
    </div>
  )
}

export default EditProductCategory