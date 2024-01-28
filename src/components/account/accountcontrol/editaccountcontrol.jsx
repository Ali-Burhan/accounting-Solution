import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom"
const Editaccountcontrol = () => {
  const {ids} = useParams()
  const [accounthead,setaccounthead] = useState([])
  const [accounthead2,setaccounthead2] = useState([])
  const [accountheadname,setaccountheadname] = useState('')
  const [accountheadcode,setaccountheadcode] = useState('')
  const [error,seterror] = useState('')
  const [user,setUser] = useState({})
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
     
     let response = await fetch(`/getaccountcontrol/${ids}`, { 
       method: "POST",
       headers: headersList
     });
     
     let data = await response.json();
     setaccounthead(data)
  }
  const handleeditaccounthead2 = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch(`/getaccounthead/${accounthead[0].accountheadid}`, { 
       method: "POST",
       headers: headersList
     });
     
     let data = await response.json();
     setaccounthead2(data)
  }

  const handleupdate = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
     accountcontrolname:accountheadname,
      accountcontrolcode:accountheadcode?accountheadcode:accounthead[0].accountcontrolcode,
      userid:user.length>0? user[0].id:""
       
     });
     
     let response = await fetch(`/updateaccountcontrol/${ids}`, { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/accountcontrol')
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
useEffect(()=>{
    if(accounthead.length>0){
        handleeditaccounthead2() 
    }
},[accounthead.length])
  return (
    <>
    <div className="container">
    <div className="row">
        <div className="col-6 branchcol my-4">
            <div className='bracnhspan'>
            <div className="error text-danger">
            </div>
            <div className="my-3">
            <div className="text-danger">{error}</div>
            <span>Account Head Name*</span>
            <input readOnly type="text" value={`${accounthead.length>0? accounthead2.length > 0? accounthead2.map((ele)=>(accounthead[0].accountheadid==ele.accountheadid?ele.accountheadname:"")) :"":""}`} className='branchtypeinput'/>
            <span>Account Control Code*</span>
            <input type="number" onChange={(e)=>setaccountheadcode(e.target.value)} placeholder={`${accounthead.length>0?accounthead[0].accountcontrolcode:""}`} className='branchtypeinput'/>
            </div>
            <span >Account Control Name*</span>
            <input type="text" onChange={(e)=>setaccountheadname(e.target.value)} placeholder={`${accounthead.length>0? accounthead[0].accountcontrolname:""}`} className='branchtypeinput'/>
            {/* onClick={handleaccountactivity} */}
            <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdate}>Update</button>
            </div>
        </div>
    </div>
</div>
    </>
  )
}

export default Editaccountcontrol