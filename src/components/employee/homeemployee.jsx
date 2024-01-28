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
const Homeemployee = () => {
    const navigate = useNavigate()
    const [customer,setCustomer] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const filterContent = (e) => {
        const searchValue = e.target.value;
        setSearchData(searchValue);
        const newUsers = customer.filter((user) => user.employeeid == searchValue);
        setFilteredUsers(newUsers);
      };


      const handleBranchtype = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getemployee", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setCustomer(data)
      }
useEffect(()=>{
    handleBranchtype()
},[])
const handleedit = (ids) => {      
    navigate(`/editemployee/${ids}`);
    }
    const handledelete = async (id) => {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
         }
         
         let response = await fetch(`/deletebranchtype/${id}`, { 
           method: "DELETE",
           headers: headersList
         });
         
         if(response.ok){
        //   setMessage(true)
          window.location.reload()
         }
         
      }

  return (
    <>
    <div className="table">
        <div className="csvfile">
            <CSVLink  data={customer} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/createemployee'} className='btn btn-outline-primary'>Create new Branch</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Employee Name</TableCell>
                  <TableCell className='text-white'>Employee Contact</TableCell>
                  <TableCell className='text-white'>Employee Email</TableCell>
                  <TableCell className='text-white'>Employee Salary</TableCell>
                  <TableCell align="right" className='text-white'>Actions</TableCell>
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
                      {row.employeename}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.employeecontact}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.employeeemail}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.employeemonthlysalary}
                    </TableCell>
                    <TableCell align="right"><button onClick={()=>handleedit(row.employeeid)} className='btn btn-outline-primary'>Edit</button> <button className='btn btn-outline-danger'>Del</button> </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.employeename}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.employeecontact}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.employeeemail}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.employeemonthlysalary}
                  </TableCell>
                  <TableCell align="right"><button onClick={()=>handleedit(row.employeeid)} className='btn btn-outline-primary'>Edit</button> <button className='btn btn-outline-danger'>Del</button> </TableCell>
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

export default Homeemployee