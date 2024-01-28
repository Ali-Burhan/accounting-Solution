import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const Printsalereturninvoice = () => {
	const navigate = useNavigate()
    const {ids} = useParams()
	const [ordertotal,setordertotal] = useState('')
	const [saletax,setsaletax] = useState('')
	const [subtotalamount,setsubtotalamount] = useState('')	
	const [product,setproduct] = useState([])
	const [supplier,setsupplier] = useState([])
    const [supplierreturninvoice,setsupplierreturninvoice] = useState([])
	const [returninvoicedetail,setreturninvoicedetail] = useState([])
	
    const selectedreturnedinvoices = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch(`/getselectedcustomerreturninvoicedetail/${ids}`, { 
			 method: "GET",
			 headers: headersList
		   });
		   const data = await response.json()
		   console.log( "Return invoice data",data);
		   setreturninvoicedetail(data)
			
    }

    useEffect(()=>{
      
    },[])

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
	const handleSuppliersreturninvoice = async () => {
		let headersList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		   }
		   
		   let response = await fetch("/getreturncustomerinvoice", { 
			 method: "GET",
			 headers: headersList
		   });
		   
		   let data = await response.json();
		   console.log("Date Data",data);
		   setsupplierreturninvoice(data)
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
	
    useEffect(()=>{
		handleSuppliersreturninvoice()
		selectedreturnedinvoices()
    },[])
	
	useEffect(()=>{
		handleSuppliers()
		handleProduct()
	},[])

	useEffect(()=>{
		setsubtotalamount(returninvoicedetail.length > 0? returninvoicedetail.map((ele)=>( ele.returnunitprice)).reduce((pre,cur)=>(pre+cur)):"")
	},[returninvoicedetail.length])
	useEffect(()=>{
		setsaletax( subtotalamount? (subtotalamount*18)/100:0)
	},[subtotalamount])
	useEffect(()=>{
		setordertotal( parseInt(subtotalamount)+ parseInt(saletax))
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
                <h5 class="pull-right"> {supplierreturninvoice.length > 0? supplierreturninvoice.map((ele)=>(ids==ele.customerinvoiceid?ele.returninvoicetitle:"")):""} </h5>
                </div>
				</div>
				<div className="col-sm-4">
				</div>
				<div className="col-sm-4  text-center">

					<address className='date' style={{fontSize:'25px'}} >
    					<strong >Date: </strong>
    					{supplierreturninvoice.length>0? returninvoicedetail.length > 0? supplierreturninvoice.map((row)=>(row.customerreturninvoiceid == returninvoicedetail[0].customerreturninvoiceid?row.returndate.slice(0,10):"")):"":""}
    				</address>
				</div>
    		</div>
            </div>
			<hr/>
    		<div class="row" >
    			<div class="col-sm-9 ">
    				<address>
    				<strong>Supplier Details:</strong><br/>
    				<b>Name:</b>	{supplier.length>0? supplier.map((ele)=>(returninvoicedetail.length>0? ele.cutomercode==returninvoicedetail[0].customerid?ele.customername:"":"")) :""}<br/>
    				<b>Address:</b>	{supplier.length>0? supplier.map((ele)=>(returninvoicedetail.length>0? ele.cutomercode==returninvoicedetail[0].customerid?ele.customeraddress:"":"")) :""}<br/>
    				<b>Contact:</b>	{supplier.length>0? supplier.map((ele)=>(returninvoicedetail.length>0? ele.cutomercode==returninvoicedetail[0].customerid?ele.customerphone:"":"")) :""}
    					
    				</address>
    			</div>
    			<div class="col-sm-3" >
					
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
    				<div class="table-responsive ">
    					<table class="table table-condensed ">
    						<thead >
                                <tr >
        							<td className='bg-dark text-white'><strong>Item</strong></td>
        							<td class="text-center bg-dark text-white"><strong>Quantity</strong></td>
        							<td class="text-center bg-dark text-white"><strong>Price</strong></td>
        							{/* <td class="text-right bg-dark text-white"><strong>Totals</strong></td> */}
                                </tr>
    						</thead>
    						<tbody>
    							
								{
									returninvoicedetail.length > 0? returninvoicedetail.map((row,index)=>(
								<tr>
								<td class="">{product.length > 0? product.map((ele)=>(row.productid==ele.productid?ele.productname:"")) :""}</td>
								
    								{/* <td class="text-center">  <input type="text"  placeholder={returninvoicedetail.length >0? returninvoicedetail.map((ele)=>(ele.productid == row.productid?row.purchasequantity-ele.returnquantity==0?"nothing":row.purchasequantity-ele.returnquantity:"")):row.purchasequantity}  onChange={(e)=>{
										handlechange(e,index,row.productid)}
									}  style={{width:'20%'}} /></td> */}
									<td class="text-center">{row.returnquantity}</td>

    								<td class="text-center">{row.returnunitprice }</td>
    								{/* <td class="text-right">{row.returnquantity * row.returnunitprice}</td> */}
    							</tr>
									)) :""
								}	
    							<tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Subtotal</strong></td>
    								<td class="thick-line text-right">{subtotalamount}</td>
    							</tr>
    							{/* <tr>
    								<td class="thick-line"></td>
    								<td class="thick-line"></td>
    								<td class="thick-line text-center"><strong>Sale Tax</strong></td>
    								<td class="thick-line text-right">{Math.floor(saletax)}</td>
    							</tr> */}
    							{/* <tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Shipping</strong></td>
    								<td class="no-line text-right">{supplierinvoice.length > 0?supplierinvoice[0].shippingfee:""}</td>
    							</tr> */}
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong>Total</strong></td>
    								<td class="no-line text-right">{Math.floor(ordertotal)}</td>
    							</tr>
    							<tr>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line"></td>
    								<td class="no-line text-center"><strong><button className="btn btn-outline-danger" onClick={()=>navigate('/supplierreturninvoice')}>Cancel</button></strong></td>
    								<td class="no-line text-right"><button className="btnf btn-outline-primary" onClick={()=>window.print()} >Print</button> </td>
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

export default Printsalereturninvoice