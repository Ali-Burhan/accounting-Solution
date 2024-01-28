import React, { useState,useEffect } from 'react'

import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Homefinancialyear = () => {
    const [financialyear,setfinancialyear] = useState([])
    const navigate = useNavigate()
    const [accounthead,setaccounthead] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const filterContent = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchData(searchValue);
        const newUsers = financialyear.filter((user) => user.financialyear.toString().toLowerCase().includes(searchValue));
        setFilteredUsers(newUsers);
      };
    // const filterContent = (e) => {
    //   const searchValue = e.target.value.toLowerCase();
    //   setSearchData(searchValue);
    //   const newUsers = financialyear.filter((user) =>
    //     user.financialyear.toString().toLowerCase().includes(searchValue)
    //   );
    //   setFilteredUsers(newUsers);
    // };
    const handlefinancialyear = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getfinancialyear", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setfinancialyear(data)
    }
useEffect(()=>{
    handlefinancialyear()
},[])
    const handleedit = (ids) => {      
        navigate(`/editfinancialyear/${ids}`);
        }

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
const handleDelete = async (ids) => {
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json",
   }
   
   let response = await fetch(`/deletefinancialyear/${ids}`, { 
     method: "DELETE",
     headers: headersList
   });
   if(response.ok){
window.location.reload()
    }else if(response.status==404){
      window.alert('Can Not delete active year')
    }
   
}
  return (
    <>
     <div className="table">
      <div className="csvfile">
          <CSVLink  data={accounthead} filename={"users_data.csv"}>
      <button className='csvbutton'>Excel</button>
  </CSVLink>
  <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
          <Link to={'/createfinancialyear'} className='btn btn-outline-primary'>Create new Financial Year</Link>
      </div> 
      <div className="">
      </div>
  <TableContainer className='tablehead' component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='bg-dark'>
              <TableRow>
                <TableCell className='text-white'><b> Financial Year</b></TableCell>
                <TableCell className='text-white'><b> Start Date</b></TableCell>
                <TableCell className='text-white'><b> End Date</b></TableCell>
                <TableCell className='text-white'><b> User Id</b></TableCell>
                <TableCell className='text-white'><b>Is Active</b></TableCell>
                <TableCell className='text-white' ><b> Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredUsers.length===0?
                financialyear.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.financialyear}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {new Date(row.startdate).toLocaleDateString('en-US',options)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                  {new Date(row.enddate).toLocaleDateString('en-US',options)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.userid}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.isactive==1? <input type='checkbox' checked/> :<input type='checkbox' disabled/>}
                  </TableCell>
                  <TableCell ><button onClick={()=>handleedit(row.financialyearid)} className='btn btn-outline-primary'>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handleDelete(row.financialyearid)}>Del</button> </TableCell>
                </TableRow>
              )):
              filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.financialyear}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {new Date(row.startdate).toLocaleDateString('en-US',options)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                  {new Date(row.enddate).toLocaleDateString('en-US',options)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.userid}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.isactive==1? <input type='checkbox' checked/> :<input type='checkbox' disabled/>}
                  </TableCell>
                  <TableCell ><button onClick={()=>handleedit(row.financialyearid)} className='btn btn-outline-primary'>Edit</button> <button className='btn btn-outline-danger'>Del</button> </TableCell>
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

export default Homefinancialyear