import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Conexion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "moment/locale/es";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const DeudasMedidor = () => {
  const [clientes, setClientes] = useState([]);
  const [show, setShow] = useState(false);
  const [pago, setPago] = useState(0);
  const [validated, setValidated] = useState(false);
  const [cliente, setCliente] = useState({});
  const desplegar = () => setShow(true);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getClientes();
      })
      .catch((error) => error);
  }, []);

  const getClientes = () => {
    Api.service("cliente")
      .find({ query: { medidorId: { $ne: null } } })
      .then((res) => {
        setClientes(res.data);
      });
  };

  const handleChange = (e) => {
    setPago(e.target.value);
  };

  const limpiar = () => {
    setShow(false);
    setPago(0);
    setValidated(false);
  };

  const pagar = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    Api.service("pago-medidor")
      .create({
        pago: pago,
        fecha: moment().format("YYYY-MM-DD"),
        medidorId: cliente.medidorId,
      })
      .then(() => {
        Api.service("medidor")
          .patch(cliente.medidor.id, {
            saldo: cliente.medidor.saldo - pago,
          })
          .then(() => {
            limpiar();
            getClientes();
          });
      });
  };

  const modal = (dato) => {
    desplegar();
    setCliente(dato);
  };

  return (
    <div>
      <div className="container-fluid">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Codigo medidor</th>
              <th>Precio medidor</th>
              <th>Saldo</th>
              <th>Propietario</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {clientes &&
              clientes.map((dato) => {
                return (
                  <tr key={dato.id}>
                    <td>{dato.medidor.codigo}</td>
                    <td>{dato.medidor.precio}</td>
                    <td>{dato.medidor.saldo}</td>
                    <td>{dato.nombre}</td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => modal(dato)}
                        disabled={dato.medidor.saldo <= 0}
                      >
                        Pagar
                      </Button>
                      <Link
                        className="btn btn-warning ml-2"
                        to={`/pagomedidor/${dato.medidor.id}`}
                      >
                        Historial
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={limpiar}>
        <Modal.Header closeButton>
          <Modal.Title>Pago Medidor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group as={Col} controlId="validacionPago">
              <Form.Label>Monto a pagar</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={handleChange}
                name="pago"
                value={pago || ""}
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
          <Button variant="primary" onClick={pagar}>
            Pagar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeudasMedidor;
