import React, { useEffect, useState } from "react";
import Api from "../conexion";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Deudas = (props) => {
  const [datos, setDatos] = useState([]);
  const [dato, setDato] = useState([]);
  const [show, setShow] = useState(false);


  useEffect(() => {
    Api.authenticate().then(() => {
      getDeudas()
    }).catch(() => {
      window.location.reload();
    })
  }, []);

  const handleClose = () => {
    setShow(false)
  }

  const getDeudas = () => {
    Api.service("consumo")
      .find({ query: { estado: false } })
      .then((response) => setDatos(response.data));
  }

  const pagar = (data) => {
    console.log(data);
    setDato(data)
    setShow(true)
  }
  const generarPago = () => {
    handleClose()
    Api.service("consumo")
      .patch(dato.id, { estado: true })
      .then((response) => {
        setDato({})
        getDeudas()
      });
  }




  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-center"> Consumo de cliente </h1>
          {/* <Button variant="primary" onClick={handleShow}>
            Generar consumo
          </Button> */}
        </div>
        <br />
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Cantidad consumida</th>
                <th>Costo consumo</th>
                <th>Alcantarillado</th>
                <th>Multa</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos &&
                datos.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.cliente.nombre}</td>
                      <td>{dato.consumo}</td>
                      <td>{dato.costo_consumo}</td>
                      <td>{dato.costo_alcantarillado}</td>
                      <td>{dato.costo_multa}</td>
                      <td>{dato.total_pago}</td>
                      <td>
                        <Button variant="secondary" onClick={() => pagar(dato)}>
                          Pagar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Costo consumo</label>
              <input
                className="form-control"
                type="text"
                disabled
                value={dato.costo_consumo}
              />
            </div>
            <div className="form-group">
              <label>Alcantarillado</label>
              <input
                className="form-control"
                type="text"
                disabled
                value={dato.costo_alcantarillado}
              />
            </div>
            <div className="form-group">
              <label>Multa</label>
              <input
                className="form-control"
                type="text"
                disabled
                value={dato.costo_multa}
              />
            </div>
            <div className="form-group">
              <label>TOTAL</label>
              <input
                className="form-control"
                type="text"
                disabled
                value={dato.total_pago}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={generarPago}>
            Pagar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Deudas;
