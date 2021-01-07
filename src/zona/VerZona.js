import React, { useState, useEffect } from "react";
import Api from "../Conexion";
import Table from "react-bootstrap/Table";

const VerZona = (props) => {
  const zonaId = props.match.params.zonaId;
  const [clientes, setClientes] = useState([]);

  const getClientes = () => {
    Api.service("cliente")
      .find({
        query: { zonaId: zonaId },
      })
      .then((response) => {
        setClientes(response.data);
      });
  };

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getClientes();
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-center"> Clientes por Zona </h1>
        </div>
        <br />
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>C.I.</th>
                <th>Codigo Medidor</th>
                <th>Zona</th>
              </tr>
            </thead>
            <tbody>
              {clientes &&
                clientes.map((cliente) => {
                  return (
                    <tr key={cliente.id}>
                      <td>{cliente.codigo}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.ci}</td>
                      <td>{cliente.medidor ? cliente.medidor.codigo : ""}</td>
                      <td>{cliente.zona.nombre}</td>
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

export default VerZona;
