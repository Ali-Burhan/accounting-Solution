import React, {useState,useEffect} from 'react'
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
import EditProductCategory from './editproductcategory';
const Homeproductcategory = () => {
    const [productCategory,setproductCategory] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const navigate = useNavigate();
    // const filterContent = (e) => {
    //     const searchValue = e.target.value;
    //     setSearchData(searchValue);
    //     const newUsers = productCategory.filter((user) => user.productcategoryid == searchValue);
    //     setFilteredUsers(newUsers);
    //   };
      
    const filterContent = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setSearchData(searchValue);
      const newUsers = productCategory.filter((category) =>
      category.productcategoryname.toString().toLowerCase().includes(searchValue)
      );
      setFilteredUsers(newUsers);
    };

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
           console.log(data);
           setproductCategory(data)
           
    }
    useEffect(()=> {
        handleProductCategory();
    },[])

    const handleedit = (ids) => {      
    navigate(`/editproductcategory/${ids}`);
    }
  return (
    <>
       <div className="table">
        <div className="csvfile">
            <CSVLink  data={productCategory} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/createproductcategory'} className='btn btn-outline-primary'>Create new product Category</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>product ID</TableCell>
                  <TableCell align="right" className='text-white'>product Name</TableCell>
                  <TableCell align="right" className='text-white'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  productCategory.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.productcategoryid}
                    </TableCell>
                    <TableCell align="right">{row.productcategoryname}</TableCell>
                    <TableCell align="right"><button onClick={()=>handleedit(row.productcategoryid)} className='btn2'>Edit</button><button className='btn btn-outline-danger mx-1'>Delete</button></TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                   <TableCell component="th" scope="row">
                      {row.productcategoryid}
                    </TableCell>
                    <TableCell align="right">{row.productcategoryname}</TableCell>
                    <TableCell align="right"><button onClick={()=>handleedit(row.productcategoryid)} className='btn btn-outline-primary'>Edit</button><button className='btn btn-outline-danger mx-1'>Delete</button></TableCell>
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

export default Homeproductcategory