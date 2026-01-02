import React from 'react'
import { Link } from 'react-router-dom';
import { F1, F2, F3 } from '../assets/Index'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext';

const Header = ({openCart}) => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
    <div className='header'>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <Link className="navbar-brand" to="/"><img className='pl-5' src={F1} alt="Logo" /></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto">
            <li className="nav-item active mx-2">
              <Link className="f-home nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item active mx-2">
              <Link className="f-nav nav-link" to='/products'>Our products <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item active mx-2">
              <a className="f-nav nav-link" href="#">Health Benefits<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active mx-2">
              <a className="f-nav nav-link" href="#">Blog<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active mx-2">
              <a className="f-nav nav-link" href="#">FAQs<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active mx-5">
              <img src={F2} alt="" />
            </li>
          </ul>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>   
            <Link to="/wishlist" style={{ position: 'relative' }}>
              <img className="mr-1" src={F3} alt="wishlist" />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#F58634',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <div 
              style={{ 
                position: 'relative', 
                cursor: 'pointer',
                marginRight: '25px'
              }} 
              onClick={openCart}
            >
              <FontAwesomeIcon 
                icon={faShoppingBag} 
                style={{ 
                  fontSize: '24px', 
                  color: '#333' 
                }}
              />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#F58634',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </div>

            <button className="f-btn btn my-sm-0" type="submit">Contact Us</button>
          </div>
        </div>
      </nav>
    </div>
    </>
  )
}

export default Header