import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
import "./branch.css"
const Branch = () => {
    
const [branchData,setbranchData] = useState({branchtypeid:"",branchname:"",branchcontact:"",branchaddress:"",companyid:""})
const [selectedtitem,setSelectedItem] = useState('')
    const [selectedtitemid,setSelectedItemid] = useState('')
    const [option,setOption] = useState([])
const navigate = useNavigate()  
const handlechange = (e) => {
    setbranchData({...branchData,[e.target.name]:e.target.value})
    console.log(branchData);
}
const handleBranch = async () => {
    const {branchtypeid,branchname,branchcontact,branchaddress} = branchData;
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
            branchtypeid:selectedtitemid,branchname,branchcontact,branchaddress
           });
           
           let response = await fetch("/addbranch", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
     if(response.ok){
    navigate('/branch')
     }      
    }
    const handleBranchtype = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getbranchtype", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setOption(data)
      }
useEffect(()=>{
    handleBranchtype()
},[])
    const handledropdownitem = (itemname,itemid) => {
        setSelectedItem(itemname)
        setSelectedItemid(itemid)
        }
  return (
    <>
    <div className="container">
        <div className="row">
          <div className="col-3"></div>
            <div className="col-6 branchcol my-4">
                
                <div className='bracnhspan'>
            <div className="row">
              <div className="col-12">
                  <h3 className='text-center branchtitle'>Branch</h3>
                </div>
              <div className="col-6">

                <span >Branch Name*</span>
                <input type="text" value={branchData.branchname} name='branchname'  onChange={handlechange} className='branchtypeinput'/>
              </div>
              <div className="col-6 my-4">
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} className='my-1' variant="dark" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Select Category"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { option.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownitem(ele.branchtypename,ele.branchtypeid)} key={option.value} href="#option1">{ele.branchtypename}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
              </div>
            </div>


                <span >Branch Contact*</span>
                <input type="text" value={branchData.branchcontact} name='branchcontact'  onChange={handlechange} className='branchtypeinput'/>
                <span >Branch Address*</span>
                <input type="text" value={branchData.branchaddress} name='branchaddress'  onChange={handlechange} className='branchtypeinput'/>
                <button className='btn my-2 ' style={{width:"100%"}} onClick={handleBranch}>Create</button>
                </div>
            </div>
            <div className="col-3"></div>
        </div>
    </div>
    </>
  )
}

export default Branch