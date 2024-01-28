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
const Salecart = () => {
    const [purchasecart,setPurchasecart] = useState([])
    const [isChecked,setIsChecked] = useState(false)    
    const [purchasecartquantitysum,setpurchasequantitysum] = useState([])
    const [error,seterror] = useState(false)
    const [orderTotal,setOrdertotal] = useState("")
    const [subtotal,setSubtotal] = useState("")
    const [shippingfee,setShippingFee] = useState("")
    const [invoicedate,setinvoicedate] = useState('')
    const [filteredUsers,setFilteredUsers] = useState([])
    const [click,setClick] = useState(0)
    const [duedate,setduedate] = useState('')
    const [searchData,setSearchData] = useState('')
    const [productnet,setproductnet] = useState('')
    const [message,setMessage] = useState(false)
    const [selectedproductname,setselectproductname] = useState('')
    const [selectedsuppliername,setselectsuppliername] = useState('')
    const [purchasecartData,setPurchaseCartData] = useState({purchasecartquantity:"",purchasecartsalesdata:"",companyid:"",branchid:"",userid:""})
    const [selectedproductid,setselectedproductid] = useState('')
    const [discount,setdiscount] = useState('')
    const [description,setdescription] = useState('')
    const [allsaletax,setallsaletax] = useState('')
    const [itemtax,setitemtax] = useState('')
    const [selectedsupplierid,setselectedsupplierid] = useState('')
    const [product,setproduct] = useState([])
    const [itemtaxpercen,setitemtaxpercen] = useState([{id:0,value:'No - Tax'},{id:17,value:'PB - 17%'},{id:18,value:'PB - 18%'}])
    const [itemtaxname,setitemtaxname] = useState('')
    const [itemtaxid,setitemtaxid] = useState('')
    const [supplier,setsupplier] = useState([])
    const [bank,setbank] = useState([])
    const [bankname,setbankname] = useState('')
    const [bankid,setbankid] = useState('')
    const [taxdropname,settaxdropname] = useState('')
    const [taxdropid,settaxdropid] = useState(0)
    const [taxdrop,setTaxdrop] = useState([{id:0, value:"No - Tax"},{id:5, value:"5%"},{id:5.5, value:"5.5%"},{id:6, value:"6%"},{id:8, value:"8%"},{id:9, value:"9%"},{id:10, value:"10%"},{id:12, value:"12%"}])
    const [incometax,setincometax] = useState("")
    const navigate = useNavigate()


  const handleCheckout = async () => {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     let bodyContent = JSON.stringify({
      supplierid:selectedsupplierid,
      companyid:"2",
      payment:isChecked,
      ordertotal: Math.round(orderTotal),
      branchid:"2",
      totalamount: Math.round(orderTotal),
      invoicedate:invoicedate,
      userid:localStorage.getItem('userid'),
      saletax: Math.round(allsaletax),
      shippingfee: Math.round(shippingfee),
      subtotalamount: Math.round(subtotal),
      incometax:isChecked? Math.round(incometax):null,
      customerinvoicedescription:description,
      duedate:duedate,
      bankid
     });
     
     let response = await fetch("/addsalecheckout", { 
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
    setproductnet( parseInt((purchasecartData.purchasecartquantity*purchasecartData.purchasecartsalesdata),10)  - parseInt(discount?discount>productnet?0:discount:0,10))
  },[discount,itemtax,description,purchasecartData.purchasecartquantity,purchasecartData.purchasecartsalesdata])

  const handlediscount = (e) => {
    setdiscount(e.target.value)
    
    if(discount > parseInt((purchasecartData.purchasecartquantity*purchasecartData.purchasecartsalesdata))){

      setdiscount('')
    }else{
    }
  }

  const handledropdowntax = (itemname,itemid) => {
    settaxdropname(itemname)
    settaxdropid(itemid)
      }
  const handledropdownbank = (itemname,itemid) => {
    setbankname(itemname)
    setbankid(itemid)
      }
  useEffect(()=>{
    const sumquantity =async () => {
  let quantity =purchasecart.length>0?purchasecart.map((ele)=>(ele.salequantity *  ele.saleunitprice)):""
  setpurchasequantitysum(quantity)
    }
    console.log("allsaletax",allsaletax);
    let saletax = purchasecart.length > 0?purchasecart.map((ele)=>(ele.saletax)):""
    setallsaletax(saletax.length>0? saletax.reduce((accumulator,currentValue)=>(accumulator + parseInt(currentValue,10)),0):0)
   sumquantity()
   
  },[purchasecart])
  

useEffect(()=>{
setOrdertotal(subtotal + allsaletax + Number(shippingfee))
setincometax(Math.floor(orderTotal*taxdropid/100))
},[shippingfee,taxdropid,incometax])
  useEffect(()=>{
    setSubtotal(purchasecartquantitysum.length>0? purchasecartquantitysum.reduce((accumulator,currentValue)=>(accumulator + parseInt(currentValue,10)),0):0)
  },[purchasecartquantitysum])
    const filterContent = (e) => {
      const searchValue = e.target.value;
      setSearchData(searchValue);
      const newUsers = product.filter((user) => user.productid == searchValue);
      setFilteredUsers(newUsers);
    };
    const handleedit = (ids) => {      
      navigate(`/editproduct/${ids}`);
      }
      const handledelete = async (id) => {
        let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json",
         }
         
         let response = await fetch(`/deletesalecartcart/${id}`, { 
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
       
       let response = await fetch("/getsalecart", { 
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
           
           let response = await fetch("/getsaleproducts", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
          //  console.log(data);
           setproduct(data)
    }
    const handlebank = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch("/getaccountasset", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           setbank(data)
    }


    const handleSuppliers = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
           }
           
           let response = await fetch("/getcustomers  ", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
          setsupplier(data)
           
    }


    useEffect(()=> {
        handleProducts();
        handleSuppliers()
        handlebank()
      },[])


    const handledropdownitem = (itemname,itemid) => {
      setselectproductname(itemname)
      setselectedproductid(itemid)
        }

    const handledropdownsaletax = (itemname,itemid) => {
      setitemtaxname(itemname)
      setitemtaxid(itemid)
        }


    const handledropdownsupplier = (itemname,itemid) => {
      setselectsuppliername(itemname)
      setselectedsupplierid(itemid)
      console.log(selectedsupplierid);
      console.log(selectedsuppliername);
        }



    const handlepurchasecart = async () => {

      const {purchasecartquantity,purchasecartsalesdata ,companyid ,branchid ,userid} = purchasecartData;


      const response = await fetch('/addsalecart',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
          productid:selectedproductid,
          purchasecartquantity,
          purchasecartsalesdata,
          companyid,
          branchid,
          userid,
          discount,
          description,
          itemtax,
          productnet
        })
        })

        if(response.ok){
          console.log("SUCCESS");
          setClick(click+1)
          seterror(false)
          setPurchaseCartData({purchasecartquantity:"",purchasecartsalesdata:""})
          setitemtax('')
          setdiscount('')
          setproductnet('')
        }else{
          seterror(true)
          console.log("ERROR");
        }
    }
    useEffect(()=>{
      setitemtax((purchasecartData.purchasecartquantity * purchasecartData.purchasecartsalesdata) * itemtaxid / 100)
    },[itemtaxid])


  return (
    <>
    <div className="container my-2 ">
    <div className="row mx-2" >
    <div className="col-12 text-center p-2 branchtitle"><h3>New Sale Cart</h3></div>
    <div className="col-12">
      <div className="row my-2 borderforgroup">
        <div className="col-12">
          
      <h1 className='text-center text-danger'>{error?"Already Exist in Cart":""}</h1>
        </div>
    <div className="col-lg-3">
         <span>Product</span>
    <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" >
       {selectedproductname ? selectedproductname : " Select Product"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { product.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownitem(ele.productname,ele.productid)} key={product.value}>{ele.productname}</Dropdown.Item>
            ))}
            <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createproduct'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </div> <div className="col-lg-3 my-2">
            <span>Discription</span>
              <input type="text" value={description} onChange={(e)=>setdescription(e.target.value)} placeholder={`Description`}className='customerinput' />
            </div>
            <div className="col-lg-3 my-2">
            <span>Product Quantity</span>
              <input type="text" placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productquantity || ''
      : ''
  } className='customerinput' name='purchasecartquantity' value={purchasecartData.purchasecartquantity} onChange={handleChange}/>
            </div>
            
            <div className="col-lg-3 my-2">
            <span>Sale Unit Price</span>
              <input type="text" onChange={handleChange} placeholder={
    selectedproductid
      ? product.find((ele) => ele.productid === selectedproductid)?.productsalesdata || ''
      : ''
  }className='customerinput' name='purchasecartsalesdata' value={purchasecartData.purchasecartsalesdata}/>
            </div>
           
            <div className="col-lg-3 my-2">
            <span>Discount</span>
              <input type="number" value={discount} onChange={handlediscount} placeholder={`0.00`}className='customerinput' />
            </div>
            <div className="col-lg-3 my-2">
              <div className="row">
                <div className="col-6">
                  <span>Tax</span>
            <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" >
       {itemtaxname ? itemtaxname : " Tax"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { itemtaxpercen.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsaletax(ele.value,ele.id)} key={product.value}>{ele.value}</Dropdown.Item>
          ))}
          
      </Dropdown.Menu>
    </Dropdown>
          </div>
          <div className="col-6">

            <span>Sale Tax</span>
              <input type="number" value={itemtax} placeholder={`0.00`}className='customerinput' />
          </div>
        </div>
            </div>

            <div className="col-lg-6 my-2">
            <span>Net.</span>
              <input type="text"  placeholder={`${productnet}`} value={productnet} className='customerinput' />
            </div>
             <div className="col-12">
              <button className="my-2 btn btn-outline-dark" style={{width:"100%"}} onClick={handlepurchasecart}> Add to cart </button>
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
                  <TableCell className='text-white' align="right">Quantity</TableCell>
                  <TableCell className='text-white' align="right">Sale price</TableCell>
                  <TableCell className='text-white' align="right">Sale Tax</TableCell>
                  <TableCell className='text-white' align="right">Discount</TableCell>
                  <TableCell className='text-white' align="right">Net.</TableCell>
                  <TableCell className='text-white' align="right">Action</TableCell>
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
                    <TableCell align="right">{row.salequantity}</TableCell>
                    <TableCell align="right">{row.saleunitprice}</TableCell>
                    <TableCell align="right">{row.saletax}</TableCell>
                    <TableCell align="right">{row.discount}</TableCell>
                    <TableCell align="right">{row.nettotal}</TableCell>
                     <TableCell align="right"><button className='btn btn-outline-primary' onClick={()=>handleedit(row.productid)}>Edit</button> <button className='btn btn-outline-danger' onClick={()=>handledelete(row.productid)}>Del</button> </TableCell>
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
              <div className="col-2"></div>
            <div className="col-10 my-2">
              <div className="row">
                <div className="col-12">
                <div className="card text-bg-light mb-3" style={{maxWidth:"70%"}}>
  <div className="card-header">
    <div className="row">
      <div className="col-lg-6">
    <Dropdown className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedsuppliername ? selectedsuppliername : " Select Customer"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        { supplier.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownsupplier(ele.customername,ele.cutomercode)} key={supplier.value}>{ele.customername}</Dropdown.Item>
          ))}
          <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createcustomers'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
    </div>
  </div>
  <div className="col-12 mx-1">
    <div className="row">
      <div className="col-lg-6">
          <div className="row ">
          <div className="col-lg-6 ">
    <p style={{fontWeight:'bold'}}>Contact No.</p>
    <p >{supplier.map((ele)=>(ele.cutomercode == selectedsupplierid ?ele.customerphone:null))}</p>
    <p style={{fontWeight:'bold'}}>Supplier Address</p>
    <p >{supplier.map((ele)=>(ele.cutomercode == selectedsupplierid ?ele.customeraddress:null))}</p>
          </div>
          <div className="col-lg-6 ">
    <p style={{fontWeight:'bold'}}>Credit limit</p>
    <p >{supplier.map((ele)=>(ele.cutomercode == selectedsupplierid ?ele.customercreditlimit:null))} Rs.</p>
    <p style={{fontWeight:'bold'}}>Balance</p>
    <p >{supplier.map((ele)=>(ele.cutomercode == selectedsupplierid ?ele.openingbalance:0))}</p>
          </div>

          </div>
      </div>
          <div className="col-lg-6">
            <div>
            <p className='d-inline-block' style={{width:'30%'}}>Invoice Date</p>
              <input type="date" onChange={(e)=>setinvoicedate(e.target.value)} placeholder="Manufacture Date" style={{width:'65%'}} className='mx-1 my-1 d-inline-block' />
            </div>
              <div>
            <p style={{width:'30%'}} className='d-inline-block'>Term Days</p>
            <input
  type="number"
  onChange={handleChange}
  placeholder={supplier
    .map((ele) => (ele.cutomercode === selectedsupplierid ? ele.customerpaymentterm : ""))
    .join("")} 
  style={{ width: '65%' }}
  className='mx-1 my-1 d-inline-block'
  name='purchasecartmanufacturedate'
  value={purchasecartData.purchasecartmanufacturedate}
/>

              </div>
              <div>
            <p style={{width:'30%'}} className='d-inline-block'>Due Date</p>
              <input type="date" onChange={(e)=>setduedate(e.target.value)} placeholder="Manufacture Date" style={{width:'65%'}} className='d-inline-block mx-1 my-1' />
              </div>
              <div>
            <p className='d-inline-block' style={{width:'30%'}}>Doc. No.</p>
              <input type="number" onChange={handleChange} placeholder="Doc. No." style={{width:'65%'}} className='mx-1 my-1 d-inline-block' name='purchasecartmanufacturedate' value={purchasecartData.purchasecartmanufacturedate}/>
              </div>
          </div>
    </div>
  </div>
  <hr />
  <div className="card-body">
    <div className="row">
<div className="col-lg-6">

    <p className="card-title my-1">Sub Total</p>
    <p className="card-text"><input type="text" value={`${subtotal}`} readOnly className='customerinput'/></p>

    <p className="card-title">Sale Tax</p>
    <p className="card-text"><input type="number" placeholder='Shipping Fee' value={allsaletax} className='customerinput'/></p>
    <p className="card-title">Shipping fee</p>
    <p className="card-text"><input type="number" placeholder='Shipping Fee' onChange={(e)=>setShippingFee(e.target.value)} className='customerinput'/></p>

    <h5 className="card-title ">Order Total</h5>
    <p className="card-text"><input type="number" readOnly value={`${orderTotal}`}  className='customerinput'/></p>
    <p><input type="checkbox" onChange={(e)=>setIsChecked(e.target.checked)}/> Is Payment Paid? ({isChecked?"Paid":"Not Paid"})</p>
    </div>
    <div className="col-lg-6">
    {isChecked&&
    <>
    <div className="row">
    <div className='col-lg-6'>

        <Dropdown className='my-4'>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {taxdropname ? taxdropname : "Income Tax"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { taxdrop.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdowntax(ele.value,ele.id)} key={ele.id}>{ele.value}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
          </div>
    <div className='col-lg-6'>

        <Dropdown className='my-4'>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {bankname ? bankname : "Bank & Cash"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { bank.map((ele)=>(
          <Dropdown.Item onClick={()=>handledropdownbank(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={ele.accountsubcontrolid}>{ele.accountsubcontrolname}</Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
          </div>
    </div>
    <p className=" card-title mx-1">Tax</p>
    <p className="card-text "><input type="number" readOnly value={`${incometax}`}  className='customerinput'/></p>
    
    <div className="col-lg-12">
            <span >Customer Invoice Note</span>
            <textarea  style={{width:'100%',height:'100%'}} rows={5} onChange={(e)=>setdescription(e.target.value)} className='customerinput'></textarea>
          </div>
    </>
    }
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
    </>
  )
}

export default Salecart