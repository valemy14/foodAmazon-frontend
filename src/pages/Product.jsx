import React from 'react'
import PopularProduct from '../components/PopularProduct'
import { P4 } from '../assets/Index'


const Product = () => {
  return (
    <>
      <div className="product">
        <div className="product-top">
            <h2>Our Popular Products</h2>
            <div className="p-top">
                <p>Browse our most popular snacks and make your day <br />more beautiful and glorious.</p>
                <button className='p-btn'>Browse All</button>
            </div>
        </div>
        <PopularProduct type='popular'/>
      </div>
    <img className='pp-line'  style={{width:'85%', marginTop:'60px'}} src={P4} alt="" />
    </>
  )
}

export default Product
