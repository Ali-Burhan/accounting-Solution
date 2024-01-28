import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Badge from 'react-bootstrap/Badge';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Homepurchasereturn = ({user}) => {
    const navigate = useNavigate()
    const [filteredUsers,setFilteredUsers] = useState([])
    const [supplierincoice,setSupplierinvoice] = useState([])
    const [pendingInvoices,setPendingInvoices] = useState([])
    const getPendingInvoices = async () => {

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getremainingsupplierinvoices", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setPendingInvoices(data)
           console.log(data);
    }
    useEffect(()=>{
        getPendingInvoices()
    },[])
    const getSupplierInvoices = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getsupplierinvoice", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
            setSupplierinvoice(data)           
    }
    useEffect(()=>{
        getSupplierInvoices()
    },[])
    const handleedit = (ids) => {      
        navigate(`/supplierreturninvoicedetail/${ids}`);
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
  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-12">

      <div className="table"  style={{ maxHeight: '88vh', overflow: 'auto' }}>
        <div className="">
          <h5>All Invoices</h5>
        </div>
    <TableContainer className='tablehead'  component={Paper}>
            <Table sx={{ minWidth: 650 }}  aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white' >Invoice No.</TableCell>
                  <TableCell className='text-white' align="right">Invoice Date</TableCell>
                  <TableCell className='text-white' align="right">Sub Total Amount</TableCell>
                  <TableCell className='text-white' align="right">Sale Tax</TableCell>
                  <TableCell className='text-white' align="right">Shipping fee</TableCell>
                  <TableCell className='text-white' align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  supplierincoice.map((row) => ( 
                    <TableRow  style={{cursor:"pointer"}}
                    key={row.productid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell  component="th" onClick={()=>handleedit(row.supplierinvoiceid)} scope="row">
                    <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
                      {row.invoiceno  }
                    </TableCell>
                    <TableCell align="right">{row.invoicedate.slice(0,10)}</TableCell>
                    <TableCell align="right">{row.subtotalamount}</TableCell>
                    <TableCell align="right">{row.saletax}</TableCell>
                     <TableCell align="right">{row.shippingfee}</TableCell>
                     <TableCell align="right">{ pendingInvoices.map((ele)=>(row.invoiceno==ele.invoiceno?<Badge bg="danger" onClick={()=>navigate(`/paysupplierpendinginvoice/${ele.supplierremaininginvoice}`)}>PENDING</Badge>:""))} <Badge bg='primary'>HISTORY</Badge> </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.productid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.productid}
                  </TableCell>
                  <TableCell align="right">{row.productname}</TableCell>
                  <TableCell align="right">{row.productweight}</TableCell>
                  <TableCell align="right">{row.productprice}</TableCell>
                  <TableCell align="right">{row.productsupplier}</TableCell>
                  <TableCell align="right">{row.productsalesdata}</TableCell>
                  <TableCell align="right"><button className='btn btn-outline-primary' onClick={()=>handleedit(row.productid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.productid)}>Del</button> </TableCell>
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

export default Homepurchasereturn