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
const Homebanktransfer = () => {
    const navigate = useNavigate()
    const [banktransfer,setbanktransfer] = useState([]);
    const [nominalaccounts,setnominalaccounts] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const filterContent = (e) => {
        const searchValue = e.target.value;
        setSearchData(searchValue);
        const newUsers = banktransfer.filter((user) => user.employeeid == searchValue);
        setFilteredUsers(newUsers);
      };


      const handlebanktransfers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getbanktransfer", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setbanktransfer(data)
      }
      const handlenominals = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getaccountsubcontrol", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           
           setnominalaccounts(data)
      }
useEffect(()=>{
    handlebanktransfers()
    handlenominals()
},[])
const handleedit = (ids) => {      
    navigate(`/editcompany/${ids}`);
    }
    const handledelete = async (id) => {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
         }
         
         let response = await fetch(`/deletecompany/${id}`, { 
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
            <CSVLink  data={banktransfer} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/banktransfer'} className='btn btn-outline-primary'>New Bank Transfer</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>V. No.</TableCell>
                  <TableCell className='text-white'>Date</TableCell>
                  <TableCell className='text-white'>From Bank</TableCell>
                  <TableCell className='text-white'>To Bank</TableCell>
                  <TableCell className='text-white'>Ref. No.</TableCell>
                  <TableCell className='text-white'>Detail</TableCell>
                  <TableCell className='text-white'>Amount</TableCell>
                  <TableCell align="right" className='text-white'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  banktransfer.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.banktransfersid}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.transferdate?.slice(0,10)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.frombankid?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                    { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.tobankid?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.refno}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.description?.slice(0,15)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.amount}
                    </TableCell>
                    <TableCell align="right"><button className='btn btn-outline-danger'>Del</button> </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.name}
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

export default Homebanktransfer