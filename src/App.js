import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Switch,Route} from "react-router-dom";
import Header from './components/header/Header'
import AddProduct from "./components/addProduct/AddProduct";
import UpdateProduct from "./components/updateProduct/UpdateProduct";

function App() {
  return (
      <React.Fragment>
          <Header/>
          <Switch>
              <Route exact path="/" component={AddProduct}/>
              <Route exact path="/Update" component={UpdateProduct}/>
          </Switch>
      </React.Fragment>
  );
}

export default App;
