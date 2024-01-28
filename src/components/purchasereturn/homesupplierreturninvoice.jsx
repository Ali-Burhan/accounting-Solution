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
const Homereturnsupplierinvoice = () => {
    const navigate = useNavigate()
    const [returninvoice,setreturninvoice] = useState([])
    const [invoices,setInvoices] = useState([])
    const returnedinvoices = async () => {
      
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getreturnsupplierinvoice", { 
         method: "GET",
         headers: headersList
       });
       if(response.ok){
         let data = await response.json();
         console.log(data);
         setreturninvoice(data)
        } 
       
    }

    useEffect(()=>{
      returnedinvoices()
    },[])

  return (
    <>
    <div className="table"  style={{ maxHeight: '88vh', overflow: 'auto' }}>
        <div className="">
          <h5>All Invoices</h5>
        </div>
    <TableContainer className='tablehead'  component={Paper}>
            <Table sx={{ minWidth: 650 }}  aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Invoice No.</TableCell>
                  <TableCell className='text-white' align="right">Invoice Date</TableCell>
                  <TableCell className='text-white' align="right">Sub Total Amount</TableCell>
                  <TableCell className='text-white' align="right">Quantity</TableCell>
                  <TableCell className='text-white' align="right">Tax</TableCell>
                  <TableCell className='text-white' align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  returninvoice.map((row) => ( 
                    <TableRow  style={{cursor:"pointer"}}
                    onClick={()=>navigate(`/returninvoicedetail/${row.supplierinvoiceid}`)}
                    key={row.supplierreturninvoiceid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell  component="th" scope="row"
                    
                    >
                    <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
                      {row.returninvoicetitle  }
                    </TableCell>
                    <TableCell align="right">{row.returndate.slice(0,10)}</TableCell>
                    <TableCell align="right">{row.returnamount}</TableCell>
                    <TableCell align="right">{row.returnquantity}</TableCell>
                     <TableCell align="right">{ Math.floor(row.tax)}</TableCell>
                     <TableCell align="right"> <Badge bg='primary'>HISTORY</Badge> </TableCell>
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

export default Homereturnsupplierinvoice