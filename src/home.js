import React, { useEffect, useState } from "react";
import Api from "./conexion";
import Login from "./component/Login";
import Deudas from "./consumo/Deudas";
import moment from "moment";
import "moment/locale/es";
import _ from "underscore";

const Home = (props) => {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    Api.authenticate()
      .then(() => {
        setLogged(true);
        agregarMulta();
      })
      .catch(() => {
        setLogged(false);
      });
  }, []);

  const login = () => {
    setLogged(true);
  };

  const agregarMulta = () => {
    Api.service("adicionales")
      .find()
      .then((response) => {
        const costo_multa = _.find(response.data, (item) => {
          return item.nombre === "Multa";
        });

        Api.service("consumo")
          .find({ query: { estado: false, costo_multa: 0 } })
          .then((result) => {
            _.each(result.data, (elemento) => {
              if (moment(elemento.mes_proceso).add(1, "Months") < moment()) {
                Api.service("consumo").patch(elemento.id, {
                  costo_multa: costo_multa.costo,
                  total_pago: elemento.total_pago + costo_multa.costo,
                });
              }
            });
          });
      });
  };

  if (logged) {
    return <Deudas />;
  } else {
    return <Login fnLogin={login} />;
  }
};

export default Home;
