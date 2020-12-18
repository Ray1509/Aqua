import React, { useEffect, useState } from "react";

import Api from "../Conexion";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const Precios = () => {
  const [precio, setPrecio] = useState({
    minimo: "",
    maximo: "",
    precio: "",
    estado: undefined,
  });
  const [show, setShow] = useState(false);
  const [editar, setEditar] = useState(false);
  const [datos, setDatos] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getPrecios();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const desplegar = () => setShow(true);

  const handleChange = (e) => {
    setPrecio({
      ...precio,
      [e.target.name]: e.target.value,
    });
  };

  const guardarPrecio = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (editar) {
      Api.service("precio-consumo")
        .patch(precio.id, precio)
        .then((res) => {
          getPrecios();
          limpiar();
        })
        .catch((error) => error);
    } else {
      Api.service("precio-consumo")
        .create(precio)
        .then((res) => {
          getPrecios();
          limpiar();
        })
        .catch((error) => error);
    }
  };

  const editarPrecio = (dato) => {
    setPrecio(dato);
    setShow(true);
    setEditar(true);
  };

  const getPrecios = () => {
    Api.service("precio-consumo")
      .find()
      .then((response) => {
        setDatos(response);
      });
  };

  const limpiar = () => {
    setPrecio({
      minimo: "",
      maximo: "",
      precio: "",
      estado: undefined,
    });
    setEditar(false);
    setShow(false);
    setValidated(false);
  };

  return (
    <div>
      <h1 className="text-center">Precios </h1>
      <br />
      <div className="container">
        <Button variant="primary" onClick={desplegar}>
          Nuevo Precio
        </Button>
        <div>
          <Modal show={show} onHide={limpiar}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editar ? "Editar Precio" : "Nuevo Precio"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated}>
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validacionMinimo">
                    <Form.Label>Cantidad minima</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      type="number"
                      name="minimo"
                      value={precio.minimo}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validacionMaximo">
                    <Form.Label>Cantidad maxima</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      type="number"
                      name="maximo"
                      value={precio.maximo}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validacionPrecio">
                    <Form.Label>Precio unitario</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      type="number"
                      name="precio"
                      value={precio.precio}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validacionEstado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      onChange={handleChange}
                      name="estado"
                      value={precio.estado}
                      custom
                    >
                      <option value=""> </option>
                      <option value={false || 0}>Deshabilitado</option>
                      <option value={1 || true}>Habilitado</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={limpiar}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardarPrecio}>
                {editar ? "Guardar" : "Crear"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <br />
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Minimo</th>
                <th>Maximo</th>
                <th>Precio unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.minimo}</td>
                      <td>{dato.maximo}</td>
                      <td>{dato.precio}</td>
                      <td>{dato.estado}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => editarPrecio(dato)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default Precios;
