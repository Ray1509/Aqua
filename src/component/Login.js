import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Api from "../conexion";

const Login = (props) => {
  const { fnLogin } = props
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')

  const handleChangeUsuario = (e) => {
    setUsuario(e.target.value)
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  };

  const iniciarSesion = () => {
    Api.authenticate({
      strategy: "local",
      usuario: usuario,
      password: password,
    }).then((user) => {
      // props.history.push("/cliente");
      // window.location.reload();
      fnLogin()
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido</h1>
        <form>
          <div className="form-group">
            <label>Usuario</label>
            <input
              onChange={handleChangeUsuario}
              className="form-control"
              type="text"
              name="usuario"
              value={usuario}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={handleChangePassword}
              className="form-control"
              type="password"
              name="password"
              value={password}
            />
          </div>
          <div>
            <Button className="mr-3" variant="secondary">
              Nuevo Usuario
            </Button>
            <Button variant="primary" onClick={iniciarSesion}>
              Ingresar
            </Button>
          </div>
        </form>
      </header>
    </div>
  );
};

export default Login;
