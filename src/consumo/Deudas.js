import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Api from "../Conexion";
import moment from "moment";
import "moment/locale/es";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Recibo from "./Recibo";
import _ from "underscore";

const Deudas = (props) => {
  const [datos, setDatos] = useState([]);
  const [dato, setDato] = useState([]);
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState("");
  const [aux, setAux] = useState([]);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getDeudas();
      })
      .catch(() => {
        window.location.reload();
      });
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleChangeCliente = (e) => {
    setCliente(e.target.value);

    const busqueda = _.filter(datos, (item) => {
      return item.cliente.nombre
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setAux(busqueda);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getDeudas = () => {
    Api.service("consumo")
      .find({ query: { estado: false } })
      .then((response) => {
        setDatos(response.data);
        setAux(response.data);
      });
  };

  const pagar = (data) => {
    setDato(data);
    setShow(true);
    console.log(data);
  };

  const generarPago = () => {
    handleClose();
    Api.service("consumo")
      .patch(dato.id, { estado: true })
      .then((response) => {
        setDato({});
        getDeudas();
      });
  };

  return (
    <div>
      <div className="container">
        <div className="text-center">
          <h1> Pagos pendientes </h1>
        </div>
        <br />
        <input
          onChange={handleChangeCliente}
          className="form-control col-4"
          placeholder="Busqueda por Nombre"
          type="text"
          name="cliente"
          value={cliente}
        />
        <br />
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Codigo cliente</th>
                <th>Nombre Completo</th>
                <th>Numero de medidor</th>
                <th>Mes</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aux &&
                aux.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.cliente.codigo}</td>
                      <td>{dato.cliente.nombre}</td>
                      <td>{dato.cliente.codigo_medidor}</td>
                      <td>{moment(dato.mes_proceso).format("MMMM")}</td>
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

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Body>
          <Recibo dato={dato} ref={componentRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={generarPago}>
            Pagar
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Deudas;
