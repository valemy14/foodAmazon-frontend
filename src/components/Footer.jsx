import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"; 
import { FO1, FO2, FO3, FO4, FO5, FO6,  FO7, FO8 ,  F1 } from '../assets/Index'






const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-top">
            <h5>Excellent</h5>
            <img src={FO1} alt="" />
            <div>
                <small>Based on 13,586 reviews</small>
                <hr className='ft-line' />
               {/* <div><img className='ft-line' src={FO8} alt="" /></div>  */}
            </div>
            <div className='trust'>
                <FontAwesomeIcon className='t-icon' icon={faStar}/>
                <p>Trustpilot</p>
            </div>  
            
        </div>
        <hr className='footer-line' />

        <div className="f-row row">
            <div className="col-sm-12 col-md-12 col-lg">
                <div className='fb'>
                    <p>Customer Service</p>
                    <small>Order Lookup</small>
                    <small>Bulk Order</small>
                    <small>Shipping & Delivery</small>
                     <small>Discounts</small>
                     
                </div>
            </div>

             <div className="col-sm-12 col-md-12 col-lg">
                <div className='fb'>
                     <p>About Us</p>
                    <small>News & Blog</small>
                     <small>Suppliers</small>
                     <small>Terms & Conditions</small>
                     <small>Privacy Policy</small>
                </div>
               

            </div>

             <div className="col-sm-12 col-md-12 col-lg">
                <div className='fb'>
                    <p>Need Help?</p>
                     <small>Contact Us</small>
                     <small>FAQs</small>
                </div>
            </div>

             <div className="col-sm-12 col-md-12 col-lg">
            <div className='fb'>
                <p>Privacy</p>
                <small>Terms & Conditions</small>
                <small>Privacy Policy</small>    
             </div>
               

            </div>

             <div className="col-sm-12 col-md-12 col-lg">
                <div className='fb'>
                     <p>Follow us</p>
                     <div className='f-logo'>
                        <img src={FO2} alt="" />
                        <img src={FO3} alt="" />
                        <img src={FO4} alt="" /> 
                     </div>
                </div>
               

            </div>
        </div>
        <div className='footer-bar'>
            <img src={F1} alt="" />
            <div className='bar-logo'>
                <img src={FO5} alt="" />
                <img src={FO6} alt="" />
                <img src={FO7} alt="" />
                 <small>Copyright © 2024 FoodieAmazon. All Rights Reserved</small>
            </div>
           
        </div>
      </footer>
    </>
  )
}

export default Footer
