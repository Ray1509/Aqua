import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Api from "../conexion";
import Navbarr from "../navbar";
import _ from 'underscore';

const Adicionales = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    Api.service("adicionales")
      .find()
      .then((data) => setDatos(data));
  }, []);

  return (
    <div>
      <Navbarr />
      <div>
        <h1 className="text-center"> Adicionales </h1>
        <br />
        <div className="container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                <>
                  {
                    _.map(datos.data, (dato) => {
                      return (
                        <>
                          <tr key={dato.id}>
                            <td>{dato.id}</td>
                            <td>{dato.nombre}</td>
                            <td>
                              <Button variant="link">Editar</Button>
                            </td>
                          </tr>
                        </>
                      )
                    })
                  }
                </>
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Adicionales;
