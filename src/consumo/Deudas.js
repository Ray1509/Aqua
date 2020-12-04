import React, { useEffect, useState } from "react";
import Api from "../conexion";
import moment from "moment";
import "moment/locale/es";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Deudas = (props) => {
  const [datos, setDatos] = useState([]);
  const [dato, setDato] = useState([]);
  const [show, setShow] = useState(false);

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

  const getDeudas = () => {
    Api.service("consumo")
      .find({ query: { estado: false } })
      .then((response) => {
        setDatos(response.data);
      });
  };

  const pagar = (data) => {
    setDato(data);
    setShow(true);
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
              {datos &&
                datos.map((dato) => {
                  return (
                    <tr key={dato.id}>
                      <td>{dato.cliente.codigo}</td>
                      <td>{dato.cliente.nombre}</td>
                      <td>{dato.cliente.codigoMedidor}</td>
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

      <Modal show={show} onHide={handleClose} size="lg">
        <div className="container">
          <br />
          <div className="text-center">
            <h3>Servicio de Agua Potable "San Pablo Laguna Sulty"</h3>
            <h5>RECIBO POR EL PAGO DE SERVICIOS</h5>
          </div>
          <Modal.Body>
            <div>
              <div className="row">
                <div className="col-8">
                  <strong className="col-4">Nombre Socio</strong>
                  <label>Juan Carlos Vargas Maldonado</label>
                </div>
                <div className="col-4">
                  <strong className="col-4">Código</strong>
                  <label>54613165461354</label>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <strong className="col-4">Numero de Medidor</strong>
                  <label>sdgf651dag1320asd</label>
                </div>
                <div className="col-6">
                  <strong className="col-4">Ubicacion</strong>
                  <label>Zona Norte</label>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <strong className="col-4">Mes Proceso</strong>
                  <label>Enero-2020</label>
                </div>
                <div className="col-6">
                  <strong className="col-4">Fecha de Pago</strong>
                  <label>20/2/2020</label>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <strong className="col-5">Lectura Anterior</strong>
                  <label>100</label>
                </div>
                <div className="col-4">
                  <strong className="col-5">Lectura Actual</strong>
                  <label>110</label>
                </div>
                <div className="col-4">
                  <strong className="col-5">Consumo</strong>
                  <label>10 Cubos</label>
                </div>
              </div>
              <div className="row">
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th className="text-center col">Detalle</th>
                      <th className="text-center"> Importe </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Costo Consumo</td>
                      <td className="text-center">15</td>
                    </tr>
                    <tr>
                      <td>Multa</td>
                      <td className="text-center">5</td>
                    </tr>
                    <tr>
                      <td>Alcantarillado</td>
                      <td className="text-center">5</td>
                    </tr>
                    <tr>
                      <td>
                        <b> Total a Pagar</b>
                      </td>
                      <td className="text-center">25</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
        </div>
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
