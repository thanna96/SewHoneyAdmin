import React from 'react';
import './App.css';
import {Switch,Route, Redirect} from "react-router-dom";
import Header from './components/header/Header'
import AddProduct from "./components/addProduct/AddProduct";
import UpdateProduct from "./components/updateProduct/UpdateProduct";
import LoginPage from "./components/loginPage/LoginPage";

const checkAuth = () =>{
    const token = localStorage.getItem('token');
    return token;
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
      </React.Fragment>
  );
}

export default App;
