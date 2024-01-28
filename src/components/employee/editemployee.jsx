import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Editemployee = () => {
  const navigate = useNavigate()
  const {ids} = useParams()
  const [exist , setExist] = useState(false)
const [branchtype,setBranchtype] = useState([])
const [employeeData,setemployeeData] = useState({employeename:"",employeecontact:"",employeemonthlysalary:"",employeecnic:"",employeeemail:"",employeeaddress:""})
const handlechange = (e) => {
  console.log(employeeData);
  setemployeeData({...employeeData,[e.target.name]:e.target.value});
}
  const handleeditbranchtype = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch(`/getemployee/${ids}`, { 
       method: "POST",
       headers: headersList
     });
     
     let data = await response.json();
    //  console.log(data);
     setBranchtype(data)
  }

 const handleupdatebranch = async () => {
  const { employeename,employeecontact,employeeemail,employeeaddress,employeecnic,employeemonthlysalary} = employeeData;
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
   }
   
   let bodyContent = JSON.stringify({
    employeename,employeecontact,employeeemail,employeeaddress,employeecnic,employeemonthlysalary
   });
   
   let response = await fetch(`/updateemployee/${ids}`, { 
     method: "POST",
     body: bodyContent,
     headers: headersList
   });
   if(response.ok){
     navigate('/employee')
     setExist(false)
    }else if(response.status==402){
      console.log("Already Exist");
      setExist(true)
    }else{
      console.log("ERROR");
      setExist(true)
    }
 }



useEffect(()=>{
  handleeditbranchtype()
},[])


  return (
    <>
    
    <div className="container">
        <div className="row">
            <div className="col-6 branchcol my-4">
                <div className='bracnhspan'>
                  <div className='text-danger'>
              {exist? "Already Exist":""}
                  </div>
                  <div className="row">
                    <div className="col-6">

                <span >Employee Name*</span>
                <input type="text" name='employeename' value={employeeData.employeename} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeename:""}`} className='branchtypeinput'/>
                <span >Employee Contact*</span>
                <input type="text" name='employeecontact' value={employeeData.employeecontact} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeecontact:""}`} className='branchtypeinput'/>
                <span >Employee Email*</span>
                <input type="text" value={employeeData.employeeemail} name='employeeemail' onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeeemail:""}`} className='branchtypeinput'/>
                    </div>
                    <div className="col-6">
                <span >Employee Salary*</span>
                <input type="text" name='employeemonthlysalary' value={employeeData.employeemonthlysalary} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeemonthlysalary:""}`} className='branchtypeinput'/>
               
                <span >Employee CNIC*</span>
                <input type="text" value={employeeData.employeecnic} name='employeecnic' onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeecnic:""}`} className='branchtypeinput'/>
               
                    </div>
               <div className="col-10">
                <span >Employee Address*</span>
                <input type="text" name='employeeaddress' value={employeeData.employeeaddress} onChange={handlechange} placeholder={`${branchtype.length > 0? branchtype[0].employeeaddress:""}`} className='branchtypeinput'/>

               </div>
                  </div>
                <button className='btn btn-outline-primary my-2 branchbtn' onClick={handleupdatebranch}>Update</button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Editemployee