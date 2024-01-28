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
const Homebankreceipt = () => {
    const navigate = useNavigate()
    const [bankreceipt,setbankreceipt] = useState([]);
    const [nominalaccounts,setnominalaccounts] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const filterContent = (e) => {
        const searchValue = e.target.value;
        setSearchData(searchValue);
        const newUsers = bankreceipt.filter((user) => user.employeeid == searchValue);
        setFilteredUsers(newUsers);
      };


      const handlebankreceipts = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getbankreceipt", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setbankreceipt(data)
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
    handlebankreceipts()
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
            <CSVLink  data={bankreceipt} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
            <Link to={'/bankreceipt'} className='btn btn-outline-primary'>New Bank Receipt</Link>
        </div> 
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>V. No.</TableCell>
                  <TableCell className='text-white'>Date</TableCell>
                  <TableCell className='text-white'>Bank</TableCell>
                  <TableCell className='text-white'>Nominal Account</TableCell>
                  <TableCell className='text-white'>Ref. No.</TableCell>
                  <TableCell className='text-white'>Detail</TableCell>
                  <TableCell className='text-white'>Amount</TableCell>
                  <TableCell align="right" className='text-white'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  bankreceipt.map((row) => ( 
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.bankreceiptsid}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.paymentdate?.slice(0,10)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.bankid?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                    { nominalaccounts.length > 0? nominalaccounts.map((ele)=>(ele.accountsubcontrolid==row.nominalaccountid?ele.accountsubcontrolname:"")):""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.refno}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.detail}
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

export default Homebankreceipt