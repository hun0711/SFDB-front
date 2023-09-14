import React from 'react'
import RegisterPage from './pages/user/RegisterPage'
import LoginPage from './pages/user/LoginPage'
import { Route, Routes } from 'react-router'
import MainPage from './pages/main/MainPage'
import theme from './utils/theme'
import { ThemeProvider } from '@mui/material'
import StartPage from './pages/start/StartPage'
import MyInfoPage from './pages/user/MyInfoPage'
import KakaoCallback from './pages/user/KakaoCallback'
import { SnackbarProvider } from 'notistack'
import MovieDetailPage from './pages/detail/MovieDetailPage'

const App = () => {
  return (
    <>
    <SnackbarProvider maxSnack={3}>
    <ThemeProvider theme={theme}>
    <Routes>
      {/* 첫 시작 페이지*/}
      <Route path="/" exact={true} element={<StartPage />} />

      {/* 메인페이지 */}
      <Route path="/main" exact={true} element={<MainPage />} />

      {/* 로그인페이지 */}
      <Route path="/login" exact={true} element={<LoginPage />} />
      
      {/* 카카오 콜백 */}
      <Route path="/auth/kakao" exact={true} element={<KakaoCallback />} />
      
      {/* 회원가입페이지 */}
      <Route path="/register" exact={true} element={<RegisterPage />} />
      
      {/* 마이페이지 */}
      <Route path="/myInfo" exact={true} element={<MyInfoPage />} />
      
      {/* 영화 정보 상세페이지 */}
      <Route path='/movieDetail/*' element={<MovieDetailPage />}/>

    

   </Routes>
    </ThemeProvider>
    </SnackbarProvider>
    </>
  )
}

export default App