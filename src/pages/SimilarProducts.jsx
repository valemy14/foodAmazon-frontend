import React from 'react'
import { useNavigate } from 'react-router-dom'
import PopularProduct from '../components/PopularProduct'
import { P4 } from '../assets/Index'

const SimilarProducts = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="similar-product">
        <div className="sproduct-top">
          <h2>Similar Products</h2>
          <div className="sp-top">
            <p>Browse our most popular snacks and make your day <br />more beautiful and glorious.</p>
            <button 
              className='sp-btn'
              onClick={() => navigate('/products')}
            >
              Browse All
            </button>
          </div>
        </div>
        <PopularProduct type='frequently-bought' />
      </div>
      <img className='sp-line' style={{width:'85%', marginTop:'60px'}} src={P4} alt="" />
    </>
  )
}

export default SimilarProducts