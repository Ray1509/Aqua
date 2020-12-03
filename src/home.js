import React, { useEffect, useState } from "react";
import Api from "./conexion";
import Login from './component/Login'
import Deudas from './consumo/Deudas'

const Home = (props) => {
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    Api.authenticate().then(() => {
      setLogged(true)
    }).catch(() => {
      setLogged(false)
    })
  }, [])

  const login = () => {
    setLogged(true)
  }

  if (logged) {
    return <Deudas />
  } else {
    return <Login fnLogin={login} />
  }
};

export default Home;
