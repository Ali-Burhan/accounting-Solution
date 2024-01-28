import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import "../accountcontrol/accountcontrol.css"
const Accountflowsetting = () => {
    const [accounthead,setAccountHead] = useState([])
    const [error,setError] = useState(false)
    const [accountcontrol,setAccountControl] = useState([])
    const [accountactivitysetname,setaccountactivityname] = useState('')
    const [accountactivitysetid,setaccountactivityid] = useState('')
    const [accountactivity,setaccountactivity] = useState([])
    const [accountsubcontrol,setaccountsubcontrol] = useState([])
    const [selectedtitem,setSelectedItem] = useState('')
    const [selectedtitemcontrol,setSelectedItemcontrol] = useState('')
    const [selectedtitemid2,setSelectedItemid2] = useState('')
    const [selectedtitemid3,setSelectedItemid3] = useState('')
    const [selectedtitemname3,setSelectedItemname3] = useState('')
    const [accountsubcontrolname,setAccountSubControlName] = useState('')
    const [user,setUser] = useState([])
    const [selectedtitemid,setSelectedItemid] = useState('')
    const navigate = useNavigate()
    const getaccountheaddata = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }

           let response = await fetch("/getaccounthead", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setAccountHead(data)
    }
    const getaccountactivitydata = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }

           let response = await fetch("/getaccountactivity", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setaccountactivity(data)
    }
    // const getaccountcontroldata = async () => {
    //     let headersList = {
    //         "Accept": "*/*",
    //         "Content-Type": "application/json"
    //        }

    //        let response = await fetch("/getaccounthead", { 
    //          method: "GET",
    //          headers: headersList
    //        });
           
    //        let data = await response.json();
    //        console.log(data);
    //        setAccountControl(data)
    // }
useEffect(()=>{
    // getaccountcontroldata()
    getaccountactivitydata()
    getaccountheaddata()
},[])
const handleSubmit =async () => {
    let headersList = {
    "Accept": "*/*",
     "Content-Type": "application/json",
   }
   
   let response = await fetch("/a", { 
     method: "GET",
     headers: headersList
   });
   
   let data = await response.json();
   console.log(data);
   setUser(data)
}
useEffect(()=>{
  const fetchData = async () => {
    await handleSubmit();
  };
fetchData()
},[])

    const handledropdownitem = (itemname,itemid) => {
        setSelectedItem(itemname)
        setSelectedItemid(itemid)
        }

        const handleFetching = async () => {
          let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             accountheadid:selectedtitemid,
             accountcontrolid:selectedtitemid2,
             accountsubcontrolid:selectedtitemid3,
             accountactivityid:accountactivitysetid
           });
           
           let response = await fetch("/addaccountflowsetting", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           if(response.ok){
            navigate('/accountflowsetting')
           }else{
            setError(true)
            console.log("ERROR OCCURED");
           }
           
        }
        const handleControlagainthead = async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
               }
               
               let response = await fetch(`/getaccountcontrolhead/${selectedtitemid}`, { 
                 method: "GET",
                 headers: headersList
               });
               
               if(response.ok){

                 let data = await response.json();
                 console.log(data);
                 setAccountControl(data)
                 setError(false)
                }else{
                  setSelectedItemcontrol('')
                }
               
        }
        const handlesubControlagainthead = async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
               }
               
               let response = await fetch(`/getaccountsubcontrolhead/${selectedtitemid2}`, { 
                 method: "GET",
                 headers: headersList
               });
               
               if(response.ok){

                 let data = await response.json();
                 console.log(data);
                 setaccountsubcontrol(data)
                 setError(false)
                }else{
                  setSelectedItemcontrol('')
                }
               
        }
        useEffect(()=>{
          setSelectedItemcontrol('')
          handleControlagainthead()
        },[selectedtitemid])
        useEffect(()=>{
          handlesubControlagainthead()
          
        },[selectedtitemid2])

        const handleDropDown2 = (id,name) => {
            setSelectedItemid2(id)
            setSelectedItemcontrol(name)
        }
        const handleDropDown3 = (id,name) => {
            setSelectedItemid3(id)
            setSelectedItemname3(name)
        }
        const handleDropDown4 = (id,name) => {
            setaccountactivityid(id)
            setaccountactivityname(name)
        }
  return (
    <>
    <div className="container">
<div className="row">
  <div className="col-4"></div>
  <div className="col-4">
    <div className="row flowsetting">
    <div className="col-12"> 
    
    <div className="control-container">
    <br />  
    <div className="controlgroup">
      <h1 className='text-danger'>{error?"Already Exist":""}</h1>
        {/* <div className="droptwin"> */}
    <Dropdown className='my-2'>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Account Head"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accounthead.map((ele)=>(
          <Dropdown.Item href="#option1" onClick={()=>handledropdownitem(ele.accountheadname,ele.accountheadid)}>{ele.accountheadname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown className='my-2'>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
       {selectedtitemcontrol  && error==false? selectedtitemcontrol : " Account Control"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accountcontrol.map((ele)=>(
          <Dropdown.Item onClick={()=>handleDropDown2(ele.accountcontrolid, ele.accountcontrolname)} href="#option1">{ error?" ": ele.accountcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown className='my-2'>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
       {selectedtitemname3  && error==false? selectedtitemname3 : " Account Sub Control"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accountsubcontrol.map((ele)=>(
            <Dropdown.Item onClick={()=>handleDropDown3(ele.accountsubcontrolid, ele.accountsubcontrolname)} href="#option1">{ error?" ": ele.accountsubcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown className='my-2'>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
       {accountactivitysetname? accountactivitysetname : " Account Activity"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accountactivity.map((ele)=>(
          <Dropdown.Item onClick={()=>handleDropDown4(ele.accountactivityid, ele.accountactivityname)} href="#option1">{ error?" ": ele.accountactivityname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
            {/* </div> */}
    <button className="btn btn-outline-primary my-2" onClick={handleFetching}>Create Account Flow</button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
          </div>
    </>
  )
}

export default Accountflowsetting