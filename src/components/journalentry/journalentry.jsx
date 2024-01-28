import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom'
import './journal.css'
const Journalentry = () => {
  const [bankaccounts, setbankaccounts] = useState([])
  const [bankname,setbankname] = useState('')
  const [bankid,setbankid] = useState('')
  const [bankname2,setbankname2] = useState('')
  const [date , setdate] = useState('')
  const [bankid2,setbankid2] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [refno,setrefno] = useState('')
  const [description, setdescription] = useState('')
  const [amount,setamount] = useState('')
  const [modes,setmodes] = useState([{id:1,value:'Cash'},{id:2,value:'Cheque'},{id:3,value:'Credit Card'},{id:4,value:'Off Set'},{id:5,value:'Online'},{id:6,value:'Pay Order'},])
  const [modename,setmodename] = useState('')
  const [modeid,setmodeid] = useState('')
  const navigate = useNavigate()      
  const [nominalname,setnominalname] = useState([])
  const [filteredAccountSubControls, setFilteredAccountSubControls] = useState([]);
  const [filteredAccountSubControls2, setFilteredAccountSubControls2] = useState([]);
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    const filteredItems = bankaccounts.filter((ele) =>
      ele.accountsubcontrolname.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredAccountSubControls(filteredItems);
  };
  const handleSearch2 = (event) => {
    const searchValue = event.target.value;
    setSearchTerm2(searchValue);

    const filteredItems = bankaccounts.filter((ele) =>
      ele.accountsubcontrolname.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredAccountSubControls2(filteredItems);
  };
  const handlesubmit = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
       frombankcode: String(bankid),
       tobankcode: String(bankid2),
       transferdate:date,
       mode:modename,
       refno:refno,
       description:description,
       amount:amount,
       userid:localStorage.getItem('userid')
     });
     
     let response = await fetch("/addjournalentry", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     
    if(response.ok){
      setbankname('')
      setbankname2('')
      setdate('')
      setrefno('')
      setmodename('')
      setdescription('')
      setamount('')
      alert("Bank Transfer Added Successfully");
    } else if(response.status == 409){
      window.alert('Both Banks cannot be same')
    }else{
      window.alert('ERROR OCCURED')
    }
  }
  const handlesubmit2 = async () => {

    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
      frombankcode: String(bankid),
      tobankcode: String(bankid2),
       transferdate:date,
       mode:modename,
       refno:refno,
       description:description,
       amount:amount,
       userid:localStorage.getItem('userid')
     });
     
     let response = await fetch("/addjournalentry", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     
    if(response.ok){
      navigate(-1)
    } 
    else if(response.status == 409){
      window.alert('Both Banks cannot be same')
    } else if(response.status == 405){
        window.alert('Bank do not have sufficient money')
    }
    else{
      window.alert('ERROR OCCURED')
    }
  }

   const handleBankaccounts = async () => {
    let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
   }
   
   let response = await fetch("/getaccountsubcontrol", { 
     method: "GET",
     headers: headersList
   });
   
   let data = await response.json();
   console.log(data);
   setbankaccounts(data)
  }
  const handledropdownaccountbanks = (itemname,itemid) => {
    setbankname(itemname)
    setbankid(itemid)
      }
  const handledropdownaccountbanks2 = (itemname,itemid) => {
    setbankname2(itemname)
    setbankid2(itemid)
      }
      useEffect(()=>{
        console.log(date);
      },[date])
      useEffect(()=>{
        handleBankaccounts()
      },[])
      const handledropdownmodes = (itemid,itemname) => {
        setmodeid(itemid)
        setmodename(itemname)
          }
  return (
    <div className="container">
        <div className="row my-3 p-4 jborder ">
            <div className="col-lg-12 branchtitle">
                <h3 style={{textAlign: "center"}}><strong>Journal Entry</strong></h3>
            </div>
            <div className="col-lg-12 border">
              <div className="row p-3">
                <div className="col-lg-4">
                  <span>Date*</span>
                  <input type="date" onChange={(e)=>setdate(e.target.value)} className='customerinput' />
                </div><div className="col-lg-4">
                  <span>Mode</span>
                  <Dropdown  className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden',backgroundColor:'white',border:'1px solid black',color:'black',height:'34px'}} id="dropdown-basic">
       {modename ? modename : "Mode"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { modes.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownmodes(ele.id,ele.value)} key={bankaccounts.value}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
                </div>
                <div className="col-lg-4">
                  <span>Debit Account</span>
                  <Dropdown className="">
          <Dropdown.Toggle style={{ width: '100%', overflow: 'hidden' }} variant="dark" id="dropdown-basic">
            {bankname ? bankname : "Debit Account"}
          </Dropdown.Toggle>
          <Dropdown.Menu className='droptoggle'>
            <input
      type="text"
      placeholder="Search for an account..."
      value={searchTerm}
      onChange={handleSearch}
      className='customerinput'
    />
              <Dropdown.Item
                >
              </Dropdown.Item>
            { filteredAccountSubControls.length > 0?filteredAccountSubControls.map((ele) => (
              <Dropdown.Item
              onClick={()=>handledropdownaccountbanks(ele.accountsubcontrolname,ele.accountsubcontrolcode)}
                key={ele.accountsubcontrolcode}
              >
                {ele.accountsubcontrolname}
              </Dropdown.Item>
            )):bankaccounts.map((ele) => (
              <Dropdown.Item
              onClick={()=>handledropdownaccountbanks(ele.accountsubcontrolname,ele.accountsubcontrolcode)}
                key={ele.accountsubcontrolcode}
              >
                {ele.accountsubcontrolname}
              </Dropdown.Item>
            ))
          }
          </Dropdown.Menu>
        </Dropdown>
                </div>
                <div className="col-lg-4">
                  <span>Ref. No.</span>
                  <input type="text" onChange={(e)=>setrefno(e.target.value)} className='customerinput'/>
                </div>
                <div className="col-lg-4">
                  <span>Description</span>
                  <input type="text" onChange={(e)=>setdescription(e.target.value)} className='customerinput' />
                </div>
                <div className="col-lg-4">
                  <span>Credit Account*</span>
                  <Dropdown className="">
          <Dropdown.Toggle style={{ width: '100%', overflow: 'hidden' }} variant="dark" id="dropdown-basic">
            {bankname2 ? bankname2 : "Credit Account"}
          </Dropdown.Toggle>
          <Dropdown.Menu className='droptoggle'>
            <input
      type="text"
      placeholder="Search for an account..."
      value={searchTerm2}
      onChange={handleSearch2}
      className='customerinput'
    />
              <Dropdown.Item
                >
              </Dropdown.Item>
            { filteredAccountSubControls2.length > 0?filteredAccountSubControls2.map((ele) => (
              <Dropdown.Item
              onClick={()=>handledropdownaccountbanks2(ele.accountsubcontrolname,ele.accountsubcontrolcode)}
                key={ele.accountsubcontrolcode}
              >
                {ele.accountsubcontrolname}
              </Dropdown.Item>
            )):bankaccounts.map((ele) => (
              <Dropdown.Item
              onClick={()=>handledropdownaccountbanks2(ele.accountsubcontrolname,ele.accountsubcontrolcode)}
                key={ele.accountsubcontrolcode}
              >
                {ele.accountsubcontrolname}
              </Dropdown.Item>
            ))
          }
          </Dropdown.Menu>
        </Dropdown>
                </div>
                <div className="col-lg-8">
                  <div className="row">

                <div className="col-lg-4"> <Link style={{textDecoration:'none'}} onClick={()=>navigate(-1)}><button className="btn my-3" style={{width:'100%'}}>Cancel</button></Link></div>
                <div className="col-lg-4 my-3">
                  <button style={{width:'100%'}} className="btnf" onClick={handlesubmit2}>Save and Close</button>
                </div>
                <div className="col-lg-4 my-3"><button style={{width:'100%'}} className="btn2" onClick={handlesubmit}>Save and new</button></div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <span>Amount</span>
                  <input onChange={(e)=>setamount(e.target.value)} type="number" placeholder='0.00' className='customerinput' />
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Journalentry