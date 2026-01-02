import React from 'react'
import BulkOrder from '../components/BulkOrder'


const Bulk = () => {
  return (
    <>
    
      <div className="bulk">
            <div className="bulk-body">
            <div className="bulk-top">
                <h1>Bulk Orders</h1>
                <hr className='b-line' />
                <small>Our snacks are free from artificial additives, providing a pure and wholesome snacking experience. Discover <br />our range of delightful organic treats designed to satisfy your cravings while supporting a healthy lifestyle.</small>
            </div>
           <BulkOrder/>
        </div>
         
        
       
      </div>
    </>
  )
}

export default Bulk
