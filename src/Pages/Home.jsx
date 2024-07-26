import React from 'react'
import { images } from '../constants'

function Home() {
  return (
    <div>
    <h1>Welcome to BarbApp</h1>
  <img src={images.logo}alt=""  className='logo-image'/>
    </div>
  )
}

export default Home
