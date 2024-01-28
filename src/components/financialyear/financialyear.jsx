import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Financialyear = () => {
  const [financialyears , setFinancialyear] = useState({financialyear:"",userid:"",startdate:"",enddate:"",isactive:""})
  const handlechange = (e) => {
    setFinancialyear({...financialyears,[e.target.name]:e.target.value})
    console.log(financialyears);
  }
  const [user,setUser] = useState([])
  const navigate = useNavigate()  
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
     setUser(data)
  }
  useEffect(()=>{
    const fetchData = async () => {
      await handleSubmit();
    };
  fetchData()
  },[])
  const handlesubmit = async () => {
    const {financialyear,userid,startdate,enddate,isactive} = financialyears;
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
      financialyear,userid:user.length>0?user[0].id:"",startdate,enddate,isactive
     });
     
     let response = await fetch("/addfinancialyear", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/financialyear')
     }
     
  }

  return (
    <>
     <div className="container">
    <div className="row">
      <div className="col-3"></div>
        <div className="col-md-6 branchcol my-4">
            <div className='bracnhspan'>
              <div className="row">
                <div className="col-12">
                  <h3 className='text-center branchtitle'>Financial Year </h3>
                </div>
                <div className="col-12">
            <div className="error text-danger">
                {/* {error?"Already Exist":""} */}
            </div>
            <div className="my-3">
            <span>Financial Year*</span>
            <input type="text" name='financialyear' onChange={handlechange} value={financialyears.financialyear} placeholder='Enter Year' className='branchtypeinput'/>
            </div>
            <span >Start Date*</span>
            <input type="date"  name='startdate' onChange={(e)=>{setFinancialyear({...financialyears,[e.target.name]:String(e.target.value)})}} value={financialyears.startdate} className='branchtypeinput'/>
            <span >End Date*</span>
            <input type="date" name='enddate' value={financialyears.enddate}  onChange={(e)=>{setFinancialyear({...financialyears,[e.target.name]:String(e.target.value)})}} className='branchtypeinput'/>
            <span >Is Active*</span>
            <input type="text" name='isactive' value={financialyears.isactive} onChange={handlechange} placeholder='1 for active 0 for not' className='branchtypeinput'/>
            {/* onClick={handleaccountactivity} */}
            <button className='btn my-2' style={{width:"100%"}} onClick={handlesubmit}>Create</button>
                </div>
              </div>
            </div>
        </div>
        <div className="col-3"></div>
    </div>
</div>
    </>
  )
}

export default Financialyear