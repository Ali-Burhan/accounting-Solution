import React, { useEffect, useState } from 'react'
import "./bank.css"
const Accountbalances = () => {
    const [bankaccounts, setbankaccounts] = useState([])
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
   
useEffect(()=>{
    handleBankaccounts()
},[])

  return (
    <div className="container">
        <div className="row my-2">
            <div className="col-12">
            
  <table className='balancetable'>
    <thead>
      <tr>
        <th className='balanceth' style={{width:'30%'}}>Bank</th>
        <th className='balanceth'>Code</th>
        <th className='balanceth' style={{width:'25%'}}>Reconcile Data</th>
        <th className='balanceth'>Balance</th>
        {/* <!-- Add more headers if needed --> */}
      </tr>
    </thead>
    <tbody className='balancetbody'>
        {bankaccounts.length > 0 && bankaccounts.map((ele)=>(
            <>
      <tr>
            <td className='balancetd'>{ele.accountsubcontrolname}</td>
            <td className='balancetd'>{ele.accountsubcontrolcode}</td>
            <td className='balancetd'>{ele.accountsubcontrolname}</td>
            <td className='balancetd'>{ele.currentbalance} Rs.</td>
            </tr>
            </>
        ))}
        {/* <!-- Add more data cells if needed --> */}
      {/* <!-- Add more rows if needed --> */}
    </tbody>
  </table>
            </div>
        </div>
    </div>
  )
}

export default Accountbalances