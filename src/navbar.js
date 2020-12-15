import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Api from "./Conexion";

const Navbarr = () => {
  const [login, setLogin] = useState(false);
  const [usuario, setUsuario] = useState({});

  const cerrarSesion = () => {
    Api.logout();
    window.location.reload();
  };

  useEffect(() => {
    Api.on("authenticated", (login) => {
      setUsuario(login.usuario);
      setLogin(true);
    });

    Api.on("logout", () => {
      setLogin(false);
    });
  }, []);

  return (
    <>
      {login ? (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand to="/">Aqua</Navbar.Brand>
          <Nav
            className="text-white"
            style={{ flexDirection: "column", width: "100%" }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <Link className="text-reset text-decoration-none mr-3" to="/">
                  Inicio
                </Link>
                <Link
                  className="text-reset text-decoration-none mr-3"
                  to="/cliente"
                >
                  Cliente
                </Link>
                {usuario.admin ? (
                  <Link
                    className="text-reset text-decoration-none mr-3"
                    to="/zona"
                  >
                    Zona
                  </Link>
                ) : null}
                {usuario.admin ? (
                  <Link
                    className="text-reset text-decoration-none mr-3"
                    to="/adicionales"
                  >
                    Adicionales
                  </Link>
                ) : null}
                {usuario.admin ? (
                  <Link
                    className="text-reset text-decoration-none mr-3"
                    to="/precios"
                  >
                    Precios
                  </Link>
                ) : null}
              </div>
              <div>
                <label className="mr-2">({usuario.usuario})</label>

                <Link
                  className="text-reset text-decoration-none text-end"
                  to="/"
                  onClick={cerrarSesion}
                >
                  Cerrar sesion
                </Link>
              </div>
            </div>
          </Nav>
        </Navbar>
      ) : null}
    </>
  );
};
export default Navbarr;
