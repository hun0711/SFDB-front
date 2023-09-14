import React, { useEffect } from 'react'
import HeaderBar from '../../components/HeaderBar'
import Footer from '../../components/Footer'
import MainTopSection from './MainTopSection'
import MainMidSection from './MainMidSection'
import MainBtmSection from './MainBtmSection'

const MainPage = () => {

  return (
    <>
    <HeaderBar/>

{/* TOP 카루셀 */}
<div style={{marginTop:'100px'}}>
<MainTopSection/>
</div>

{/* MID 카루셀 */}
<div style={{marginTop:'100px'}}>
  <MainMidSection/>
</div>

{/* BTM 카루셀 */}
<div style={{marginTop:'100px'}}>
  <MainBtmSection/>
</div>


<div style={{marginTop:'100px'}}>
  <Footer/> 
</div>
    </>
  )
}

export default MainPage