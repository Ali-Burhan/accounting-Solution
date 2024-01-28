import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import {CSVLink} from "react-csv"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
import "./purchasecart.css"
const Purchasecart = () => {
    const [purchasecart,setPurchasecart] = useState([])
    const [isChecked,setIsChecked] = useState(false)    
    const [purchasecartquantitysum,setpurchasequantitysum] = useState([])
    const [error,seterror] = useState(false)    
    const [itemtaxname,setitemtaxname] = useState('')
    const [itemtaxid,setitemtaxid] = useState('')
    const [orderTotal,setOrdertotal] = useState("")
    const [subtotal,setSubtotal] = useState("")
    const [shippingfee,setShippingFee] = useState("")
    const [invoicedate,setinvoicedate] = useState('')
    const [saletax,setSaletax] = useState("")
    const [discount,setdiscount] = useState('')
    const [allsaletax,setallsaletax] = useState('')
    const [incometax,setincometax] = useState("")
    const [filteredUsers,setFilteredUsers] = useState([])
    const [click,setClick] = useState(0)
    const [searchData,setSearchData] = useState('')
    const [message,setMessage] = useState(false)
    const [selectedproductname,setselectproductname] = useState('')
    const [selectedsuppliername,setselectsuppliername] = useState('')
    const [purchasecartData,setPurchaseCartData] = useState({purchasecartquantity:"",purchasecartcurrentpurchaseprice:"",purchasecartsalesdata:"",companyid:"",branchid:"",userid:"",purchasecartpreviouspurchaseprice:"",purchasecartdescription:"",purchasecartmanufacturedate:"",purchasecartexpirydate:""})
    const [duedate,setduedate] = useState('')
    const [selectedproductid,setselectedproductid] = useState('')
    const [selectedsupplierid,setselectedsupplierid] = useState('')
    const [productnet,setproductnet] = useState('')
    const [product,setproduct] = useState([])
    const [supplier,setsupplier] = useState([])
    const [accountactivity,setaccountactivity] = useState([])
    const [itemtaxpercen,setitemtaxpercen] = useState([{id:0,value:'No - Tax'},{id:17,value:'PB - 17%'},{id:18,value:'PB - 18%'}])
    const [taxdrop,setTaxdrop] = useState([{id:0, value:"No - Tax"},{id:5, value:"5%"},{id:5.5, value:"5.5%"},{id:6, value:"6%"},{id:8, value:"8%"},{id:9, value:"9%"},{id:10, value:"10%"},{id:12, value:"12%"}])
    const [accountactivitynameselected,setselectedaccountactivityname] = useState('')
    const [accountactivityidselected,setselectedaccountactivityid] = useState(0)
    const [taxdropname,settaxdropname] = useState('')
    const [taxdropid,settaxdropid] = useState(0)
    const navigate = useNavigate()

    const handleBranchtype = async () => {
      
      let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch("/getaccountasset", { 
       method: "GET",
       headers: headersList
     });
     
     let data = await response.json();
     console.log(data);
     setaccountactivity(data)
    }
    useEffect(()=>{
      console.log(invoicedate);
    },[invoicedate])
 useEffect(()=>{
  handleBranchtype()
},[])
  const handleCheckout = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     let bodyContent = JSON.stringify({
      supplierid:selectedsupplierid,
      companyid:"2",
      payment:isChecked,
      ordertotal:String( Math.round(orderTotal)),
      branchid:"2",
      totalamount:String( Math.round(orderTotal)),
      invoicedate:invoicedate,
      supplierinvoicedescription:purchasecartData.purchasecartdescription,
      userid:localStorage.getItem('userid'),
      saletax:String( Math.round(saletax)),
      shippingfee:String( Math.round(shippingfee)),
      subtotalamount:String(Math.round(subtotal)),
      accountactivityid:accountactivityidselected,
      incometax:isChecked?Math.round(incometax):null,
      duedate:duedate
     });
     
     let response = await fetch("/addcheckout", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     if(response.ok){
      navigate('/home')
     }else{
      console.log("Error occured");
     }
     
  }


  useEffect(()=>{
    const sumquantity =async () => {
  let quantity =purchasecart.length>0?purchasecart.map((ele)=>(ele.purchasecartquantity * ele.purchasecartcurrentpurchaseprice) - ele.discount):""
  let saletax = purchasecart.length>0?purchasecart.map((ele)=>(ele.saletax)):""
  setpurchasequantitysum(quantity)
  setSaletax(saletax.length>0? saletax.reduce((accumulator,currentValue)=>(accumulator + parseInt(currentValue,10)),0):0)
    }
   sumquantity()
  },[purchasecart])
  
useEffect(()=>{
setallsaletax((productnet * itemtaxid)/100)
},[itemtaxid])

useEffect(()=>{
setOrdertotal(subtotal + saletax +  Number(shippingfee))
},[shippingfee])
useEffect(()=>{
setincometax((subtotal + saletax)*taxdropid/100)
console.log(incometax);
},[taxdropname])
  useEffect(()=>{
    setSubtotal(purchasecartquantitysum.length>0? purchasecartquantitysum.reduce((accumulator,currentValue)=>(accumulator + parseInt(currentValue,10)),0):0)
  },[purchasecartquantitysum])
  
  useEffect(()=>{
  setproductnet((purchasecartData.purchasecartquantity * purchasecartData.purchasecartcurrentpurchaseprice) - discount)
  if(discount> purchasecartData.purchasecartquantity * purchasecartData.purchasecartcurrentpurchaseprice){
    window.alert('Discount Cannot be greated than net value')
    setdiscount('')
  }
},[purchasecartData.purchasecartquantity,purchasecartData.purchasecartcurrentpurchaseprice,discount])

    const filterContent = (e) => {
      const searchValue = e.target.value;
      setSearchData(searchValue);
      const newUsers = product.filter((user) => user.productid == searchValue);
      setFilteredUsers(newUsers);
    };
    const handleedit = (ids) => {      
      navigate(`/editpurchasecart/${ids}`);
      }
      const handledelete = async (id) => {

        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
         }
         
         let response = await fetch(`/deletepurchasecart/${id}`, { 
           method: "DELETE",
           headers: headersList
         });
         
         if(response.ok){
          setMessage(true)
          window.location.reload()
         }
         
      }
    const handlepurchasecartdata = async () => {
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getpurchasecart", { 
         method: "GET",
         headers: headersList
       });
       
      if(response.ok){
        let purchasecartdata =await response.json();
        console.log(purchasecartdata);
         setPurchasecart(purchasecartdata)
      } else{

      }      
    }

    useEffect(()=>{
      handlepurchasecartdata()
    },[click])
    const handleChange = (e) => {
      setPurchaseCartData({...purchasecartData,[e.target.name]:e.target.value})
    }
    const handleProducts = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch("/getpurchaseproduct", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
          //  console.log(data);
           setproduct(data)
           
    }


    const handleSuppliers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch("/getsupplier", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
          setsupplier(data)
           
    }


    useEffect(()=> {
        handleProducts();
        handleSuppliers()
      },[])


    const handledropdownitem = (itemname,itemid) => {
      setselectproductname(itemname)
      setselectedproductid(itemid)
        }
    const handledropdowntax = (itemname,itemid) => {
      settaxdropname(itemname)
      settaxdropid(itemid)
        }


    const handledropdownsupplier = (itemname,itemid) => {
      setselectsuppliername(itemname)
      setselectedsupplierid(itemid)
        }
    const handledropdownaccountactivity = (itemname,itemid) => {
      setselectedaccountactivityname(itemname)
      setselectedaccountactivityid(itemid)
        }



    const handlepurchasecart = async () => {

      const {purchasecartquantity,purchasecartcurrentpurchaseprice ,purchasecartsalesdata ,companyid ,branchid ,userid , purchasecartpreviouspurchaseprice ,purchasecartdescription,purchasecartmanufacturedate ,purchasecartexpirydate} = purchasecartData;


      const response = await fetch('/addpurchasecart',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
          productid:selectedproductid,
          purchasecartquantity,
          purchasecartcurrentpurchaseprice,
          companyid,
          branchid,
          userid,
          purchasecartdescription,
          saletax:allsaletax,
          discount,
          nettotal:productnet
        })
        })

        if(response.ok){
          console.log("SUCCESS");
          setClick((prev)=>prev+1)
          seterror(false)
          setdiscount('')
          
        }else{
          seterror(true)
          console.log("ERROR");
        }
    }

    const handledropdownsaletax = (itemname,itemid) => {
      setitemtaxname(itemname)
      setitemtaxid(itemid)
        }

  return (
    <>
    <div className="container my-2 ">
    <div className="row mx-2" >
    <div className="col-12 text-center p-2 branchtitle"><h3>New Purchase Cart</h3></div>
    <div className="col-12">
      <div className="row my-2 borderforgroup">
    <div className="col-md-2">
      <h1 className='text-center text-danger'>{error?"Already Exist Product":""}</h1>
          <span>Product</span>
    <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden',height:'33px'}} variant="dark" >
       {selectedproductname ? selectedproductname : "item"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { product.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownitem(ele.productname,ele.productid)} key={product.value}>{ele.productname}</Dropdown.Item>
            ))}
            <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createproduct'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </div>            
            <div className="col-md-3 my-2">
            <span>Description</span>
              <input type="text" onChange={handleChange} placeholder="Description" className='customerinput' name='purchasecartdescription' value={purchasecartData.purchasecartdescription}/>
            </div>
     
            <div className="col-md-1 my-2">
            <span>Quantity</span>
              <input type="number" placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productquantity || ''
      : ''
  } className='customerinput' name='purchasecartquantity' value={purchasecartData.purchasecartquantity} onChange={handleChange}/>
            </div>
            {/* <div className="col-md-1 my-2">
              <span>P Price</span>
              <input type="text" placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productpreviouspurchaseprice || ''
      : ''
  } className='customerinput' onChange={handleChange} name='purchasecartpreviouspurchaseprice' value={purchasecartData.purchasecartpreviouspurchaseprice}/>
              </div> */}
            <div className="col-md-1 my-2">
            <span>Price</span>
              <input type="number" onChange={handleChange} placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productcurrentpurchaseprice || ''
      : ''
  }className='customerinput' name='purchasecartcurrentpurchaseprice' value={purchasecartData.purchasecartcurrentpurchaseprice}/>
            </div>
            {/* <div className="col-md-2 my-2">
            <span>Sale Unit Price</span>
              <input type="text" onChange={handleChange} placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productsalesdata || ''
      : ''
  }className='customerinput' name='purchasecartsalesdata' value={purchasecartData.purchasecartsalesdata}/>
            </div> */}
            <div className="col-md-1 my-2">
            <span>Discount</span>
              <input type="text" onChange={(e)=>setdiscount(e.target.value)} value={discount} className='customerinput' placeholder='0.00' />
            </div>     
              <div className="col-md-2 my-2">
              <span>Sale Tax</span>
            <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden',height:'33px'}} variant="dark" >
       {itemtaxname ? itemtaxname : " Tax"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { itemtaxpercen.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsaletax(ele.value,ele.id)} key={product.value}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
            </div><div className="col-md-1 my-2">
            <span>Sale Tax</span>
              <input type="text" readOnly value={ Math.round(allsaletax)} className='customerinput' placeholder='0.00' />
            </div> 
            <div className="col-md-1 my-2">
            <span>Net.</span>
              <input type="text" readOnly value={ Math.round(productnet)} className='customerinput'/>

            </div>
            <div className="col-12 my-2">
              <button className="btnb btn-outline-dark" style={{width:"100%"}} onClick={handlepurchasecart}> Add To Cart </button>
            </div>
            <div className="col-12">
            <div className="table">
        <div className="">
        </div>
    <TableContainer className='tablehead' component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className='bg-dark'>
                <TableRow>
                  <TableCell className='text-white'>Name</TableCell>
                  <TableCell align="right" className='text-white'>Quantity</TableCell>
                  <TableCell align="right" className='text-white'>Price</TableCell>
                  <TableCell align="right" className='text-white'>Discount</TableCell>
                  <TableCell align="right" className='text-white'>Sale Tax</TableCell>
                  <TableCell align="right" className='text-white'>Net Total</TableCell>
                  <TableCell align="right" className='text-white'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredUsers.length===0?
                  purchasecart.map((row) => ( 
                    <TableRow
                    key={row.productid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                      {product.map((ele)=>(ele.productid==row.productid?ele.productname:""))}
                    </TableCell>
                    <TableCell align="right">{row.purchasecartquantity}</TableCell>
                    <TableCell align="right">{row.purchasecartcurrentpurchaseprice}</TableCell>
                    <TableCell align="right">{Math.round(row.discount)}</TableCell>
                    <TableCell align="right">{ Math.round(row.saletax)}</TableCell>
                    <TableCell align="right">{ Math.round(row.nettotal)}</TableCell>
                     <TableCell align="right"><button className='btn btn-outline-primary' onClick={()=>handleedit(row.purchasecartid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.purchasecartid)}>Del</button> </TableCell>
                  </TableRow>
                )):
                filteredUsers.map((row) => ( 
                  <TableRow
                  key={row.productid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="row">
                    {row.productid}
                  </TableCell>
                  <TableCell align="right">{row.productname}</TableCell>
                  <TableCell align="right">{row.productweight}</TableCell>
                  <TableCell align="right">{row.productprice}</TableCell>
                  <TableCell align="right">{row.productsupplier}</TableCell>
                  <TableCell align="right">{row.productsalesdata}</TableCell>
                  <TableCell align="right"><button className='btn btn-outline-primary' onClick={()=>handleedit(row.productid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.productid)}>Del</button> </TableCell>
                </TableRow>
                ))
                
                }
              </TableBody>
            </Table>
          </TableContainer>
    </div>
            </div>
            </div>
            </div>
            <div className="col-12 my-2">
              <div className="row"> 
              <div className="col-2"></div>
                <div className="col-10">
            <div className="col-12">
                <div className="card text-bg-light mb-3" style={{maxWidth:"80%"}}>
                  <div className="row">
<div className="col-12">
   <div className="card-header">
    
    <Dropdown className=''>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
       {selectedsuppliername ? selectedsuppliername : "Supplier"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { supplier.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsupplier(ele.suppliername,ele.supplierid)} key={supplier.value}>{ele.suppliername}</Dropdown.Item>
          ))}
                    <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createsupplier'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    
  </div>
  </div>

  </div>
  <div className="col-12 mx-1">
    <div className="row">
          <div className="col-md-6">
    <p style={{fontWeight:'bold',display:'inline-block'}}>Contact No. : </p>
    <p style={{display:'inline-block'}}>{supplier.map((ele)=>(ele.supplierid == selectedsupplierid ?ele.suppliercontact:null))}</p>
    <br />
    <p style={{fontWeight:'bold',display:'inline-block'}}>Supplier Address : </p>
    <p style={{display:'inline-block'}}> {supplier.map((ele)=>(ele.supplierid == selectedsupplierid ?ele.supplieraddress:null))}</p>
          </div>
          <div className="col-md-6">
            <div>

    <p style={{fontWeight:'bold',display:'inline-block',width:'25%'}} className='mx-1'>Bill No.</p>
    <input type="text" style={{display:'inline-block',width:'70%'}}/>
            </div>
            <div>

    <p style={{fontWeight:'bold',display:'inline-block',width:'25%'}} className='mx-1' >Invoice Date</p>
    <input type="date" onChange={(e)=>setinvoicedate(e.target.value)} style={{display:'inline-block',width:'70%'}}/>
            </div>
          <div>
            
    <p style={{fontWeight:'bold',display:'inline-block',width:'25%'}} className='mx-1'>Term Days</p>
    <input type="number" style={{display:'inline-block',width:'70%'}}/>
          </div>
          <div>

         
            <p style={{fontWeight:'bold',display:'inline-block',width:'25%'}} className='mx-1'>Due Date</p>
              <input type="date" style={{display:'inline-block',width:'70%'}} onChange={(e)=>setduedate(e.target.value)}/>
          </div>
          
          </div>
    </div>
  </div>
<hr />
  <div className="card-body">
    <div className="row">
      <div className="col-md-6">

    <p className="card-title my-1">Sub Total</p>
    <p className="card-text"><input type="text" value={`${ Math.round(subtotal)}`} readOnly className='customerinput'/></p>
  
    <p className="card-title">Sale Tax</p>
    <p className="card-text"><input type="text" value={`${ Math.round(saletax)}`} readOnly className='customerinput'/></p>
  
    <p className="card-title">Shipping fee</p>
    <p className="card-text"><input type="number" placeholder='Shipping Fee' onChange={(e)=>setShippingFee(e.target.value)} className='customerinput'/></p>

    <p style={{fontWeight:'bold'}} className="card-title ">Order Total</p>
    <p className="card-text"><input type="number" readOnly value={`${ Math.round(orderTotal)}`}  className='customerinput'/></p>
    <p><input type="checkbox" onChange={(e)=>setIsChecked(e.target.checked)}/> Is Payment Paid? ({isChecked?"Paid":"Not Paid"})</p>
   
    </div>
    <div className="col-md-6 my-2">
    <div className="row">
      <div className="col-md-6 ">
    { isChecked &&
    <>
    <span>Select Bank</span>
  <Dropdown  className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {accountactivitynameselected ? accountactivitynameselected : "Account"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { accountactivity.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownaccountactivity(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={accountactivity.value}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
    </>
    }
    </div>
    <div className="col-md-6">
    { isChecked &&
    <>
    <span>WHT Tax</span>
  <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {taxdropname ? taxdropname : "WHT Tax"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { taxdrop.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdowntax(ele.value,ele.id)} key={ele.id}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
    </>
    }
    </div>
    <div className="col-md-12">
    {
      isChecked &&
      <>
      <p className="card-title my-2">Income Tax</p>
    <p className="card-text"><input type="number" readOnly value={`${ Math.round(incometax)}`}  className='customerinput'/></p>
    <span>Notes</span>
    <textarea name="" id="" cols="45" style={{width:'100%'}} rows="5"></textarea>
      </>
    }
    </div>
    </div>
  </div>
          <button className="btn btn-outline-dark" style={{width:"100%"}} onClick={handleCheckout}>Checkout</button>
          </div>
  </div>
</div>
</div>
            </div>
              </div>
            </div>
           
            
            </div>
            </div>
    </>
  )
}

export default Purchasecart