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
const Homejournalentry = () => {
    const navigate = useNavigate()
    const [bankpayment,setbankpayment] = useState([]);
    const [nominalaccounts,setnominalaccounts] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const filterContent = (e) => {
        const searchValue = e.target.value;
        setSearchData(searchValue);
        const newUsers = bankpayment.filter((user) => user.journalentryid == searchValue);
        setFilteredUsers(newUsers);
      };


      const handleBankPayments = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getjournalentry", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setbankpayment(data)
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
    handleBankPayments()
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
            <CSVLink  data={bankpayment} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/journalentry'} className='btn btn-outline-primary'>New Journal Entry</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>V. No.</TableCell>
                  <TableCell className='text-white'>Date</TableCell>
                  <TableCell className='text-white'>Debit Account</TableCell>
                  <TableCell className='text-white'>Credit Account</TableCell>
                  <TableCell className='text-white'>Ref. No.</TableCell>
                  <TableCell className='text-white'>Detail</TableCell>
                  <TableCell className='text-white'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  bankpayment.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.journalentryid}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.journaldate.slice(0,10)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.debitaccount?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                    { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.creditaccount?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.refno}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.description.slice(0,15)}..
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.amount}
                    </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.journalentryid}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.journaldate.slice(0,10)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.debitaccount?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                    { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.creditaccount?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.refno}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.description.slice(0,15)}..
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.amount}
                    </TableCell>
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

export default Homejournalentry