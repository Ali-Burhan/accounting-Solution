import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
import "./employee.css"
const Employee = () => {
  const [branchData,setbranchData] = useState({employeename:"",employeecontact:"",employeeemail:"",employeeaddress:"",employeecnic:"",employeedesignation:"",employeedescription:"",employeemonthlysalary:"",branchid:"",companyid:"",userid:""})
const [selectedtitem,setSelectedItem] = useState('')
const navigate = useNavigate()
    const [selectedtitemid,setSelectedItemid] = useState('')
    const [option,setOption] = useState([])
    const handlechange = (e) => {
      setbranchData({...branchData,[e.target.name]:e.target.value})
    }

    const handlesubmit = async  () => {
      const {employeename,employeecontact,employeeemail,employeeaddress,employeecnic,employeedesignation,employeedescription,employeemonthlysalary,branchid,companyid,userid} = branchData;
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
        employeename,
        employeecontact,
        employeeemail,
        employeeaddress,
        employeecnic,
        employeedesignation,
        employeedescription,
        employeemonthlysalary,
        branchid:selectedtitemid,
        companyid:"",
        userid:""
       });
       
       let response = await fetch("/addemployee", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       if(response.ok){
        navigate('/employee')
       }
    }

    const handledropdownitem = (itemname,itemid) => {
      setSelectedItem(itemname)
      setSelectedItemid(itemid)
      }
      const handleBranch = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getbranch", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setOption(data)
      }
useEffect(()=>{
  handleBranch()
},[])
  return (
    <>
     <div className="container">
        <div className="row">
          <div className="col-1"></div>
            <div className="col-10 branchcol my-4">
                <div className='bracnhspan'>
            <div className="row">
              <div className="col-12">
                <h3 className='text-center employeetitle'>Employee</h3>
              </div>
              <div className="col-6">

                <span >Employee Name*</span>
                <input type="text" value={branchData.employeename} onChange={handlechange} name='employeename'  className='branchtypeinput'/>
              </div>
              <div className="col-6 my-1">

                <Dropdown className=''>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Select Branch"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { option.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownitem(ele.branchname,ele.branchid)} key={option.value} href="#option1">{ele.branchname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
              </div>
            </div>
            <div className="row">

              <div className="col-6">

                <span >Employee Salary*</span>
                <input type="text" value={branchData.employeemonthlysalary} onChange={handlechange} name='employeemonthlysalary'  className='branchtypeinput'/>
              </div>
              <div className="col-6">

                <span >Employee Contact*</span>
                <input type="text" value={branchData.employeecontact} onChange={handlechange} name='employeecontact'  className='branchtypeinput'/>
              </div>
              <div className="col-6">

                <span >Employee Email*</span>
                <input type="text" value={branchData.employeeemail} name='employeeemail' onChange={handlechange}  className='branchtypeinput'/>
              </div>
              <div className="col-6">

                <span >Employee CNIC*</span>
                <input type="text" onChange={handlechange} value={branchData.employeecnic} name='employeecnic'  className='branchtypeinput'/>
              </div>
              <div className="col-6">

                <span >Employee Designation*</span>
                <input type="text" onChange={handlechange} value={branchData.employeedesignation} name='employeedesignation'  className='branchtypeinput'/>
              </div>
              <div className="col-6">

                <span >Employee Description*</span>
                <input type="text" onChange={handlechange} value={branchData.employeedescription} name='employeedescription'  className='branchtypeinput'/>
              </div>
              <div className="col-12">

                <span >Employee Address*</span>
                <input type="text" onChange={handlechange} value={branchData.employeeaddress} name='employeeaddress'  className='branchtypeinput'/>
              </div>
            </div>
                <button className='btn my-2' style={{width:"100%"}} onClick={handlesubmit}>Create</button>
                </div>
            </div>
            <div className="col-1"></div>
        </div>
    </div>
    </>
  )
}

export default Employee