import React, { useEffect, useState } from 'react'
import "./signup.css"
import {Link, useNavigate} from "react-router-dom"
const Signup = ({setNavbar}) => {
  
  const [formData,setFormData] = useState({fullname:"",email:"",password:""});
  const [loading,setLoading] = useState(false)
  const [data , setData] = useState([])
  const [error,setError] =  useState(false)
  const [userPicture,setUserpicture] = useState(null)
  const navigate = useNavigate();
  const handledata = (e) =>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
useEffect(()=>{
  setNavbar(false)
},[])

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   const {fullname,email,password} = formData;
    //   let headersList = {
    //     "Accept": "*/*",
    //     "Content-Type": "application/json"
    //    }
       
    //    let bodyContent = JSON.stringify({
    //      fullname,
    //      email,
    //      password
    //    });
       
    //    let response = await fetch("/userregister", { 
    //      method: "POST",
    //      body: bodyContent,
    //      headers: headersList
    //    });
       
    //    setData(await response)
    //    console.log(data);
       
    // }
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setLoading(true)
    //   const { fullname, email, password } = formData;
    //   let headersList = {
    //     "Accept": "*/*",
    //     "Content-Type": "application/json"
    //   }
    
    //   let bodyContent = JSON.stringify({
    //     fullname,
    //     email,
    //     password
    //   });
    
    //   let response = await fetch("/userregister", {
    //     method: "POST",
    //     body: bodyContent,
    //     headers: headersList
    //   });
    //   console.log(response);
    //   if (response.ok) {
    //     // Convert the response to JSON
    //     const responseData = await response.json();
    //     setData(responseData);
    //     console.log(responseData[0].id);
    //     setLoading(false)
    //     setError(false)
    //     navigate('/')
    //   } else {
    //     setError(true)
    //     setLoading(false)
    //     console.log("Request failed with status:", response.status);
    //   }
    // }
    
    const handleUserPicture = async (e) => {
      e.preventDefault()
      setLoading(true)
      const { fullname, email, password } = formData;
      const formData1 = new FormData()
      formData1.append('picture',userPicture)
      formData1.append('fullname',fullname)
      formData1.append('email',email)
      formData1.append('password',password)
      let headersList = {
      }
    
      let bodyContent = JSON.stringify({
        fullname,
        email,
        password
      });
    
      let response = await fetch("/userregister", {
        method: "POST",
        body: formData1,
        headers: headersList
      });
      console.log(response);
      if (response.ok) {
        // Convert the response to JSON
        const responseData = await response.json();
        setData(responseData);
        console.log(responseData[0].id);
        setLoading(false)
        setError(false)
        navigate('/')
      } else {
        setError(true)
        setLoading(false)
        console.log("Request failed with status:", response.status);
      }
    }
  return (
    <>
    <div className="container">
    <div className="row">
<div className="col-5 signup">
    <div className='signupgroup'>
    <h4 className='text-center registertitle'>Register User</h4>
    {/* <br /> */}
    <div className="form ">
      <form className='' onSubmit={handleUserPicture}>
        <div>
      <h6 className='h'><svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12a5.25 5.25 0 1 0 0-10.499A5.25 5.25 0 0 0 12 12Zm0 1.5c-3.254 0-9.75 2.01-9.75 6v3h19.5v-3c0-3.99-6.496-6-9.75-6Z"></path>
</svg>Full Name </h6>
      <input type="text" className='input1' name='fullname' onChange={handledata} value={formData.fullname} placeholder='Enter your Name'/>
        </div>
        <div>
      <h6 className='h'><svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.75 3.75H2.25a.75.75 0 0 0-.75.75v15a.75.75 0 0 0 .75.75h19.5a.75.75 0 0 0 .75-.75v-15a.75.75 0 0 0-.75-.75Zm-9.29 9.592a.75.75 0 0 1-.92 0l-7.342-5.71.92-1.184L12 11.8l6.882-5.352.92 1.184-7.342 5.71Z"></path>
</svg>Email</h6>
      <input type="email" name='email' className='input1' value={formData.email} onChange={handledata} placeholder='Enter your Email'/>
        </div>
        <div>
      <h6 className='h'><svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.25 9h-.75V5.25a4.5 4.5 0 1 0-9 0V9h-.75a3.003 3.003 0 0 0-3 3v8.25a3.003 3.003 0 0 0 3 3h10.5a3.004 3.004 0 0 0 3-3V12a3.004 3.004 0 0 0-3-3ZM15 9H9V5.25a3 3 0 1 1 6 0V9Z"></path>
</svg>Password</h6>
      <input type="password" className='input1' name='password' onChange={handledata} value={formData.password} placeholder='Enter your Password'/>
        </div>
        <div>
      <h6 className='h'><svg width="20" height="20" className='mx-1' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 3.75h-15A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V6a2.25 2.25 0 0 0-2.25-2.25Z"></path>
  <path d="M15.75 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M14.25 15.743 10 11.502a1.5 1.5 0 0 0-2.056-.061L2.25 16.503"></path>
  <path d="m10.5 20.253 5.782-5.781a1.5 1.5 0 0 1 2.02-.094l3.448 2.875"></path>
</svg>Picture</h6>
      <input type="file" className='input1' onChange={(e)=>setUserpicture(e.target.files[0])} name='picture' />
        </div>
        { loading?
          <input type="submit" value={`Create Account`} style={{cursor:"not-allowed"}} className='my-2 input2'/>:
          <input type="submit" value={`Create Account`} className='my-2 input2'/>
        }
      </form>
      {error?
        <p className='text-danger text-center fontl'>INVALID CREDENTIALS</p>:
          ""
        }
      <p className='p1'> Already have an account? <Link to={'/'}> Login</Link></p>
    </div>
    {/* <h1>USER {data.map((ele)=><p>{ele.fullname}</p>)}</h1> */}
    </div>
        </div>
        <div className="col-7 signuppic"></div>
    </div>
    </div>
    </>
  )
}

export default Signup