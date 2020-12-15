import React, { useEffect, useState } from "react";

import Api from "../Conexion";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const Precios = () => {
  const [precio, setPrecio] = useState({
    form: {
      minimo: "",
      maximo: "",
      precio: "",
      estado: false,
    },
  });
  const [show, setShow] = useState(false);
  const [editar, setEditar] = useState(false);
  const [datos, setDatos] = useState([]);

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

  const guardarPrecio = () => {
    if (editar) {
      Api.service("precio-consumo")
        .patch(precio.id, precio)
        .then(() => {
          getPrecios();
        });
    } else {
      Api.service("precio-consumo")
        .create(precio)
        .then(() => {
          getPrecios();
        });
    }
    limpiar();
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
        console.log(response);
        setDatos(response);
      });
  };

  const limpiar = () => {
    setEditar(false);
    setShow(false);
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
              <Form>
                <div className="row">
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Cantidad minima</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="number"
                        name="minimo"
                        value={precio.minimo}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Cantidad maxima</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="number"
                        name="maximo"
                        value={precio.maximo}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Precio unitario</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="number"
                        name="precio"
                        value={precio.precio}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handleChange}
                        name="estado"
                        value={precio.estado}
                        custom
                      >
                        <option value={false}>Deshabilitado</option>
                        <option value={true}>Habilitado</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
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
