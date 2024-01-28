import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
const Supplierreturninvoicedetail = () => {
	const navigate = useNavigate()
    const {ids} = useParams()
	const [paid,setPaid] = useState('')
	const [error,seterror] = useState(false)
	const [selectedproduct,setselectedProduct] = useState([])
	const [ordertotal,setordertotal] = useState('')
	const [returndate,setreturndate] = useState('')
	const [saletax,setsaletax] = useState('')
	const [subtotalamount,setsubtotalamount] = useState('')	
    const [supplierinvoice,setSupplierinvoice] = useState([])
    const [bankaccounts,setbankaccounts] = useState([])
	const [product,setproduct] = useState([])
	const [supplierinvoicedetail,setsupplierinvoicedetail] = useState([])
	const [itemtaxpercen,setitemtaxpercen] = useState([{id:0,value:'No - Tax'},{id:17,value:'PB - 17%'},{id:18,value:'PB - 18%'}])
   	const [supplier,setsupplier] = useState([])
	const [quantities, setQuantities] = useState([]); 
	const [returninvoicedetail,setreturninvoicedetail] = useState([])
	const [itemtaxname,setitemtaxname] = useState('')
    const [itemtaxid,setitemtaxid] = useState('')
	const [accountactivitynameselected,setselectedaccountactivityname] = useState('')
    const [accountactivityidselected,setselectedaccountactivityid] = useState(0)
    const selectedreturnedinvoices = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch(`/getselectedreturninvoicedetail/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   const data = await response.json()
		   console.log(data);
		   setreturninvoicedetail(data)
			
    }

	const handlebanks = async () => {
      
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
	   setbankaccounts(data)
	  }

    useEffect(()=>{
      selectedreturnedinvoices()	
	  handlebanks()
    },[])
	const handledropdownsaletax = (itemname,itemid) => {
		setitemtaxname(itemname)
		setitemtaxid(itemid)
		  }

	const handlepayment = async () =>{
		let headersList = {
			"Accept": "*/*",
			
			"Content-Type": "application/json"
		   }
		   
		   let bodyContent = JSON.stringify({
			ordertotal: Math.round(ordertotal),
			subtotalamount: Math.round(subtotalamount),
			saletax: Math.round(saletax),
			quantities,
			ids,
			returndate,
			paid,
			selectedproduct,
			supplierid: supplierinvoice.length > 0? supplierinvoice[0].supplierid:0,
			bankid:paid?accountactivityidselected:0
		   });
		   
		   let response = await fetch("/addpurchasereturninvoice", { 
			 method: "POST",
			 body: bodyContent,
			 headers: headersList
		   });
		   if(response.ok){
			   navigate('/allreturninvoices')
			   seterror(false)
		}
		else if(response.status==406){
			seterror(true)
			window.alert("Inavlid Quantity")
		   }
		   
	} 

    const handleSupplierinvoice = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch(`/getselectedinvoice/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   setSupplierinvoice(data)
    }
	const handlechange = (e, index,product) => {
		const newQuantities = [...quantities];
		newQuantities[index] = e.target.value
		setQuantities(newQuantities)
		const newpeoduct = [...selectedproduct]
		newpeoduct[index] = product
		setselectedProduct(newpeoduct)
		
	  };

	  const handledropdownaccountactivity = (itemname,itemid) => {
		setselectedaccountactivityname(itemname)
		setselectedaccountactivityid(itemid)
		  }

	const handleSuppliers = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch("/getsupplier", { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   setsupplier(data)
	}
	const handleProduct = async () => {
		let headersList = {
			"Accept": "*/*",			
			"Content-Type": "application/json"
		   }
		   let response = await fetch("/getproducts", { 
			 method: "GET",
			 headers: headersList
		   });
		   let data = await response.json();
		   setproduct(data)
	}
	const handlesupplierinvoicedetail = async () =>{
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch(`/getsupplierinvoicedetailselected/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   console.log(data);
		   setsupplierinvoicedetail(data)
	}
    useEffect(()=>{
        handleSupplierinvoice()
		handleSuppliers()
		handleProduct()
		handlesupplierinvoicedetail()
    },[])

	useEffect(()=>{
		setsubtotalamount(supplierinvoicedetail.length > 0? quantities.length>0? quantities.map((row)=>(row==0? supplierinvoicedetail[0].purchaseunitprice*0:supplierinvoicedetail[0].purchaseunitprice*row)).reduce((pre,cur)=>(pre+cur),0):0:"")
	},[quantities])
	useEffect(()=>{
		setsaletax( subtotalamount? (subtotalamount*itemtaxid)/100:0)
	},[subtotalamount,itemtaxid])
	useEffect(()=>{
		setordertotal(subtotalamount+saletax)
	},[subtotalamount,saletax])

  return (
    <>
    <div class="container-sm my-2 invoicebox ">
    <div class="row " >
        <div class="col-sm-12">
    		<div class="invoice-title">
            <div className="row my-1">
				<div className="row">
                <div className="col-sm-8">
    			<h5 ><b> Invoice No:</b></h5>
                </div>
                <div className="col-sm-4 text-center">
                <h5 class="pull-right"> {supplierinvoice.length > 0? supplierinvoice.map((ele)=>(ids==ele.supplierinvoiceid?ele.invoiceno:"")):""} </h5>
                </div>
				</div>
				<div className="col-sm-8">

				<address className='descs'>
        			<strong >Invoice Description:</strong>
    						{supplierinvoice.length >0? supplierinvoice[0].supplierinvoicedescription :"No Description"}
    				</address>
				</div>
				<div className="col-sm-4 text-center">

					<address className='date'>
    					<strong >Date: </strong>
    					{supplierinvoice.length>0? supplierinvoice[0].invoicedate.slice(0,10):""}
    				</address>
				</div>
    		</div>
            </div>
			<hr/>
    		<div class="row" >
    			<div class="col-sm-7 ">
    				<address>
    				<strong>Supplier Details:</strong><br/>
    				<b>Name:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.suppliername:"":"")) :""}<br/>
    				<b>Address:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.supplieraddress:"":"")) :""}<br/>
    				<b>Contact:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.suppliercontact:"":"")) :""}
    					
    				</address>
    			</div>
    			<div class="col-sm-5">
					<div className="row">
					<div className="col-lg-6">

					<span style={{color:'blue',fontWeight:'bold'}}>Return Date</span>
    				<input type="date" style={{outline:'none',borderRadius:'5px',border:'1px solid blue',padding:'5px',color:'blue'}} onChange={(e)=>setreturndate(e.target.value)}/>
					</div>
					<div className="col-lg-6">

					<span style={{fontWeight:'bold'}}>Sale Tax</span>
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
			{ paid &&
			<>
				<span style={{fontWeight:'bold'}}>Select Bank</span>
  <Dropdown  className=''>
      <Dropdown.Toggle style={{width:'100%',overflow:'hidden'}} variant="dark" id="dropdown-basic">
       {accountactivitynameselected ? accountactivitynameselected : "Account"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href="#option1">Option 1</Dropdown.Item> */}
        { bankaccounts.map((ele)=>(
			<Dropdown.Item onClick={()=>handledropdownaccountactivity(ele.accountsubcontrolname,ele.accountsubcontrolid)} key={bankaccounts.value}>{ele.accountsubcontrolname}</Dropdown.Item>
			))}
      </Dropdown.Menu>
    </Dropdown>
			</>
}
			</div>
	</div>
    		</div>
    		<div class="row">
    			<div class="col-sm-9">
    			</div>
    			<div class="col-sm-3">
    				
    			</div>
    		</div>
    	</div>
    </div>
    
    <div class="row">
    	<div class="col-md-12">
    		<div class="panel panel-default">
    			<div class="panel-heading">
    				<h3 class="panel-title"><strong>Order summary</strong></h3>
    				
    			</div>
    			<div class="panel-body">
    				<div class="table-responsive">
    					<table class="table table-condensed">
    						<thead>
                                <tr>
        							<td className='bg-dark text-white'><strong>Item</strong></td>
        							<td class="text-center bg-dark text-white "><strong>Quantity</strong></td>
        							<td class="text-center bg-dark text-white"><strong>Price</strong></td>
        							<td class="text-right bg-dark text-white"><strong>Totals</strong></td>
                                </tr>
    						</thead>
    						<tbody>
    							
								{
									supplierinvoicedetail.length > 0? supplierinvoicedetail.map((row,index)=>(
								<tr>
								<td class="">{product.length > 0? product.map((ele)=>(row.productid==ele.productid?ele.productname:"")) :""}</td>
								
    								{/* <td class="text-center">  <input type="text"  placeholder={returninvoicedetail.length >0? returninvoicedetail.map((ele)=>(ele.productid == row.productid?row.purchasequantity-ele.returnquantity==0?"nothing":row.purchasequantity-ele.returnquantity:"")):row.purchasequantity}  onChange={(e)=>{
										handlechange(e,index,row.productid)}
									}  style={{width:'20%'}} /></td> */}
									<td class="text-center">
  <input
    type="text"
    placeholder={
      returninvoicedetail.length > 0
        ? returninvoicedetail
            .filter(ele => ele.productid === row.productid)
            .map(ele =>
              ele.returnquantity === 0 ? "nothing" : row.purchasequantity - ele.returnquantity
            )
            .find(quantity => quantity !== "")
        : row.purchasequantity
    }
    onChange={e => {
      handlechange(e, index, row.productid);
    }}
    style={{ width: '20%' }}
  />
</td>

    								<td class="text-center">{row.purchaseunitprice }</td>
    								<td class="text-right">{quantities.length>0? quantities[index]?  quantities[index] * row.purchaseunitprice: 0 * row.purchaseunitprice:0}</td>
    							</tr>
									)) :""
								}	
    							<tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Subtotal</strong></td>
    								<td class="thick-line text-right">{subtotalamount}</td>
    							</tr>
    							<tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Sale Tax</strong></td>
    								<td class="thick-line text-right">{Math.round(saletax)}</td>
    							</tr>
    							{/* <tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Shipping</strong></td>
    								<td class="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].shippingfee:""}</td>
    							</tr> */}
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Total</strong></td>
    								<td class="no-line text-right">{Math.round(ordertotal)}</td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-right"> <p className='text-center'>Is payment paid</p></td>
    								<td class="no-line text-right"> <input type="checkbox" onChange={(e)=>setPaid(e.target.checked)}/> </td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong><button className="btn btn-outline-danger" onClick={()=>navigate('/supplierreturninvoice')}>Cancel</button></strong></td>
    								<td class="no-line text-right"><button className="btnf btn-outline-primary" onClick={handlepayment} >Return</button> </td>
    							</tr>
    						</tbody>
    					</table>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
</div>

    </>
  )
}

export default Supplierreturninvoicedetail