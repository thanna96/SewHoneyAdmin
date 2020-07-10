import React from 'react';
import './App.css';
import {Switch,Route} from "react-router-dom";
import Header from './components/header/Header'
import AddProduct from "./components/addProduct/AddProduct";
import UpdateProduct from "./components/updateProduct/UpdateProduct";
import LoginPage from "./components/loginPage/LoginPage";

function App() {
  return (
      <React.Fragment>
          <Header/>
          <Switch>
              <Route exact path="/AddProduct" component={AddProduct}/>
              <Route exact path="/Update" component={UpdateProduct}/>
              <Route component={LoginPage}/>
          </Switch>
      </React.Fragment>
  );
}

export default App;
