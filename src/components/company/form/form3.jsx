import React, { useEffect, useState } from 'react'
import company from "../../images/companyname.svg"
const Form3 = ({setFormData,formData}) => {
  const [previewURL, setPreviewURL] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData({...formData,companylogo:file});
    setPreviewURL(URL.createObjectURL(file));
  };

  return (
    <>
        <div className="container">
      <div className="row">
        <div className="col-md-4 mx-4">
          <img style={{width:"100%",height:"100%"}} src={company}/>
        </div>
        <div className="col-md-7">
    <form className='companyform1 my-3' >
      <span>*Company Name:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,companyname:e.target.value})}} className='companyinput' placeholder='Enter Company Name'/>
      <span>*Branch Title:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,branchtitle:e.target.value})}} className='companyinput' placeholder='Enter Branch Title'/>
      <span>*Branch Contact:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,branchcontact:e.target.value})}} className='companyinput' placeholder='Enter Branch Contact'/>
      <span>*Branch Address:</span>
      <input type="text" onChange={(e)=>{setFormData({...formData,branchaddress:e.target.value})}} className='companyinput' placeholder='Enter Branch Address'/>
   </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Form3