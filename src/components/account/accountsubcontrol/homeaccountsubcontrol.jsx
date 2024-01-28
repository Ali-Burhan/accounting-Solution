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
const Homeaccountsubcontrol = () => {
  const navigate = useNavigate()
  const [accounthead,setaccounthead] = useState([]);
  const [arr,setarr] = useState([])
  const [filteredUsers,setFilteredUsers] = useState([])
  const [searchData,setSearchData] = useState('')
  const [loading,setloading] = useState(false)
  const [accountcontrol,setaccountcontrol] = useState([])
  const [accountheaddata,setaccountheaddata] = useState([])
  const [accountheaddatasorted,setaccountheaddatasorted] = useState([])
  const filterContent = (e) => {
      const searchValue = e.target.value;
      setSearchData(searchValue);
      const newUsers = accounthead.filter((user) => user.accountsubcontrolname.toLowerCase().toString().includes(searchValue));
      setFilteredUsers(newUsers);
    };
    const handleaccountcontrol =async() => {
      setloading(true)
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch("/getaccountcontrol", { 
           method: "GET",
           headers: headersList
         });
         
         let data = await response.json();
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
         setaccountheaddata(data)
         setloading(false)
      }
    const handleaccounthead =async() => {
      setloading(true)
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
      useEffect(() => {
      
        // Sort the accounthead array after it has been updated
        const sortedArray = accounthead.slice().sort((a, b) => a.accountheadid - b.accountheadid);
        
        setaccountheaddatasorted(accountheaddata.slice().sort((a, b) => a.accountheadid - b.accountheadid))
        console.log("sorted accounthead", accountheaddatasorted);
        setarr(sortedArray);
        console.log("arr",arr);
      }, [accounthead]); //
      useEffect(()=>{
        setloading(true)
        handleaccountheaddata()
        handleaccounthead()
        handleaccountcontrol()
      },[])
return (
  <>
  { loading?<h1 className='text-center text-white bg-dark'>LOADING...</h1>:
     <div className="table" style={{ maxHeight: '88vh', overflow: 'auto' }}>
      <div className="csvfile">
          <CSVLink  data={accounthead} filename={"users_data.csv"}>
      <button className='csvbutton'>Excel</button>
      
  </CSVLink>
  <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with ID' id="search1" onChange={filterContent} />
          <Link to={'/createaccountsubcontrol'} className='btn btn-outline-primary'>Create new Account Sub Control</Link>
      </div> 
      <div className="" >
      </div>
  <TableContainer className='tablehead'  component={Paper}>
          <Table  sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='bg-dark'>
              <TableRow>
                <TableCell className='text-white'><b> Account Code</b></TableCell>
                <TableCell className='text-white'><b> Account Head Name </b></TableCell>
                <TableCell className='text-white'><b> Account Control Name</b></TableCell>
                <TableCell className='text-white'><b> Account Subcontrol Name</b></TableCell>
                <TableCell className='text-white'><b>Available Balance</b></TableCell>
                <TableCell className='text-white'><b> Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredUsers.length===0?
                arr.map((row) => ( 
                  <TableRow
                  key={row.accountactivityname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.accountsubcontrolcode}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accountheaddatasorted.map((ele)=>(
                        ele.accountheadid==row.accountheadid?ele.accountheadname:""
                    ))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accountcontrol.map((ele)=>(
                        ele.accountcontrolid==row.accountcontrolid?ele.accountcontrolname:""
                    ))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.accountsubcontrolname}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.currentbalance} Rs.
                  </TableCell>
                  <TableCell ><button onClick={()=>handleedit(row.accountsubcontrolid)} className='btn btn-outline-primary'>Edit</button></TableCell>
                </TableRow>
              )):
              filteredUsers.map((row) => ( 
                <TableRow
                key={row.accountactivityname}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                  {row.accountsubcontrolcode}
                </TableCell>
                <TableCell component="th" scope="row">
                  {accountheaddatasorted.map((ele)=>(
                      ele.accountheadid==row.accountheadid?ele.accountheadname:""
                  ))}
                </TableCell>
                <TableCell component="th" scope="row">
                  {accountcontrol.map((ele)=>(
                      ele.accountcontrolid==row.accountcontrolid?ele.accountcontrolname:""
                  ))}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.accountsubcontrolname}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.currentbalance} Rs.
                </TableCell>
                <TableCell ><button onClick={()=>handleedit(row.accountsubcontrolid)} className='btn btn-outline-primary'>Edit</button></TableCell>
              </TableRow>
              ))
              
              }
            </TableBody>
          </Table>
        </TableContainer>
  </div>
            }
    </>
  )
}

export default Homeaccountsubcontrol