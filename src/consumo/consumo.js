import React, { useEffect, useState } from "react";
import Api from "../conexion";
import Table from "react-bootstrap/Table";

const Consumo = (props) => {
  const clienteId = props.match.params.clienteId;

  const [datos, setDatos] = useState([]);

  const getConsumo = () => {
    Api.service("consumo")
      .find({ query: { clienteId: clienteId, estado: true } })
      .then((response) => setDatos(response));
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
                <th>Cantidad consumida</th>
                <th>Costo consumo</th>
                <th>Alcantarillado</th>
                <th>Multa</th>
                <th>Total</th>
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
