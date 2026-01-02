import React from 'react'
import { N1, N4, N2, N3 } from '../assets/Index'






const NewsLetter = () => {
  return (
    <>
      <div className="news">
        <div className="news-wrapper">
            <div className='container n-img'><img className='news-img' src={N1} alt="" /></div>

            <div className="news-content">
              <img className='triangle' src={N2} alt="" />
              <h3>Subscribe Our Newsletter</h3>
              <small>Receive latest updates on our products and many other things <br />every week. </small>
              <form className='news-form'>
                <div class="form-row">
                  <div class="col">
                    <input type="text" class="form-control" placeholder="Enter Your Email Address"/>
                  </div>
                </div>
              </form>
             <div className="icon-images">
                <img src={N4} alt="" />
             </div>
             <img className='eclipse' src={N3} alt="" />
            </div>
        </div> 
      </div>
    </>
  )
}

export default NewsLetter
