import React, {useEffect}from "react";
import {Routes, Route, useNavigate,useLocation} from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Success from "./pages/Success";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state)=>state.user.currentUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    const checkLoggedInAndRedirect = ()=>{
      if (user && (location.pathname === "/login")){
        navigate("/");
      }
    };
    checkLoggedInAndRedirect();
  },[user,navigate,location]);
  return (
    <>
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/products/:category" element={<ProductList />}/>
        <Route path="/product/:id" element={<Product />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/success" element={<Success />}/>
        <Route path="/register" element={<Register /> }/>
    </Routes>
    </>
  );
};

export default App;
