import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';

const Payinvoice = () => {
    const {ids} = useParams()
    const navigate = useNavigate()
    const [invoices,setInvoices] = useState([])
    const [customer,setCustomer] = useState([])
    const [bank,setbank] = useState([])
    const [payamount,setPayamount] = useState('')
    const [payerror,setPayerror] = useState(false) 
    const [taxdrop,setTaxdrop] = useState([{id:0, value:"No - Tax"},{id:5, value:"5%"},{id:5.5, value:"5.5%"},{id:6, value:"6%"},{id:8, value:"8%"},{id:9, value:"9%"},{id:10, value:"10%"},{id:12, value:"12%"}])
    const [taxdropname,settaxdropname] = useState('')
    const [taxdropid,settaxdropid] = useState(0)
    const [incometax,setincometax] = useState('')
    const [bankname,setbankname] = useState('')
    const [paymentdate,setpaymentdate] = useState('')
    const [invoiceamount,setinvoiceamount] = useState('')
    const [remarks,setremarks] = useState('')
    const [bankid,setbankid] = useState('')

    useEffect(()=>{
      let amount = invoices.length>0?Math.round(invoices[0].totalamount)-Math.round(invoices[0].paidamount):0
setinvoiceamount(amount);
console.log(invoiceamount);
    },[incometax,invoices.length])

    const handledropdowntax = (itemname,itemid) => {
      settaxdropname(itemname)
      settaxdropid(itemid)
        }
    const handleinvoice = async () =>{
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch(`/getselectedcustomerpendingpayinvoices/${ids}`, { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setInvoices(data)
    }
    const handleCustomer = async () =>{
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch(`/getcustomers`, { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setCustomer(data)
    }
    useEffect(()=>{
        handleinvoice()
        handleCustomer()
        handlebankaccounts()
    },[])

    const handlechange = (e) => {
        setPayamount(e.target.value)
    }
    useEffect(()=>{
      let check = invoices.length > 0? invoices[0].totalamount:""
      if(payamount>check){
        setPayerror(true)
      }else{
        setPayerror(false)
      }
    },[payamount])
    const handlepayment = async () => {
      if(payamount > 0){
      let invoiceno = invoices[0].customerinvoiceid
      let payamount1 = payerror?0:payamount
      let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch(`/paypendingcustomerinvoice`, { 
           method: "POST",
           headers: headersList,
           body:JSON.stringify({
             payamount1:Math.round(payamount1),
              invoiceno,
              bankid,
              incometax:incometax? Math.round(incometax):0,
              remarks,
              paymentdate,
              bankname,
              userid:localStorage.getItem('userid')
                   })
         });
         if(response.ok){
            navigate('/customerpendinginvoice')
         }else{

         }
        }else{
          window.alert('Please Enter a amount to pay')
        }
  }
  const handlebankaccounts = async () =>{

    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch(`/getaccountasset`, { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
       setbank(data)
}
  useEffect(()=>{
    if(!payamount || payamount < 0){
      let incometaxvalue = invoices.length>0?Math.round(invoices[0].totalamount)- Math.round(invoices[0].paidamount):""
      setincometax(incometaxvalue*taxdropid/100)
      console.log(incometax);
    }else{
      let incometaxvalue = payamount
      setincometax(incometaxvalue*taxdropid/100)
      console.log(incometax);
    }
  },[taxdropid,payamount])
  const handledropdownbank = (itemname,itemid) => {
    setbankname(itemname)
    setbankid(itemid)
      }
  return (
    <>
    <div className="container">
        <div className="row">
            <div className="col-12 my-1 text-center text-white bg-dark p-3 rounded" style={{fontSize:'1.5rem',fontWeight:'bold'}}>INVOICE NO : {invoices.map((row)=>(row.invoiceno))}</div>
            <div className="col-12">
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-lg-5 p-2">
                    <div className="card text-bg-light mb-3" style={{maxWidth:"100%"}}>
  <div className="card-header" >
    <div className="row">
    <div className="col-lg-4">
    {invoices.map((row)=>(customer.map((ele)=>(row.customerid==ele.cutomercode?ele.customername:""))))}
    </div>
    <div className="col-lg-4">
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
    <div className="col-lg-4">
<Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {bankname ? bankname : "Bank & Cash"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { bank.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownbank(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={ele.accountsubcontrolid}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
</div>
    </div>

  </div>
  {/* <div className="card-body">
    
    <p className="card-title ">Income Tax</p>
    <p className="card-text"><input type="number" value={incometax} readOnly   className='customerinput'/></p>
    <p className="card-title ">Order Total</p>
    <p className="card-text"><input type="number" value={invoices.length>0?Math.round(invoices[0].totalamount)- Math.round(invoices[0].paidamount):""} readOnly   className='customerinput'/></p>
    <p className="card-title ">Pay Amount {payerror? <strong className='text-danger'>INVALID AMOUNT</strong>:"" }</p>
    
    <p className="card-text"><input type="number" onChange={handlechange} className='customerinput'/></p>
    
          <button className="btn btn-outline-dark" style={{width:"100%"}} onClick={handlepayment}>Checkout</button>
  </div> */}
  <div className="card-body">
   
    <p className="card-title ">Payment Date</p>
    <p className="card-text"><input type="date" onChange={(e)=>setpaymentdate(e.target.value)} className='customerinput'/></p>
    <div className="row">
      <div className="col-lg-12">
    <p className="card-title ">Remarks</p>
        <textarea name="" id="" onChange={(e)=>setremarks(e.target.value)} className='customerinput'></textarea>
      </div>
      <div className="col-lg-6">
    <p className="card-title ">Invoice Total</p>
    <p className="card-text"><input type="number"  value={invoiceamount} readOnly   className='customerinput'/></p>
      </div>
      <div className="col-lg-6">

    <p className="card-title ">Income Tax</p>
    <p className="card-text"><input type="number" value={ Math.round(incometax)} readOnly   className='customerinput'/></p>
      </div>
    </div>
    <div className="row my-2">
          <div className="col-lg-6">

    {/* <p className="card-title ">Total</p>
    <p className="card-text"><input type="number" value={invoices.length>0?Math.round(invoices[0].totalamount)-Math.round(invoices[0].paidamount) + Math.round(incometax):""} readOnly   className='customerinput'/></p> */}
          </div>
          <div className="col-lg-12">

    <p className="card-title ">Pay Amount {payerror? <strong className='text-danger'>INVALID AMOUNT</strong>:"" }</p>
    
    <p className="card-text"><input type="number" placeholder='Amount Should be Less or equal to invoice total' onChange={handlechange} className='customerinput'/></p>
          </div>

    </div>
    
          <button className="btn btn-outline-dark" style={{width:"100%"}} onClick={handlepayment}>Submit</button>
  </div>
</div></div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Payinvoice