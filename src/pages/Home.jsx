import React from 'react'
import { H1, H2, H3, H4, H5, H6 } from '../assets/Index'





const Home = () => {
  return (
    <>
 <div className="home"> 
    <div className="r-home row">
        <div className="col-sm-12 col-md-12 col-lg-6" >
            <div className="home-left w-100">
                <small>Discover the Pure Taste of Nature</small>
                <h1 style={{fontFamily:'MD Nichrome test'}}><span className='organic'>Organic</span> <span className='snacks'>Snacks</span><br /><span className='made'>Made</span> <span className='with'>with</span> <span className='love'>Love,</span> <br /><span className='just'>Just</span> <span className='for'>for</span> <span className='you'>You</span></h1>
                <div><button className='h-btn'>Shop Now <img src={H1} alt="" /></button></div> 
                <div className='h-icon'><img src={H2} alt="" /></div>    
            </div>
            
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6">
            <div className='home-right pr-5 '>
                <img src={H3} alt="" className='w-100' />
            </div>

        </div>
    </div>
    <img className='first-bg w-100' src={H4} alt="" />
    <img className='second-bg w-100' src={H5} alt="" />
    <img className='third-bg w-100' src={H6} alt="" />
 </div>

    
    </>
  )
}

export default Home
