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
const HomeAccountActivity = () => {
  const navigate = useNavigate()
  const [accountactivity,setaccountactivity] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([])
  const [searchData,setSearchData] = useState('')
  const filterContent = (e) => {
      const searchValue = e.target.value;
      setSearchData(searchValue);
      const newUsers = accountactivity.filter((user) => user.accountactivityname.toLowerCase().toString().includes(searchValue));
      setFilteredUsers(newUsers);
    };


    const handleBranchtype = async () => {
      
      let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json"
     }
     
     let response = await fetch("/getaccountactivity", { 
       method: "GET",
       headers: headersList
     });
     
     let data = await response.json();
     console.log(data);
     setaccountactivity(data)
    }
 useEffect(()=>{
  handleBranchtype()
},[])
const handleedit = (ids) => {      
  navigate(`/editaccountavtivity/${ids}`);
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
          <CSVLink  data={accountactivity} filename={"users_data.csv"}>
      <button className='csvbutton'>Excel</button>
  </CSVLink>
  <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
          <Link to={'/createaccountactivity'} className='btn btn-outline-primary'>Create new Account Activity</Link>
      </div> 
      <div className="">
      </div>
  <TableContainer className='tablehead' component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='bg-dark'>
              <TableRow>
                <TableCell className='text-white'><b> Account Activity Name</b></TableCell>
                <TableCell className='text-white'><b> Balance</b></TableCell>
                <TableCell className='text-white'><b> Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredUsers.length===0?
                accountactivity.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.accountactivityname}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.balance} Rs.
                  </TableCell>
                  <TableCell ><button onClick={()=>handleedit(row.accountactivityid)} className='btn btn-outline-primary'>Edit</button> <button className='btn btn-outline-danger'>Del</button> </TableCell>
                </TableRow>
              )):
              filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.accountactivityname}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.balance} Rs.
                  </TableCell>
                  {/* onClick={()=>handledelete(row.productid)} */}
                  
                  <TableCell align="right"><button onClick={()=>handleedit(row.accountactivityid)} className='btn btn-outline-primary'>Edit</button></TableCell>
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

export default HomeAccountActivity