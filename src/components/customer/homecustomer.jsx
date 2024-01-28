import React, { useEffect, useState } from 'react'
import "./customer.css"
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
const HomeCustomer = () => {
    const [customer,setCustomer] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')


    const handledelete = async (id) => {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",   }
       
       let response = await fetch(`/deletecustomer/${id}`, { 
         method: "DELETE",
         headers: headersList
       });
       if(response.ok){
        window.location.reload()
       }
       
    }
    const handleCustomers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            // "Set-Cookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbG5hbWUiOiJBaG1hZCBTdWJoYW4iLCJlbWFpbCI6ImFobWFkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWhtYWQiLCJpYXQiOjE2ODYxNDIxMDB9.RyBFrvNaJkdq14p4e6DW9gZF2Y7QtkJhqAyRim03xxQ"
           }
           
           let response = await fetch("/getcustomers", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setCustomer(data)
           
    }
    useEffect(()=>{
        handleCustomers();
    },[])

    // const filterContent = (e) => {
    //     const searchValue = e.target.value;
    //     setSearchData(searchValue);
    //     const newUsers = customer.filter((user) => user.cutomercode == searchValue);
    //     setFilteredUsers(newUsers);
    //   };

    const filterContent = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setSearchData(searchValue);
      const newUsers = customer.filter((user) =>
        user.customername.toString().toLowerCase().includes(searchValue)
      );
      setFilteredUsers(newUsers);
    };
  return (
    <>
    <div className="table">
        <div className="csvfile">
            <CSVLink  data={customer} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/createcustomers'} className='btn btn-outline-primary'>Create new Customer</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'> ID</TableCell>
                  <TableCell className='text-white' align="right"> Name</TableCell>
                  <TableCell className='text-white' align="right"> Email</TableCell>
                  <TableCell className='text-white' align="right"> Phone</TableCell>
                  <TableCell className='text-white' align="right"> Address</TableCell>
                  <TableCell className='text-white' align="right"> industry</TableCell>
                  <TableCell className='text-white' align="right"> Credit limit</TableCell>
                  <TableCell className='text-white' align="right"> Actions</TableCell>
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  customer.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.cutomercode}
                    </TableCell>
                    <TableCell align="right">{row.customername}</TableCell>
                    <TableCell align="right">{row.customeremail}</TableCell>
                    <TableCell align="right">{row.customerphone}</TableCell>
                    <TableCell align="right">{row.customeraddress}</TableCell>
                    <TableCell align="right">{row.customerindustry}</TableCell>
                    <TableCell align="right">{row.customercreditlimit}</TableCell>
                    <TableCell align="right"> <button className="btn" onClick={()=>handledelete(row.cutomercode)}>Delete</button> </TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.cutomercode}
                    </TableCell>
                    <TableCell align="right">{row.customername}</TableCell>
                    <TableCell align="right">{row.customeremail}</TableCell>
                    <TableCell align="right">{row.customerphone}</TableCell>
                    <TableCell align="right">{row.customeraddress}</TableCell>
                    <TableCell align="right">{row.customerindustry}</TableCell>
                    <TableCell align="right">{row.customercreditlimit}</TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
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

export default HomeCustomer