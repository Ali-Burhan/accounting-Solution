import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import { Dropdown } from 'react-bootstrap';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './daybookpur.css'
import { Link, useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
const Daybookpur = () => {
    const [startdate,setStartDate] = useState('')
    const [enddate,setEndDate] = useState('')
    const [transactions,setTransactions] = useState([])
    const [supplierinvoicedetail,setInvoicedetail] = useState([])
    const [products,setProducts] = useState([])
    const [supplier,setSupplier] = useState([])
    const [selectedsupplierid,setselectedsupplierid] = useState('')
    const [selectedsuppliername,setselectsuppliername] = useState('')
    const currentDate = new Date();  // Get the current date

    // Format the current date in the desired format
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  
    const getsupplierinvoicedetail = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getsupplierinvoicedetail", { 
             method: "GET",

             headers: headersList
           });
           
           let data = await response.json();
           setInvoicedetail(data)
    }

    const getProducts = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getproducts", { 
             method: "GET",

             headers: headersList
           });
           
           let data = await response.json();
           setProducts(data)
    }

    const getSupplier = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getsupplier", { 
             method: "GET",

             headers: headersList
           });
           
           let data = await response.json();
           setSupplier(data)
    }

    const handledropdownsupplier = (itemname,itemid) => {
      setselectsuppliername(itemname)
      setselectedsupplierid(itemid)
        }
    const gettransactions = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             startdate,
             enddate,
             supplierid:selectedsupplierid,
           });
           
           let response = await fetch("/getpurchasedaybook", { 
             method: "POST",
             body: bodyContent,
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
    useEffect(()=>{
        getsupplierinvoicedetail()
        getProducts()
        getSupplier()
    },[])
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
                <h1 className='text-center branchtitle'><b>Day Book Purchase</b></h1>
                <div className="row">
                    <div className="col-2"> 
                    <span>Select Supplier</span>
                    <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedsuppliername ? selectedsuppliername : "Supplier"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { supplier.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsupplier(ele.suppliername,ele.supplierid)} key={supplier.value}>{ele.suppliername}</Dropdown.Item>
          ))}
                    <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createsupplier'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown></div>
                    <div className="col-3"> <span>Start Date</span> <input onChange={(e)=>setStartDate(e.target.value)} className='customerinput' type="date" style={{width:'100%'}} /> <p className='daybookpurdates'> From Date : {formatDateToCustomString(startdate)}</p> </div>
                    <div className="col-3"><span>End Date</span><input type="date" style={{width:'100%'}} className='customerinput' onChange={(e)=>setEndDate(e.target.value)}/><p className='daybookpurdates'> To Date : {formatDateToCustomString(enddate)}</p></div>
                    <div className="col-4"><span>Submit</span><button type="submit" style={{width:'100%'}} className='btnb' onClick={gettransactions}> Get </button><p className='daybookpurdates'> Print Date : {formatDateToCustomString(formattedDate)}</p></div>
                </div>
                <div className="row my-3">
                    <div className="col-lg-12">
                    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Date</TableCell>
                  <TableCell className='text-white'>Product Name</TableCell>
                  <TableCell className='text-white'>Supplier Name</TableCell>
                  <TableCell align="" className='text-white'>Quantity</TableCell>
                  <TableCell align="" className='text-white'>Net Price</TableCell>
                  <TableCell align="" className='text-white'>Sale Tax</TableCell>
                  <TableCell align="" className='text-white'>Discount</TableCell>
                  <TableCell align="" className='text-white'>Gross</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  transactions.map((row) => ( 
                    <TableRow
                    key={row.transactionid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {formatDateToCustomString(row.invoicedate).slice(0,11)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {supplierinvoicedetail.map((ele)=>(ele.supplierinvoiceid==row.supplierinvoiceid? products.map((p)=>(p.productid==ele.productid?p.productname:"")):""))}
                    </TableCell>
                    <TableCell align="">{supplier.map((ele)=>(ele.supplierid==row.supplierid?ele.suppliername:""))}</TableCell>
                    <TableCell align="">{supplierinvoicedetail.map((ele)=>(ele.supplierinvoiceid==row.supplierinvoiceid?ele.purchasequantity:""))}</TableCell>
                    <TableCell align="">{row.subtotalamount}</TableCell>
                    <TableCell align="">{Math.round(row.saletax)}</TableCell>
                    <TableCell align="">{ '0'}</TableCell>
                    <TableCell align="">{ Math.round(row.totalamount)}</TableCell>
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

export default Daybookpur