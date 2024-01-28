import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import "../accountcontrol/accountcontrol.css"
const Accountsubcontrol = () => {
    const [accounthead,setAccountHead] = useState([])
    const [error,setError] = useState(false)
    const [accountcontrol,setAccountControl] = useState([])
    const [selectedtitem,setSelectedItem] = useState('')
    const [selectedtitemcontrol,setSelectedItemcontrol] = useState('')
    const [selectedtitemid2,setSelectedItemid2] = useState('')
    const [accountsubcontrolname,setAccountSubControlName] = useState('')
    const [user,setUser] = useState([])
    const [accountheadcode,setaccountheadcode] = useState(0)
    const [accountcontrolcode,setaccountcontrolcode] = useState(0)
    const [accountsubcontrolcode , setaccountsubcontrolcode] = useState(0)
    const [accountopeningbalance , setaccountopeningbalance] = useState(0)
    const [accounttype,setaccounttype] = useState('')
    const [accountactive,setaccountactive] = useState(null)
    const [subcontrol,setsubcontrols] = useState([])
    const [click,setclick] = useState(0)
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
    const getpresentsubcontrol = async () =>{
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
         accountheadid:selectedtitemid,
         accountcontrolid:selectedtitemid2
       });
       
       let response = await fetch("/getaccountsubcontrolwithheadcontrol", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       if(response.ok){

         let data = await response.json();
         setsubcontrols(data)
         console.log(data);
         setError(false)
        }else if(response.status==404){
          setError(true)
        }
       
    }
    useEffect(()=>{
      getpresentsubcontrol()
    },[selectedtitemid,selectedtitemid2,click])
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

    const handledropdownitem = (itemname,itemid,code) => {
        setSelectedItem(itemname)
        setSelectedItemid(itemid)
        setaccountheadcode(code)
        }

        const handleFetching = async () => {

            const response = await fetch('/addaccountsubcontrol',
            {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                  accountcontrolid:selectedtitemid2,      
                  accountsubcontrolname,
                        accountheadid: selectedtitemid,
                        userid:user.length>0?user[0].id : "",
                        accountsubcontrolcode:accountcontrolcode + accountsubcontrolcode,
                        accountopeningbalance,
                        accounttype:accounttype,
                        accountactive
                })
            }
            )
            if(response.ok){
                // setAccountSubControlName('')
                // setSelectedItem('')
                // setSelectedItemid('')
                console.log("SUCCESS");
                // navigate('/accountsubcontrol')
                setclick(click+1)
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
                  setError(true)
                  setSelectedItemcontrol('')
                }
               
        }
        useEffect(()=>{
          setSelectedItemcontrol('')
            handleControlagainthead()
        },[selectedtitemid])


        const handleDropDown2 = (id,name,code2) => {
            setSelectedItemid2(id)
            setSelectedItemcontrol(name)
            setaccountcontrolcode(code2)
        }

        useEffect(()=>{
          console.log(accountactive);
        },[accountactive])
  return (
    <>
    <div className="container">
    <br />  
          <div className="row">
            <div className="col-lg-5 jborder p-4 rounded" >
                  <div className="col-12 p-1 text-center bg-primary text-white rounded ">
                    <h3>
                    Create Sub Control
                    </h3>
                  </div>
              <div className="row">
                <div className="col-12">
                  <div className="row">
    <div className="col-5">

    <Dropdown className='my-2 fixheightdrop'>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="primary" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Account Head"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accounthead.map((ele)=>(
          <Dropdown.Item  onClick={()=>handledropdownitem(ele.accountheadname,ele.accountheadid,ele.accountheadcode)}>{ele.accountheadname} </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
          </div>
          <div className="col-5">

    <Dropdown className='my-2 '>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="primary" id="dropdown-basic">
       {selectedtitemcontrol  ? selectedtitemcontrol : " Account Control"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accountcontrol.map((ele)=>(
          <Dropdown.Item onClick={()=>handleDropDown2(ele.accountcontrolid, ele.accountcontrolname,ele.accountcontrolcode)} >{ele.accountcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
          </div>
          <div className="col-2">
    <Dropdown className='my-2 '>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="primary" id="dropdown-basic">
       {accounttype? accounttype : " Type"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
            <Dropdown.Item onClick={(e)=>setaccounttype('C')} >Credit</Dropdown.Item>
            <Dropdown.Item onClick={(e)=>setaccounttype('D')} >Debit</Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>  
          </div>
    </div>
    <span className='spanitem mt-2'>Account Sub Control Name</span>
    <input type="text" style={{width:'100%'}}  className='controlinput' onChange={(e)=>setAccountSubControlName(e.target.value)}/>
    <span className='spanitem mt-2'>Account Sub Control Code</span>
    <input type="text" style={{width:'100%'}}  className='controlinput' onChange={(e)=>setaccountsubcontrolcode(e.target.value)}/>
    <span className='spanitem mt-2'>Opening Balance</span>
    <input type="number" style={{width:'100%'}}  className='controlinput' placeholder='Rs' onChange={(e)=>setaccountopeningbalance(e.target.value)}/>
    
    <span className='d-block border p-2 rounded my-2'>De-Activate Account? <input onChange={(e)=>setaccountactive(e.target.checked)} type="checkbox" /> {accountactive && <span className='text-danger'>'Created Account will be De-Active'</span>}</span>
    <button className="btn d-block btn-outline-primary my-2" onClick={handleFetching}>Create</button>
    </div>

    </div>
    </div>
    <div className="col-lg-6 jborder rounded mx-2 my-2 ">
      <div className="row bg-primary text-white p-2 my-4 rounded ">
        <div className="col-6">Previous Sub Controls </div>
        <div className="col-6">Code</div>
      </div>
      {subcontrol.map((row)=>(
        <>
        <div className='row border p-2'>
          <div className="col-6">
            
        <span>Account : {error? "No Control":row.accountsubcontrolname}</span>
          </div>
          <div className="col-6">

        <span className='float-right'>Code :  {error? "No Control":row.accountsubcontrolcode}</span>
          </div>
        </div>
        </>
      ))}
    </div>
    </div>
            </div>
    </>
  )
}

export default Accountsubcontrol