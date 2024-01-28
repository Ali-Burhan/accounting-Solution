import React, { useState } from 'react'
import  "./branchtype.css"
import {useNavigate} from "react-router-dom"
const BranchType = () => {
const [branchtypename,setBranchTypename] = useState('')
const navigate = useNavigate()  
const handleBranch = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
            branchtypename
           });
           
           let response = await fetch("/addbranchtype", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
     if(response.ok){
    navigate('/branchtype')
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
                  <h3 className='text-center branchtitle'>Branch Type</h3>
                </div>
                <span >Branch Type Name*</span>
                <input type="text" placeholder='Enter branch type name' onChange={(e)=>setBranchTypename(e.target.value)} className='branchtypeinput'/>
                <button className='btn my-2' onClick={handleBranch}>Create</button>
                </div>
              </div>
            </div>
            <div className="col-3"></div>
        </div>
    </div>
    </>
  )
}

export default BranchType