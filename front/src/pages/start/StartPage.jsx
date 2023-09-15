import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import Footer from '../../components/Footer'
import StartTopSection from './StartTopSection'
import StartMidSection from './StartMidSection'
import StartCategorySection from './StartCategorySection'
import StartBottomSection from './StartBottomSection'

const StartPage = () => {
  return (
    <>

    <HeaderBar/>
    <div style={{marginTop:'50px'}}>
<StartTopSection/>
    </div>
    <div style={{marginTop:'5px'}}>
<StartMidSection/>
    </div>
<StartCategorySection />
<StartBottomSection />
<Footer />



    </>
  )
}

export default StartPage