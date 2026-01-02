import React from 'react'
import PopularProduct from '../components/PopularProduct'

const NewProduct = () => {
  return (
    <>
      <div className="new-product">
        <div className="nproduct-top">
          <h2>Our New Products</h2>
          <div className="np-top">
            <p>Browse our most popular snacks and make your day more beautiful and glorious.</p>
            <button className='p-btn'>Browse All</button>
          </div>
        </div>
        <PopularProduct type='new'/>
      </div>
    </>
  )
}

export default NewProduct