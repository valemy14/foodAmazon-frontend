import React from 'react'
import PopularProduct from '../components/PopularProduct'
import { P4 } from '../assets/Index'


const PeopleAlsoBuy = () => {
  return (
    <>
       <div className="new-product">
        <div className="nproduct-top">
            <h2>People Also Buy</h2>
            <div className="np-top">
                <p>Browse our most popular snacks and make your day <br />more beautiful and glorious.</p>
                <button className='np-btn'>Browse All</button>
            </div>
        </div>
        <PopularProduct type='frequently-bought'/>
      </div>
    <img className='pab-line' style={{width:'85%', marginTop:'60px'}} src={P4} alt="" />

    </>
  )
}

export default PeopleAlsoBuy
