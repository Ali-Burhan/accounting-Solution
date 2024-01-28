import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Unitofmeasure = () => {
    const [unitofmeasurename,setunitofmeasurename] = useState('')
    const [unitofmeasuretitle,setunitofmeasuretitle] = useState('')
    const [error,setError] =  useState(false)
    const navigate = useNavigate()  
  
    const handleaccounthead = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
           unitofmeasurename,
           unitofmeasuretitle,
        });
           
           let response = await fetch("/addunitofmeasure", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
        if(response.ok){
            navigate(-1)
        }           
else{
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
                  <h3 className='text-center branchtitle'>Unit of measure</h3>
                </div>
                <div className="col-12">
            <div className="error text-danger">
                {error?"Already Exist":""}
            </div>
            <div className="my-3">
            <span>Account Head Code*</span>
            <input type="text" placeholder='Title' onChange={(e)=>setunitofmeasuretitle(e.target.value)} className='branchtypeinput'/>
            </div>
            <span >Account Head Name*</span>
            <input type="text" placeholder='Name' onChange={(e)=>setunitofmeasurename(e.target.value)} className='branchtypeinput'/>
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

export default Unitofmeasure