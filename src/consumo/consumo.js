import React, { useEffect, useState } from "react";
import Api from "../conexion";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Navbarr from "../navbar";

const Consumo = (props) => {
  const [lectura_actual, setLectura] = useState("");

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setLectura(e.target.value);
    console.log(e.target.name, e.target.value, "-------------");
  };

  const generarConsumo = () => {
    let nuevoConsumo = {
      lectura_actual: lectura_actual,
      consumo: lectura_actual - cliente.ultima_lectura,
      costo_consumo: 25 * (lectura_actual - cliente.ultima_lectura),
      costo_alcantarillado: 5,
      costo_multa: 5,
      mes_proceso: cliente.fecha_pago,
      total_pago: 5,
      fecha_pago: "2020-11-26T21:39:09.000Z",
    };
    Api.service("consumo")
      .create(nuevoConsumo)
      .then(() => {
        Api.service("cliente").patch(cliente.id, {
          fecha_pago: cliente.fecha_pago,
          ultima_lectura: lectura_actual
        });
      });
    console.log(nuevoConsumo);
    setShow(handleClose);
  };

  useEffect(() => {
    Api.service("cliente")
      .get(props.match.params.clienteId)
      .then((response) => setCliente(response));

    Api.service("consumo")
      .find({ query: { clienteId: props.match.params.clienteId } })
      .then((response) => setDatos(response));
  }, []);

  return (
    <div>
      <Navbarr />
      <div className="container">
        <div>
          <h1 className="text-center"> Consumo de cliente </h1>
          <Button variant="primary" onClick={handleShow}>
            Generar consumo
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Generar Nuevo Consumo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Lectura actual</label>
                  <input
                    onChange={handleChange}
                    className="form-control"
                    type="number"
                    name="lectura_actual"
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={generarConsumo}>
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
                <th>Numero recibo</th>
                <th>Cantidad consumida</th>
                <th>Costo consumo</th>
                <th>Alcantarillado</th>
                <th>Multa</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{dato.consumo}</td>
                      <td>{dato.costo_consumo}</td>
                      <td>{dato.costo_alcantarillado}</td>
                      <td>{dato.costo_multa}</td>
                      <td>{dato.total_pago}</td>
                      <td>{dato.estado}</td>
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

export default Consumo;
