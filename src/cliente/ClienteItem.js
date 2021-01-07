import React, { useState } from "react";
import moment from "moment";
import "moment/locale/es";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Api from "../Conexion";
import _ from "underscore";

const ClienteItem = ({
  cliente,
  editarCliente,
  getClientes,
  alcantarillado,
  asignarMedidor,
  usuario,
}) => {
  const [lectura, setLectura] = useState(0);

  const handleChangeLectura = (e) => {
    setLectura(e.target.value);
  };

  const generarConsumo = (cliente) => {
    const mes = moment(cliente.fecha_pago)
      .subtract(1, "months")
      .format("YYYY-MM-DD");

    const sigMes = moment(cliente.fecha_pago)
      .add(1, "months")
      .format("YYYY-MM-DD");

    let nuevoConsumo = {
      mes_proceso: mes,
      clienteId: cliente.id,
      lectura_anterior: cliente.ultima_lectura,
      fecha_pago: moment().format("YYYY-MM-DD"),
    };
    if (cliente.alcantarillado === 1) {
      nuevoConsumo.costo_alcantarillado = alcantarillado;
    } else {
      nuevoConsumo.costo_alcantarillado = 0;
    }

    let editarCliente = {
      fecha_pago: sigMes,
    };
    let costo_consumo;
    if (lectura >= 0 && lectura >= cliente.ultima_lectura) {
      const cantidad = lectura - cliente.ultima_lectura;

      Api.service("precio-consumo")
        .find({ query: { estado: true } })
        .then((res) => {
          const precio = _.find(res.data, (item) => {
            if (!item.maximo) {
              return true;
            }
            return item.minimo <= cantidad && item.maximo >= cantidad;
          });
          if (precio.maximo) {
            if (precio.minimo) {
              costo_consumo = precio.precio * cantidad;
            } else {
              costo_consumo = precio.precio;
            }
          } else {
            costo_consumo = precio.precio;
          }

          nuevoConsumo.consumo = cantidad;
          editarCliente.ultima_lectura = lectura;
          nuevoConsumo.lectura_actual = lectura;
          nuevoConsumo.costo_consumo = costo_consumo;
          nuevoConsumo.total_pago =
            costo_consumo + nuevoConsumo.costo_alcantarillado;
        })
        .then(() => {
          Api.service("consumo")
            .create(nuevoConsumo)
            .then(() => {
              Api.service("cliente")
                .patch(cliente.id, editarCliente)
                .then(() => {
                  getClientes();
                  setLectura(0);
                });
            });
        });
    }
  };
  return (
    <tr>
      <td>{cliente.codigo}</td>
      <td>{cliente.nombre}</td>
      <td>{moment(cliente.fecha_pago).subtract(1, "months").format("MMMM")}</td>
      <td>{moment(cliente.fecha_pago).format("D, MMMM")}</td>
      <td>{cliente.medidor.codigo}</td>
      <td>{cliente.ultima_lectura}</td>
      <td>
        <div className="container row">
          <input
            onChange={handleChangeLectura}
            className="form-control col-7"
            type="number"
            name="lectura_actual"
            value={lectura}
          />
          <Button
            className="col"
            variant="success"
            onClick={() => generarConsumo(cliente)}
          >
            Generar
          </Button>
        </div>
      </td>
      <td>
        <Button variant="link" onClick={() => editarCliente(cliente)}>
          Editar
        </Button>
        <Link className="btn btn-warning" to={`/consumo/${cliente.id}`}>
          Historial
        </Link>
        {usuario.admin ? (
          <Button variant="primary" onClick={() => asignarMedidor(cliente)}>
            Medidor
          </Button>
        ) : null}
      </td>
    </tr>
  );
};
export default ClienteItem;
