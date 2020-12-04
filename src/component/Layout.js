
import Navbarr from '../navbar'


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