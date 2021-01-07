import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "moment/locale/es";
import Modal from "react-bootstrap/Modal";
import Api from "../Conexion";
import ClienteItem from "./ClienteItem";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import _ from "underscore";

const Cliente = (props) => {
  const [formulario, setFormulario] = useState({
    nombre: null,
    codigo: "",
    ci: "",
    fecha_pago: "",
    ultima_lectura: "",
    zonaId: null,
    alcantarillado: false,
    medidorId: null,
  });
  const [editar, setEditar] = useState(false);

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [alcantarillado, setAlcantarillado] = useState(0);
  const [cliente, setCliente] = useState("");
  const [codigoMedidor, setCodigoMedidor] = useState("");
  const [aux, setAux] = useState([]);
  const [validated, setValidated] = useState(false);
  const [showMedidor, setShowMedidor] = useState(false);
  const [medidor, setMedidor] = useState({
    codigo: "",
    precio: "",
    saldo: "",
  });
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    Api.authenticate()
      .then((res) => {
        setUsuario(res.usuario);
        getZonas();
        getClientes();
        getAdicionales();
      })
      .catch((error) => error);
  }, []);

  const desplegar = () => setShow(true);

  const limpiar = () => {
    setEditar(false);
    setShow(false);
    setFormulario({
      nombre: null,
      codigo: "",
      ci: "",
      fecha_pago: "",
      ultima_lectura: "",
      zonaId: null,
      alcantarillado: false,
      medidorId: null,
    });
    setValidated(false);
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCliente = (e) => {
    setCliente(e.target.value);

    const busqueda = _.filter(datos, (item) => {
      return item.nombre.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setAux(busqueda);
  };

  const handleChangeCodigoMedidor = (e) => {
    setCodigoMedidor(e.target.value);

    const busqueda = _.filter(datos, (item) => {
      if (!item.medidorId) {
        return false;
      }
      return item.medidor.codigo
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setAux(busqueda);
  };

  const guardarCliente = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (editar) {
      Api.service("cliente")
        .patch(formulario.id, formulario)
        .then(() => {
          getClientes();
          limpiar();
        })
        .catch((error) => error);
    } else {
      Api.service("cliente")
        .create(formulario)
        .then(() => {
          getClientes();
          limpiar();
        })
        .catch((error) => error);
    }
  };

  const getClientes = () => {
    Api.service("cliente")
      .find()
      .then((response) => {
        setDatos(response.data);
        setAux(response.data);
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
    setShow(true);
    setEditar(true);
  };

  const limpiarModal = () => {
    setShowMedidor(false);
    setMedidor({ codigo: "", precio: "", saldo: "" });
    setValidated(false);
  };

  const handleChangeMedidor = (e) => {
    setMedidor({
      ...medidor,
      [e.target.name]: e.target.value,
    });
  };

  const asignarMedidor = (cliente) => {
    setMedidor(cliente.medidor);
    setShowMedidor(true);
    setFormulario(cliente);
  };

  const guardarMedidor = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (formulario.medidorId) {
      Api.service("medidor")
        .patch(medidor.id, medidor)
        .then(() => {
          getClientes();
          limpiarModal();
        });
    } else {
      Api.service("medidor")
        .create({ ...medidor, saldo: medidor.precio })
        .then((response) => {
          Api.service("cliente")
            .patch(formulario.id, { medidorId: response.id })
            .then((res) => {
              getClientes();
              limpiarModal();
            });
        });
    }
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
              <Form noValidate validated={validated}>
                <Form.Row>
                  <Form.Group as={Col} controlId="validacionNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      onChange={handleChange}
                      name="nombre"
                      value={formulario.nombre}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validacionCodigo">
                    <Form.Label>Codigo</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      onChange={handleChange}
                      name="codigo"
                      value={formulario.codigo}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>C.I.</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="ci"
                      value={formulario.ci}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validacionFechaPago">
                    <Form.Label>Fecha de pago</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      onChange={handleChange}
                      name="fecha_pago"
                      value={moment(formulario.fecha_pago).format("YYYY-MM-DD")}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Ultima lectura</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="ultima_lectura"
                      value={formulario.ultima_lectura}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="5" controlId="validacionZona">
                    <Form.Label>Zona</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      onChange={handleChange}
                      name="zonaId"
                      custom
                      value={formulario.zonaId || ""}
                    >
                      <option>Seleccione una zona </option>
                      {zonas.map((zona) => {
                        return (
                          <option key={zona.id} value={zona.id}>
                            {zona.nombre}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validacionAlcantarillado"
                  >
                    <Form.Label>Alcantarillado</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      onChange={handleChange}
                      name="alcantarillado"
                      custom
                      value={formulario.alcantarillado || ""}
                    >
                      <option>Seleccione</option>
                      <option value={false || 0}>No</option>
                      <option value={1 || true}>Si</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Este campo es obigatorio
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
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
        <div className="row">
          <div className="col-6">
            <input
              onChange={handleChangeCliente}
              className="form-control"
              placeholder="Busqueda por Nombre"
              type="text"
              name="cliente"
              value={cliente}
            />
          </div>
          <div className="col-6">
            <input
              onChange={handleChangeCodigoMedidor}
              className="form-control"
              placeholder="Busqueda por Codigo Medidor"
              type="text"
              name="codigoMedidor"
              value={codigoMedidor}
            />
          </div>
        </div>
        <br />
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Mes proceso</th>
                <th>Fecha pago</th>
                <th>Codigo medidor</th>
                <th>Ultima lectura</th>
                <th>lectura Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aux &&
                aux.map((dato) => {
                  return (
                    <ClienteItem
                      cliente={dato}
                      key={dato.id}
                      editarCliente={editarCliente}
                      getClientes={getClientes}
                      alcantarillado={alcantarillado}
                      asignarMedidor={asignarMedidor}
                      usuario={usuario}
                    />
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showMedidor} onHide={limpiarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Medidor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group as={Col} controlId="validacionCodigo">
              <Form.Label>Codigo</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={handleChangeMedidor}
                name="codigo"
                value={medidor.codigo}
              />
              <Form.Control.Feedback type="invalid">
                Este campo es obigatorio
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validacionPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                required
                type="number"
                onChange={handleChangeMedidor}
                name="precio"
                value={medidor.precio}
              />
              <Form.Control.Feedback type="invalid">
                Este campo es obigatorio
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={limpiarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarMedidor}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cliente;
