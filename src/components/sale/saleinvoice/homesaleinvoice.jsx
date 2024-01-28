import React, { useEffect, useState } from 'react'
import { Badge, Dropdown } from 'react-bootstrap';
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Homesaleinvoice = ({user}) => {
    const navigate = useNavigate()
    const [filteredUsers,setFilteredUsers] = useState([])
    const [supplierincoice,setSupplierinvoice] = useState([])
    const [searchData,setSearchData] = useState('')
    const getSupplierInvoices = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getcustomerinvoice", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
            setSupplierinvoice(data)           
    }
    useEffect(()=>{
        getSupplierInvoices()
        console.log(user);
    },[])
    const handleedit = (ids) => {      
        navigate(`/customerinvoice/${ids}`);
        }
        const handledelete = async (id) => {
          let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch(`/deletepurchasecart/${id}`, { 
             method: "DELETE",
             headers: headersList
           });
           
           if(response.ok){
            window.location.reload()
           }
           
        }   
        const filterContent = (e) => {
          const searchValue = e.target.value.toLowerCase();
          setSearchData(searchValue);
          const newUsers = supplierincoice.filter((user) =>
            user.invoiceno.toString().toLowerCase().includes(searchValue)
          );
          setFilteredUsers(newUsers);
        };
  return (
    <>
      <div className="table">
      <div className="csvfile">
            <CSVLink  data={ filteredUsers.length > 0?filteredUsers: supplierincoice} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with Name' id="search1" onChange={filterContent} />
        </div> 
        <div className="">
          <h5>All Invoices</h5>
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white' >Invoice No.</TableCell>
                  <TableCell className='text-white'  align="right">Invoice Date</TableCell>
                  <TableCell className='text-white'  align="right">Sub Total Amount</TableCell>
                  <TableCell className='text-white'  align="right">Sale Tax</TableCell>
                  <TableCell  className='text-white' align="right">Shipping fee</TableCell>
                  <TableCell  className='text-white' align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  supplierincoice.map((row) => ( 
                    <TableRow onClick={()=>handleedit(row.customerinvoiceid)} style={{cursor:"pointer"}}
                    key={row.productid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell  component="th" scope="row">
                    <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
                      {row.invoiceno}
                    </TableCell>
                    <TableCell align="right">{row.invoicedate?.slice(0,10)}</TableCell>
                    <TableCell align="right">{row.subtotalamount}</TableCell>
                    <TableCell align="right">{row.tax}</TableCell>
                     <TableCell align="right">{row.shippingfee}</TableCell>
                     <TableCell align="right">{<Badge bg='primary'>HISTORY</Badge>}</TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow onClick={()=>handleedit(row.customerinvoiceid)} style={{cursor:"pointer"}}
                  key={row.productid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell  component="th" scope="row">
                  <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
<path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
                    {row.invoiceno}
                  </TableCell>
                  <TableCell align="right">{row.invoicedate?.slice(0,10)}</TableCell>
                  <TableCell align="right">{row.subtotalamount}</TableCell>
                  <TableCell align="right">{row.tax}</TableCell>
                   <TableCell align="right">{row.shippingfee}</TableCell>
                   <TableCell align="right">{<Badge bg='primary'>HISTORY</Badge>}</TableCell>
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

export default Homesaleinvoice