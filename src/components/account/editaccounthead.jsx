import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom"
const Editaccounthad = () => {
  const {ids} = useParams()
  const [accounthead,setaccounthead] = useState([])
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
     
     let response = await fetch(`/getaccounthead/${ids}`, { 
       method: "POST",
       headers: headersList
     });
     
     let data = await response.json();
     setaccounthead(data)
  }

  const handleupdate = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
      accountheadname,
      accountheadcode,
      userid:user.length>0? user[0].id:""
       
     });
     
     let response = await fetch(`/updateaccounthead/${ids}`, { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/accounthead')
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
        <div className="col-6 branchcol my-4">
            <div className='bracnhspan'>
            <div className="error text-danger">
            </div>
            <div className="my-3">
            <div className="text-danger">{error}</div>
            <span>Account Head Code*</span>
            <input type="number" onChange={(e)=>setaccountheadcode(e.target.value)} placeholder={`${accounthead.length>0?accounthead[0].accountheadcode:""}`} className='branchtypeinput'/>
            </div>
            <span >Account Head Name*</span>
            <input type="text" onChange={(e)=>setaccountheadname(e.target.value)} placeholder={`${accounthead.length>0? accounthead[0].accountheadname:""}`} className='branchtypeinput'/>
            {/* onClick={handleaccountactivity} */}
            <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdate}>Update</button>
            </div>
        </div>
    </div>
</div>
    </>
  )
}

export default Editaccounthad