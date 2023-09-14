import React from 'react'
import Register from './Register'
import Footer from '../../components/Footer'
import HeaderBar from '../../components/HeaderBar'

const RegisterPage = () => {
  return (
    <>
    <HeaderBar />

    <div style={{marginTop:'100px'}}>
    <Register/>
    </div>

    <div style={{marginTop:'30px'}}>
    <Footer />
    </div>
    
    </>
  )
}

export default RegisterPage