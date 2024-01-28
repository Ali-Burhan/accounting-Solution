import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Dropdown } from 'react-bootstrap';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
const Salereceiptreport = () => {
    const [startdate,setStartDate] = useState('')
    const [enddate,setEndDate] = useState('')
    const [transactions,setTransactions] = useState([])
    const [supplierinvoicedetail,setInvoicedetail] = useState([])
    const [supplier,setSupplier] = useState([])
    const [selectedsuppliername,setselectsuppliername] = useState('')
    const [selectedsupplierid,setselectedsupplierid] = useState('')
    const [banks,setbanks] = useState([])

    const bankandcash = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getaccountasset", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setbanks(data)
           console.log(data);
           
    }

    const currentDate = new Date();  // Get the current date

    // Format the current date in the desired format
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  
    const getcustomerinvoice = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getcustomerinvoicedated", { 
             method: "POST",
            body:JSON.stringify({
startdate,
enddate,
customerid:selectedsupplierid
            }),
             headers: headersList
           });
           
           let data = await response.json();
           setInvoicedetail(data)
    }

    const getCustomer = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getcustomers", { 
             method: "GET",

             headers: headersList
           });
           
           let data = await response.json();
           setSupplier(data)
    }


    const gettransactions = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
            
           
           let response = await fetch("/getalltransactions", { 
             method: "GET",
             headers: headersList
           });
           
           if(response.ok){

               let data = await response.json();
               setTransactions(data)
               console.log(data); 
            }else if(response.status == 404){
                window.alert('SELECT DATE')
            }
    }
    const handledropdownsupplier = (itemname,itemid) => {
      setselectsuppliername(itemname)
      setselectedsupplierid(itemid)
        }

    useEffect(()=>{
        gettransactions()
        getCustomer()
    },[])
    useEffect(()=>{
        bankandcash()
    },[transactions.length])
    function formatDateToCustomString(dateString) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const [year, month, day] = dateString.split('-');
      
        const formattedDate = `${year}-${months[parseInt(month, 10) - 1]}-${day}`;
        return formattedDate;
      }

  return (
    <>
    <div className="container">
        <div className="row my-2">
            <div className="col-lg-1"></div>
            <div className="col-lg-10">
                <h1 className='text-center branchtitle'><b>Sale Receipt Report</b></h1>
                <div className="row">
                    <div className="col-2">
                      <span>Select Customer</span>
                      <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedsuppliername ? selectedsuppliername : " Select Customer"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { supplier.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsupplier(ele.customername,ele.cutomercode)} key={supplier.value}>{ele.customername}</Dropdown.Item>
          ))}
          <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createcustomers'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown></div>
                    <div className="col-3"> <span>Start Date</span> <input onChange={(e)=>setStartDate(e.target.value)} className='customerinput' type="date" style={{width:'100%'}} /> <p className='daybookpurdates'> From Date : {formatDateToCustomString(startdate)}</p> </div>
                    <div className="col-3"><span>End Date</span><input type="date" style={{width:'100%'}} className='customerinput' onChange={(e)=>setEndDate(e.target.value)}/><p className='daybookpurdates'> To Date : {formatDateToCustomString(enddate)}</p></div>
                    <div className="col-4"><span>Submit</span><button type="submit" style={{width:'100%'}} className='btnb' onClick={getcustomerinvoice}> Get </button><p className='daybookpurdates'> Print Date : {formatDateToCustomString(formattedDate)}</p></div>
                </div>
                <div className="row my-3">
                    <div className="col-lg-12">
                    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Date</TableCell>
                  <TableCell className='text-white'>Customer Name</TableCell>
                  <TableCell className='text-white'>Bank Or Cash</TableCell>
                  <TableCell align="" className='text-white'>Remarks</TableCell>
                  <TableCell align="" className='text-white'>Voucher No</TableCell>
                  <TableCell align="" className='text-white'>Receipts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  supplierinvoicedetail.map((row) => ( 
                    <TableRow
                    key={row.customerinvoiceid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {formatDateToCustomString(row.invoicedate).slice(0,11)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {supplier.map((ele)=>(ele.cutomercode==row.customerid?ele.customername:""))}
                    </TableCell>
                    <TableCell align="">{ transactions.length > 0 && transactions.map((ele)=>(ele.voucher==' SP '+row.customerinvoiceid? banks.length > 0 &&  banks.map((b)=>(b.accountsubcontrolid==ele.accountsubcontrolid?b.accountsubcontrolname:"")) :""))}</TableCell>
                    <TableCell align="">{row.customerinvoicedescription}</TableCell>
                    <TableCell align=""> SP {row.customerinvoiceid}</TableCell>
                    <TableCell align="">Rs. {row.totalamount}</TableCell>
                    </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <div className="col-12 my-2">
          <button className="btnp" style={{width:'100%'}} onClick={()=>window.print()}>Print</button>
          </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Salereceiptreport