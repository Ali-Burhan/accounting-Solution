import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom'
import "./bank.css"
const Bankpayment = () => {
    const [bankaccounts, setbankaccounts] = useState([])
    const [formDataArray, setFormDataArray] = useState([{ date: '', mode: '', nominalid: '', refno: '', details: '', amount: '' }]);
    const navigate = useNavigate()
    const [bankname,setbankname] = useState('')
    const [bankid,setbankid] = useState('')
    const [accountsubcontrol,setaccountsubcontrol] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAccountSubControls, setFilteredAccountSubControls] = useState([]);
    const [modes,setmodes] = useState([{id:1,value:'Cash'},{id:2,value:'Cheque'},{id:3,value:'Credit Card'},{id:4,value:'Off Set'},{id:5,value:'Online'},{id:6,value:'Pay Order'},])
    const [nominalname,setnominalname] = useState([])
    const handleAddForm = () => {
      setFormDataArray([...formDataArray, { date: '', mode: '', nominalid: '', refno: '', details: '', amount: '',nominalid:'' }]);
    };
    const handleFormChange = (index, field, value,nominalnames = nominalname[index]) => {
      const updatedFormData = formDataArray.map((formData, i) => (i === index ? { ...formData, [field]: value } : formData));
      setFormDataArray(updatedFormData);
      const updatedNominalname = [...nominalname];
      updatedNominalname[index] = nominalnames;
      // Update the state with the new array
      setnominalname(updatedNominalname);
      console.log(formDataArray);
    };
    const handleFormDelete = (index, field, value) => {
      const updatedFormData = formDataArray.filter((_, i) => (i !== index));
      setFormDataArray(updatedFormData);
      console.log(formDataArray);
    };
    const handleSubmitAll = async () => {
      for (const formData of formDataArray) {
        // Here, you can send each formData in a separate request or combine them and send in a single request based on your server-side API requirements.
        const bodyContent = JSON.stringify({
          bankcode: String(bankid),
          date: formData.date,
          mode: formData.mode,
          nominalaccount: String(formData.nominalid),
          refno: formData.refno,
          detail: formData.details,
          amount: formData.amount,
          userid: localStorage.getItem('userid')
        });
    
        const response = await fetch("/addbankpayment", {
          method: "POST",
          body: bodyContent,
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
          }
        });
      }
    };
    const handleSubmitAll2 = async () => {

      for (const formData of formDataArray) {
        // Here, you can send each formData in a separate request or combine them and send in a single request based on your server-side API requirements.
        const bodyContent = JSON.stringify({
          bankcode: String(bankid),
          date: formData.date,
          mode: formData.mode,
          nominalaccount: String(formData.nominalid),
          refno: formData.refno,
          detail: formData.details,
          amount: formData.amount,
          userid: localStorage.getItem('userid')
        });
    
        const response = await fetch("/addbankpayment", {
          method: "POST",
          body: bodyContent,
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
          }
        });
    
        if (response.ok) {
          navigate(`/homebankpayment`)
        } else {
          window.alert('ERROR');
        }
      }
    };
    
    const handleaccountcontrol =async() => {
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
         setaccountsubcontrol(data)         
      }
    const handleBankaccounts = async () => {
      
        let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getaccountasset", { 
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
          const handleSearch = (event) => {
            const searchValue = event.target.value;
            setSearchTerm(searchValue);
        
            const filteredItems = accountsubcontrol.filter((ele) =>
              ele.accountsubcontrolname.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredAccountSubControls(filteredItems);
          };
          useEffect(()=>{
            handleBankaccounts()
            handleaccountcontrol()
          },[])
  return (
    <div className="container">
        <div className="row my-2 jborder p-4">
            <div className="col-12 text-center branchtitle"> <h4>Add Bank Payment</h4></div>
            
            <div className="col-lg-4 my-2">
            <span>Select Bank</span>
  <Dropdown  className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {bankname ? bankname : "Bank"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { bankaccounts.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownaccountbanks(ele.accountsubcontrolname,ele.accountsubcontrolcode)} key={bankaccounts.value}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
            </div>
            <div className="col-lg-6"></div>
            <div className="col-lg-12 my-1">
  {formDataArray.map((formData, index) => (
    <div key={index} className="row border">
      <div className="col-lg-4">
        <span>Date</span>
        <input onChange={(e) => handleFormChange(index, 'date', e.target.value)} value={formData.date} className="customerinput" type="date" />
      </div>
      <div className="col-lg-4">
        <span>Mode</span>
        <Dropdown className="">
        <Dropdown.Toggle style={{width:'100%',overflow:'hidden',backgroundColor:'white',border:'1px solid black',color:'black'}} id="dropdown-basic">
       {formDataArray[index].mode ? formDataArray[index].mode : "Mode"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { modes.map((ele)=>(
          <Dropdown.Item onClick={()=>handleFormChange(index,'mode',ele.value)} key={bankaccounts.value}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="col-lg-4">
        <span>Nominal Account*</span>
        <Dropdown className="">
          <Dropdown.Toggle style={{ width: '100%', overflow: 'hidden' }} variant="dark" id="dropdown-basic">
            {nominalname[index] ? nominalname[index] : "Nominal Account"}
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
                onClick={() => handleFormChange(index,'nominalid', ele.accountsubcontrolcode,ele.accountsubcontrolname)}
                key={ele.accountsubcontrolcode}
              >
                {ele.accountsubcontrolname}
              </Dropdown.Item>
            )):accountsubcontrol.map((ele) => (
              <Dropdown.Item
                onClick={() => handleFormChange(index,'nominalid', ele.accountsubcontrolcode,ele.accountsubcontrolname)}
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
        <input onChange={(e) => handleFormChange(index, 'refno', e.target.value)} value={formData.refno} className="customerinput" type="text" />
      </div>
      <div className="col-lg-4">
        <span>Detail</span>
        <input onChange={(e) => handleFormChange(index, 'details', e.target.value)} value={formData.details} className="customerinput" type="text" />
      </div>
      <div className="col-lg-4">
        <span>Amount</span>
        <input onChange={(e) => handleFormChange(index, 'amount', e.target.value)} value={formData.amount} type="number" placeholder='0.00' className="customerinput" />
      </div>
      <div className="col-8"></div>
      <div className="col-lg-2 my-2">
      </div>
      <div className="col-lg-2 my-2">
        <button style={{width:'100%'}} className="btn" onClick={()=>handleFormDelete(index)}>Delete this form</button>
        
      </div>
    </div>
  ))}
</div>
<div className="row">
<div className="col-lg-12">
  <div className="row">
<div className="col-lg-3 my-1">
<Link style={{textDecoration:'none',color:'red'}} onClick={()=>navigate(-1)}> <button className="btn"  style={{width:'100%'}}>Cancel</button></Link>
</div>
<div className="col-lg-3 my-1 ">
  <button style={{width:'100%'}} className='btnb' onClick={handleAddForm}>Add Another Form</button>
</div>
<div className="col-lg-3 my-1">
  <button  className="btn2 " style={{width:'100%'}} onClick={handleSubmitAll}>Save And New</button>
</div>
<div className="col-lg-3 my-1">
  <button className="btnp"  style={{width:'100%'}} onClick={handleSubmitAll2}>Save And Close</button>
</div>
  </div>
</div>
</div>

        </div>
    </div>
  )
}

export default Bankpayment