import React from 'react'

const Form1 = ({setFormData,formData}) => {
  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-md-10">

    <form className='companyform1 my-3'>
      <span>*User Name:</span>
      <input type="text" name='username' onChange={(e)=>{setFormData({...formData,username:e.target.value})}} className='companyinput' placeholder='Enter Your User Name'/>
      <span>*Password:</span>
      <input type="password" name='password' onChange={(e)=>{setFormData({...formData,password:e.target.value})}} className='companyinput' placeholder='Enter Your Password'/>
      <span>*Confirm Password:</span>
      <input type="password" name='confirmpassword' onChange={(e)=>{setFormData({...formData,confirmpassword:e.target.value})}} className='companyinput' placeholder='Confirm Password'/>
    </form>
        </div>
      </div>
    </div>

    </>
  )
}

export default Form1