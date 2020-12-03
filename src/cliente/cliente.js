import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "moment/locale/es";
import Modal from "react-bootstrap/Modal";
import Api from "../conexion";

const Cliente = () => {
  const [state, setState] = useState({
    form: {
      nombre: "",
      codigo: "",
      ci: "",
      fecha_pago: "",
      ultima_lectura: "",
      codigoMedidor: "",
    },
  });

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    Api.authenticate().then(() => {
      getClientes();
    }).catch((error) => { console.log(error); })
  }, [])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setState({
      form: {
        ...state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  const crearCliente = async () => {
    await Api.service("cliente")
      .create(state.form)
      .then(() => {
        getClientes();
      });
    handleClose()
    setState({
      form: {
        nombre: "",
        codigo: "",
        ci: "",
        fecha_pago: "",
        ultima_lectura: "",
        codigoMedidor: "",
      },
    });
  };

  const getClientes = () => {
    Api.service("cliente")
      .find()
      .then((response) => {
        console.log(response.data);
        setDatos(response)
      });
  };


  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-center"> Cliente </h1>
          <Button variant="primary" onClick={handleShow}>
            Nuevo Cliente
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Nuevo Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="row">
                  <div className="col">
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
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Codigo</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="number"
                        name="codigo"
                        value={state.form.codigo}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>C.I.</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="text"
                        name="ci"
                        value={state.form.ci}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Fecha de pago</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="date"
                        name="fecha_pago"
                        value={state.form.fecha_pago}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>Ultima lectura</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="number"
                        name="ultima_lectura"
                        value={state.form.ultima_lectura}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Codigo de medidor</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="text"
                        name="codigoMedidor"
                        value={state.form.codigoMedidor}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={crearCliente}>
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
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Fecha pago</th>
                <th>Ultima lectura</th>
                <th>Codigo de Medidor</th>
                <th>Acctiones</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.codigo}</td>
                      <td>{dato.nombre}</td>
                      <td>{moment(dato.fecha_pago).format("D, MMMM")}</td>
                      <td>{dato.ultima_lectura}</td>
                      <td>{dato.codigoMedidor}</td>
                      <td>
                        <Link
                          className="btn btn-success mr-2"
                          to={`/cliente/${dato.id}`}
                        >
                          Ver
                        </Link>
                        <Link
                          className="btn btn-warning"
                          to={`/consumo/${dato.id}`}
                        >
                          Cobrar
                        </Link>
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

export default Cliente;
