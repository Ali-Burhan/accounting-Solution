import React from 'react'
import "../company.css"
import company from "../../images/company.svg"
const Form2 = ({setFormData,formData}) => {
  return (
    <>
     <div className="container">
      <div className="row">
        <div className="col-md-4 mx-4">
          <img style={{width:"100%",height:"100%"}} src={company}/>
        </div>
        <div className="col-md-7">
    <form className='companyform1 my-3' >
      <div className="row">

      <div className="col-5">
      <span>*Employee Name:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,employeename:e.target.value})}} className='companyinput' placeholder='Enter Your First Name'/>
      <span>*Contact No:</span>
      <input type="text"  onChange={(e)=>{setFormData({...formData,employeecontact:e.target.value})}} className='companyinput' placeholder='Enter Your Last Name'/>
      <span>*Email:</span>
      <input type="email"  onChange={(e)=>{setFormData({...formData,email:e.target.value})}} className='companyinput' placeholder='Enter Your Email'/>
      </div>
      <div className="col-5 mx-3">
      <span>*CNIC:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,cnic:e.target.value})}} className='companyinput' placeholder='Enter Your First Name'/>
      <span>*Designation:</span>  
      <input type="text"  onChange={(e)=>{setFormData({...formData,designation:e.target.value})}} className='companyinput' placeholder='Enter Your Last Name'/>
      <span>*Basic Salary:</span>
      <input type="email"  onChange={(e)=>{setFormData({...formData,salary:e.target.value})}} className='companyinput' placeholder='Enter Your Email'/>
      </div>
      <div className="col-11">
      <span>*Address:</span>
      <input type="email" style={{width:"100%"}}  onChange={(e)=>{setFormData({...formData,address:e.target.value})}} className='companyinput' placeholder='Enter Your Email'/>
      </div>
      </div>
    </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Form2