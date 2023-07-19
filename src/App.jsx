import { Component, useState } from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import ProductListContainer from './components/Listcomponents/ProductListContainer';
import ListTestContainer from './components/ListTestContainer';
import ActionsPagesContainer from './components/Actions components/ActionsComponent container';
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
import StoreKeeperData from './Pages/StoreKeeperData';
import TrecabilityData from './Pages/TrecabilityData';




function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route  element={<ListTestContainer/>}>
    <Route  path='*' element={<DefaultPages/>}/>
    <Route  path='/products' element={<ProductsList/>}/>
    <Route  path='/sales'element={<SalesListPage/>}/>
    <Route  path='/purchases' element={<PurchasesListPage/>}/>
    <Route  path='/users' element={<UsersListPage/>}/>
    <Route  path='/suppliers' element={<SuppliersListPage/>}/>
    <Route  path='/entry/storekeeper' element={<StoreKeeperData/>}/>
    <Route  path='/entry/trecability' element={<TrecabilityData/>}/>
    <Route  path='/add/product' element={<AddProductPage/>}/>
    <Route  path='/add/sale' element={<AddSalesPage/>}/>
    <Route  path='/add/purchase' element={<AddPurchasePage/>}/>
    <Route  path='/add/user' element={<AddUserPage/>}/>
    <Route  path='/edit/user' element={<EditUserPage/>}/>
    <Route  path='/add/supplier' element={<AddSuplierPage/>}/>
    <Route  path='/register' element={<RegisterPage/>}/>
    <Route  path='/login' element={<LoginPage/>}/>
    <Route  path='/password/reset' element={<ResetPasswordPage/>}/>
    <Route  path='/password/forgot' element={<ForgotPasswordPage/>}/>
    <Route  path='/framer' element={<Framer/>}/>
    <Route  path='/wee' element={<RoleBasedRoute/>}/>
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
