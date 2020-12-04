import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "moment/locale/es";
import Modal from "react-bootstrap/Modal";
import Api from "../conexion";
import { Link } from "react-router-dom";

const Cliente = (props) => {
  const [formulario, setFormulario] = useState({
    form: {
      nombre: "",
      codigo: "",
      ci: "",
      fecha_pago: moment().format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
      ultima_lectura: "",
      codigoMedidor: "",
      lectura_actual: "",
    },
  });
  const [editar, setEditar] = useState(false);

  const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(false);
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        getClientes();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const desplegar = () => setShow(true);

  const limpiar = () => {
    setEditar(false);
    setCliente({});
    setShow(false);
    setFormulario({});
  };

  const handleChange = (e) => {
    setFormulario({
      form: {
        ...formulario.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  const guardarCliente = () => {
    if (editar) {
      Api.service("cliente")
        .patch(cliente.id, formulario.form)
        .then(() => {
          getClientes();
        });
    } else {
      Api.service("cliente")
        .create(formulario.form)
        .then(() => {
          getClientes();
        });
    }
    limpiar();
  };

  const editarCliente = (dato) => {
    setCliente(dato);
    setFormulario(dato);
    desplegar();
    setEditar(true);
  };

  const getClientes = () => {
    Api.service("cliente")
      .find()
      .then((response) => {
        setDatos(response);
      });
  };

  const generarConsumo = (cliente) => {
    const cantidad = formulario.form.lectura_actual - cliente.ultima_lectura;
    const mes = moment(cliente.fecha_pago)
      .subtract(1, "months")
      .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");

    let nuevoConsumo = {
      lectura_actual: formulario.form.lectura_actual,
      consumo: cantidad,
      costo_consumo: 25 * cantidad,
      costo_alcantarillado: 5,
      costo_multa: 5,
      mes_proceso: mes,
      total_pago: 5,
      fecha_pago: "",
      clienteId: cliente.id,
    };

    const sigMes = moment(cliente.fecha_pago)
      .add(1, "months")
      .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
    let editarCliente = {
      fecha_pago: sigMes,
      ultima_lectura: formulario.form.lectura_actual,
    };

    Api.service("consumo")
      .create(nuevoConsumo)
      .then(() => {
        Api.service("cliente").patch(cliente.id, editarCliente);
        window.location.reload();
      });
  };

  return (
    <div>
      <div className="container">
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
              <form>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Codigo</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="number"
                        name="codigo"
                        value={formulario.codigo}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>C.I.</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="text"
                        name="ci"
                        value={formulario.ci}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Fecha de pago</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="date"
                        name="fecha_pago"
                        value={formulario.fecha_pago}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>Ultima lectura</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="number"
                        name="ultima_lectura"
                        value={formulario.ultima_lectura}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>Codigo de medidor</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        type="text"
                        name="codigoMedidor"
                        value={formulario.codigoMedidor}
                      />
                    </div>
                  </div>
                </div>
              </form>
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
                    <tr key={dato.id}>
                      <td>{dato.codigo}</td>
                      <td>{dato.nombre}</td>
                      <td>
                        {moment(dato.fecha_pago)
                          .add(1, "days")
                          .format("D, MMMM")}
                      </td>
                      <td>{dato.ultima_lectura}</td>
                      <td>{dato.codigoMedidor}</td>
                      <td>
                        <div className="container row">
                          <input
                            onChange={handleChange}
                            className="form-control col-7"
                            type="number"
                            name="lectura_actual"
                            value={formulario.lectura_actual}
                          />
                          <Button
                            className="col"
                            variant="success"
                            onClick={() => generarConsumo(dato)}
                          >
                            Generar
                          </Button>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => editarCliente(dato)}
                        >
                          Editar
                        </Button>
                        <Link
                          className="btn btn-warning"
                          to={`/consumo/${dato.id}`}
                        >
                          Historial
                        </Link>
                      </td>
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

export default Cliente;
