import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContent } from '../context/AppContex'
const Footer = () => {
  const {isLoggedin} = useContext(AppContent)
  return (
    <div className="border-t border-gray-800 mt-12 pt-8 px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} PIXELCODE. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/about" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
              About
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
              Contact
              </Link>
              {!isLoggedin && <Link to="/signin" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
              Login
              </Link>}
              {!isLoggedin && <Link to="/signup" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
              Sign up
              </Link>}
            </div>
          </div>
        </div>
  )
}

export default Footer