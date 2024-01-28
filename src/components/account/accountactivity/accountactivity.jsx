import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Accountactivity = () => {
    const [accountactivityname,setaccountactivityname] = useState('')
    const [balance,setBalance] = useState(0)
    const [error,setError] =  useState(false)
    const navigate = useNavigate()  
    const handleaccountactivity = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             accountactivityname,
             balance             
           });
           
           let response = await fetch("/addaccountactivity", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           if(response.ok){
            setError(true)
            navigate('/accountactivity')
           }else if(response.status == 401){
            setError(true)
           }
        }
    
  return (
    <>
    
    <div className="container">

        <div className="row">
          <div className="col-3"></div>
            <div className="col-6 branchcol my-4">
                <div className='bracnhspan'>
                  <div className="row">
                  <div className="col-12">
                    <h3 className='text-center branchtitle'>Account Activity</h3>
                  </div>
                  <div className="col-12">

                <div className="error text-danger">
                    {error?"Already Exist":""}
                </div>
                <span >Account Activity Name*</span>
                <input type="text" placeholder='Enter Account Activity name' onChange={(e)=>setaccountactivityname(e.target.value)} className='branchtypeinput'/>
                <div className='my-4'>

                <span className=''>Account Balance*</span>
                <input type="number" placeholder='Enter Account Opening Balance' onChange={(e)=>setBalance(e.target.value)} className='branchtypeinput'/>
                </div>
                <button className='btn my-2' style={{width:"100%"}} onClick={handleaccountactivity}>Create</button>
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

export default Accountactivity