import React, { useEffect, useState } from 'react'
import Form1 from './form/form1'
import Form2 from './form/form2'
import {useNavigate} from "react-router-dom"
import "./company.css"
import Form3 from './form/form3'
import maleuser from '../images/maleuser.svg'
import company from '../images/company.svg'
import companyname from '../images/companyname.svg'

const Company = () => {
    const [page,setPage] = useState(0)
    const navigate = useNavigate() 
    const [formData,setFormData] = useState({username:"",password:"",confirmpassword:"",employeename:"",employeecontact:"",email:"",cnic:"",designation:"",salary:"",address:"",companyname:"",branchtitle:"",branchcontact:"",branchaddress:""})



    const handlesubmit = async () => {
        const {username,password,confirmpassword,employeename,employeecontact,email,cnic,designation,salary,address,companyname} = formData
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             username,
             password,
             confirmpassword,
             employeename,
             employeecontact,
             email,
             address,
             cnic,
             designation,
             salary,
             companyname
           });
           
           let response = await fetch("/addcompany", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           if(response.ok){
            navigate('/company')
           }
    }

    const handlepageplus = () => {
        if (page<=1) {

            setPage(page+1)
        }
    }
    const handlepageminus = () => {
        if (page>0) {
            setPage(page-1)
        }
    }

    const renderform = () => {
        if(page==0){
            return <Form1 setFormData={setFormData} formData={formData}/>
        }
        else if(page==1){
            return <Form2 setFormData={setFormData} formData={formData}/>
        }
        else{
            console.log(page);
            return <Form3 setFormData={setFormData} formData={formData}/>
        }
    }


  return (
    <>
    <div className="container-fluid ">
        
        <div className="row my-3">
            <div className="col-1"></div>
        <div className="col-10">
            <div className="row progress">
                
                <div className="col-4" style={{background:`${page==0 || page==1 || page==2? "grey":""}`}} onClick={()=>{setPage(0)}}>
                    <div className="row">
                        <div className="col-6">User <img src={maleuser} height={40} alt="" /> </div>
                    </div>
                </div>
                <div className="col-4" style={{background:`${page==1 || page==2?"grey":""}`}} onClick={()=>{setPage(1)}}> Company <img src={company} height={40} alt="" /></div>
                <div className="col-4" style={{background:`${page==2?"grey":""}`}} onClick={()=>{setPage(2)}}>Other <img src={companyname} height={40} alt="" /></div>
            </div>
        {renderform()
        }
        <button className='btn btn-outline-secondary mx-2' onClick={handlepageminus}>Previous</button>
        {page==2?
            <button className='btn btn-outline-secondary mx-2' onClick={handlesubmit}>Submit</button>:
            <button className='btn btn-outline-secondary mx-2' onClick={handlepageplus}>Next</button>
        }
        </div>
        </div>
    </div>
    </>
  )
}

export default Company