import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Api from "../conexion";
import Navbarr from "../navbar";

const Zona = (props) => {
  const [state, setState] = useState({ form: { nombre: "" } });

  const [datos, verDatos] = useState([]);
  const [show, setShow] = useState(false);

  const ocultar = () => setShow(false);
  const desplegar = () => setShow(true);

  const handleChange = (e) => {
    setState({
      form: {
        ...state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  const crearZona = async () => {
    await Api.service("zona").create(state.form);
    setShow(ocultar);
  };

  useEffect(() => {
    Api.service("zona")
      .find()
      .then((response) => response)
      .then((data) => verDatos(data));
  }, []);

  return (
    <div>
      <Navbarr />
      <div className="container">
        <div>
          <h1 className="text-center"> Zona</h1>
          <Button variant="primary" onClick={desplegar}>
            Nueva Zona
          </Button>

          <Modal show={show} onHide={ocultar}>
            <Modal.Header closeButton>
              <Modal.Title>Nueva Zona</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    onChange={handleChange}
                    className="form-control"
                    type="text"
                    name="nombre"
                    value={state.form.nombre}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ocultar}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={crearZona}>
                Crear
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <br />
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{dato.nombre}</td>
                      <td>
                        <Button variant="link">Editar</Button>
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
