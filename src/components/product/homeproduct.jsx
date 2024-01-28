import React, { useEffect, useState } from 'react'

import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Homeproduct = () => {
    const [product,setproduct] = useState([]);
    const [productcategory,setproductcategory] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
  const [message,setMessage] = useState(false)
    const navigate = useNavigate()
    // const filterContent = (e) => {
    //     const searchValue = e.target.value;
    //     setSearchData(searchValue);
    //     const newUsers = product.filter((user) => user.productid == searchValue);
    //     setFilteredUsers(newUsers);
    //   };

    const filterContent = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setSearchData(searchValue);
      const newUsers = product.filter((product) =>
      product.productname.toString().toLowerCase().includes(searchValue)
      );
      setFilteredUsers(newUsers);
    };
    
      const handleProducts = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            // "Set-Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbG5hbWUiOiJBaG1hZCBTdWJoYW4iLCJlbWFpbCI6ImFobWFkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWhtYWQiLCJpYXQiOjE2ODYxNDIxMDB9.RyBFrvNaJkdq14p4e6DW9gZF2Y7QtkJhqAyRim03xxQ"
           }
           
           let response = await fetch("/getproducts", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setproduct(data)
           
    }
      const handleProductsCategory = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch("/getproductscategory", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setproductcategory(data)
           
    }
    useEffect(()=> {
      handleProducts();
      handleProductsCategory()
    },[])


    const handleedit = (ids) => {      
      navigate(`/editproduct/${ids}`);
      }
      const handledelete = async (id) => {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
         }
         
         let response = await fetch(`/deleteproducts/${id}`, { 
           method: "DELETE",
           headers: headersList
         });
         
         if(response.ok){
          setMessage(true)
          window.location.reload()
         }
         
      }
  return (
    <>
    
    <div className="table">
        <div className="csvfile">
            <CSVLink  data={product} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with Name' id="search1" onChange={filterContent} />
            <Link to={'/createproduct'} className='btn btn-outline-primary'>Create new product</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow className=''>
                  
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Type</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Category</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Name</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Quantity</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Description</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Sales Data</TableCell>
                  <TableCell align="" className='text-white' style={{fontWeight:"bold"}}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                {
                  filteredUsers.length===0?
                  product.map((row) => ( 
                

                    <TableRow
                    key={row.productid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    
                    >
                    <TableCell align="">{row.producttypeid=='2'?'Sale':"Purchase"}</TableCell>
                    <TableCell align="">{productcategory.map((ele)=>(ele.productcategoryid==row.productcategory?ele.productcategoryname:""))}</TableCell>
                    <TableCell align="">{row.productquantity==0?<strike>{row.productname}</strike>:row.productname}</TableCell>
                    <TableCell align="">{row.productquantity}</TableCell>
                    <TableCell align="">{row.productdescription}</TableCell>
                    <TableCell align="">{row.productsalesdata}</TableCell>
                    <TableCell align=""><button className='btn2 btn-outline-primary' onClick={()=>handleedit(row.productid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.productid)}>Del</button> </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.productid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell align="">{row.producttypeid=='2'?'Sale':"Purchase"}</TableCell>
                    <TableCell align="">{productcategory.map((ele)=>(ele.productcategoryid==row.productcategory?ele.productcategoryname:""))}</TableCell>
                    <TableCell align="">{row.productquantity==0?<strike>{row.productname}</strike>:row.productname}</TableCell>
                    <TableCell align="">{row.productquantity}</TableCell>
                    <TableCell align="">{row.productdescription}</TableCell>
                    <TableCell align="">{row.productsalesdata}</TableCell>
                    <TableCell align=""><button className='btn2 btn-outline-primary' onClick={()=>handleedit(row.productid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.productid)}>Del</button> </TableCell>
                </TableRow>
                ))
                
                }
              </TableBody>
            </Table>
          </TableContainer>
    </div>
    </>
  )
}

export default Homeproduct