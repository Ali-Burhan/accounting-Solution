import "./app.css"
import Signup from './components/signup';
import {BrowserRouter,Routes,Route, useLocation } from "react-router-dom"
import Login from './components/login';
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from './components/common/navbar/navbar';
import Sidebar from './components/common/sidebar/sidebar';
import { useEffect, useState } from "react";
import Home from "./components/home/home";
import Users from "./components/users/users";
import Customer from "./components/customer/customer";
import HomeCustomer from "./components/customer/homecustomer";
import HomeSupplier from "./components/supplier/homesupplier";
import Supplier from "./components/supplier/supplier";
import Homeproduct from "./components/product/homeproduct";
import Product from "./components/product/product";
import ProductCategory from "./components/product/productcategory";
import Homeproductcategory from "./components/product/homeproductcategory";
import EditProductCategory from "./components/product/editproductcategory";
import EditProduct from "./components/product/editproduct";
import Company from "./components/company/company";
import BranchType from "./components/branch/branchtype";
import Homebranchtype from "./components/branch/homebranchtype";
import Editbranchtype from "./components/branch/editbranchtype";
import Accountactivity from "./components/account/accountactivity/accountactivity";
import HomeAccountActivity from "./components/account/accountactivity/homeaccountactivity";
import Editaccountactivity from "./components/account/accountactivity/editaccountactivity";
import Accounthead from "./components/account/accounthead";
import Homeaccounthead from "./components/account/homeaccounthead";
import Editaccounthad from "./components/account/editaccounthead";
import Homefinancialyear from "./components/financialyear/homefinancialyear";
import Financialyear from "./components/financialyear/financialyear";
import Editfinancialyear from "./components/financialyear/editfinancialyear";
import Branch from "./components/branch/branch/branch";
import Homebranch from "./components/branch/branch/homebranch";
import Editbranch from "./components/branch/branch/editbranch";
import Employee from "./components/employee/employee";
import Editemployee from "./components/employee/editemployee";
import Homeemployee from "./components/employee/homeemployee";
import Homecompany from "./components/company/homecompany";
import Accountcontrol from "./components/account/accountcontrol/accountcontrol";
import Homeaccountcontrol from "./components/account/accountcontrol/homeaccountcontrol";
import Accountsubcontrol from "./components/account/accountsubcontrol/accountsubcontrol";
import Homeaccountsubcontrol from "./components/account/accountsubcontrol/homeaccountsubcontrol";
import Accountflowsetting from "./components/account/accountflowsetting/accountflowsetting";
import Homeaccountflowsetting from "./components/account/accountflowsetting/homeaccountflowsetting";
import Purchasecart from "./components/purchasecart/purchasecart";
import Homesupplierinvoice from "./components/supplierinvoice/homesupplierinvoice";
import Supplierinvoicelists from "./components/supplierinvoice/supplierinvoicelist";
import Userrights from "./components/users/userrights";
import Salecart from "./components/sale/salecart";
import Homesaleinvoice from "./components/sale/saleinvoice/homesaleinvoice";
import Printsaleinvoice from "./components/sale/saleinvoice/printsaleinvoice";
import Supplierpendinginvoices from "./components/supplierinvoice/pendinginvoices/supplierpendinginvoice";
import SalePendinginvoice from "./components/sale/saleinvoice/pendingsaleinvoice/salependinginvoice";
import Paypendinginvoices from "./components/sale/saleinvoice/pendingsaleinvoice/paypendinginvoice";
import Paypendingsupplierinvoices from "./components/supplierinvoice/pendinginvoices/paysupplierpendinginvoice";
import Payinvoice from "./components/sale/saleinvoice/pendingsaleinvoice/payinvoice";
import Paypendingsupplierinvoice from "./components/supplierinvoice/pendinginvoices/paypendingsupplierinvoice";
import Homepurchasereturn from "./components/purchasereturn/purchasereturn";
import Supplierreturninvoicedetail from "./components/purchasereturn/purchasereturndetail";
import Homereturnsupplierinvoice from "./components/purchasereturn/homesupplierreturninvoice";
import Homereturninvoicedetail from "./components/purchasereturn/homereturninvoicedetail";
import Returnpendingpay from "./components/purchasereturn/returnpending/returnpendingpay";
import Paypendingreturn from "./components/purchasereturn/returnpending/paypendingreturn";
import Homepursalereturn from "./components/salereturn/homesalereturn";
import Customerreturninvoicedetail from "./components/salereturn/salereturndetail";
import Homesalereturninvoice from "./components/salereturn/homesalereturninvoice";
import Printsalereturninvoice from "./components/salereturn/printsalereturninvoice";
import Homepaypendindsalereturn from "./components/salereturn/homepaypendingreturn";
import Paypendingsalereturn from "./components/salereturn/paypendingsalereturn";
import Userprofile from "./components/users/userprofile";
import Testpic from "./components/testpic/testpic";
import Editaccountcontrol from "./components/account/accountcontrol/editaccountcontrol";
import Editaccountsubcontrol from "./components/account/accountsubcontrol/editaccountsubcontrol";
import Unitofmeasure from "./components/product/unitofmeasure/unitofmeasure";
import Editsupplier from "./components/supplier/editsupplier";
import Bankpayment from "./components/bank/bankpayment";
import Banktransfer from "./components/bank/banktransfer";
import Accountbalances from "./components/bank/accountbalances";
import Bankreceipts from "./components/bank/bankreceipts";
import Homebankpayments from "./components/bank/homebankpayments";
import Journalentry from "./components/journalentry/journalentry";
import Homebankreceipt from "./components/bank/homebankreceipt";
import Homebanktransfer from "./components/bank/homebanktransfer";
import Daybookpur from "./components/reporting/daybookpur";
import Salereceiptreport from "./components/reporting/salereceipt/salereceiptreport";
import Homejournalentry from "./components/journalentry/homejournalentry";
import Journalentryreport from "./components/reporting/journalentry/journalentryreport";
function App() {
  const [user,setUser] = useState([])
  const [navbar, setNavbar] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toggle,setToggle] = useState(false)

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

  return (
    <>
     <BrowserRouter>
    <div className='home'>
      <div className={`homesidebar ${toggle?"toggletrue":"togglefalse"}`} >
        {
          navbar?
          <Sidebar setToggle={setToggle} toggle ={toggle}/>:""
        }
        
      </div>
      <div className='homenavbar'>
  {navbar?
  <Navbar user={user}/>:""

  }
       <div style={{display:'block'}}>
        { 
    <Routes>   
        <Route index path='/signup' element={<Signup setNavbar={setNavbar}/>}/>
        <Route path='/' element={<Login setUser={setUser} setNavbar={setNavbar}/>}/>
        { localStorage.getItem('userid') &&
        <>
        <Route path='/home' element={<Home setNavbar={setNavbar}/>}/>
        <Route path='/users' element={<Users  setNavbar={setNavbar}/>}/>
        <Route path='/userprofile/:ids' element={<Userprofile/>}/>
        <Route path='/createcustomers' element={<Customer/>}/>
        <Route path='/testpic' element={<Testpic/>}/>
        <Route path='/bankpayment' element={<Bankpayment/>}/>
        <Route path='/journalentry' element={<Journalentry/>}/>
        <Route path='/homejournalentry' element={<Homejournalentry/>}/>
        <Route path='/homebankpayment' element={<Homebankpayments/>}/>
        <Route path='/homebankreceipt' element={<Homebankreceipt/>}/>
        <Route path='/homebanktransfer' element={<Homebanktransfer/>}/>
        <Route path='/banktransfer' element={<Banktransfer/>}/>
        <Route path='/bankbalances' element={<Accountbalances/>}/>
        <Route path='/bankreceipt' element={<Bankreceipts/>}/>
        <Route path='/createsupplier' element={<Supplier/>}/>
        <Route path='/createproduct' element={<Product/>}/>
        <Route path='/createproductcategory' element={<ProductCategory/>}/>
        <Route path='/createbranchtype' element={<BranchType/>}/>
        <Route path='/createfinancialyear' element={<Financialyear/>}/>
        <Route path='/createemployee' element={<Employee/>}/>
        <Route path='/createsupplier' element={<Supplier/>}/>
        <Route path='/createpurchasecart' element={<Purchasecart/>}/>
        <Route path='/createsalecart' element={<Salecart/>}/>
        <Route path='/createunitofmeasure' element={<Unitofmeasure/>}/>
        <Route path='/createaccountactivity' element={<Accountactivity/>}/>
        <Route path='/createaccounthead' element={<Accounthead />}/>
        <Route path='/createaccountcontrol' element={<Accountcontrol />}/>
        <Route path='/createaccountsubcontrol' element={<Accountsubcontrol />}/>
        <Route path='/createaccountflowsetting' element={<Accountflowsetting />}/>
        <Route path='/createcompany' element={<Company/>}/>
        <Route path='/createbranch' element={<Branch />}/>
        <Route path='/editproductcategory/:ids' element={<EditProductCategory/>}/>
        <Route path='/editproduct/:ids' element={<EditProduct/>}/>
        <Route path='/editsupplier/:ids' element={<Editsupplier/>}/>
        <Route path='/editemployee/:ids' element={<Editemployee/>}/>
        <Route path='/editbranchtype/:ids' element= {<Editbranchtype/>}/>
        <Route path='/editaccounthead/:ids' element={<Editaccounthad />}/>
        <Route path='/editaccountcontrol/:ids' element={<Editaccountcontrol />}/>
        <Route path='/editaccountsubcontrol/:ids' element={<Editaccountsubcontrol />}/>
        <Route path='/editfinancialyear/:ids' element={<Editfinancialyear />}/>
        <Route path='/editaccountavtivity/:ids' element={<Editaccountactivity/>}/>
        <Route path='/editbranch/:ids' element={<Editbranch/>}/>
        <Route path='/customers' element={<HomeCustomer/>}/>
        <Route path='/employee' element={<Homeemployee/>}/>
        <Route path='/supplier' element={<HomeSupplier/>}/>
        <Route path='/product' element={<Homeproduct/>}/>
        <Route path='/supplierinvoice' element={<Supplierinvoicelists user={user}/>}/>
        <Route path='/allreturninvoices' element={<Homereturnsupplierinvoice/>}/>
        <Route path='/allcustomerreturninvoices' element={<Homesalereturninvoice/>}/>
        <Route path='/returninvoicedetail/:ids' element={<Homereturninvoicedetail/>}/>
        <Route path='/returnsaleinvoicedetail/:ids' element={<Printsalereturninvoice/>}/>
        <Route path='/supplierreturninvoice' element={<Homepurchasereturn/>}/>
        <Route path='/customerinvoice' element={<Homesaleinvoice/>}/>
        <Route path='/customerreturninvoice' element={<Homepursalereturn/>}/>
        <Route path='/customerreturninvoicedetail/:ids' element={<Customerreturninvoicedetail/>}/>
        <Route path='/supplierpendinginvoice' element={<Supplierpendinginvoices/>}/>
        <Route path='/returnpendingpay' element={<Returnpendingpay/>}/>
        <Route path='/returnsalependingpay' element={<Homepaypendindsalereturn/>}/>
        <Route path='/customerpendinginvoice' element={<SalePendinginvoice/>}/>
        <Route path='/paycustomerpendinginvoice' element={<Paypendinginvoices/>}/>
        <Route path='/paycustomerpendinginvoice/:ids' element={<Payinvoice/>}/>
        <Route path='/payreturnpendinginvoice/:ids' element={<Paypendingreturn/>}/>
        <Route path='/payreturnsalependinginvoice/:ids' element={<Paypendingsalereturn/>}/>
        <Route path='/paysupplierpendinginvoice/:ids' element={<Paypendingsupplierinvoice/>}/>
        <Route path='/paysupplierpendinginvoice' element={<Paypendingsupplierinvoices/>}/>
        <Route path='/supplierinvoice/:ids' element={<Homesupplierinvoice/>}/>
        <Route path='/supplierreturninvoicedetail/:ids' element={<Supplierreturninvoicedetail/>}/>
        <Route path='/customerinvoice/:ids' element={<Printsaleinvoice/>}/>
        <Route path='/accountcontrol' element={<Homeaccountcontrol/>}/>
        <Route path='/accountflowsetting' element={<Homeaccountflowsetting/>}/>
        <Route path='/accountsubcontrol' element={<Homeaccountsubcontrol/>}/>
        <Route path='/branch' element={<Homebranch/>}/>
        <Route path='/reportdaybookpur' element={<Daybookpur/>}/>
        <Route path='/salereceiptreport' element={<Salereceiptreport/>}/>
        <Route path='/journalreport' element={<Journalentryreport/>}/>
        <Route path='/company' element={<Homecompany/>}/>
        <Route path='/financialyear' element={<Homefinancialyear/>}/>
        <Route path='/accountactivity' element={<HomeAccountActivity/>}/>
        <Route path='/accounthead' element={<Homeaccounthead/>}/>
        <Route path='/branchtype' element={<Homebranchtype/>}/>
        <Route path='/productcategory' element={<Homeproductcategory/>}/>
        <Route path='/userrights/:id' element={<Userrights/>}/>
        </>
        }
    </Routes>
}
       </div>
      </div>
    </div>
    </BrowserRouter> 

    </>
    
  );
}

export default App;
