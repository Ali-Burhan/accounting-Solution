import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Paypendingsupplierinvoices = () => {
    const navigate = useNavigate()
    const [selectedsuppliername,setselectsuppliername] = useState('')
    const [selectedsupplierid,setselectedsupplierid] = useState('')
    const [supplier,setsupplier] = useState([])
    const [pendingInvoices,setPendingInvoices] = useState([])
    const [suppliertotal,setsuppliertotal] = useState('')
    const [bank,setbank] = useState([])
    const [taxdrop,setTaxdrop] = useState([{id:0, value:"No - Tax"},{id:5, value:"5%"},{id:5.5, value:"5.5%"},{id:6, value:"6%"},{id:8, value:"8%"},{id:9, value:"9%"},{id:10, value:"10%"},{id:12, value:"12%"}])
    const [incometax,setincometax] = useState("")
    const [bankname,setbankname] = useState("")
    const [bankid,setbankid] = useState("")
    const [paymentdate,setpaymentdate] = useState('')
    const [remarks,setremarks] = useState('')
    const [taxdropname,settaxdropname] = useState('')
    const [taxdropid,settaxdropid] = useState(0)
    const [error,setError] = useState(false)

    const handleallPayment = async () => {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
         supplierid:selectedsupplierid,
         bankid,
         incometaxrate:taxdropid,
         paymentdate,
         remarks
       });
       
       let response = await fetch("/payselectedsupplierremaininginvoice", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       if(response.ok){
        window.location.reload()
       }
    } 

    const handledropdowntax = (itemname,itemid) => {
      settaxdropname(itemname)
      settaxdropid(itemid)
        }
    const handledropdownbank = (itemname,itemid) => {
      setbankname(itemname)
      setbankid(itemid)
        }

    const handledropdownsupplier = (itemname,itemid) => {
        setselectsuppliername(itemname)
        setselectedsupplierid(itemid)
          }
          const handleSuppliers = async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json",
               }
               
               let response = await fetch("/getsupplier", { 
                 method: "GET",
                 headers: headersList
               });
               
               let data = await response.json();
               setsupplier(data)
        }
          const handlebank = async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json",
               }
               
               let response = await fetch("/getaccountasset", { 
                 method: "GET",
                 headers: headersList
               });
               
               let data = await response.json();
               setbank(data)
        }
        const getSelectedPendingInvoices = async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
               }
               
               let response = await fetch(`/getselectedsupplierpendinginvoices/${selectedsupplierid}`, { 
                 method: "GET",
                 headers: headersList
               });
               if(response.ok){

                   let data = await response.json();
                   console.log(data);
                   setPendingInvoices(data)
                   setError(false)
                  }else{
                  setPendingInvoices([])
                    setError(true)
                }
        }
        useEffect(()=>{
            handleSuppliers()
            handlebank()
        },[])
        useEffect(()=>{
getSelectedPendingInvoices()
},[selectedsupplierid])
useEffect(() => {
  const total = pendingInvoices.length > 0 ? pendingInvoices.map((row) => row.totalamount).reduce((prev, curr) => prev + curr) : '';
  console.log(total);
  setsuppliertotal(total);
  setincometax(Math.floor(total*taxdropid/100))
}, [pendingInvoices,taxdropid]);
  return (
    <>
    <div className="container">
<div className="row my-3">
  <div className="col-lg-3 jborder">
    <div className="row">
<div className="col-12 my-2">
  <span>Select Supplier</span>
    <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedsuppliername ? selectedsuppliername : " Select Supplier"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { supplier.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownsupplier(ele.suppliername,ele.supplierid)} key={supplier.value}>{ele.suppliername}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
</div>
<div className="col-12 my-2">
<span>Select Income Tax</span>
  <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {taxdropname ? taxdropname : "Income Tax"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { taxdrop.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdowntax(ele.value,ele.id)} key={ele.id}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
            </div>
<div className="col-12 my-2"><Dropdown className=''>
<span>Bank & Cash</span>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {bankname ? bankname : "Bank & Cash"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { bank.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownbank(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={ele.accountsubcontrolid}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
            </div>
            <div className="col-lg-12">
  <span>Payment Date</span>
              <input type="date" onChange={(e)=>setpaymentdate(e.target.value)} name="fromDate" className='customerinput my-2'/>
            </div>
            <div className="col-lg-12">
  <span>Remarks</span>
              <textarea onChange={(e)=>setremarks(e.target.value)} className='customerinput my-2'></textarea>
            </div>
            <div className="col-12">
            <Card style={{ width: '100%',border:'none' }}>
                              <Card.Body>
        <Card.Title>Supplier Total</Card.Title>
        <Card.Text>
          {pendingInvoices.length>0? suppliertotal?Math.round(suppliertotal):"":""}
        </Card.Text>
        <Card.Title>Total Income Tax</Card.Title>
        <Card.Text>
          {incometax}
        </Card.Text>
        <Button variant="primary" onClick={handleallPayment}>Pay All</Button>
      </Card.Body>
    </Card>
            </div>
    </div>
            </div>
            <div className="col-lg-9">
              <div className="row">
<div className="col-12">

    <TableContainer className='tablehead  my-2' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Invoice No</TableCell>
                  <TableCell align="" className='text-white'>Total Amount</TableCell>
                  <TableCell align="" className='text-white'>Shipping Fee</TableCell>
                  <TableCell align="" className='text-white'>Tax</TableCell>
                  <TableCell align="right" className='text-white'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  error? "No Record":
                  
                  pendingInvoices.map((row) => ( 
                    <TableRow
                    key={row.productid}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                    <TableCell component="th" scope="row">
                      {row.invoiceno}
                    </TableCell>
                    <TableCell align="">{Math.floor(row.totalamount)}</TableCell>
                    <TableCell align="">{row.shippingfee}</TableCell>
                    <TableCell align="">{row.saletax}</TableCell>
                     <TableCell align="right"><button className='btn2' onClick={()=>navigate(`/paysupplierpendinginvoice/${row.supplierremaininginvoice}`)}>Pay</button></TableCell>
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
                  </div>
    </>
  )
}

export default Paypendingsupplierinvoices