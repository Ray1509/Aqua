import React, { useEffect, useState } from "react";
import Api from "../Conexion";
import Table from "react-bootstrap/Table";

const HistorialPagos = (props) => {
  const medidorId = props.match.params.medidorId;
  const [pagos, setPagos] = useState([]);
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getHistorial();
      })
      .catch(() => {});
  }, []);

  const getHistorial = () => {
    Api.service("pago-medidor")
      .find({
        query: { medidorId: medidorId },
      })
      .then((response) => {
        setPagos(response.data);
      });
    Api.service("cliente")
      .find({ query: { medidorId: medidorId } })
      .then((res) => {
        setCliente(res.data[0]);
      });
  };

  return (
    <div>
      <h1 className="text-center">Historial de pagos de {cliente.nombre}</h1>
      <br />
      <div className="container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Codigo Medidor</th>
              <th>Pago</th>
              <th>fecha de pago</th>
            </tr>
          </thead>
          <tbody>
            {pagos &&
              pagos.map((dato) => {
                return (
                  <tr key={dato.id}>
                    <td>{dato.medidor.codigo}</td>
                    <td>{dato.pago}</td>
                    <td>{dato.fecha}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default HistorialPagos;
