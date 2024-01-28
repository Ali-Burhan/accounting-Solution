import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
const Paypendingsalereturn = () => {
    const navigate = useNavigate()
    const [invoices,setInvoices] = useState([])    
    const [supplier,setsupplier] = useState([])
    const [payamount,setPayamount] = useState(0)
    const [transactiondate,setTransactiondate] = useState('')
    const [payerror,setPayerror] = useState(false)
    const {ids} = useParams()
    const handleremaininginvoice = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch(`/getselectedsalereturnremaining/${ids}`, { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setInvoices(data)
    }
    const handlepayment = async () => {
        let invoiceno = invoices[0].supplierinvoiceid
        let payamount1 = payerror?0:payamount
        const response = await fetch(`/addremainingsalereturnpayment/${invoices[0].customerreturnremaininginvoice}`,{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                payamount:payamount1,
                transactiondate
            })
        })

        if(response.ok){
            console.log("SUCCESS");
            navigate('/allcustomerreturninvoices')
        }
          else{
            console.log("ERROR");
          } 
    }
    const handlesupplier = async () =>{
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
           setsupplier(data)
    }
    useEffect(()=>{
        handleremaininginvoice()
        handlesupplier()
    },[])
    const handlechange = (e) => {
        setPayamount(e.target.value)
    }
    useEffect(()=>{
      let check = invoices.length > 0? invoices[0].totalamount + invoices[0].tax:""
      if(payamount>check){
        setPayerror(true)
      }else{
        setPayerror(false)
      }
    },[payamount])
  return (
    <>
    <div className="container">
        <div className="row">
            <div className="col-12 my-1 text-center text-white bg-dark p-3 rounded">INVOICE NO : {invoices.map((row)=>(row.invoicetitle))}</div>
            <div className="col-12">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-6 p-2">
                    <div className="card text-bg-light mb-3" style={{maxWidth:"25rem"}}>
  <div className="card-header" >
    {invoices.map((row)=>(supplier.map((ele)=>(row.customerid==ele.cutomercode?ele.customername:""))))}
  </div>
  <div className="card-body">
    <div className="row">
    <div className="col-12 my-2">
        <span>Transaction Date</span>
        <input type="date" onChange={(e)=>setTransactiondate(e.target.value)} style={{width:'100%',padding:'5px',border:"1px solid grey",borderRadius:'5px'}}/>
    </div>
    </div>
  
  
    <p className="card-title ">Order Total</p>
    <p className="card-text"><input type="number" value={invoices.length>0?Math.floor(invoices[0].totalamount + invoices[0].tax)-Math.floor(invoices[0].paidamount):""} readOnly   className='customerinput'/></p>
    <p className="card-title ">Received Amount {payerror? <strong className='text-danger'>INVALID AMOUNT</strong>:"" }</p>
    
    <p className="card-text"><input type="number" onChange={handlechange} className='customerinput'/></p>
    
          <button className="btn btn-outline-dark" style={{width:"100%"}} onClick={handlepayment} >Checkout</button>
  </div>
</div></div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Paypendingsalereturn