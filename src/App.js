import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home";
import Adicionales from "./adicionales/adicionales";
import Cliente from "./cliente/cliente";
import Zona from "./zona/zona";
import Consumo from "./consumo/consumo";
import Layout from './component/Layout'

const App = (props) => {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/adicionales" component={Adicionales} />
            <Route exact path="/cliente" component={Cliente} />
            <Route exact path="/zona" component={Zona} />
            <Route exact path="/consumo/:clienteId" component={Consumo} />
          </Switch>
        </Layout>
      </Router>
    </>
  );
};

export default App;
