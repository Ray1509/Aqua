
import Navbarr from '../Navbar'


const Layout = (props) => {
  const { children } = props

  return (
    <>
      <Navbarr />
      {children}
    </>
  )
}

export default Layout