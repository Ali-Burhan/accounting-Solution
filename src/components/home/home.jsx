import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import {ResponsivePie} from '@nivo/pie'
import './home.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title, } from 'chart.js';
import { Pie,Bar } from 'react-chartjs-2';


const Home = ({setNavbar}) => {
  const [user,setUser] = useState({})
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [pendingInvoices,setPendingInvoices] = useState([])
  const [supplierincoice,setSupplierinvoice] = useState([])
  const [totalpurchaseamount,settotalpurchaseamount] = useState('')
  const [totalpurchaseamount2,settotalpurchaseamount2] = useState('')
  const [totalpurchaseamount3,settotalpurchaseamount3] = useState('')
  const [totalsaleamount,settotalsaleamount] = useState('')
  const [totalsalependingamount,settotalsalependingamount] = useState('')
  const [totalsalepaidamount,settotalsalepaidamount] = useState('')
  const [customerinvoice,setcustomerinvoice] = useState([])
  const [pendingInvoices2,setPendingInvoices2] = useState([])
  const [Banks,setBanks] = useState([])

 
  const getPendingInvoices2 = async () => {

      let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch("/getpendingcustomerinoives", { 
           method: "GET",
           headers: headersList
         });
         
         let data = await response.json();
         setPendingInvoices2(data)
  }
  const getbanks = async () => {

      let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch("/getaccountasset", { 
           method: "GET",
           headers: headersList
         });
         
         let data = await response.json();
         setBanks(data)
  }
  useEffect(()=>{
      getPendingInvoices2()
         ChartJS.register(ArcElement, Tooltip, Legend,
          );
         ChartJS.register(
          CategoryScale,
          LinearScale,
          BarElement,
          Title,);
          const total = pendingInvoices.length > 0 ? pendingInvoices.map((row) => parseInt(row.totalamount,10)).reduce((prev, curr) => prev + curr) : '';
          const total2 = supplierincoice.length > 0 ? supplierincoice.map((row) => parseInt(row.subtotalamount,10)).reduce((prev, curr) =>  prev + curr) : '';
          const paid = total2 - total 
          console.log(total2);
          settotalpurchaseamount(total)
          settotalpurchaseamount2(Math.floor(total2))
          settotalpurchaseamount3(Math.abs(paid))
          console.log(totalpurchaseamount3);
          getbanks()
        },[pendingInvoices.length,supplierincoice.length])
        
    const getcustomerInvoices = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
           
           let response = await fetch("/getcustomerinvoice", { 
             method: "GET",
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
           setcustomerinvoice(data)           
    }
    useEffect(()=>{
      getcustomerInvoices()
      getPendingInvoices()
    },[])
    const getPendingInvoices = async () => {

      let headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
         }
         
         let response = await fetch("/getremainingsupplierinvoices", { 
           method: "GET",
           headers: headersList
         });
         
         let data = await response.json();
         setPendingInvoices(data)
         console.log(pendingInvoices);
  }
  useEffect(()=>{
    const total = pendingInvoices2.length > 0 ? pendingInvoices2.map((row) => parseInt(row.totalamount,10)).reduce((prev, curr) => prev + curr) : '';
    const total2 = customerinvoice.length > 0 ? customerinvoice.map((row) => parseInt(row.totalamount,10)).reduce((prev, curr) =>  prev + curr) : '';
    const paid = total2 - total 
    console.log(total2);
    settotalsalependingamount(total)
    settotalsaleamount(Math.floor(total2))
    settotalsalepaidamount(Math.abs(paid))
},[customerinvoice.length])
const getSupplierInvoices = async () => {
  let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
     }
     
     let response = await fetch("/getsupplierinvoice", { 
       method: "GET",
       headers: headersList
     });
     
     let data = await response.json();
     console.log(data);
      setSupplierinvoice(data)           
}
useEffect(()=>{
  getSupplierInvoices()
},[])
  const data = [
    {
      "id": "Purchase Pending",
      "label": "Purchase Pending",
      "value": pendingInvoices.length > 0 ? pendingInvoices.length:0,
      "color": "#000"
    },
    {
      "id": "Total Purchase",
      "label": "Total Purchase ",
      "value": supplierincoice.length > 0 ? supplierincoice.length:0,
      "color": "#000"
    },
    {
      "id": "Purchase Paid",
      "label": "Purchase Paid",
      "value": supplierincoice.length > 0 ? pendingInvoices.length > 0? supplierincoice.length-pendingInvoices.length:supplierincoice.length-0:0,
      "color": "#000"
    },
    
  ]

  const data2 = [

    {
      "id": "Sale Pending",
      "label": "Sale Pending",
      "value": pendingInvoices2.length>0?pendingInvoices2.length:0,
      "color": "#000"
    },
    {
      "id": "Total Sale",
      "label": "Total Sale ",
      "value": customerinvoice.length>0?customerinvoice.length:0,
      "color": "#000"
    },
    {
      "id": "Sale Paid",
      "label": "Sale Paid",
      "value": customerinvoice.length>0?pendingInvoices2.length>0? customerinvoice.length-pendingInvoices2.length:customerinvoice.length-0:0,
      "color": "#000"
    },
    
  ]


  useEffect(() => {
  
    // Update the windowWidth state whenever the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleSubmit =async () => {
    let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json",
   }
   
   let response = await fetch("/a", { 
     method: "GET",
     headers: headersList
   });
   
   let data = await response.json();
   setUser(data)
}
useEffect(()=>{
  const fetchData = async () => {
    await handleSubmit();
  };
fetchData()

},[])

useEffect(()=>{
    setNavbar(true)
},[])

return (
    <div className='container'>
      <div className="row my-2">
        <div className="col-12 my-2">
          <div className="row">
            <div className="col-12">
          

            </div>
            <div className="col-md-4 my-2">
              <div className="border rounded  p-4" style={{boxShadow:'0px 1px 2px grey'}}>
            <h3 className='text-center'>Purchase Details</h3>
            <hr />
            <div className="row">
                <div className='col-md-8 my-3'>
                 <h5>Total  : Rs.{totalpurchaseamount2? totalpurchaseamount2:0}</h5>
                 <hr style={{color:'green',border:'3px solid green',borderRadius:'5px'}}/>
                </div>
                <div className='col-md-6'>
                 <h5>Paid : Rs.{totalpurchaseamount3? totalpurchaseamount3:0} </h5>
                 <hr style={{color:'blue',border:'3px solid blue',borderRadius:'5px'}}/>
                </div>
                <div className='col-md-6'>
                 <h5>Pending  : Rs.{totalpurchaseamount? totalpurchaseamount:0}</h5>
                 <hr style={{color:'blue',border:'3px solid blue',borderRadius:'5px'}}/>
                </div>
            </div>
              </div>
            </div>
            <div className="col-md-4 my-2">
              <div className="border rounded p-4" style={{boxShadow:'0px 1px 2px grey'}}>
            <h3 className='text-center'>Sale Details</h3>
            <hr />
            <div className="row">
                <div className='col-md-8 my-3'>
                 <h5>Total  : Rs.{totalsaleamount? totalsaleamount:0}</h5>
                 <hr style={{color:'green',border:'3px solid green',borderRadius:'5px'}}/>
                </div>
                <div className='col-md-6'>
                 <h5>Paid : Rs.{totalsalepaidamount? totalsalepaidamount:0}</h5>
                 <hr style={{color:'blue',border:'3px solid blue',borderRadius:'5px'}}/>
                </div>
                <div className='col-md-6'>
                 <h5>Pending  : Rs.{totalsalependingamount? totalsalependingamount:0}</h5>
                 <hr style={{color:'blue',border:'3px solid blue',borderRadius:'5px'}}/>
                </div>
            </div>
              </div>
            </div>
            <div className="col-md-4 my-2">
              <div className="border rounded p-4" style={{boxShadow:'0px 1px 2px grey'}}>
            <h3 className='text-center'>Bank Details</h3>
            <hr />
            <div className="row">
              { Banks.map((row)=>(
                <div className='col-md-12'>
                  <div className="row " style={{borderBottom:'1px solid grey',alignItems:'center'}}>
                    <div className="col-6">
                 {/* <span title={row.accountsubcontrolname}>{row.accountsubcontrolname.slice(0,18)}</span> */}
                 <span class="custom-tooltip" title={row.accountsubcontrolname}>{row.accountsubcontrolname.slice(0,18)}</span>
                    </div>
                    <div className="col-6">
                 <span> {row.currentbalance} Rs</span>
                    </div>
                  </div>
                </div>
                  ))
                }
            </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 my-2">
        <Card className="horizontal-card">
      <div className="row g-0">
        <div className="col-md-12 cardtitle">
          <Card.Body>
            <div className="row ">
              <div className="col-3" >
            <Card.Title className='titlesideline my-2 text-center'>Purchase</Card.Title>
            <Card.Title className='titlesideline my-2 text-center'>Invoices</Card.Title>
              </div>
              <div className="col-9">
             
              <div className="div" style={{height:'300px'}}>

<ResponsivePie
data={data}
margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
innerRadius={0.5}
padAngle={0.7}
cornerRadius={3}
activeOuterRadiusOffset={8}
borderWidth={2}
borderColor={{
from: 'color',
modifiers: [
    [
        'brighter',
        0.2
    ]
]
}}
arcLinkLabelsSkipAngle={10}
arcLinkLabelsTextColor="#fff"
arcLinkLabelsThickness={2}
arcLinkLabelsColor={{ from: 'color' }}
arcLabelsSkipAngle={10}
arcLabelsTextColor={{
from: 'color',
modifiers: [
  [
    'darker',
        2
    ]
  ]
}}
defs={[
{
id: 'dots',
    type: 'patternDots',
    background: 'inherit',
    color: 'rgba(255, 255, 255, 0.3)',
    size: 4,
    padding: 1,
    stagger: true
},
{
  id: 'lines',
  type: 'patternLines',
    background: 'inherit',
    color: 'rgba(255, 255, 255, 0.3)',
    rotation: -45,
    lineWidth: 6,
    spacing: 10
  }
]}
fill={[
{
  match: {
    id: 'Purchase Pending'
  },
  id: 'lines'
},
{
  match: {
    id: 'Total Purchase'
  },
    id: 'dots'
  },
  {
    match: {
        id: 'Purchase Paid'
      },
    id: 'lines'
  },
]}
legends={[
{
    anchor: 'bottom',
    direction: 'row',
    justify: false,
    translateX: 0,
    translateY: 40,
    itemsSpacing: 10,
    itemWidth: 110,
    itemHeight: 18,
    itemTextColor: '#fff',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 18,
    symbolShape: 'circle',
    effects: [
        {
          on: 'hover',
            style: {
              itemTextColor: '#ffff'
            }
          }
        ]
      }
    ]}
/>
    </div>
    </div>
            </div>
          </Card.Body>
        </div>
      </div>
    </Card>
        </div>
        {/* <div className="col-md-2"></div> */}
        <div className="col-lg-6 my-2">
        <Card className="horizontal-card">
      <div className="row g-0">
        <div className="col-md-12 cardtitle">
          <Card.Body>
            <div className="row ">
              <div className="col-3" >

            <Card.Title className='titlesideline my-2 text-center'>Sale</Card.Title>
            <Card.Title className='titlesideline my-2 text-center'>Invoices</Card.Title>
</div>

              <div className="col-9">

              <div className="div" style={{height:'300px'}}>
<ResponsivePie
data={data2}
margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
innerRadius={0.5}
padAngle={0.7}
colors={{scheme:"set1"}}
cornerRadius={3}
activeOuterRadiusOffset={8}
borderWidth={2}
borderColor={{
from: 'color',
modifiers: [
    [
        'darker',
        0.2
    ]
]
}}
arcLinkLabelsSkipAngle={10}
arcLinkLabelsTextColor="#fff"
arcLinkLabelsThickness={2}
arcLinkLabelsColor={{ from: 'color' }}
arcLabelsSkipAngle={10}
arcLabelsTextColor={{
from: 'color',
modifiers: [
  [
    'darker',
        2
    ]
  ]
}}
defs={[
{
id: 'dots',
    type: 'patternDots',
    background: 'inherit',
    // color: 'red',
    size: 4,
    padding: 1,
    stagger: true
},
{
  id: 'lines',
  type: 'patternLines',
    background: 'inherit',
    color: '#eed312',
    rotation: -45,
    lineWidth: 6,
    spacing: 10
  }
]}
fill={[
{
  match: {
    id: 'Sale Pending'
  },
  id: 'dots2'
},
{
  match: {
    id: 'Total Sale'
  },
    id: 'lines2'
  },
  {
    match: {
        id: 'Sale Paid'
      },
    id: 'lines2'
  },
]}
legends={[
{
    anchor: 'bottom',
    direction: 'row',
    justify: false,
    translateX: 0,
    translateY: 40,
    itemsSpacing: -6,
    itemWidth: 110,
    itemHeight: 18,
    itemTextColor: '#fff',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 18,
    symbolShape: 'circle',
    effects: [
        {
          on: 'hover',
            style: {
              itemTextColor: '#fff'
            }
          }
        ]
      }
    ]}
/>
    </div>
    </div>
            </div>
          </Card.Body>
        </div>
      </div>
    </Card>
    
        </div>
      </div>
    </div>
    )
}

export default Home