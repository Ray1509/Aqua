import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Conexion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import moment from "moment";
import "moment/locale/es";

const PagoMedidor = () => {
  const [medidores, setMedidores] = useState([]);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pago, setPago] = useState(null);
  const [pagoMedidor, setPagoMedidor] = useState({});

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getPagoMedidores();
      })
      .catch((error) => error);
  }, []);

  const desplegar = () => setShow(true);

  const handleChange = (e) => {
    setPago(e.target.value);
  };

  const getPagoMedidores = () => {
    Api.service("pago-medidor")
      .find({ query: { estado: false } })
      .then((result) => {
        setMedidores(result.data);
      });
  };

  const limpiar = () => {
    setShow(false);
    setValidated(false);
    setPago(null);
  };

  const pagarMedidor = (event) => {
    setShow(true);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    Api.service("pago-medidor")
      .patch(pagoMedidor.id, {
        saldo: pagoMedidor.saldo - pago,
        pago: pago,
        fecha: moment().format("DD-MMMM-YYYY"),
      })
      .then((resultado) => {
        Api.service("pago-medidor").create({
          pago: resultado.pago,
          saldo: resultado.saldo,
          fecha: resultado.fecha,
          medidorId: resultado.medidorId,
          estado: true,
        });
        getPagoMedidores();
        limpiar();
      })
      .catch((error) => error);
  };

  const pagar = (dato) => {
    desplegar();
    setPagoMedidor(dato);
  };

  return (
    <div>
      <div className="container">
        <div className="text-center">
          <h1> Pagos de Medidores </h1>
        </div>
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Codigo Medidor</th>
                <th>Propietario</th>
                <th>Costo Medidor</th>
                <th>Saldo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medidores &&
                medidores.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.medidor.codigo}</td>
                      <td>{dato.medidor.cliente.nombre}</td>
                      <td>{dato.medidor.precio}</td>
                      <td>{dato.saldo}</td>
                      <td>
                        <Button
                          variant="secondary mr-2"
                          onClick={() => pagar(dato)}
                          disabled={dato.saldo <= 0}
                        >
                          Pagar
                        </Button>
                        <Link
                          className="btn btn-warning"
                          to={`/pagomedidor/${dato.medidorId}`}
                        >
                          Pagos
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={limpiar}>
        <Modal.Header closeButton>
          <Modal.Title>Realizar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group as={Col} controlId="validacionNombre">
              <Form.Label>Monto a Pagar</Form.Label>
              <Form.Control
                required
                type="number"
                onChange={handleChange}
                name="pago"
                value={pago}
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
          <Button variant="primary" onClick={pagarMedidor}>
            Pagar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PagoMedidor;
