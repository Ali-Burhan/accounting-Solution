import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Editbranch = () => {
  const navigate = useNavigate()
  const {ids} = useParams()
  const [exist , setExist] = useState(false)
const [branchtype,setBranchtype] = useState([])
const [branchData,setbranchData] = useState({branchname:"",branchcontact:"",branchaddress:""})
const handlechange = (e) => {
  setbranchData({...branchData,[e.target.name]:e.target.value})
}
  const handleeditbranchtype = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch(`/getbranch/${ids}`, { 
       method: "GET",
       headers: headersList
     });
     
     let data = await response.json();
    //  console.log(data);
     setBranchtype(data)
  }

 const handleupdatebranch = async () => {
  const {branchname,branchcontact,branchaddress} = branchData;
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
   }
   
   let bodyContent = JSON.stringify({
    branchname,branchcontact,branchaddress
   });
   
   let response = await fetch(`/updatebranch/${ids}`, { 
     method: "POST",
     body: bodyContent,
     headers: headersList
   });
   if(response.ok){
     navigate('/branch')
     setExist(false)
    }else if(response.status==400){
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
                <span >Update Branch Name*</span>
                <input type="text" name='branchname' value={branchData.branchname} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].branchname:""}`} className='branchtypeinput'/>
                <div className="my-2"></div>
                <span >Update Branch Contact*</span>
                <input type="text" name='branchcontact' value={branchData.branchcontact} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].branchcontact:""}`} className='branchtypeinput'/>
                <div className="my-2"></div>
                <span >Update Branch Address*</span>
                <input type="text" name='branchaddress' value={branchData.branchaddress} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].branchaddress:""}`} className='branchtypeinput'/>
                <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdatebranch}>Update</button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Editbranch