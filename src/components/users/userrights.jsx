import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./users.css"
const Userrights = () => {
    const navigate = useNavigate()
    const [checkGroup,setCheckGroup] = useState({check1:"",check2:"",check3:"",check4:"",check5:""})
    const {id} = useParams()
    const [user,setUser] = useState([])
    const [assign,setAssign] = useState(false)
    const getUser = async () =>{
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch(`/userauthorization/${id}`, { 
             method: "POST",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
        setUser(data)
        
    }
    useEffect(()=>{
        getUser()
        console.log(checkGroup.check1);
    },[checkGroup.check1])

    const handleChange = (e) => {
        console.log(checkGroup);
    }

    const giveRights = async () => {
        const {check1,check2,check3,check4,check5}  = checkGroup;
        if(check1 || check2 ||check3 ||check4 ||check5){

            let headersList = {
                "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
            check1,check2,check3,check4,check5
           });
           
           let response = await fetch(`/assignrole/${id}`, { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           if(response.ok){
               navigate('/users')
            }else{
                
            }
        }else{
            window.alert('CHOOSE A RIGHT')
        }
            
        }
    useEffect(()=>{
        if( user.length>0? user[0].accountid==1 && user[0].branch==1 && user[0].masterdata == 1 && user[0].purchaseid==1 && user[0].saleid==1 :""){
            setAssign(true)
            console.log("entered");
        }
    },[user.length])
    return (
        <>
    <div className="container">
        <div className="row">
            <div className="col-3"></div>
            <div className="col-md-6 my-2">
    <div className="row userrightsbox">
        <div className="col-12">

    <h3 className='text-center branchtitle'>{user.length > 0? user[0].fullname :""}</h3>
        </div>
        <div className="col-12">

        <h5 className='text-center userrights'>Rights</h5>
        </div>
        { assign? "" :
        <div className="col-12">
            {user.length > 0? user[0].branch==1?"":
                <>
                <input type="checkbox" className='checkinput' name='check1'  onChange={(e)=>setCheckGroup({...checkGroup,check1:e.target.checked})} id="myCheckbox"/>
<label for="myCheckbox" className='mx-1'>Branch</label>
</>:""
            }
     {user.length > 0? user[0].accountid==1?"":
        <>
            <input type="checkbox" name='check2' className='checkinput' onChange={(e)=>setCheckGroup({...checkGroup,check2:e.target.checked})} id="myCheckbox1"/>
<label for="myCheckbox1" className='mx-1'>Account</label>
     </>:""}
     {user.length > 0? user[0].purchaseid==1?"": <>
            <input type="checkbox" name='check3' className='checkinput' onChange={(e)=>setCheckGroup({...checkGroup,check3:e.target.checked})} id="myCheckbox2"/>
<label for="myCheckbox2" className='mx-1'>Purchase</label>
     </>:""}
     {user.length > 0? user[0].saleid==1?"": <>
            <input type="checkbox" name='check4' className='checkinput' onChange={(e)=>setCheckGroup({...checkGroup,check4:e.target.checked})} id="myCheckbox3"/>
<label for="myCheckbox3" className='mx-1'>Sale</label>
     </>:""}
     {user.length > 0? user[0].masterdata==1?"": <>
            <input type="checkbox" name='check5' className='checkinput' onChange={(e)=>setCheckGroup({...checkGroup,check5:e.target.checked})} id="myCheckbox4"/>
<label for="myCheckbox4" className='mx-1'>Master Data</label>
     </>:""}
        </div>
        }
        {assign?
        <div className="col-12">
            <button className='btn my-2' style={{width:"100%"}}>  All Rights Given </button>
        </div>:
        <div className="col-12">
            <button className='btn my-2' style={{width:"100%"}} onClick={giveRights}>  ASSIGN </button>
        </div>
        }
    </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Userrights