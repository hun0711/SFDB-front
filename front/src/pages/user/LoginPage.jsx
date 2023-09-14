import React from 'react'
import Login from './Login'
import Footer from '../../components/Footer'
import HeaderBar from '../../components/HeaderBar'

const LoginPage = () => {
  return (

    <>
    {/* 헤더 */}
    <HeaderBar />
    {/* 로그인 컴포 */}
    <div style={{ marginTop: '100px' }}>
        <Login />
      </div>
      {/* 푸터 */}
      <div style={{marginTop: '100px'}}>
    <Footer />
      </div>
    </>
  )
}

export default LoginPage