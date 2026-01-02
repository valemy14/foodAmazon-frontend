import React from 'react'
import { Q1 } from '../assets/Index'




const Quality = () => {
  return (
    <>
        <div className="quality row">
            <div className="quality-left col-sm-12 col-md-12 col-lg-6">
                <img src={Q1} alt="" />
                <div><button className='q-btn'>100% Organic</button></div>
            </div>
            <div className="quality-right col-sm-12 col-md-12 col-lg-6">
                <div>
                    <h1 style={{color:'#07AA07'}}> HIGH QUALITY </h1>
                    <h1 style={{color:'#F58634'}}>ORGANIC SNACKS</h1>
                </div>
                
                <p>At Foodie Amazon, we believe in the power of nature to provide wholesome, 
                   <br />delicious snacks. Our journey began with a simple mission: to bring the pure 
                  <br /> taste of nature to your doorstep. We are dedicated to creating snacks that are 
                  <br /> not only delicious but also healthy and free from artificial additives. Our major 
                   <br />focus is on providing organic snacks that are made with the finest ingredients <br />sourced 
                   from sustainable farms.</p> <p>Our commitment to quality means that you won't find any gums, preservatives,
                    <br />or artificial sugars in our products. Instead, we use natural sweeteners and <br />preservatives to ensure 
                    that every bite is as healthy as it is tasty.</p>
                
                <div className='qr-bottom'>
                  <hr className='q-line'/>
                   <p>Our vision is to become a household name in organic snacks, known for our commitment <br />to quality and sustainability.</p>
                </div>
                <div className='bottom-qr'>
                    <p>John Doe</p>
                    <small>Chief Executive Officer</small>
                </div>
            </div>
        </div>
    </>
  )
}

export default Quality
