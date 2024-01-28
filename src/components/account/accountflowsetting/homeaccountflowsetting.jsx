import React, { useEffect, useState } from 'react'
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
const Homeaccountflowsetting = () => {
  const navigate = useNavigate()
  const [accounthead,setaccounthead] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([])
  const [accountflowsetting,setaccountflowsetting] = useState([])
  const [searchData,setSearchData] = useState('')
  const [accountcontrol,setaccountcontrol] = useState([])
  const [accountactivity,setaccountactivity] = useState([])
  const [accountheaddata,setaccountheaddata] = useState([])

const handleFlowSetting = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getaccountflowsetting", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
       setaccountflowsetting(data)
}
const handleAccountActivity = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getaccountactivity", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
       setaccountactivity(data)
}

  const filterContent = (e) => {
      const searchValue = e.target.value;
      setSearchData(searchValue);
      const newUsers = accounthead.filter((user) => user.accountactivityid == searchValue);
      setFilteredUsers(newUsers);
    };
    const handleaccountcontrol =async() => {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch("/getaccountcontrol", { 
           method: "GET",
           headers: headersList
         });
         
         let data = await response.json();
         console.log(data);
         setaccountcontrol(data)         
      }
    const handleaccountheaddata =async() => {
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
         setaccountheaddata(data)
      }
    const handleaccounthead =async() => {
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
       setaccounthead(data)
       
    }
    const handleedit = (ids) => {      
      navigate(`/editaccountsubcontrol/${ids}`);
      }

      useEffect(()=>{
        handleFlowSetting()
        handleAccountActivity()
        handleaccountcontrol()
        handleaccountheaddata()
        handleaccounthead()
      },[])

  return (
    <>
     <div className="table">
      <div className="csvfile">
          <CSVLink  data={accounthead} filename={"users_data.csv"}>
      <button className='csvbutton'>Excel</button>
  </CSVLink>
  <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
          <Link to={'/createaccountflowsetting'} className='btn btn-outline-primary'>Create new Account Flow</Link>
      </div> 
      <div className="">
      </div>
  <TableContainer className='tablehead' component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='bg-dark'>
              <TableRow>
                <TableCell className='text-white'><b> Account Head Name </b></TableCell>
                <TableCell className='text-white'><b> Account Control Name</b></TableCell>
                <TableCell className='text-white'><b> Account Sub Control Name</b></TableCell>
                <TableCell className='text-white'><b> Account Activity</b></TableCell>
                <TableCell className='text-white'><b> Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredUsers.length===0?
                accountflowsetting.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {accountheaddata.map((ele)=>(
                        ele.accountheadid==row.accountheadid?ele.accountheadname:""
                    ))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accountcontrol.map((ele)=>(
                        ele.accountcontrolid==row.accountcontrolid?ele.accountcontrolname:""
                    ))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accounthead.map((ele)=>(
                        ele.accountsubcontrolid == row.accountsubcontrolid?ele.accountsubcontrolname:""
                    ))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accountactivity.map((ele)=>(
                        ele.accountactivityid == row.accountactivityid?ele.accountactivityname:""
                    ))}
                  </TableCell>
                  <TableCell ><button onClick={()=>handleedit(row.accountheadid)} className='btn btn-outline-primary'>Edit</button></TableCell>
                </TableRow>
              )):
              filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.accountactivityname}
                  </TableCell>
                  {/* onClick={()=>handledelete(row.productid)} */}
                  
                  <TableCell align="right"><button onClick={()=>handleedit(row.accountheadid)} className='btn btn-outline-primary'>Edit</button></TableCell>
                </TableRow>
              ))
              
              }
            </TableBody>
          </Table>
        </TableContainer>
  </div>
    </>
  )
}

export default Homeaccountflowsetting