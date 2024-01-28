import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
import './product.css'
const Product = () => {
    const [option,setOption] = useState([])
    const [selectedtitem,setSelectedItem] = useState('')
    const [suppliername,setsuppliername] = useState('')
    const [supplierid,setsupplierid] = useState('')
    const [customername,setcustomername] = useState('')
    const [customerid,setcustomerid] = useState('')
    const [selectedtitemglsale,setSelectedItemglsale] = useState('')
    const [selectedtitemstock,setSelectedItemstock] = useState('')
    const [selectedtitemcos,setSelectedItemcos] = useState('')
    const [selectedtitemunit,setSelectedItemunit] = useState('')
    const [selectedtitem2,setSelectedItem2] = useState('')
    const [producttype,setproducttype] = useState([])
    const [suppliers,setsuppliers] = useState([])
    const [customers,setcustomers] = useState([])
    const [unitofmeasure,setunitofmeasure] = useState([])
    const [glsalesaccount,setglsalesaccount] = useState([])
    const [stockaccount,setstockaccount] = useState([])
    const [cosaccount,setcosaccount] = useState([])
    const [selectedtitemid,setSelectedItemid] = useState('')
    const [selectedtitemglsaleid,setSelectedItemglsaleidid] = useState('')
    const [selectedtitemstockid,setSelectedItemstockid] = useState('')
    const [selectedtitemcosid,setSelectedItemcosid] = useState('')
    const [selectedtitemunitid,setselectedtitemunitid] = useState('')
    const [selectedtitemid2,setSelectedItemid2] = useState('')
  const [productData,setproductData] = useState({productname:"",productdescription:"",productprice:"",productavailability:"",productweight:"",productsupplier:"",productsalesdata:"",productquantity:"",productpreviouspurchaseprice:"",
  productcurrentpurchaseprice:"",productmanufacturedate:"",productexpirydate:"",minimumstocklevel:'',reorderquantity:'',partnumber:'',productlocation:'',productposition:''})
  const navigate = useNavigate()
  const handleChange = (e) =>{
      setproductData({...productData,[e.target.name]:e.target.value})
      console.log(productData);
  }
  const handleSubmit =async (e) => {

    e.preventDefault()
    
    const {productname,productdescription,
        productprice,productavailability,productweight,
        productsupplier,productsalesdata,productquantity,productpreviouspurchaseprice,
        productcurrentpurchaseprice,productmanufacturedate,productexpirydate,minimumstocklevel,reorderquantity,partnumber,productlocation,productposition} = productData;

    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
       }
       
       let bodyContent = JSON.stringify({
       productname,productcategory:selectedtitemid,
        productdescription,productunitofmeasure:selectedtitemunit,
        productprice,productavailability,productweight,
        productsupplier,productsalesdata,productquantity,productpreviouspurchaseprice,
        productcurrentpurchaseprice,productmanufacturedate,productexpirydate,
        producttypeid:selectedtitemid2,minimumstocklevel,reorderquantity,
        supplierid:supplierid,
        customerid:customerid,
        partnumber,
        unitofmeasure:selectedtitemunit,
        glsaleaccount:selectedtitemglsaleid,
        glinventoryaccount:selectedtitemstockid,
        glcosaccount:selectedtitemcosid,
        productlocation,
        productposition
        
    });
       
       let response = await fetch("/addproduct", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.json();
       console.log(data);
       navigate('/product')
}

const handleProductCategory = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
       }
       
       let response = await fetch("/getproductscategory", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setOption(data)
       console.log(option);
}

const handleunitofmeasure = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
       }
       
       let response = await fetch("/getunitofmeasure", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setunitofmeasure(data)
       console.log(data);
}
const handleProductType = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
       }
       
       let response = await fetch("/getproducttype", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setproducttype(data)
       console.log(producttype);
}
useEffect(()=> {

    handlecustomer()
    handlesuppliers()
    handlestockaccounts()
    handleglsaleaccounts()
    handlecosaccounts()
    handleProductType();
},[])
useEffect(()=> {
    handleProductCategory();
},[producttype.length])
useEffect(()=> {
    handleunitofmeasure()
},[option.length])

const handleglsaleaccounts = async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getglsaleaccounts", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setglsalesaccount(data)
       
}
const handlestockaccounts = async () => {

    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getstockaccount", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setstockaccount(data)
       
}
const handlecosaccounts = async () => {

    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
       
       let response = await fetch("/getcosaccount", { 
         method: "GET",
         headers: headersList
       });
       
       let data = await response.json();
       setcosaccount(data)
       
}
const handlesuppliers = async () => {

let headersList = {
 "Accept": "*/*",
 "Content-Type": "application/json"
}

let response = await fetch("/getsupplier", { 
  method: "GET",
  headers: headersList
});

let data = await response.json();
setsuppliers(data)
}
const handlecustomer = async () => {

let headersList = {
 "Accept": "*/*",
 "Content-Type": "application/json"
}

let response = await fetch("/getcustomers", { 
  method: "GET",
  headers: headersList
});

let data = await response.json();
setcustomers(data)
}

const handledropdownitem = (itemname,itemid) => {
setSelectedItem(itemname)
setSelectedItemid(itemid)
}
const handledropdownsupplier = (itemname,itemid) => {

setsuppliername(itemname)
setsupplierid(itemid)
}
const handledropdowncustomer = (itemname,itemid) => {

setcustomername(itemname)
setcustomerid(itemid)
}
const handledropdownitem2 = (itemname,itemid) => {
setSelectedItem2(itemname)
setSelectedItemid2(itemid)
}
const handledropdownitemunit = (itemname,itemid) => {
setSelectedItemunit(itemname)
setselectedtitemunitid(itemid)
}
const handledropdownglsale = (itemname,itemid) => {

setSelectedItemglsale(itemname)
setSelectedItemglsaleidid(itemid)
}
const handledropdownstockaccount = (itemname,itemid) => {

setSelectedItemstock(itemname)
setSelectedItemstockid(itemid)
}
const handledropdowncos = (itemname,itemid) => {

setSelectedItemcos(itemname)
setSelectedItemcosid(itemid)
}


  return (
    <>
     <div className="container">
        <div className="row p-4">
            <div className="col-1"></div>
            <div className="col-md-10 ">
                <div className="row p-4 jborder">
            <div className="col-12">
    <h4 className='text-center producttitle'>Create Product</h4>
            </div>
        <div className="col-md-3 my-1">
            <span >Product Name</span>
                <input type="text" value={productData.productname}  onChange={handleChange} className="customerinput" name='productname'/>
        </div>
        <div className="col-md-3 my-1">
            <span >SKU / Part Number</span>
                <input type="text" value={productData.partnumber}  onChange={handleChange} className="customerinput" name='partnumber'/>
        </div>        <div className="col-md-6 my-1">
        <span >Product Description</span>


        <input type="text" value={productData.productdescription} onChange={handleChange}    className=" customerinput" name='productdescription' />
        </div>
        <div className="col-md-6 my-1">
        <div className="row">
            <div className="col-md-8">
                <div className="row">
    <div className="col-md-6">

        <span >Category</span>
                {/* <input type="text" value={productData.productcategory} placeholder='product Category' onChange={handleChange} className="customerinput" name='productcategory'/> */}
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitem ? selectedtitem : " Category"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { option.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownitem(ele.productcategoryname,ele.productcategoryid)} key={option.value} href="#option1">{ele.productcategoryname}</Dropdown.Item>
            ))}
            <Dropdown.Item className='border text-primary'> <Link style={{textDecoration:'none'}} to={'/createproductcategory'}>+ Add New</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </div>
            <div className="col-md-6">

        <span >Unit Of Measure</span>
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitemunit ? selectedtitemunit : "Unit"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { unitofmeasure.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownitemunit(ele.unittitle,ele.unitofmeasureid)} key={option.value}>{ele.unitname}</Dropdown.Item>
            ))}
            <Dropdown.Item onClick={()=>navigate('/createunitofmeasure')} className='border text-primary my-2'>+ Add new </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </div>
            </div>
            </div>
            <div className="col-md-4">

        <div className="customerform">          
        <span >Product Type</span>
            
                {/* <input type="text" value={productData.productcategory} placeholder='product Category' onChange={handleChange} className="customerinput" name='productcategory'/> */}
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitem2 ? selectedtitem2 : " Select Type"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { producttype.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownitem2(ele.producttypename,ele.producttypeid)} key={producttype.value} href="#option1">{ele.producttypename}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
            </div>
                       </div>
        </div>
        <div className="col-md-6 my-1">
        <div className="row">
            <div className="col-md-8">
                <div className="row">
    <div className="col-md-6">

        <span >GL Sales Account</span>
                {/* <input type="text" value={productData.productcategory} placeholder='product Category' onChange={handleChange} className="customerinput" name='productcategory'/> */}
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitemglsale ? selectedtitemglsale : " Sale Account"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { glsalesaccount.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownglsale(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={glsalesaccount.value} href="#option1">{ele.accountsubcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
            </div>
            <div className="col-md-6">

        <span >GL Inventory Acc</span>
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitemstock ? selectedtitemstock : "Inventory Acc"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { stockaccount.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownstockaccount(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={option.value}>{ele.accountsubcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
            </div>
            </div>
            </div>
            <div className="col-md-4">

        <div className="customerform">          
        <span >GL COS Account</span>
            
                {/* <input type="text" value={productData.productcategory} placeholder='product Category' onChange={handleChange} className="customerinput" name='productcategory'/> */}
                <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {selectedtitemcos ? selectedtitemcos : " Select Type"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { cosaccount.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdowncos(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={cosaccount.value}>{ele.accountsubcontrolname}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
            </div>
                       </div>
        </div>

        {/* <div className="col-md-6 my-1">
        <span >Product Unit Of Measure</span>

            <input type="text" value={productData.productunitofmeasure} onChange={handleChange}   className="customerinput" name='productunitofmeasure' />
        </div> */}
        {/* <div className="col-md-6 my-1">
        <span >Product Price</span>

            <input type="text" value={productData.productprice}  onChange={handleChange}   className="customerinput" name='productprice' />
        </div> */}
        {/* <div className="col-md-6 my-1">
        <span >Product Availability</span>

            <input type="text" value={productData.productavailability}  onChange={handleChange}   className="customerinput"  name='productavailability'/>

        </div> */}
         <div className="col-md-3 my-1">
        <span >Product Weight</span>

            <input type="text" value={productData.productweight} onChange={handleChange}    className="customerinput" name='productweight' />
            </div>
            <div className="col-md-3 my-1">
        <span >Opening Quantity</span>

            <input type="text" value={productData.productquantity} onChange={handleChange}    name='productquantity' className="customerinput" />

        </div>
        {/*
        <div className="col-md-6 my-1">
        <span >Product Supplier</span>

            <input type="text" value={productData.productsupplier}  onChange={handleChange}  name='productsupplier'  className="customerinput" />

        </div> */}
        <div className="col-md-3 my-1">
        <span >Product Sales Price</span>

            <input type="text" value={productData.productsalesdata} onChange={handleChange}    name='productsalesdata' className="customerinput" />

        </div>
        
        <div className="col-md-3 my-1">
        <span >Product Purchase Price</span>

            <input type="text" value={productData.productpreviouspurchaseprice} onChange={handleChange}    name='productpreviouspurchaseprice' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span >Product Current Price</span>

            <input type="text" value={productData.productcurrentpurchaseprice} onChange={handleChange}    name='productcurrentpurchaseprice' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span >Min Stock level</span>

            <input type="number" value={productData.minimumstocklevel} onChange={handleChange}    name='minimumstocklevel' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span >Re-order Quantity</span>

            <input type="number" value={productData.reorderquantity} onChange={handleChange}    name='reorderquantity' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span >Product Manufacture Date</span>

            <input type="date" value={productData.productmanufacturedate}  onChange={handleChange}    name='productmanufacturedate' className="customerinput" />

        </div>
        <div className="col-md-3 my-1">
        <span >Product Expiry Date</span>

            <input type="date" value={productData.productexpirydate} onChange={handleChange}    name='productexpirydate' className="customerinput" />

        </div>
        {!selectedtitem2=='' && selectedtitem2!='sale' &&
        <div className="col-md-3 my-1">
            <span>Preferred Supplier</span>
        <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {suppliername ? suppliername : "Supplier"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { suppliers.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdownsupplier(ele.suppliername,ele.supplierid)} key={cosaccount.value}>{ele.suppliername}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
        }
        {selectedtitem2=='sale' &&
        <div className="col-md-3 my-1">
            <span>Buyer</span>
        <Dropdown>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {customername ? customername : " Select Buyer"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { customers.map((ele)=>(
            <Dropdown.Item onClick={()=>handledropdowncustomer(ele.customername,ele.cutomercode)} key={customers.value}>{ele.customername}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
        }
        <div className="col-md-3 my-1">
        <span >Product Location</span>
            <input type="text" name='productlocation' onChange={handleChange} className="customerinput" />
        </div>
        <div className="col-md-3 my-1">
        <span >Product Position</span>
            <input type="text" name='productposition' onChange={handleChange} className="customerinput" />
        </div>
        <div className="col-md-12">

            <button className='btn' style={{width:"100%"}} onClick={handleSubmit}>CREATE</button>
        </div>
        </div>
        </div>
        <div className="col-2"></div>
        </div>
    </div>
    </>
  )
}

export default Product