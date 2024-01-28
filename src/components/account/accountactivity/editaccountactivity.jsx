import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Editaccountactivity = () => {
  const navigate = useNavigate()
  const {ids} = useParams()
  const [exist , setExist] = useState(false)
const [accountactivityname,setaccountactivityname] = useState([])
  const handleeditbranchtype = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch(`/getaccountactivity/${ids}`, { 
         method: "POST",
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
     setaccountactivityname(data)
  }

 const handleupdatebranch = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
        accountactivityname
       });
       
       let response = await fetch(`/updateaccountactivity/${ids}`, { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       if(response.ok){
        navigate('/accountactivity')
       }
       
 }



useEffect(()=>{
  handleeditbranchtype()
},[])


  return (
    <>
    
    <div className="container">
        <div className="row">
            <div className="col-6 branchcol my-4">
                <div className='bracnhspan'>
                  <div className='text-danger'>
              {exist? "Already Exist":""}
                  </div>
                <span >Update Account Activity Name*</span>
                <input type="text" onChange={(e)=>setaccountactivityname(e.target.value)} placeholder={`${accountactivityname.length > 0? accountactivityname[0].accountactivityname:""}`} className='branchtypeinput'/>
                <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdatebranch}>Update</button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Editaccountactivity