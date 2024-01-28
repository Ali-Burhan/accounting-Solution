import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './supplier.css'
import { Dropdown } from 'react-bootstrap';
import Error from '../error/error';
const Supplier = () => {
  const [customerData,setCustomerData] = useState({suppliername:"",supplieremail:"",suppliercontact:"",supplieraddress:"",supplierdescription:"",supplierindustry:"",supplierpaymentterm:"",suppliercreditlimit:"",supplierntn:"",suppliersaletax:"",openingdate:'',openingbalance:'',cnic:'',supplierstn:'',bankname:'',accountnumber:'',accountname:'',iban:'',swiftcode:'',bankaddress:'',suppliercity:'',supplierprovince:'',supplierpostalcode:'',suppliercountry:''})
  const navigate = useNavigate()
  const [term,setterm] = useState(false)
  const [tax,settax] = useState(false)
  const [address,setaddress] = useState(false)
  const [bank,setbank] = useState(false)
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

const handletaxclick = (e) => {
    settax(true)
    setterm(false)
    setaddress(false)
    setbank(false)
}
const handletermclick = (e) => {
    settax(false)
    setterm(true)
    setaddress(false)
    setbank(false)
}
const handleaddress = (e) => {
    settax(false)
    setterm(false)
    setaddress(true)
    setbank(false)
}
const handlebank = (e) => {
    settax(false)
    setterm(false)
    setaddress(false)
    setbank(true)
}

const handleSubmit =async (e) => {
  e.preventDefault()
  
  const {suppliername,supplieremail,suppliercontact,supplieraddress,supplierdescription,supplierindustry,supplierpaymentterm,suppliercreditlimit,supplierntn,suppliersaletax,openingdate,openingbalance,cnic,supplierstn,bankname,accountnumber,accountname,iban,swiftcode,bankaddress,suppliercity,supplierprovince,supplierpostalcode,suppliercountry} = customerData;

  let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
     }
     
     let bodyContent = JSON.stringify({
      suppliername,supplieremail,suppliercontact,
      supplieraddress,supplierdescription,supplierindustry,
      supplierpaymentterm,suppliercreditlimit,supplierntn,
      suppliersaletax,openingdate,openingbalance,cnic,
      supplierstn,createdby:localStorage.getItem('userid'),
      bankname,accountnumber,accountname,iban,swiftcode,
      bankaddress,suppliercity,supplierprovince,
      supplierpostalcode,suppliercountry,
      suppliercoacode:String(accountsubcontrolid)
  });
     
     let response = await fetch("/addsupplier", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/supplier')
     }else{
      console.log("Error Occured");
     }
}

const handledropdownsupplier = (itemname,itemid) => {
    setaccountsubcontrolname(itemname)
    setaccountsubcontrolid(itemid)
    console.log(accountsubcontrolid);
      }
      useEffect(()=>{
        handleglcode()
      },[])
  return (
    <>
       <div className="container">
        <div className="row">
            <div className="col-2 d-sm-none d-md-none d-lg-block"></div>
            <div className="col-8">
<div className="row suppliergroup">
        <div className="col-12">
    <h4 className='text-center suppliertitle' style={{fontWeight:"bold"}}>Create Supplier</h4>
        </div>
        <div className="col-12">
            <h5 className='d-inline-block my-2 bg-dark text-white rounded p-2'>General Info</h5>
        </div>
        <div className="col-md-3 my-1">    
                <span style={{fontWeight:"bold"}}>Supplier Name</span>
                <input type="text" value={customerData.suppliername} onChange={handleChange} className="customerinput" name='suppliername'/>
        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>GL Account Control</span>
        <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {accountsubcontrolname ? accountsubcontrolname : "Supplier"}
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
        <span style={{fontWeight:"bold"}}>Supplier Phone</span>

            <input type="text" value={customerData.suppliercontact} onChange={handleChange}   className="customerinput" name='suppliercontact' />
        </div>   <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Industry</span>

            <input type="text" value={customerData.supplierindustry}  onChange={handleChange}  className="customerinput"  name='supplierindustry'/>

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Email</span>

            <input type="text" value={customerData.supplieremail}  onChange={handleChange}  className="customerinput" name='supplieremail' />
        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Description</span>

            <textarea type="text" value={customerData.supplierdescription} onChange={handleChange}   name='supplierdescription' className="customerinput" />

        </div>

        <div className="col-12 border  rounded ">
            <h5 className={`mx-1 d-inline-block my-2 p-2 ${address && 'bg-dark text-white rounded'}`} onClick={handleaddress} style={{cursor:'pointer'}}>Address</h5>
            <h5 className={`mx-1 d-inline-block my-2 p-2 ${tax && 'bg-dark text-white rounded'}`} onClick={handletaxclick} style={{cursor:'pointer'}}>Tax Info</h5>
            <h5 className={`mx-1 d-inline-block my-2 p-2 ${term && 'bg-dark text-white rounded'}`} style={{cursor:'pointer'}} onClick={handletermclick}>Terms Info </h5>
            <h5 className={`mx-1 d-inline-block my-2 p-2 ${bank && 'bg-dark text-white rounded'}`} onClick={handlebank} style={{cursor:'pointer'}}>Bank Info</h5>
       
        </div>
        { term && <>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Payment Term</span>

            <input type="text" value={customerData.supplierpaymentterm} onChange={handleChange}    name='supplierpaymentterm' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Credit Limit</span>

            <input type="number"  value={customerData.suppliercreditlimit} onChange={handleChange}    name='suppliercreditlimit' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Opening Date</span>

            <input type="date" value={customerData.openingdate} onChange={handleChange}    name='openingdate' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Opening Balance</span>

            <input type="number"  value={customerData.openingbalance} onChange={handleChange}    name='openingbalance' className="customerinput" />

        </div>
        </>
        }
        { tax &&
            <>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Supplier NTN</span>

            <input type="text" value={customerData.supplierntn} onChange={handleChange}   name='supplierntn' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Sale Tax</span>

            <input type="text" value={customerData.suppliersaletax} onChange={handleChange}   name='suppliersaletax' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Supplier CNIC</span>

            <input type="number" value={customerData.cnic} onChange={handleChange}   name='cnic' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Supplier STN</span>

            <input type="text" value={customerData.supplierstn} onChange={handleChange}   name='supplierstn' className="customerinput" />

        </div>
        </>
        }
       
        { address &&
            <>
                <div className="col-md-8 my-1">
        <span style={{fontWeight:"bold"}}>Supplier Address</span>

        <input type="text" value={customerData.supplieraddress} onChange={handleChange}   className=" customerinput" name='supplieraddress' />
        </div>
        <div className="col-4"></div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:"bold"}}>City</span>

            <input type="text" value={customerData.suppliercity} onChange={handleChange}   name='suppliercity' className="customerinput" />

        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:"bold"}}>Province</span>

            <input type="text" value={customerData.supplierprovince} onChange={handleChange}   name='supplierprovince' className="customerinput" />

        </div>
        <div className="col-4"></div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:"bold"}}>Postal Code</span>

            <input type="number" value={customerData.supplierpostalcode} onChange={handleChange}   name='supplierpostalcode' className="customerinput" />

        </div>
        <div className="col-md-4 my-1">
        <span style={{fontWeight:"bold"}}>Country</span>

            <input type="text" value={customerData.suppliercountry} onChange={handleChange}   name='suppliercountry' className="customerinput" />

        </div>
        </>
        }
        { bank &&
            <>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Bank Name</span>

            <input type="text" value={customerData.bankname} onChange={handleChange}   name='bankname' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Account Name</span>

            <input type="text" value={customerData.accountname} onChange={handleChange}   name='accountname' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Account Number</span>

            <input type="number" value={customerData.accountnumber} onChange={handleChange}   name='accountnumber' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>IBAN</span>

            <input type="text" value={customerData.iban} onChange={handleChange}   name='iban' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Swift Code</span>

            <input type="text" value={customerData.swiftcode} onChange={handleChange}   name='swiftcode' className="customerinput" />

        </div>
        <div className="col-md-6 my-1">
        <span style={{fontWeight:"bold"}}>Address</span>

            <input type="text" value={customerData.bankaddress} onChange={handleChange}   name='bankaddress' className="customerinput" />

        </div>
        </>
        }
       
        <div className="col-md-12">
            <button style={{width:"100%"}} className='my-2 btn' onClick={handleSubmit}>SUBMIT</button>
        </div>
        </div>
            </div>
    <div className="col-2"></div>
        </div>
    </div>
    </>
  )
}

export default Supplier