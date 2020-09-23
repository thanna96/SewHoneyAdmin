import React from 'react';
import './App.css';
import {Redirect, Route, Switch} from "react-router-dom";
import Header from './components/header/Header'
import AddProduct from "./components/addProduct/AddProduct";
import UpdateProduct from "./components/updateProduct/UpdateProduct";
import LoginPage from "./components/loginPage/LoginPage";
import SuccessModal from "./components/successModal/SuccessModal";

const checkAuth = () =>{
    return localStorage.getItem('token');
}

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        checkAuth() ? (
            <Component {...props} />
        ) : (
            <Redirect to='/Login' />
        )
    )} />
)

function App() {
  return (
      <React.Fragment>
          <Header/>
          <Switch>
              <AuthRoute exact path="/AddProduct" component={AddProduct}/>
              <AuthRoute exact path="/Update" component={UpdateProduct}/>
              <Route component={LoginPage}/>
          </Switch>
          <SuccessModal/>
      </React.Fragment>
  );
}

export default App;
