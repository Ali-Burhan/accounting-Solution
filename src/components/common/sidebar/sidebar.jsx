import React, { useEffect, useState } from 'react'
import "./sidebar.css"
import { Link,useNavigate } from 'react-router-dom'
const Sidebar = ({setToggle,toggle}) => {
  const [cookieValue, setCookieValue] = useState('');
  const [loggenin,setloggedin] = useState(false)
  const [userid,setUserid] = useState('')
  const [account,setaccount] = useState('')
  const [purchase,setPurchase] = useState('')
  const [sale,setSale] = useState('')
  const [branch,setbranch] = useState('')
  const [master,setMaster] = useState('')
  const [usertype, setUsertype] = useState('')
  const [dropDown,setDropdown] = useState(false)
  const [dropProduct,setDropProduct] = useState(false)
  const [dropBranch,setDropBranch] = useState(false)
  const [dropAccount,setAccountDrop] = useState(false)
  const [dropPurchase,setPurchaseDrop] = useState(false)
  const [bankdrop,setbankdrop] = useState(false)
  const [saledrop,setsaledrop] = useState(false)
  const navigate = useNavigate()

//   const handleSubmit =async () => {
//     let headersList = {
//     "Accept": "*/*",
//      "Content-Type": "application/json",
//    }
   
//    let response = await fetch("/a", { 
//      method: "GET",
//      headers: headersList
//    });
   
//    let data = await response.json();
//    setUser(data)
// }
// useEffect(()=>{
//   const fetchData = async () => {
//     await handleSubmit();
//   };
// fetchData()
// },[])
useEffect(()=>{
  setUserid(localStorage.getItem('userid'))
  setPurchase(localStorage.getItem('purchase'))
  setSale(localStorage.getItem('sale'))
  setbranch(localStorage.getItem('branch'))
  setaccount(localStorage.getItem('account'))
  setMaster(localStorage.getItem('master'))
  setUsertype( localStorage.getItem('usertype'));
},[])
  useEffect(() => {
    const getCookieValue = () => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('J')) {
          const value = cookie.substring('JWT='.length);
          setCookieValue(value);
          break;
        }
      }
      if(cookieValue){
        setloggedin(true)
      }
      // console.log(cookies);
    };

    getCookieValue();
  }, [cookieValue]);
  
  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  
  const handleLogout = () =>{
    removeCookie('JWT')
    localStorage.clear()
  }
  
  // Usage

  return (
    <>
    { cookieValue?
    <div className='sidebar scroll-container'>
      {/* {toggle?
      "":
    <div className='top'>
      <Link style={{color:"white",textDecoration:"none"}}className='logo'>ERP SOLUTION </Link></div>
      } */}
    
    <div className='sidebarcenter'>
        
        
          <ul className='ul'>
    {/* {usertype==1? */}
    <div className={`${toggle? "":"text-center"}`}>
    <button onClick={()=>setToggle(!toggle)} className='togglebtn'>
      {toggle?
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7.5h16.5"></path>
  <path d="M3.75 12h16.5"></path>
  <path d="M3.75 16.5h16.5"></path>
</svg>:
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m18.75 6.82-1.57-1.57L12 10.43 6.82 5.25 5.25 6.82 10.43 12l-5.18 5.18 1.57 1.57L12 13.57l5.18 5.18 1.57-1.57L13.57 12l5.18-5.18Z"></path>
</svg>
 }
</button>
      </div>
      {master==1?
    <>
            <p className="title" onClick={()=>setDropdown(!dropDown)} style={{cursor:'pointer'}}>MAIN 
            { dropDown?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}
</p>
            {dropDown?
            <div className={`${dropDown?'droptrans':"droptransno"} `}> 

            <>
              <li>
               <svg width="23" height="23" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.261 4.745a.375.375 0 0 0-.518 0l-8.63 8.244a.374.374 0 0 0-.115.271l-.002 7.737a1.5 1.5 0 0 0 1.5 1.5h4.505a.75.75 0 0 0 .75-.75v-6.375a.375.375 0 0 1 .375-.375h3.75a.375.375 0 0 1 .375.375v6.375a.75.75 0 0 0 .75.75h4.503a1.5 1.5 0 0 0 1.5-1.5V13.26a.374.374 0 0 0-.116-.271L12.26 4.745Z"></path>
  <path d="M23.011 11.444 19.505 8.09V3a.75.75 0 0 0-.75-.75h-2.25a.75.75 0 0 0-.75.75v1.5L13.04 1.904c-.254-.257-.632-.404-1.04-.404-.407 0-.784.147-1.038.405l-9.97 9.539a.765.765 0 0 0-.063 1.048.749.749 0 0 0 1.087.05l9.726-9.294a.375.375 0 0 1 .519 0l9.727 9.294a.75.75 0 0 0 1.059-.02c.288-.299.264-.791-.036-1.078Z"></path>
</svg>
                {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/home'}>
                    Dashboard
                </Link>
                }
            </li>
                  </>
                 
                {userid==5006? 
                  <li>
               <svg width="23" height="23" className='mx-1' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3"></path>
  <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6"></path>
  <path d="M12 11v2a14 14 0 0 0 2.5 8"></path>
  <path d="M8 15a18 18 0 0 0 1.8 6"></path>
  <path d="M4.9 18.998a22 22 0 0 1-.9-7v-1a8 8 0 0 1 12-6.95"></path>
</svg>
                {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/users'}>
                    Authorization
                </Link>
                }
            </li>
                  :""}
              
            {/* // :""} */}
            {/* <p className="title">LIST</p> */}

            <li>
               <svg width="23" height="23" className='mx-1' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3"></path>
  <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6"></path>
  <path d="M12 11v2a14 14 0 0 0 2.5 8"></path>
  <path d="M8 15a18 18 0 0 0 1.8 6"></path>
  <path d="M4.9 18.998a22 22 0 0 1-.9-7v-1a8 8 0 0 1 12-6.95"></path>
</svg>
                {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/homejournalentry'}>
                    Journal Entry
                </Link>
                }
            </li>

            
            </div>
                  :""
                }
            </>:""
    }
    
    {purchase==1?
    <>
            <p className="title" onClick={()=>setDropProduct(!dropProduct)}>{toggle?"Products":"Products"}  { dropProduct?
         <svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg> :
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
            {dropProduct&&
            <div className={`${dropProduct?'droptrans':"droptransno"} `}>

            <li>
                <svg width="20" height="20" className='mx-1' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 8.25V6.375A1.875 1.875 0 0 1 10.875 4.5h7.5a1.875 1.875 0 0 1 1.875 1.875v11.25a1.875 1.875 0 0 1-1.875 1.875H11.25c-1.036 0-2.25-.84-2.25-1.875V15.75"></path>
  <path d="M13.5 15.75 17.25 12 13.5 8.25"></path>
  <path d="M3.75 12H16.5"></path>,
</svg>
{toggle?"":
            <Link style={{color:"white",textDecoration:"none"}} to={'/productcategory'}>
             
                  Categories
                </Link>
}
            </li>
            <li>

            <svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.25 6h-3.816a4.5 4.5 0 0 0-8.868 0H3.75a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5ZM9 9.75a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5ZM9.094 6a3 3 0 0 1 5.812 0H9.094ZM16.5 9.75a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 1 1 1.5 0v1.5Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/product'}>
                    Product
                </Link>
}
               
            </li>
            </div>}
            </>:""
}
{branch==1?
<>
            <p className="title" onClick={()=>setbankdrop(!bankdrop)}>BANK  { bankdrop?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
{bankdrop&&
<div className={`${bankdrop?'droptrans':"droptransno"} `} >
            <li>

            <svg width="20"  className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M20.595 2.49a.6.6 0 0 1 .285.51v18a.6.6 0 0 1-.6.6h-3.6a.6.6 0 0 1-.6-.6v-1.8h-1.2V21a.6.6 0 0 1-.6.6H3.48a.6.6 0 0 1-.6-.6v-6.6a.6.6 0 0 1 .41-.569l6.79-2.263V7.8a.6.6 0 0 1 .331-.536l9.6-4.8a.6.6 0 0 1 .584.026ZM10.08 12.833l-6 2V20.4h6v-7.567Zm1.2 7.567h2.4v-1.8a.6.6 0 0 1 .6-.6h2.4a.6.6 0 0 1 .6.6v1.8h2.4V3.971l-8.4 4.2v12.23Z" clip-rule="evenodd"></path>
  <path d="M5.28 15.6h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2ZM5.28 18h1.2v1.2h-1.2V18Zm2.4 0h1.2v1.2h-1.2V18Zm4.8-4.8h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2Zm-2.4 2.4h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2Zm2.4-2.4h1.2v1.2h-1.2v-1.2Zm0 2.4h1.2v1.2h-1.2v-1.2Zm-4.8-4.8h1.2V12h-1.2v-1.2Zm2.4 0h1.2V12h-1.2v-1.2Zm2.4 0h1.2V12h-1.2v-1.2Zm-4.8-2.4h1.2v1.2h-1.2V8.4Zm2.4 0h1.2v1.2h-1.2V8.4Zm2.4 0h1.2v1.2h-1.2V8.4Zm0-2.4h1.2v1.2h-1.2V6Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/bankbalances'}>
                Balances
                </Link>
}
            </li>
            <li>

                <svg width="23" className='mx-1' height="23" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 23.25H2.25v-9H6v9Z"></path>
  <path d="M16.5 23.25h-3.75V9.75h3.75v13.5Z"></path>
  <path d="M21.75 23.25H18V4.5h3.75v18.75Z"></path>
  <path d="M11.25 23.25H7.5V.75h3.75v22.5Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/homebankpayment'}>
                Payments
                </Link>
}
            </li>
            <li>

            <svg width="20" className='mx-1' height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 16.875a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"></path>
  <path d="M6.6 20.252a6.01 6.01 0 0 1 10.8 0"></path>
  <path d="M19.172 10.93a5.634 5.634 0 0 1 3.703 2.193"></path>
  <path d="M15.666 6.583a3 3 0 1 1 3.46 4.2"></path>
  <path d="M4.875 10.783a3 3 0 1 1 3.46-4.2"></path>
  <path d="M1.125 13.123a5.634 5.634 0 0 1 3.703-2.193"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/homebankreceipt'}>
                Receipts
                                </Link>}
            </li>
            <li>
                <svg width="23" className='mx-1' height="23" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 22.5a3.754 3.754 0 0 0 3.436-2.25H8.564A3.754 3.754 0 0 0 12 22.5Z"></path>
  <path d="M18.75 13.5v-2.837c0-3.304-1.282-6.181-4.5-6.913l-.375-2.25h-3.75L9.75 3.75c-3.229.732-4.5 3.598-4.5 6.913V13.5L3 16.5v2.25h18V16.5l-2.25-3Z"></path>
</svg>
      {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/homebanktransfer'}>
                    Transfer
                </Link>
                }
            </li>
            </div>
            }
            </>:""}          
{branch==1?
<>
            <p className="title" onClick={()=>setDropBranch(!dropBranch)}>BRANCH  { dropBranch?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
{dropBranch&&
<div className={`${dropBranch?'droptrans':"droptransno"} `} >
            <li>

            <svg width="20"  className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M20.595 2.49a.6.6 0 0 1 .285.51v18a.6.6 0 0 1-.6.6h-3.6a.6.6 0 0 1-.6-.6v-1.8h-1.2V21a.6.6 0 0 1-.6.6H3.48a.6.6 0 0 1-.6-.6v-6.6a.6.6 0 0 1 .41-.569l6.79-2.263V7.8a.6.6 0 0 1 .331-.536l9.6-4.8a.6.6 0 0 1 .584.026ZM10.08 12.833l-6 2V20.4h6v-7.567Zm1.2 7.567h2.4v-1.8a.6.6 0 0 1 .6-.6h2.4a.6.6 0 0 1 .6.6v1.8h2.4V3.971l-8.4 4.2v12.23Z" clip-rule="evenodd"></path>
  <path d="M5.28 15.6h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2ZM5.28 18h1.2v1.2h-1.2V18Zm2.4 0h1.2v1.2h-1.2V18Zm4.8-4.8h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2Zm-2.4 2.4h1.2v1.2h-1.2v-1.2Zm2.4 0h1.2v1.2h-1.2v-1.2Zm2.4-2.4h1.2v1.2h-1.2v-1.2Zm0 2.4h1.2v1.2h-1.2v-1.2Zm-4.8-4.8h1.2V12h-1.2v-1.2Zm2.4 0h1.2V12h-1.2v-1.2Zm2.4 0h1.2V12h-1.2v-1.2Zm-4.8-2.4h1.2v1.2h-1.2V8.4Zm2.4 0h1.2v1.2h-1.2V8.4Zm2.4 0h1.2v1.2h-1.2V8.4Zm0-2.4h1.2v1.2h-1.2V6Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/company'}>
                Company
                </Link>
}
            </li>
            <li>

                <svg width="23" className='mx-1' height="23" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 23.25H2.25v-9H6v9Z"></path>
  <path d="M16.5 23.25h-3.75V9.75h3.75v13.5Z"></path>
  <path d="M21.75 23.25H18V4.5h3.75v18.75Z"></path>
  <path d="M11.25 23.25H7.5V.75h3.75v22.5Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/branch'}>
                    Branch
                </Link>
}
            </li>
            <li>

            <svg width="20" className='mx-1' height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 16.875a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"></path>
  <path d="M6.6 20.252a6.01 6.01 0 0 1 10.8 0"></path>
  <path d="M19.172 10.93a5.634 5.634 0 0 1 3.703 2.193"></path>
  <path d="M15.666 6.583a3 3 0 1 1 3.46 4.2"></path>
  <path d="M4.875 10.783a3 3 0 1 1 3.46-4.2"></path>
  <path d="M1.125 13.123a5.634 5.634 0 0 1 3.703-2.193"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/employee'}>
                Employee
                                </Link>}
            </li>
            <li>
                <svg width="23" className='mx-1' height="23" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 22.5a3.754 3.754 0 0 0 3.436-2.25H8.564A3.754 3.754 0 0 0 12 22.5Z"></path>
  <path d="M18.75 13.5v-2.837c0-3.304-1.282-6.181-4.5-6.913l-.375-2.25h-3.75L9.75 3.75c-3.229.732-4.5 3.598-4.5 6.913V13.5L3 16.5v2.25h18V16.5l-2.25-3Z"></path>
</svg>
      {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/branchtype'}>
                    Branch Type
                </Link>
                }
            </li>
            </div>
            }
            </>:""}          
{account==1?
<>
            <p className="title" onClick={()=>setAccountDrop(!dropAccount)}>Accounts { dropAccount?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
            {dropAccount&&
            <div className={`${dropAccount?'droptrans':"droptransno"} `}>
            <li>
            <svg width="20" className='mx-1' height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.25 12h3L9 3.75l6 15.75 3.75-7.5h3"></path>
</svg>
      {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/accountactivity'}>
                    Activity
                </Link>
                }
            </li>
            <li>
            <svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Zm-3.787 10.097-3.179 3.178A.748.748 0 0 1 12 16.5c-.1 0-.198-.02-.29-.056a.814.814 0 0 1-.244-.169l-3.178-3.178a.75.75 0 0 1 1.059-1.06l1.903 1.904V8.25a.75.75 0 1 1 1.5 0v5.69l1.903-1.902a.75.75 0 0 1 1.06 1.059Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/accounthead'}>
                    Head
                </Link>
}
            </li>
            <li>
            <svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Zm-3.787 10.097-3.179 3.178A.748.748 0 0 1 12 16.5c-.1 0-.198-.02-.29-.056a.814.814 0 0 1-.244-.169l-3.178-3.178a.75.75 0 0 1 1.059-1.06l1.903 1.904V8.25a.75.75 0 1 1 1.5 0v5.69l1.903-1.902a.75.75 0 0 1 1.06 1.059Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/accountcontrol'}>
                    Control
                </Link>
}
            </li>
            <li>
            <svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Zm-3.787 10.097-3.179 3.178A.748.748 0 0 1 12 16.5c-.1 0-.198-.02-.29-.056a.814.814 0 0 1-.244-.169l-3.178-3.178a.75.75 0 0 1 1.059-1.06l1.903 1.904V8.25a.75.75 0 1 1 1.5 0v5.69l1.903-1.902a.75.75 0 0 1 1.06 1.059Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/accountsubcontrol'}>
                  Sub  Control
                </Link>
}
            </li>
            <li>
            <svg width="20" className='mx-1' height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21Zm7.537-5.287a.75.75 0 0 1 0-1.06l1.904-1.903H8.25a.75.75 0 1 1 0-1.5h5.69l-1.902-1.903a.75.75 0 0 1 1.059-1.06l3.178 3.179c.07.07.128.152.169.243A.795.795 0 0 1 16.5 12a.748.748 0 0 1-.225.534l-3.178 3.178a.75.75 0 0 1-1.06 0Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/accountflowsetting'}>
                 Flow Setting
                </Link>
}
            </li>
            <li>
            <svg width="20" className='mx-1' height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 3.75h-15a.75.75 0 0 0-.75.75v15c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75v-15a.75.75 0 0 0-.75-.75Z"></path>
  <path d="M16.5 1.875V3.75"></path>
  <path d="M7.5 1.875V3.75"></path>
  <path d="M3.75 8.25h16.5"></path>
  <path d="M8.25 12h2.625l-1.5 1.875a1.5 1.5 0 1 1-1.06 2.56"></path>
  <path d="m13.875 13.125 1.5-1.125v4.875"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/financialyear'}>
                    Financial Year
                </Link>
}
            </li>
            </div>
            }
            </>:""}
            {purchase==1?
<>
            <p className="title" onClick={()=>setPurchaseDrop(!dropPurchase)}>Purchase { dropPurchase?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
{dropPurchase&&
<div className={`${dropPurchase?'droptrans':"droptransno"} `}>
  
<li>
                <svg width="23" className='mx-1' height="23" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.125 12a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75Z"></path>
  <path d="M10.969 13.875c-1.32-.67-2.777-.938-3.844-.938-2.09 0-6.375 1.282-6.375 3.844v1.969h7.031v-.753c0-.89.375-1.784 1.032-2.528.523-.595 1.256-1.146 2.156-1.594Z"></path>
  <path d="M15.938 13.5c-2.441 0-7.313 1.508-7.313 4.5v2.25H23.25V18c0-2.992-4.872-4.5-7.313-4.5Z"></path>
  <path d="M15.938 12a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25Z"></path>
</svg>
                {toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/supplier'}>
                  Suppliers
                </Link>
                }
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/createpurchasecart'}>
                    Cart
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
              <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/supplierinvoice'}>
                All  Invoices
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
              <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/supplierpendinginvoice'}>
                Pend Invoices
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
              <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m21 2.25-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-1.5-.75-1.5.75-2.25-.75v12.002h10.5v6.373c0 1.45 1.55 2.625 3 2.625h.563c1.45 0 2.437-1.175 2.437-2.625V1.5L21 2.25Zm-8.227 9-.023-1.5h7.477l.023 1.5h-7.477Zm-3-3.75L9.75 6h10.477l.023 1.5H9.773Z"></path>
  <path d="M15.75 19.875V15h-15v1.5c0 2.37.27 3.357.678 4.108.69 1.273 1.94 1.892 3.822 1.892h12s-1.5-.938-1.5-2.625Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/paysupplierpendinginvoice'}>
                Pay Invoices
                </Link>
}
            </li>
                 
            <span style={{fontWeight:'bold'}} className="title">Return</span>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/supplierreturninvoice'}>
                    Purchase
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/allreturninvoices'}>
                    Invoices
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/returnpendingpay'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/returnpendingpay'}>
                    PAY
                </Link>
}
            </li>
            </div>
            }
            
            </>:""}

{sale==1?
<>
            
            <p className="title" onClick={()=>setsaledrop(!saledrop)}>Sale  { saledrop?<svg width="23" className='mx-2' height="23" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m5.25 12.563 6.75 6.75 6.75-6.75"></path>
  <path d="M12 18.375V4.687"></path>
</svg>:
             <svg width="20" height="20" className='mx-2' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m12.563 5.25 6.75 6.75-6.75 6.75"></path>
  <path d="M18.375 12H4.687"></path>
</svg>
}</p>
            { saledrop &&
            <div className={`${saledrop?'droptrans':"droptransno"} `}>
            <li>
                <svg className='mx-1' width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.312 7.94a1.49 1.49 0 0 0-1.062-.44h-3v-.75a5.25 5.25 0 1 0-10.5 0v.75h-3A1.5 1.5 0 0 0 2.25 9v10.125c0 1.828 1.547 3.375 3.375 3.375h12.75c.884 0 1.734-.346 2.366-.963a3.256 3.256 0 0 0 1.009-2.353V9a1.489 1.489 0 0 0-.438-1.06ZM8.25 6.75a3.75 3.75 0 0 1 7.5 0v.75h-7.5v-.75Z"></path>
</svg>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/customers'}>
                   Customers
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/createsalecart'}>
                    Cart
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createsalecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/customerinvoice'}>
                  All  Invoices
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/customerpendinginvoice'}>
                  Pend Invoices
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/createpurchasecart'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/paycustomerpendinginvoice'}>
                  Pay Invoice
                </Link>
}
            </li>
            <span className="title" style={{fontWeight:'bold'}}>Sale Return</span>
            <li>
              <Link className='text-white' to={'/customerreturninvoice'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/customerreturninvoice'}>
                    Sale 
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/allcustomerreturninvoices'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/allcustomerreturninvoices'}>
                    Invoices 
                </Link>
}
            </li>
            <li>
              <Link className='text-white' to={'/returnsalependingpay'}>
            <svg width="20" height="20" className='mx-1' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M18.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  <path d="M7.865 14.25h12.25l1.8-9H6.276L5.88 3H1.5v1.5h3.12l2.25 12.75h13.38v-1.5H8.13l-.265-1.5Z"></path>
</svg>
              </Link>
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/returnsalependingpay'}>
                 Pay 
                </Link>
}
            </li>
            </div>
}
            </>:""}
              <span className='title'>Reporting</span>
              <li>
               
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/reportdaybookpur'}>
                   Day Book Pur
                </Link>
}
            </li>
            <li>
               
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/salereceiptreport'}>
                  Sale Receipt Report
                </Link>
}
            </li>
            <li>
               
{toggle?"":
                <Link style={{color:"white",textDecoration:"none"}} to={'/journalreport'}>
                  Journal Report
                </Link>
}
            </li>
            <li>
                { 
                loggenin?
<Link style={{color:"white",textDecoration:"none",fontSize:'23px',fontWeight:'bold'}} onClick={handleLogout} to={'/'}>
<svg className='mx-1' width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.5 12a.75.75 0 0 1 .75-.75H15V6.375c0-1.5-1.584-2.625-3-2.625H4.875A2.628 2.628 0 0 0 2.25 6.375v11.25a2.628 2.628 0 0 0 2.625 2.625h7.5A2.627 2.627 0 0 0 15 17.625V12.75H8.25A.75.75 0 0 1 7.5 12Z"></path>
  <path d="m21.53 11.472-3.75-3.75a.75.75 0 0 0-1.06 1.06l2.47 2.47H15v1.5h4.19l-2.47 2.47a.749.749 0 0 0 .526 1.294.75.75 0 0 0 .534-.234l3.75-3.75a.75.75 0 0 0 0-1.06Z"></path>
</svg>
                    Logout
                </Link>:
                  <Link style={{color:"white",textDecoration:"none"}} to={'/'}>
                <svg className='mx-1' width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12a5.25 5.25 0 1 0 0-10.499A5.25 5.25 0 0 0 12 12Zm0 1.5c-3.254 0-9.75 2.01-9.75 6v3h19.5v-3c0-3.99-6.496-6-9.75-6Z"></path>
</svg>
                    Login
                </Link>
                }
            </li>
      </ul>
    </div>
    </div>:""
}
    </>
  )
}

export default Sidebar