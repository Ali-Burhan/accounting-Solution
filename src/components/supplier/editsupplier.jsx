import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom"
const Editsupplier = () => {
  const {ids} = useParams()
  const [supplierdata,setsupplierdata] = useState({suppliername:'',supplieremail:'',suppliercontact:'',supplierindustry:'',supplierpaymentterm:'',suppliercreditlimit:''})
  const [accounthead,setaccounthead] = useState([])
  const [accounthead2,setaccounthead2] = useState([])
  const [accountheadname,setaccountheadname] = useState('')
  const [accountheadcode,setaccountheadcode] = useState('')
  const [error,seterror] = useState('')
  const [user,setUser] = useState({})

const handlechange = (e) => {
    setsupplierdata({...supplierdata,[e.target.name]:e.target.value})
    console.log(supplierdata);
}

  const handleSubmit =async () => {
    let headersList = {
    "Accept": "*/*",
     "Content-Type": "application/json",
   }
   
   let response = await fetch("/a", { 
     method: "GET",
     headers: headersList
   });
   
   let data = await response.json();
   setUser(data)
}
useEffect(()=>{
  const fetchData = async () => {
    await handleSubmit();
  };
fetchData()
},[])
  const navigate = useNavigate()
  const handleeditaccounthead = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch(`/getsupplier/${ids}`, {
       method: "GET",
       headers: headersList
     }
     );
     
     let data = await response.json();
     setaccounthead(data)
     console.log(data);
  }

  const handleupdate = async () => {
    const {suppliername,suppliercontact,supplieremail,supplierindustry,supplierpaymentterm,suppliercreditlimit} = supplierdata;
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
        suppliername:suppliername?suppliername :accounthead[0].suppliername,
        suppliercontact:suppliercontact ?suppliercontact :accounthead[0].suppliercontact,
        supplieremail:supplieremail?supplieremail :accounthead[0].supplieremail,
        supplierindustry:supplierindustry?supplierindustry :accounthead[0].supplierindustry,
        supplierpaymentterm:supplierpaymentterm?supplierpaymentterm :accounthead[0].supplierpaymentterm,
        suppliercreditlimit:suppliercreditlimit?suppliercreditlimit :accounthead[0].suppliercreditlimit
     });
     
     let response = await fetch(`/updatesupplier/${ids}`, { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/supplier')
      seterror("")
     }
     else if(response.status == 401){
          seterror("Already Present")
     }
     else if(response.status == 402){
      seterror("Error Updating")
     }
  }

useEffect(()=>{
  handleeditaccounthead()
},[])

  return (
    <>
    <div className="container">
    <div className="row">
        <div className="col-2"></div>
        <div className="col-md-8 border p-4 rounded my-4">
            <div className="row"> 
            <div className="col-12"> <h3 className='text-center bg-primary text-white p-2 rounded'>Update Supplier</h3> </div>
            <div className="col-md-6 p-3">
            <div className="text-danger">{error}</div>
            <span>Supplier Name*</span>
            <input  type="text" name='suppliername' value={supplierdata.suppliername} onChange={handlechange} placeholder={`${accounthead.length>0?accounthead[0].suppliername:""}`} className='branchtypeinput'/>
            <span>Phone</span>
            <input type="number" onChange={handlechange} name='suppliercontact' value={supplierdata.suppliercontact} placeholder={`${accounthead.length>0?accounthead[0].suppliercontact:""}`} className='branchtypeinput'/>
            <span>Payment Term</span>
            <input type="text" onChange={handlechange} name='supplierpaymentterm' value={supplierdata.supplierpaymentterm} placeholder={`${accounthead.length>0?accounthead[0].supplierpaymentterm:""}`} className='branchtypeinput'/>
            </div>
            <div className="col-md-6 p-3">

            <span>Supplier Email*</span>
            <input type="email" value={supplierdata.supplieremail} name='supplieremail' placeholder={`${accounthead.length>0?accounthead[0].supplieremail:""}`} onChange={handlechange} className='branchtypeinput'/>
            <span>Supplier Industry*</span>
            <input type="text" onChange={handlechange} value={supplierdata.supplierindustry} name='supplierindustry' placeholder={`${accounthead.length>0?accounthead[0].supplierindustry:""}`} className='branchtypeinput'/>
            <span>Supplier Credit Limit*</span>
            <input type="number" onChange={handlechange} name='suppliercreditlimit' value={supplierdata.suppliercreditlimit} placeholder={`${accounthead.length>0?accounthead[0].suppliercreditlimit:""}`} className='branchtypeinput'/>
            </div>
            <div className="col-12">
            <button style={{width:'100%'}} className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdate}>Update</button>
            </div>
            </div>
        </div>
    </div>
</div>
    </>
  )
}

export default Editsupplier