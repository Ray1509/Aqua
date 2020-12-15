import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Api from "../Conexion";

const Login = (props) => {
  const { fnLogin } = props;
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChangeUsuario = (e) => {
    setUsuario(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChange = (e) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const iniciarSesion = () => {
    Api.authenticate({
      strategy: "local",
      usuario: usuario,
      password: password,
    })
      .then((user) => {
        fnLogin();
      })
      .catch((error) => error);
  };

  const desplegar = () => setShow(true);
  const limpiar = () => {
    setNuevoUsuario({ nombre: "", apellido: "", usuario: "", password: "" });
    setShow(false);
    setValidated(false);
  };

  const crearUsuario = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    Api.service("usuario")
      .create(nuevoUsuario)
      .then(() => {
        limpiar();
      })
      .catch((error) => error);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido</h1>
        <Form>
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              onChange={handleChangeUsuario}
              name="usuario"
              value={usuario}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={handleChangePassword}
              type="password"
              name="password"
              value={password}
            />
          </Form.Group>
          <div>
            <Button className="mr-3" variant="secondary" onClick={desplegar}>
              Nuevo Usuario
            </Button>
            <Button variant="primary" onClick={iniciarSesion}>
              Ingresar
            </Button>
          </div>
        </Form>
        <Modal show={show} onHide={limpiar}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated}>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validacionNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={handleChange}
                    name="nombre"
                    value={nuevoUsuario.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    Este campo es obigatorio
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validacionApellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={handleChange}
                    name="apellido"
                    value={nuevoUsuario.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    Este campo es obigatorio
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validacionUsuario">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={handleChange}
                    name="usuario"
                    value={nuevoUsuario.usuario}
                  />
                  <Form.Control.Feedback type="invalid">
                    Este campo es obigatorio
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validacionPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    onChange={handleChange}
                    name="password"
                    value={nuevoUsuario.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    Este campo es obigatorio
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row className="justify-content-md-center">
                <Button className="mr-3" variant="secondary" onClick={limpiar}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={crearUsuario}>
                  Crear
                </Button>
              </Form.Row>
            </Form>
          </Modal.Body>
        </Modal>
      </header>
    </div>
  );
};

export default Login;
