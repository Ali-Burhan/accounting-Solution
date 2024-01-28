import React, { useEffect, useState } from 'react'
import "./supplierinvoice.css"
import { useNavigate, useParams } from 'react-router-dom'
import "./supplierinvoice.css"
const Homesupplierinvoice = () => {
	const navigate = useNavigate()
    const {ids} = useParams()
    const [supplierinvoice,setSupplierinvoice] = useState([])
	const [product,setproduct] = useState([])
	const [supplierinvoicedetail,setsupplierinvoicedetail] = useState([])
	const [supplier,setsupplier] = useState([])
	const [picture,setPicture] = useState(null)
	const [getpic,setGetpic] = useState(null)
	const [change,seChange] = useState(0)
	const [error,setError] = useState(false)
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
		   setSupplierinvoice(data.data1)
		   if(data.data2){

			   const uint8Array = new Uint8Array(data.data1? data.data2.data:0);
			   
			   // Create a Blob from the Uint8Array
			   const blob = new Blob([uint8Array],{type:'image/jpg'});
			   
			   // Generate a URL for the Blob
			   const imageUrl = URL.createObjectURL(blob);
			   setGetpic(imageUrl)
			}
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
		   setsupplierinvoicedetail(data)
	}
    useEffect(()=>{
		handleSuppliers()
		handleProduct()
    },[])
	
	useEffect(()=>{
		handleSupplierinvoice()
		handlesupplierinvoicedetail()

	},[change])


	const updatePicture = async () => {
		if(picture){

			var formData = new FormData()
			formData.append('picture',picture)
			const response = await fetch(`/supplierinvoicepic/${ids}`,{
			method: 'POST',
			body:formData,
			headers:{}
		})
		if(response.ok){
			window.alert('UPDATED')
			seChange(change+1)
			setError(false)
		}else{
			window.alert('ERROR')
		}
	}else{
		setError(true)
	}
	}
	return (
    <>
    <div className="container-sm my-2 invoicebox ">
    <div className="row " >
        <div className="col-sm-12">
    		<div className="invoice-title">
            <div className="row my-1">
				<div className="row">
					
                <div className="col-sm-8">
    			<h5 ><b> Invoice No:</b></h5>
                </div>
                <div className="col-sm-4 text-center">
                <h5 className="pull-right"> {supplierinvoice.length > 0? supplierinvoice.map((ele)=>(ids==ele.supplierinvoiceid?ele.invoiceno:"")):""} </h5>
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
    		<div className="row" >
    			<div className="col-sm-9 ">
    				<address>
    				<strong>Supplier Details:</strong><br/>
    				<b>Name:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.suppliername:"":"")) :""}<br/>
    				<b>Address:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.supplieraddress:"":"")) :""}<br/>
    				<b>Contact:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.supplierid==supplierinvoice[0].supplierid?ele.suppliercontact:"":"")) :""}
    					
    				</address>
    			</div>
    			<div className="col-sm-3">
    				{getpic? <img src={getpic} width={'100%'}  style={{borderRadius:'10px'}}/> :""}
    			</div>
    		</div>
    		<div className="row">
    			<div className="col-sm-9">
    			</div>
    			<div className="col-sm-3">
    				
    			</div>
    		</div>
    	</div>
    </div>
    
    <div className="row">
    	<div className="col-md-12">
    		<div className="panel panel-default">
    			<div className="panel-heading">
    				<h3 className="panel-title"><strong>Order summary</strong></h3>
    			</div>
    			<div className="panel-body">
    				<div className="table-responsive">
    					<table className="table table-condensed">
    						<thead>
                                <tr>
        							<td><strong>Item</strong></td>
        							<td className="text-center"><strong>Quantity</strong></td>
        							<td className="text-center"><strong>Price</strong></td>
        							<td className="text-right"><strong>Totals</strong></td>
                                </tr>
    						</thead>
    						<tbody>
    							{/* <!-- foreach ($order->lineItems as $line) or some such thing here --> */}
								{
									supplierinvoicedetail.length > 0? supplierinvoicedetail.map((row)=>(

										<tr key={row.supplierinvoicedetailid}>
    								<td className="">{product.length > 0? product.map((ele)=>(row.productid==ele.productid?ele.productname:"")) :""}</td>
    								<td className="text-center">{row.purchasequantity}</td>
    								<td className="text-center">{row.purchaseunitprice}</td>
    								<td className="text-right">{row.purchasequantity * row.purchaseunitprice}</td>
    							</tr>
									)) :""
								}	
    							<tr>
    								<td className="thick-line"></td>
    								<td className="thick-line"></td>
    								<td className="thick-line text-center"><strong>Subtotal</strong></td>
    								<td className="thick-line text-right">{supplierinvoice.length > 0? supplierinvoice[0].subtotalamount:""}</td>
    							</tr>
    							<tr>
    								<td className="thick-line"></td>
    								<td className="thick-line"></td>
    								<td className="thick-line text-center"><strong>Sale Tax</strong></td>
    								<td className="thick-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].saletax:""}</td>
    							</tr>
    							<tr>
    								<td className="no-line"></td>
    								<td className="no-line"></td>
    								<td className="no-line text-center"><strong>Shipping</strong></td>
    								<td className="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].shippingfee:""}</td>
    							</tr>
    							<tr>
    								<td className="no-line"></td>
    								<td className="no-line"></td>
    								<td className="no-line text-center"><strong>Total</strong></td>
    								<td className="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].totalamount:""}</td>
    							</tr>
								{error? <strong>Select Picture First</strong> :""}
    							<tr>
    								<td className="no-line fileinput" ><p className='tooltip2'>NOTE: File should be in Picture form</p><input onChange={(e)=>setPicture(e.target.files[0])} style={{border:'1px solid grey', width:'70%',padding:'5px',borderRadius:'5px'}} type='file'/><button onClick={updatePicture} className='btn mx-1'>Submit</button></td>
    								<td className="no-line"></td>
    								<td className="no-line text-center"><strong><button className="btn btn-outline-danger" onClick={()=>navigate('/supplierinvoice')}>Cancel</button></strong></td>
    								<td className="no-line text-right"><button className="btnf btn-outline-primary" onClick={()=>window.print()}>Print</button></td>
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

export default Homesupplierinvoice