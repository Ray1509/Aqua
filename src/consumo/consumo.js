import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Api from "../Conexion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Recibo from "./Recibo";

import moment from "moment";
import "moment/locale/es";

const Consumo = (props) => {
  const clienteId = props.match.params.clienteId;

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);
  const [dato, setDato] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleClose = () => {
    setShow(false);
  };

  const verRecibo = (data) => {
    setDato(data);
    setShow(true);
  };

  const getConsumo = () => {
    Api.service("consumo")
      .find({ query: { clienteId: clienteId, estado: true } })
      .then((response) => {
        setDatos(response.data);
      });
  };

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getConsumo();
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-center"> Consumo de cliente </h1>
        </div>
        <br />
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Numero recibo</th>
                <th>Fecha de Pago</th>
                <th>Cantidad consumida</th>
                <th>Costo consumo</th>
                <th>Alcantarillado</th>
                <th>Multa</th>
                <th>Total</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datos &&
                datos.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{moment(dato.fecha_pago).format("DD-MMMM-YYYY")}</td>
                      <td>{dato.consumo}</td>
                      <td>{dato.costo_consumo}</td>
                      <td>{dato.costo_alcantarillado}</td>
                      <td>{dato.costo_multa}</td>
                      <td>{dato.total_pago}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => verRecibo(dato)}
                        >
                          Ver
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Body>
          <Recibo dato={dato} ref={componentRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Consumo;
