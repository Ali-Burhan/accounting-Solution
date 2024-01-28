import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Userprofile = () => {
    const {ids} = useParams()
    const [user,setUser] = useState([])
    const [getpic,setGetPic] = useState(null)
    const handleUsers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch(`/userauthorization/${ids}`, { 
             method: "POST",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setUser(data)
    }

    useEffect(()=>{
        handleUsers()
    },[])
    useEffect(() => {
        const fetchPictureData = async () => {
          try {
            const response = await fetch(`/getpicture/${localStorage.getItem('email')}`);
            if (response.ok) {
              const data = await response.blob();
              setGetPic(data);
            } else {
              console.log('Error fetching picture data');
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchPictureData();
      }, []);
  return (
    <div>{user.map((row)=>(
        <div className="container">
            <div className="row my-4">
                <div className="col-3">
                </div>
                  <div className="col-6">
            <div className="row">
              <div className="col-4">

                {getpic && (
                  <img src={URL.createObjectURL(getpic)} width={200} height={200} style={{borderRadius:"10px"}} alt="Picture" />
                  )}
                    <h4>{row.fullname}</h4>
                  </div>
                  <div className="col-6">
                  <h2>Email:</h2>
                    <h4>{row.email}</h4>
                  <h2>Password:</h2>
                    <h4>{row.password}</h4>
                  </div>
                </div>
                  </div>
            </div>
        </div>
    ))}</div>
  )
}

export default Userprofile