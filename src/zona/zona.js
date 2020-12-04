import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Api from "../conexion";

const Zona = (props) => {
  const [nombre, setNombre] = useState("");
  const [editing, setEditing] = useState(false);
  const [datos, verDatos] = useState([]);
  const [dato, setDato] = useState({});

  const [show, setShow] = useState(false);

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
    setNombre("");
  };
  const desplegar = () => setShow(true);

  const handleChange = (e) => {
    setNombre(e.target.value);
  };

  const saveZona = () => {
    if (editing) {
      Api.service("zona")
        .patch(dato.id, { nombre })
        .then(() => {
          getZonas();
        });
    } else {
      Api.service("zona")
        .create({ nombre })
        .then(() => {
          getZonas();
        });
    }
    limpiar();
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
              <form>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    onChange={handleChange}
                    className="form-control"
                    type="text"
                    value={nombre}
                  />
                </div>
              </form>
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
