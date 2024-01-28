import React from 'react'
import loading from '../images/loadinggif.gif'
const Error = () => {
  return (
    <>
    <div className="container">
        <div className="row justify-center align-center">
            <div className="col-4"></div>
            <div className="col-4">
                <img src={loading} alt="LOADING" />
            </div>
        </div>
    </div>
    </>
  )
}

export default Error