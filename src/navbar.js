import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

class Navbarr extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand to="/">Aqua</Navbar.Brand>
        <Nav className="mr-auto text-white">
          <Link className="text-reset text-decoration-none mr-3" to="/cliente">
            Cliente
          </Link>
          <Link className="text-reset text-decoration-none mr-3" to="/zona">
            Zona
          </Link>
          <Link className="text-reset text-decoration-none" to="/adicionales">
            Adicionales
          </Link>
        </Nav>
      </Navbar>
    );
  }
}
export default Navbarr;
