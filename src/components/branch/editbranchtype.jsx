import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Editbranchtype = () => {
  const navigate = useNavigate()
  const {ids} = useParams()
  const [exist , setExist] = useState(false)
const [branchtype,setBranchtype] = useState('')

  const handleeditbranchtype = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch(`/getbranchtypes/${ids}`, { 
       method: "POST",
       headers: headersList
     });
     
     let data = await response.json();
     console.log(data);
     setBranchtype(data)
  }

 const handleupdatebranch = async () => {
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
   }
   
   let bodyContent = JSON.stringify({
     branchtypename:branchtype
   });
   
   let response = await fetch(`/updatebranchtype/${ids}`, { 
     method: "POST",
     body: bodyContent,
     headers: headersList
   });
   if(response.ok){
     navigate('/branchtype')
     setExist(false)
    }else if(response.status==402){
      console.log("Already Exist");
      setExist(true)
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
                <span >Update Branch Type Name*</span>
                <input type="text" onChange={(e)=>setBranchtype(e.target.value)} value={branchtype} placeholder={`${branchtype.length > 0? branchtype[0].branchtypename:""}`} className='branchtypeinput'/>
                <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdatebranch}>Update</button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Editbranchtype