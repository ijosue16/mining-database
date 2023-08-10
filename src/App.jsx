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
import MyContextProvider from './context files/MycontextProvider';
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




function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route  element={<Layout/>}>
      <Route element={<MyContextProvider/>}>
      
    <Route  path='*' element={<DefaultPages/>}/>
    <Route  path='/dummy' element={<Layout/>}/>

    <Route  path='/coltan' element={<ColtanListPage/>}/>
    <Route  path='/cassiterite' element={<ProductsList/>}/>
    <Route  path='/wolframite' element={<ProductsList/>}/>
    <Route  path='/lithium' element={<ProductsList/>}/>
    <Route  path='/beryllium' element={<ProductsList/>}/>
    <Route  path='/mixed' element={<ProductsList/>}/>

    <Route  path='/entry/add/coltan' element={<ColtanEntryForm/>}/>

    <Route  path='/edit/coltan/:entryId' element={<ColtanEditForm/>}/>
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
