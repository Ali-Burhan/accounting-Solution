import React, { useEffect, useState } from 'react'
import "./navbar.css"
import alipic from "../../images/Ali.jpg"
import { Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Navbar = () => {
  // const [user,setUser] = useState({})
  const [usertype,setUserType] = useState('')
  const [userid,setuserid] = useState('')
  const [getpic,setGetpic] = useState(null)
  // const handleSubmit =async () => {
  //   let headersList = {
  //   "Accept": "*/*",
  //   "Content-Type": "application/json",
  //  }
   
  //  let response = await fetch("/a", { 
  //    method: "GET",
  //    headers: headersList
  //  });
   
  //  let data = await response.json();
  //  setUser(data)
  // }
  // useEffect(()=>{
  //   const fetchData = async () => {
  //     await handleSubmit();
  //   };
  //   fetchData()
  // },[])
  useEffect(()=>{
  setUserType(localStorage.getItem('username'))
  setuserid(localStorage.getItem('userid'))
  console.log(usertype);
},[])
useEffect(() => {
  const fetchPictureData = async () => {
    try {
      const response = await fetch(`/getpicture/${localStorage.getItem('email')}`);
      if (response.ok) {
        const data = await response.blob();
        setGetpic(data);
      } else {
        console.log('Error fetching picture data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchPictureData();
}, []);
const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const handleLogout = () =>{
  removeCookie('JWT')
  localStorage.clear()
}
  return (
   
    <div className="container1">
      { localStorage.getItem('userid') &&
      <div className="wrapper">
        <div className="search">
          <input type="search" className='input' placeholder='Search...' />
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21.407 19.753-4.41-4.41a8.148 8.148 0 0 0 1.633-4.903c0-4.516-3.674-8.19-8.19-8.19s-8.19 3.674-8.19 8.19 3.674 8.19 8.19 8.19a8.148 8.148 0 0 0 4.902-1.633l4.41 4.41a1.171 1.171 0 0 0 1.655-1.654ZM4.59 10.44a5.85 5.85 0 1 1 5.85 5.85 5.857 5.857 0 0 1-5.85-5.85Z"></path>
</svg>
<h4 className='mobilelogo'>ERP - Solution</h4>
        </div>
        
        <div className="items">
         
          <div className="picgrid">
            
            {getpic && (
              <div >
                <Link to={`/userprofile/${userid}`} style={{textDecoration:'none',color:'black'}}>
        <img src={URL.createObjectURL(getpic)} width={40} height={40} style={{borderRadius:"10px"}} alt="Picture" />
                </Link>
        </div>
      )}

            <p className='mx-2'></p>  
            {/* <div className="dropdownwrapper" style={{width:'100px'}}>
            <Dropdown>
      <Dropdown.Toggle variant='secondary' className='userdropdown'  id="userDropdown">
      {usertype}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item > <Link to={`/userprofile/${userid}`} style={{textDecoration:'none',color:'black'}}> Profile </Link></Dropdown.Item>
        <Dropdown.Item >Settings</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}><Link style={{textDecoration:'none',color:'black'}} to={'/'}> Logout</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </div> */}

          </div>
        </div>
      </div>
      }
    </div>
  
  )
}

export default Navbar