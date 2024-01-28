import React, { useEffect, useState } from 'react'
import './customer.css'
import { useNavigate } from 'react-router-dom'
import errorpic from '../images/Nodata.gif'
import { Dropdown } from 'react-bootstrap';
const Customer = () => {
    const [customerData,setCustomerData] = useState({customercode:"",customername:"",
    customerlegalentity:"",customeraddress:"",customerphone:"",customeremail:"",
    customerindustry:"",customerbillingaddress:"",customershippingaddress:"",
    customerpaymentterm:"",customercreditlimit:"",customervatnumber:"",city:'',
    province:'',postalcode:'',country:'',ntn:'',stn:'',cnic:'',openingdate:'',
    openingbalance:'',discount:''})

    const [filer,setfiler] = useState(false)
    const navigate = useNavigate()
    const [address,setaddress] = useState(true)
    const [tax,settax] = useState(false)
    const [terms,setterms] = useState(false)
    const [supplierglcode,setsupplierglcode] = useState([])
    const [accountsubcontrolname,setaccountsubcontrolname] = useState('')
    const [accountsubcontrolid,setaccountsubcontrolid] = useState('')
    const handleChange = (e) =>{
        setCustomerData({...customerData,[e.target.name]:e.target.value})
        console.log(customerData);
    }
    const handleglcode = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getsupplierglcode", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setsupplierglcode(data)
           
    }
    
    const handleaddress = () => {
        setaddress(true)
        setterms(false)
        settax(false)
    }
    const handleterms = () => {
        setaddress(false)
        setterms(true)
        settax(false)
    }
    const handletax = () => {
        setaddress(false)
        setterms(false)
        settax(true)
    }

    const handleSubmit =async (e) => {
        e.preventDefault()
        
        const {customercode,customername,customerlegalentity,
            customeraddress,customerphone,customeremail,
            customerindustry,customerbillingaddress,customershippingaddress,
            customerpaymentterm,customercreditlimit,customervatnumber,
            city,province,postalcode,country,ntn,stn,cnic,openingdate,openingbalance,discount
        } = customerData;

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let bodyContent = JSON.stringify({
            customercode,customername,customerlegalentity,
            customeraddress,customerphone,customeremail,
            customerindustry,customerbillingaddress,
            customershippingaddress,customerpaymentterm,
            customercreditlimit,customervatnumber,city,province,
            postalcode,country,ntn,stn,cnic,openingdate,
            openingbalance,discount,filer,
            glaccount:accountsubcontrolid
        });
           
           let response = await fetch("/addcustomer", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           navigate('/customers')
    }
    const handledropdownsupplier = (itemname,itemid) => {
        setaccountsubcontrolname(itemname)
        setaccountsubcontrolid(itemid)
          }

          useEffect(()=>{
            handleglcode()
          },[])

    return (
    <>
    <div className="cutomermain container">
        <div className="row">
<div className="row ">
<div className="col-2"></div>
<div className="col-md-8">
<div className="row customergroup">
    <h4 className='text-center customertitle'>Create Customer</h4>
    <div className="col-12">
        <h5 className='d-inline-block p-2 bg-dark text-white border rounded'>General Info</h5>
    </div>
        <div className="col-md-3 my-1">
                <span style={{fontWeight:"bold"}}>Customer Code</span>            
                <input type="text" value={customerData.customercode} onChange={handleChange}  className="customerinput" name='customercode'/>
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Customer Name</span>            

                <input type="text" value={customerData.customername}  onChange={handleChange} className="customerinput" name='customername'/>
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Customer Title</span>            
                
                <input type="text" value={customerData.customerlegalentity} onChange={handleChange} className="customerinput" name='customerlegalentity'/>
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>GL Account Control</span>
        <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden',height:'33px'}} variant="dark" id="dropdown-basic">
       {accountsubcontrolname ? accountsubcontrolname : "GL Account"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { supplierglcode.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsupplier(ele.accountsubcontrolname,ele.accountsubcontrolcode)} key={supplierglcode.value}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Customer Phone</span>            

            <input type="text" value={customerData.customerphone} onChange={handleChange}   className="customerinput" name='customerphone' />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Customer Email</span>            

            <input type="text" value={customerData.customeremail}  onChange={handleChange}   className="customerinput" name='customeremail' />
        </div>

        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Customer Industry</span>            

            <input type="text" value={customerData.customerindustry}  onChange={handleChange}   className="customerinput"  name='customerindustry'/>

        </div>

        <div className="col-12 border p-1">
        <h5 className={`d-inline-block p-2 ${ address && 'bg-dark text-white border rounded'}`} style={{cursor:'pointer'}} onClick={handleaddress}>Address</h5>
        <h5 className={`d-inline-block p-2 ${ tax && 'bg-dark text-white border rounded'}`} style={{cursor:'pointer'}} onClick={handletax}>Tax Info</h5>
        <h5 className={`d-inline-block p-2 ${ terms && 'bg-dark text-white border rounded'}`} style={{cursor:'pointer'}} onClick={handleterms}>Terms</h5>
        </div>
        {terms &&
        <>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Payment Term Days</span>       
            <input type="text" value={customerData.customerpaymentterm} onChange={handleChange}    name='customerpaymentterm' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Credit Limit</span>            

            <input type="text"  value={customerData.customercreditlimit} onChange={handleChange}    name='customercreditlimit' className="customerinput" />

        </div>

        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Opening Date</span>            
            <input type="date" value={customerData.openingdate} onChange={handleChange}   name='openingdate' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Opening Balance</span>            
            <input type="number" value={customerData.openingbalance} onChange={handleChange}   name='openingbalance' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Discount</span>            
            <input type="number" value={customerData.discount} onChange={handleChange}   name='discount' className="customerinput" />
        </div>
        <div className="col-md-3 p-4 my-1">
        <h4 style={{fontWeight:"bold"}} className='d-inline'>Filer</h4>            
            <input type="checkbox" style={{height:'60%',width:'30%'}} onChange={(e)=>setfiler(e.target.checked)} name='customervatnumber' className="" />
        </div>
        </>
    }
    {address &&
        <>        <div className="col-md-6">
        <span style={{fontWeight:"bold"}}>Customer Address</span>  
        <input type="text" value={customerData.customeraddress} onChange={handleChange}    className=" customerinput" name='customeraddress' />
        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Customer Billing Address</span> 
            <input type="text" value={customerData.customerbillingaddress} onChange={handleChange}    className="customerinput" name='customerbillingaddress' />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>City</span>            
           <input type="text" value={customerData.city}  onChange={handleChange}  name='city' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Province</span>            
           <input type="text" value={customerData.province}  onChange={handleChange}  name='province' className="customerinput" />
        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Customer Shipping Address</span>            
           <input type="text" value={customerData.customershippingaddress}  onChange={handleChange}  name='customershippingaddress' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Postal Code</span>            
           <input type="text" value={customerData.postalcode}  onChange={handleChange}  name='postalcode' className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Country</span>            
           <input type="text" value={customerData.country}  onChange={handleChange}  name='country' className="customerinput" />
        </div>
        
        </>}
        {tax &&
            <>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>NTN</span>            
            <input type="text" value={customerData.ntn} onChange={handleChange}   name='ntn' className="customerinput" />
        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>STN</span>            
            <input type="text" value={customerData.stn} onChange={handleChange}   name='stn' className="customerinput" />
        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>CNIC</span>            
            <input type="text" value={customerData.cnic} onChange={handleChange}   name='cnic' className="customerinput" />
        </div>
        </>}
        <div className="col-md-12">

            <button className='btn customerbtn' onClick={handleSubmit}>SUBMIT</button>
        </div>
        </div>
        </div>
        <div className="col-2"></div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Customer