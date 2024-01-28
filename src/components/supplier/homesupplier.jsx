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
const HomeSupplier = () => {
    const [supplier,setSupplier] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const navigate = useNavigate()

    const handledelete = async (id) => {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
       }
       
       let response = await fetch(`/deletesupplier/${id}`, { 
         method: "DELETE",
         headers: headersList
       });
       
       if(response.ok){

       }
       
    }

    const handleCustomers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            // "Set-Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbG5hbWUiOiJBaG1hZCBTdWJoYW4iLCJlbWFpbCI6ImFobWFkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWhtYWQiLCJpYXQiOjE2ODYxNDIxMDB9.RyBFrvNaJkdq14p4e6DW9gZF2Y7QtkJhqAyRim03xxQ"
           }
           
           let response = await fetch("/getsupplier", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setSupplier(data)
           
    }
    useEffect(()=>{
        handleCustomers();
    },[])

    // const filterContent = (e) => {
    //     const searchValue = e.target.value;
    //     setSearchData(searchValue);
    //     const newUsers = supplier.filter((user) => user.supplierid == searchValue);
    //     setFilteredUsers(newUsers);
    //   };
    const filterContent = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setSearchData(searchValue);
      const newUsers = supplier.filter((user) =>
        user.suppliername.toString().toLowerCase().includes(searchValue)
      );
      setFilteredUsers(newUsers);
    };
  return (
    <>
    <div className="container">
      <div className="row">
    <div className="col-12">
    <div className="table" style={{width:'100%'}}>
        <div className="csvfile">
            <CSVLink  data={supplier} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/createsupplier'} className='btn btn-outline-primary'>Create new Supplier</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell align="right" className='text-white'>Supplier Name</TableCell>
                  <TableCell align="right" className='text-white'>Supplier Email</TableCell>
                  <TableCell align="right" className='text-white'>Supplier Phone</TableCell>
                  <TableCell align="right" className='text-white'>Supplier Address</TableCell>
                  <TableCell align="right" className='text-white'>Supplier Term</TableCell>
                  <TableCell align="right" className='text-white'>Supplier Credit limit</TableCell>
                  <TableCell align="right" className='text-white'>Actions</TableCell>
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  supplier.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.suppliername}
                    </TableCell>
                    <TableCell align="right">{row.supplieremail}</TableCell>
                    <TableCell align="right">{row.suppliercontact}</TableCell>
                    <TableCell align="right">{row.supplieraddress}</TableCell>
                    <TableCell align="right">{row.supplierpaymentterm}</TableCell>
                    <TableCell align="right">{row.suppliercreditlimit}</TableCell>
                    <TableCell align="right"> <button className='btn2' onClick={()=>navigate(`/editsupplier/${row.supplierid}`)}>Edit</button> <button className='btn' onClick={()=>handledelete(row.supplierid)}>Delete</button></TableCell>
                    
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                   <TableCell component="th" scope="row">
                      {row.suppliername}
                    </TableCell>
                    <TableCell align="right">{row.supplieremail}</TableCell>
                    <TableCell align="right">{row.suppliercontact}</TableCell>
                    <TableCell align="right">{row.supplieraddress}</TableCell>
                    <TableCell align="right">{row.supplierpaymentterm}</TableCell>
                    <TableCell align="right">{row.suppliercreditlimit}</TableCell>
                    
                  </TableRow>
                ))
                
                }
              </TableBody>
            </Table>
          </TableContainer>
    </div>
    </div>
                </div>
              </div>
    </>
  )
}

export default HomeSupplier