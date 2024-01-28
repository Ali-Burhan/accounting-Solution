import React, { useEffect, useState } from 'react'
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './users.css'
import {useNavigate} from "react-router-dom"
// import { inputAdornmentClasses } from '@mui/material';
const Users = ({setNavbar}) => {
    const navigate = useNavigate()
    const [user,setUsers] = useState([]);
    const [filteredUsers,setFilteredUsers] = useState([])
    const [searchData,setSearchData] = useState('')
    const handleSubmit = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
         }
        
        var response = await fetch("/api/users", { 
            method: "GET",
            headers: headersList
        });
        
           let data = await response.json();
           console.log(data);
           setUsers(data)
    }

    useEffect(()=>{
        setNavbar(true)
        handleSubmit()
    },[])

    const userrightsgiven = (ids) => {
      navigate(`/userrights/${ids}`)
    }

      // const filterContent = (e) => {
      //   const searchValue = e.target.value;
      //   setSearchData(searchValue);
      //   const newUsers = user.filter((user) => user.id == searchValue);
      //   // const newUsers = user.find(element=>element.includes(searchValue));
      //   setFilteredUsers(newUsers);
      // };
      const filterContent = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchData(searchValue);
        const newUsers = user.filter((user) =>
          user.fullname.toString().toLowerCase().includes(searchValue)
        );
        setFilteredUsers(newUsers);
      };
  return (
    <>
    
    <div className="table">
        <div className="csvfile">
            <CSVLink  data={user} filename={"users_data.csv"}>
        <button className='csvbutton'>Excel</button>
    </CSVLink>
    <input type="text" name="search" className='mx-2 usersearch'  placeholder='Search with Name' id="search1" onChange={filterContent} />
        </div> 
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650,maxHeight:250 }} aria-label="simple table">
              <TableHead className='bg-dark '>
                <TableRow >
                  <TableCell className='text-white'>ID</TableCell>
                  <TableCell align="right" className='text-white'>User Name</TableCell>
                  <TableCell align="right" className='text-white'>Email</TableCell>
                  <TableCell align="right" className='text-white'>Password</TableCell>
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  user.map((row) => ( 
                    <TableRow onClick={()=>userrightsgiven(row.id)} style={{cursor:"pointer"}}
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell  align="right"> {row.fullname}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.password}</TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow onClick={()=>userrightsgiven(row.id)}
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.fullname}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.password}</TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
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

export default Users