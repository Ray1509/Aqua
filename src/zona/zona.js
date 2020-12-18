import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Api from "../Conexion";

const Zona = (props) => {
  const [nombre, setNombre] = useState(null);
  const [editing, setEditing] = useState(false);
  const [datos, verDatos] = useState([]);
  const [dato, setDato] = useState({});
  const [show, setShow] = useState(false);

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getZonas();
      })
      .catch(() => {});
  }, []);

  const limpiar = () => {
    setEditing(false);
    setDato({});
    setShow(false);
    setNombre(null);
    setValidated(false);
  };
  const desplegar = () => setShow(true);

  const handleChange = (e) => {
    setNombre(e.target.value);
  };

  const saveZona = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (editing) {
      Api.service("zona")
        .patch(dato.id, { nombre })
        .then(() => {
          getZonas();
          limpiar();
        })
        .catch((error) => error);
    } else {
      Api.service("zona")
        .create({ nombre })
        .then(() => {
          getZonas();
          limpiar();
        })
        .catch((error) => error);
    }
  };
  const editarZona = (dato) => {
    setDato(dato);
    setNombre(dato.nombre);
    desplegar();
    setEditing(true);
  };

  const getZonas = () => {
    Api.service("zona")
      .find()
      .then((data) => verDatos(data));
  };

  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-center"> Zona</h1>
          <Button variant="primary" onClick={desplegar}>
            Nueva Zona
          </Button>

          <Modal show={show} onHide={limpiar}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing ? "Editar Zona" : "Nueva Zona"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated}>
                <Form.Group as={Col} controlId="validacionNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={handleChange}
                    name="nombre"
                    value={nombre || ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    Este campo es obigatorio
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={limpiar}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={saveZona}>
                {editing ? "Guardar" : "Crear"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <br />
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato, num) => {
                  return (
                    <tr key={dato.id}>
                      <td>{num + 1}</td>
                      <td>{dato.nombre}</td>
                      <td>
                        <Button variant="link" onClick={() => editarZona(dato)}>
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

export default Zona;
