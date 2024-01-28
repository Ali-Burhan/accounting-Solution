import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import {useNavigate} from "react-router-dom"
import "./accountcontrol.css"
const Accountcontrol = () => {
    const [accounthead,setAccountHead] = useState([])
    const [selectedtitem,setSelectedItem] = useState('')
    const [accountcontrolname,setAccountControlName] = useState('')
    const [accountcontrolcode,setAccountControlCode] = useState(0)
    const [accountheadcode,setaccountheadcode] = useState(0)
    const [presentcontrol,setpresentcontrols] = useState([])
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
useEffect(()=>{
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

    const handledropdownitem = (itemname,itemid,headcode) => {
        setSelectedItem(itemname)
        setSelectedItemid(itemid)
        setaccountheadcode(headcode)
        }

        const handleFetching = async () => {
            const response = await fetch('/addaccountcontrol',
            {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                        accountcontrolname,
                        accountheadid: selectedtitemid,
                        userid:user.length>0?user[0].id : "",
                        accountcontrolcode:accountheadcode + "" +accountcontrolcode
                        
                })
            }
            )
            if(response.ok){
                setAccountControlName('')
                setSelectedItem('')
                setSelectedItemid('')
                console.log("SUCCESS");
                navigate('/accountcontrol')
                
            }
        }
        const handleFetching2 = async () => {
          const response = await fetch('/addaccountcontrol',
          {
              headers:{
                  'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({
                      accountcontrolname,
                      accountheadid: selectedtitemid,
                      userid:user.length>0?user[0].id : "",
                      accountcontrolcode:accountheadcode + "" +accountcontrolcode
                      
              })
          }
          )
          if(response.ok){
          }
      }
        useEffect(()=>{
          console.log(accountheadcode + "" +accountcontrolcode);
        },[selectedtitemid])

        const getcontrold = async () => {
          let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             accountheadid:selectedtitemid
           });
           
           let response = await fetch("/getaccountcontrolnamewithaccounthead", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           if(response.ok){

             let data = await response.json();
             console.log("present",data);
             setpresentcontrols(data)
            }else{
              setpresentcontrols([])
            }
        }

        useEffect(()=>{
          getcontrold()
        },[selectedtitemid])
  return (
    <>
    <div className="container">
      <div className="row">
    <div className="col-md-6 rounded jborder my-3 p-2">
    <div className="control-container">
    <div className="col-12">
    <h3 className='border rounded text-center p-2 bg-primary text-white'>Create Control</h3>
    </div>
    <div className="controlgroup">
      <div className='d-flex'>
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Select Category"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accounthead.map((ele)=>(
                       <Dropdown.Item onClick={()=>handledropdownitem(ele.accountheadname,ele.accountheadid,ele.accountheadcode)} href="#option1">{ele.accountheadname}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>

    </div>
    <span className='spanitem mt-2'>Account Control Name</span>
    <input type="text"  className='controlinput' onChange={(e)=>setAccountControlName(e.target.value)}/>
    <span className='spanitem mt-2'>Account Control Code</span>
    <input type="number"  className='controlinput' onChange={(e)=>setAccountControlCode(e.target.value)}/>
    <button className="btn2 btn-outline-primary my-2" onClick={handleFetching2}>Create and New</button>
    <button className="btn btn-outline-primary my-2" onClick={handleFetching}>Create and Close</button>
    </div>
    </div>
    </div>
    <div className="col-md-6 ">
    <div  className="my-4 jborder rounded p-4" style={{height:'50vh',overflow:'auto'}}>
          <div className="row my-2 ">
            
            <div className="row text-white rounded border mx-1 p-2 bg-primary">
            <div className="col-6" >Account Control</div>
            <div className="col-6">Account Code</div>
            </div>
          </div>
{ presentcontrol.length>0? presentcontrol.map((row)=>(
  <div className='row  border p-1'>
    <div className="col-5">
  <p className='' key={row.accountheadid}> {row.accountcontrolname} </p>
    </div>
    <div className="col-5 text-center">
  <p className='' key={row.accountheadid}> {row.accountcontrolcode} </p>
    </div>
  </div>
  )):""}
  </div>
    </div>
      </div>
    </div>
    </>
  )
}

export default Accountcontrol