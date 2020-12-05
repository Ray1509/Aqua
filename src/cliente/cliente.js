import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "moment/locale/es";
import Modal from "react-bootstrap/Modal";
import Api from "../conexion";
import ClienteItem from "./ClienteItem";
import Form from "react-bootstrap/Form";
import _ from "underscore";

const Cliente = (props) => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    codigo: "",
    ci: "",
    fecha_pago: "",
    ultima_lectura: "",
    codigo_medidor: "",
    zonaId: null,
  });
  const [editar, setEditar] = useState(false);

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [alcantarillado, setAlcantarillado] = useState(0);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getZonas();
        getClientes();
        getAdicionales();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const desplegar = () => setShow(true);

  const limpiar = () => {
    setEditar(false);
    setShow(false);
    setFormulario({});
  };

  const handleChange = (e) => {
    console.log(e.target.value, e.target.name);
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCliente = () => {
    console.log("aaaaaaaaaaaaaa", formulario);
    if (editar) {
      Api.service("cliente")
        .patch(formulario.id, formulario)
        .then(() => {
          console.log(formulario);
          getClientes();
        });
    } else {
      Api.service("cliente")
        .create(formulario)
        .then(() => {
          getClientes();
        });
    }
    limpiar();
  };

  const getClientes = () => {
    Api.service("cliente")
      .find()
      .then((response) => {
        setDatos(response);
      });
  };

  const getZonas = () => {
    Api.service("zona")
      .find()
      .then((response) => {
        setZonas(response.data);
      });
  };

  const getAdicionales = () => {
    Api.service("adicionales")
      .find()
      .then((response) => {
        const costo_alcantarillado = _.find(response.data, (item) => {
          return item.nombre === "Alcantarillado";
        });
        setAlcantarillado(costo_alcantarillado.costo);
      });
  };

  const editarCliente = (cliente) => {
    setFormulario(cliente);
    // setFormulario({
    //   ...cliente,
    //   fecha_pago: moment(cliente.fecha_pago).add(1, "days"),
    // });
    console.log("aaaaaaaaaaaa", cliente);
    setShow(true);
    setEditar(true);
  };

  return (
    <div>
      <div className="container-fluid">
        <div>
          <h1 className="text-center"> Cliente </h1>
          <Button variant="primary" onClick={desplegar}>
            Nuevo Cliente
          </Button>
          <Modal show={show} onHide={limpiar}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editar ? "Editar Cliente" : "Nuevo Cliente"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div className="row">
                  <div className="col">
                    <Form.Group>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        name="nombre"
                        value={formulario.nombre}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Form.Group>
                      <Form.Label>Codigo</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="number"
                        name="codigo"
                        value={formulario.codigo}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group>
                      <Form.Label>C.I.</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        name="ci"
                        value={formulario.ci}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Form.Group>
                      <Form.Label>Fecha de pago</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="date"
                        name="fecha_pago"
                        value={moment(formulario.fecha_pago).format(
                          "YYYY-MM-DD"
                        )}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group>
                      <Form.Label>Ultima lectura</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        type="number"
                        name="ultima_lectura"
                        value={formulario.ultima_lectura}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-7">
                    <Form.Group>
                      <Form.Label>Codigo de medidor</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        name="codigo_medidor"
                        value={formulario.codigo_medidor}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-5">
                    <Form.Group>
                      <Form.Label>Zona</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handleChange}
                        name="zonaId"
                        custom
                      >
                        {zonas.map((zona) => {
                          return (
                            <option key={zona.id} value={zona.id}>
                              {zona.nombre}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={limpiar}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardarCliente}>
                {editar ? "Guardar" : "Crear"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <br />
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Fecha pago</th>
                <th>Ultima lectura</th>
                <th>Codigo de Medidor</th>
                <th>lectura Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.data &&
                datos.data.map((dato) => {
                  return (
                    <ClienteItem
                      cliente={dato}
                      key={dato.id}
                      editarCliente={editarCliente}
                      getClientes={getClientes}
                      alcantarillado={alcantarillado}
                    />
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Cliente;
