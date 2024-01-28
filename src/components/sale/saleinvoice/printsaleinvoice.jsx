import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const Printsaleinvoice = () => {
	const navigate = useNavigate()
    const {ids} = useParams()
    const [supplierinvoice,setSupplierinvoice] = useState([])
	const [product,setproduct] = useState([])
	const [supplierinvoicedetail,setsupplierinvoicedetail] = useState([])
	const [supplier,setsupplier] = useState([])
    const handleSupplierinvoice = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch(`/getselectedcustomerinvoice/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   setSupplierinvoice(data)
		   console.log(data);
    }
	const handleSuppliers = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch("/getcustomers", { 
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
		   
		   let response = await fetch(`/getcustomerinvoicedetailselected/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   setsupplierinvoicedetail(data)
	}
    useEffect(()=>{
		handleSupplierinvoice()
    },[])
    useEffect(()=>{
		handleProduct()	
		handlesupplierinvoicedetail()
		console.log("error");
    },[supplierinvoice.length])
	useEffect(()=>{
		handleSuppliers()
},[product.length])


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
                <h5 class="pull-right"> {supplierinvoice.length > 0? supplierinvoice.map((ele)=>(ids==ele.customerinvoiceid?ele.invoiceno:"")):""} </h5>
                </div>
				</div>
				<div className="col-sm-8">

				<address className='descs'>
        			<strong >Invoice Description:</strong>
    						{supplierinvoice.length >0? supplierinvoice[0].customerinvoicedescription :"No Description"}
    				</address>
				</div>
				<div className="col-sm-4 text-center">

					<address className='date'>
    					<strong >Date: </strong>
    					{supplierinvoice.length>0? supplierinvoice[0].invoicedate?.slice(1,10):""}
    				</address>
				</div>
    		</div>
            </div>
			<hr/>
    		<div class="row" >
    			<div class="col-sm-9 ">
    				<address>
    				<strong>Customer Details:</strong><br/>
    				<b>Name:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.cutomercode==supplierinvoice[0].customerid?ele.customername:"":"")) :""}<br/>
    				<b>Address:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.cutomercode==supplierinvoice[0].customerid?ele.customeraddress:"":"")) :""}<br/>
    				<b>Contact:</b>	{supplier.length>0? supplier.map((ele)=>(supplierinvoice.length>0? ele.cutomercode==supplierinvoice[0].customerid?ele.customerphone:"":"")) :""}
    					
    				</address>
    			</div>
    			<div class="col-sm-3">
    				
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
        							<td><strong>Item</strong></td>
        							<td class="text-center"><strong>Quantity</strong></td>
        							<td class="text-center"><strong>Price</strong></td>
        							<td class="text-right"><strong>Totals</strong></td>
                                </tr>
    						</thead>
    						<tbody>
    							{/* <!-- foreach ($order->lineItems as $line) or some such thing here --> */}
								{
									supplierinvoicedetail.length > 0? supplierinvoicedetail.map((row)=>(

										<tr>
    								<td class="">{product.length > 0? product.map((ele)=>(row.productid==ele.productid?ele.productname:"")) :""}</td>
    								<td class="text-center">{row.salequantity}</td>
    								<td class="text-center">{row.saleunitprice}</td>
    								<td class="text-right">{row.salequantity * row.saleunitprice}</td>
    							</tr>
									)) :""
								}	
    							<tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Subtotal</strong></td>
    								<td class="thick-line text-right">{supplierinvoice.length > 0? supplierinvoice[0].subtotalamount:""}</td>
    							</tr>
    							<tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Sale Tax</strong></td>
    								<td class="thick-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].tax:""}</td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Shipping</strong></td>
    								<td class="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].shippingfee:""}</td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Total</strong></td>
    								<td class="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].totalamount:""}</td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong><button className="btn btn-outline-danger" onClick={()=>navigate('/supplierinvoice')}>Cancel</button></strong></td>
    								<td class="no-line text-right"><button className="btnf btn-outline-primary" onClick={()=>window.print()}>Print</button></td>
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

export default Printsaleinvoice