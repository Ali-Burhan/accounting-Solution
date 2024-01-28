import React, { useEffect, useState } from 'react'

const Testpic = () => {
    const [picdata,setPicData] = useState(null)
    const [getPic,setGetpic] = useState(null)
    const handlePicture = (e) => {
        setPicData(e.target.files[0])
    }
    useEffect(()=>{
        console.log(picdata);
    },[picdata])

    const handleUpload = async () => {
        try {
          const formData = new FormData();
          formData.append('picture', picdata);
          const response = await fetch('/postpicture',{
            method:'POST',
            headers:{
              
            },
            body: formData,
          })
          // const response = await axios.post('/upload', formData, {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // });
          
        } catch (error) {
          console.error(error);
          // Handle error
        }
      };
      useEffect(() => {
        const fetchPictureData = async () => {
          try {
            const response = await fetch(`/getpicture/7`);
            if (response.ok) {
              const data = await response.blob();
              setGetpic(data);
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
    <>
    <div>Testpic</div>
    <input type='file' onChange={handlePicture}/>
    {/* <img src={picdata}/> */}
    <button onClick={handleUpload}>Upload</button>
    {getPic && (
        <img src={URL.createObjectURL(getPic)} alt="Picture" />
      )}
    </>
  )
}

export default Testpic