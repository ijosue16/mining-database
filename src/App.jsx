import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ListTestContainer from './components/ListTestContainer';
import ProductsList from './Pages/ProductsList';
import AddProductPage from './Pages/AddProductPage';
import SalesListPage from './Pages/SalesListPage';
import PurchasesListPage from './Pages/PurchasesListPage';
import UsersListPage from './Pages/UsersListPage';
import SuppliersListPage from './Pages/SuppliersListPage';
import AddSalesPage from './Pages/AddSalesPage';
import AddPurchasePage from './Pages/AddPurchasePage';
import AddUserPage from './Pages/AddUserPage';
import AddSuplierPage from './Pages/AddSuplierPage';
import RegisterPage from './Authentications/RegisterPage';
import LoginPage from './Authentications/LoginPage';
import ResetPasswordPage from './Authentications/ResetPassword';
import ForgotPasswordPage from './Authentications/ForgotPassword';
import Framer from './Framer';
import RoleBasedRoute from './routes authentication/RoleBasedRoute';
import DefaultPages from './Pages/DefaultPages';
import EditUserPage from './Pages/EditUserPage';
import StoreKeeperData from './Pages/TransactionEntry';
import TrecabilityData from './Pages/TrecabilityData';
import LoginDatacontextProvider from './context files/LoginDatacontextProvider';
import ContractsistPage from './Pages/ContractListPage';
import BuyersListPage from './Pages/BuyersListPage';
import AddBuyerPage from './Pages/AddBuyerPage';
import PaymentsListPage from './Pages/PaymentsListPage';
import AddPaymentPage from './Pages/AddPaymentPage';
import EditBuyerPage from './Pages/EditBuyerPage';
import DummyPage from './test elements/DummyPage';
import BuyerDetailsPage from './Pages/BuyerDetails';
import EditPaymentPage from './Pages/EditPaymentPage';
import HookForm from './test elements/ReactHookForm';
import YourFormComponent from './test elements/CustomForm';
import EditSuplierPage from './Pages/EditSupplierPage';
import ListPopupContainer from './components/Listcomponents/ListWithPopupContainer';
import ListPopupContainerHeader from './components/Listcomponents/ListWithPopupContainer';
import SupplierDetailsPage from './Pages/SupplierDetailsPage';
import EditMinesitePage from './Pages/EditMinesitePage';
import PermissionsPage from './Pages/PermisionsPage';
import EntriesListPage from './Pages/EntriesListPage';
import TransactionEntry from './Pages/TransactionEntry';
import ColtanEntryForm from './Pages/coltan/entry/ColtanEntryForm';
import CassiteriteEntryForm from './Pages/cassiterite/entry/CassiteriteEntryForm';
import WolframiteEntryForm from './Pages/wolframite/entry/WolframiteEntryForm';
import LithiumEntryForm from './Pages/lithium/entry/LithiumEntryForm';
import BerylliumEntryForm from './Pages/beryllium/entry/BerylliumEntryForm';
import MixedEntryForm from './Pages/mixed/entry/MixedEntryForm';
import ColtanListPage from './Pages/coltan/ColtanList';
import ColtanEditForm from './Pages/coltan/entry/ColtanEditForm';
import ColtanEntryCompletePage from './Pages/coltan/entry/ColtanEntryComplete';
import ColtanPaymentsPage from './Pages/coltan/payment/ColtanPaymentsPage';
import Layout from './Layout/Layout';
import AccountantHistoryPage from './Pages/AccountantHistoryPage';
import StockPage from './Pages/shipment/StockPage';
import DragableContainer from './test elements/Dragablecontainer';
import DraggableResizableContainer from './test elements/Dragablecontainer';
import ResizableHandles from './test elements/Dragablecontainer';
import UserProfilePage from './Pages/UserProfilePage';
import ShipmentPage from './Pages/shipment/ShipmentPage';
import ShipmentCompletionPage from './Pages/shipment/ShipmentCompletionPage';
import FilesytemManger from './test elements/FilesytemManager';
import Appis from './test elements/FilesytemManager';
import FileExplorerApp from './test elements/FileExplore';
import FilesytemMangerSample from './test elements/FileExploreSample2';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ReportPage from './Pages/ReportPage';
import FetchingPage from './Pages/FetchingPage';
import LithiumListPage from './Pages/lithium/LithiumList';
import WolframiteListPage from './Pages/wolframite/WolframiteList';
import CassiteriteListPage from './Pages/cassiterite/CassiteriteList';
import BerylliumListPage from './Pages/beryllium/BerylliumList';
import CassiteriteEditForm from './Pages/cassiterite/entry/CassiteriteEditForm';
import WolframiteEditForm from './Pages/wolframite/entry/WolframiteEditForm';




function App() {


  return (
    <>
    <BrowserRouter>
      <ToastContainer
          pauseOnHover
          autoClose={3000}
      />
    <Routes>
    <Route element={<LoginDatacontextProvider/>}>
    <Route  element={<Layout/>}>
     
      
    <Route  path='*' element={<DefaultPages/>}/>
    <Route  path='/payment/:model/:entryId/:lotNumber' element={<ColtanPaymentsPage/>}/>
    <Route  path='/shipment/add/:model' element={<StockPage/>}/>
    <Route  path='/shipments' element={<ShipmentPage/>}/>
    <Route  path='/shipment/complete/:shipmentId' element={<ShipmentCompletionPage/>}/>
    <Route  path='/payment' element={<ColtanPaymentsPage/>}/>
    <Route  path='/dummy' element={<DummyPage/>}/>
    <Route  path='/dummy2' element={<FetchingPage/>}/>
    <Route  path='/dummy3' element={<FilesytemMangerSample/>}/>
    <Route  path='/report' element={<ReportPage/>}/>

    <Route  path='/coltan' element={<ColtanListPage/>}/>
    <Route  path='/cassiterite' element={<CassiteriteListPage/>}/>
    <Route  path='/wolframite' element={<WolframiteListPage/>}/>
    <Route  path='/lithium' element={<LithiumListPage/>}/>
    <Route  path='/beryllium' element={<BerylliumListPage/>}/>
    <Route  path='/mixed' element={<MixedEntryForm/>}/>

    <Route  path='/entry/add/coltan' element={<ColtanEntryForm/>}/>
    <Route  path='/entry/add/cassiterite' element={<CassiteriteEntryForm/>}/>
    <Route  path='/entry/add/wolframite' element={<WolframiteEntryForm/>}/>
    <Route  path='/entry/add/lithium' element={<LithiumEntryForm/>}/>
    <Route  path='/entry/add/beryllium' element={<BerylliumEntryForm/>}/>
  

    <Route  path='/entry/edit/coltan/:entryId' element={<ColtanEditForm/>}/>
    <Route  path='/entry/edit/cassiterite/:entryId' element={<CassiteriteEditForm/>}/>
    <Route  path='/entry/edit/wolframite/:entryId' element={<WolframiteEditForm/>}/>
    <Route  path='/entry/edit/lithium/:entryId' element={<ColtanEditForm/>}/>
    
    <Route  path='/complete/coltan/:entryId' element={<ColtanEntryCompletePage/>}/>

    <Route  path='/test' element={<EditMinesitePage/>}/>
    <Route  path='/sales'element={<SalesListPage/>}/>
    <Route  path='/purchases' element={<PurchasesListPage/>}/>
    <Route  path='/users' element={<UsersListPage/>}/>
    <Route  path='/profile' element={<UsersListPage/>}/>
    <Route  path='/suppliers' element={<SuppliersListPage/>}/>
    <Route  path='/add/supplier' element={<AddSuplierPage/>}/>
    <Route  path='/supplier/details/:supplierId' element={<SupplierDetailsPage/>}/>
    <Route  path='/edit/supplier/:supplierId' element={<EditSuplierPage/>}/>
    <Route  path='/edit/supplier/minesite/:supplierId' element={<EditMinesitePage/>}/>
    <Route  path='/payments' element={<PaymentsListPage/>}/>
    <Route  path='/edit/payment/:paymentId' element={<EditPaymentPage/>}/>
    <Route  path='/add/payment' element={<AddPaymentPage/>}/>
    <Route  path='/buyers' element={<BuyersListPage/>}/>
    <Route  path='/edit/buyer/:buyerId' element={<EditBuyerPage/>}/>
    <Route  path='/buyer/details/:buyerId' element={<BuyerDetailsPage/>}/>
    <Route  path='/add/buyer' element={<AddBuyerPage/>}/>
    <Route  path='/entry/storekeeper' element={<TransactionEntry/>}/>
    <Route  path='/entry/trecability' element={<TrecabilityData/>}/>
    <Route  path='/add/product' element={<AddProductPage/>}/>
    <Route  path='/add/sale' element={<AddSalesPage/>}/>
    <Route  path='/add/purchase' element={<AddPurchasePage/>}/>
    <Route  path='/add/user' element={<AddUserPage/>}/>
    <Route  path='/edit/user' element={<EditUserPage/>}/>
    <Route  path='/add/supplier' element={<AddSuplierPage/>}/>
    <Route  path='/contracts' element={<ContractsistPage/>}/>
    <Route  path='/register' element={<RegisterPage/>}/>
    <Route  path='/login' element={<LoginPage/>}/>
    <Route  path='/password/reset' element={<ResetPasswordPage/>}/>
    <Route  path='/password/forgot' element={<ForgotPasswordPage/>}/>
    <Route  path='/framer' element={<Framer/>}/>
    <Route  path='/wee' element={<RoleBasedRoute/>}/>
    
    </Route>
    </Route>
      {/* <Route element={<Layout/>}>
        <Route  path='/' element={<ListContainer/>}/>
        <Route  path='/add/product' element={<ActionsPagesContainer/>}/>
       
      </Route> */}
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
