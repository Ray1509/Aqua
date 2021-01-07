import React from "react";
import Table from "react-bootstrap/Table";
import moment from "moment";
import "moment/locale/es";

class Recibo extends React.Component {
  constructor(props) {
    super(props);
    this.dato = props.dato;
  }
  render() {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h3>Servicio de Agua Potable "San Pablo Laguna Sulty"</h3>
          <h5>RECIBO POR EL PAGO DE SERVICIOS</h5>
        </div>
        <div>
          <div className="row">
            <div className="col-6">
              <strong className="col-4">Nombre Socio</strong>
              {this.dato.cliente && <label>{this.dato.cliente.nombre}</label>}
            </div>
            <div className="col-6">
              <strong className="col-4">Código</strong>
              {this.dato.cliente && <label>{this.dato.cliente.codigo}</label>}
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <strong className="col-4">Numero de Medidor</strong>

              {this.dato.cliente && (
                <label>{this.dato.cliente.codigo_medidor}</label>
              )}
            </div>
            <div className="col-6">
              <strong className="col-4">Ubicacion</strong>
              {this.dato.cliente && (
                <label>{this.dato.cliente.zona.nombre || "No tiene"}</label>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <strong className="col-4">Mes Proceso</strong>

              {this.dato.cliente && (
                <label>
                  {moment(this.dato.mes_proceso).format("MMMM-YYYY")}
                </label>
              )}
            </div>
            <div className="col-6">
              <strong className="col-4">Fecha de Pago</strong>
              {this.dato.cliente && (
                <label>
                  {moment(
                    this.dato.estado ? this.dato.fecha_pago : undefined
                  ).format("DD-MM-YYYY")}
                </label>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <strong className="col-5">Lectura Anterior</strong>
              {this.dato.cliente && <label>{this.dato.lectura_anterior}</label>}
            </div>
            <div className="col-4">
              <strong className="col-5">Lectura Actual</strong>
              {this.dato.cliente && <label>{this.dato.lectura_actual}</label>}
            </div>
            <div className="col-4">
              <strong className="col-5">Consumo</strong>
              {this.dato.cliente && <label>{this.dato.consumo}</label>}
            </div>
          </div>
          <div className="container">
            <Table bordered hover>
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "80%" }}>
                    Detalle
                  </th>
                  <th className="text-center"> Importe </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Costo Consumo</td>
                  <td className="text-center">
                    {this.dato.cliente && (
                      <label>{this.dato.costo_consumo}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Multa</td>
                  <td className="text-center">
                    {this.dato.cliente && (
                      <label>{this.dato.costo_multa}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Alcantarillado</td>
                  <td className="text-center">
                    {this.dato.cliente && (
                      <label>{this.dato.costo_alcantarillado}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b> Total a Pagar</b>
                  </td>
                  <td className="text-center">
                    {this.dato.cliente && <label>{this.dato.total_pago}</label>}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
export default Recibo;
