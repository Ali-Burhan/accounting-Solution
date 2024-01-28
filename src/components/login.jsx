import React, {  useEffect, useState } from 'react'
import "./login.css"
import { Link, useNavigate } from 'react-router-dom'
import login from "./images/login.jpg"
const Login = ({setNavbar,setUser}) => {
  const [formData, setFormData] = useState({email:"",password:""})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value});
  }

useEffect(()=>{
  setNavbar(false)
},[])
  const handlesubmit = async (e) =>{
    e.preventDefault()
    setLoading(true)
    // const {email,password} = formData;
    // let headersList = {
    //   "Accept": "*/*",
    //   "Content-Type": "application/json"
    //  }
     
    //  let bodyContent = JSON.stringify({
    //   // email,
    //   // password
    //  });
     
    //  let response = await fetch("/cookie", { 
    //    method: "GET",
    //   //  body: bodyContent,
    //    headers: headersList
    //  });
    const {email,password} = formData;
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
      email,
      password
     });
     
     let response = await fetch("/getusers", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
       let data = await response.json();
       setLoading(false)
       setError(false)
       console.log(data);
       setUser(data)
       localStorage.setItem('userid',data[0].id)
       localStorage.setItem('username',data[0].fullname)
       localStorage.setItem('purchase',data[0].purchaseid)
       localStorage.setItem('sale',data[0].saleid)
       localStorage.setItem('account',data[0].accountid)
       localStorage.setItem('branch',data[0].branch)
       localStorage.setItem('master',data[0].masterdata)
       localStorage.setItem('usertype',data[0].usertype)
       localStorage.setItem('email',data[0].email)
       
       navigate('/home')
       console.log(data[0].picture);
      }
      else{
        setError(true)
        setLoading(false)
      }
     
  }


  return (
    <>
    <div className="container-fluid" >
      <div className="row">
        <div className="col-sm-5 loginform">
          <div className="logingroup">

    <h2 className='text-center'>LOGIN</h2>

    <form onSubmit={handlesubmit}>
    <h6 className='h'><svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12a5.25 5.25 0 1 0 0-10.499A5.25 5.25 0 0 0 12 12Zm0 1.5c-3.254 0-9.75 2.01-9.75 6v3h19.5v-3c0-3.99-6.496-6-9.75-6Z"></path>
</svg>Email</h6>
          <input name="email" className='logininput' value={formData.email} onChange={handleChange} placeholder='USER EMAIL' type="text"/>
          <h6 className='h'><svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.25 9h-.75V5.25a4.5 4.5 0 1 0-9 0V9h-.75a3.003 3.003 0 0 0-3 3v8.25a3.003 3.003 0 0 0 3 3h10.5a3.004 3.004 0 0 0 3-3V12a3.004 3.004 0 0 0-3-3ZM15 9H9V5.25a3 3 0 1 1 6 0V9Z"></path>
</svg>Password</h6>
          <input className='logininput' name="password" value={formData.password} onChange={handleChange} placeholder='PASSWORD' type="password"/>
          {loading?
            <input className='input2 ' style={{cursor:"not-allowed"}} type="submit" value="Login" />:
            <input className='input2' type="submit" value="Login" />
          }
    </form>
    {
      error? <p className='text-danger text-center fontl'>INVALID CREDENTIALS</p>:""
    }
    <p>Don't have an account? <Link to={'/signup'}> Register</Link></p>
    </div>
        </div>
        <div className="col-7 picturediv">

        </div>
      </div>
    </div>
    </>
  )
}
export default Login