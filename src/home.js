import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Api from "./conexion";

const Home = (props) => {
  const [state, setState] = useState({
    form: { usuario: "", password: "" },
  });
  const handleChange = (e) => {
    setState({
      form: {
        ...state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  const iniciarSesion = () => {
    Api.authenticate({
      strategy: "local",
      usuario: state.form.usuario,
      password: state.form.password,
    }).then((user) => {
      props.history.push("/cliente");
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
              onChange={handleChange}
              className="form-control"
              type="text"
              name="usuario"
              value={state.form.usuario}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={handleChange}
              className="form-control"
              type="password"
              name="password"
              value={state.form.password}
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

export default Home;
