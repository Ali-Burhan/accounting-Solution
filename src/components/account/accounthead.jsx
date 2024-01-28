import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Accounthead = () => {
    const [accountheadname,setaccountheadname] = useState('')
    const [accountheadcode,setAccountheadcode] = useState(0)
    const [error,setError] =  useState(false)
    const [user,setUser] = useState([])
    const navigate = useNavigate()  
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
    const handleaccounthead = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
           accountheadname,
           accountheadcode,
            userid:user.length>0? user[0].id:""
        });
           
           let response = await fetch("/addaccounthead", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
        if(response.ok){
            navigate('/accounthead')
        }           
else{
    setError(true)
}
    }
useEffect(()=>{
    console.log('User prop changed',user);
},[user])

  return (
    <>
    <div className="container">
    <div className="row">
      <div className="col-3"></div>
        <div className="col-6 branchcol my-4">
            <div className='bracnhspan'>
              <div className="row">
                <div className="col-12">
                  <h3 className='text-center branchtitle'>Account Head</h3>
                </div>
                <div className="col-12">
            <div className="error text-danger">
                {error?"Already Exist":""}
            </div>
            <div className="my-3">
            <span>Account Head Code*</span>
            <input type="number" placeholder='Enter Account Head code' onChange={(e)=>setAccountheadcode(e.target.value)} className='branchtypeinput'/>
            </div>
            <span >Account Head Name*</span>
            <input type="text" placeholder='Enter Account Head name' onChange={(e)=>setaccountheadname(e.target.value)} className='branchtypeinput'/>
            {/* onClick={handleaccountactivity} */}
            <button className='btn my-2' style={{width:"100%"}} onClick={handleaccounthead}>Create</button>
                </div>
            </div>
              </div>
        </div>
        <div className="col-3"></div>
    </div>
</div>
    </>
  )
}

export default Accounthead