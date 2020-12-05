import React, { useState } from "react";
import moment from "moment";
import "moment/locale/es";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Api from "../conexion";

const ClienteItem = ({
  cliente,
  editarCliente,
  getClientes,
  alcantarillado,
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
      costo_alcantarillado: alcantarillado,
      mes_proceso: mes,
      clienteId: cliente.id,
      lectura_anterior: cliente.ultima_lectura,
    };

    let editarCliente = {
      fecha_pago: sigMes,
    };

    let costo_consumo = 15;
    if (lectura > 0 && lectura >= cliente.ultima_lectura) {
      const cantidad = lectura - cliente.ultima_lectura;
      if (cantidad <= 10) {
        costo_consumo = 15;
      } else if (cantidad > 10 && cantidad <= 15) {
        costo_consumo = 4 * cantidad;
      } else if (cantidad > 15 && cantidad <= 20) {
        costo_consumo = 6 * cantidad;
      } else if (cantidad > 20 && cantidad <= 25) {
        costo_consumo = 8 * cantidad;
      } else if (cantidad > 25) {
        costo_consumo = 10 * cantidad;
      }
      nuevoConsumo.consumo = cantidad;
      editarCliente.ultima_lectura = lectura;
      nuevoConsumo.lectura_actual = lectura;
    }
    nuevoConsumo.costo_consumo = costo_consumo;
    nuevoConsumo.total_pago = costo_consumo + alcantarillado;

    Api.service("consumo")
      .create(nuevoConsumo)
      .then(() => {
        Api.service("cliente")
          .patch(cliente.id, editarCliente)
          .then(() => {
            getClientes();
            setLectura("");
          });
      });
  };
  return (
    <tr>
      <td>{cliente.codigo}</td>
      <td>{cliente.nombre}</td>
      <td>{moment(cliente.fecha_pago).format("D, MMMM")}</td>
      <td>{cliente.ultima_lectura}</td>
      <td>{cliente.codigo_medidor}</td>
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
      </td>
    </tr>
  );
};
export default ClienteItem;
