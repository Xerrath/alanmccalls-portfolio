import React from 'react';
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <>
      <div className='contents-wrapper'>
        <div className="no-match-wrapper">
          <div className="image-header">404 - Error</div>
          <h1 className="error-header">Sorry we couldn't find that page</h1>
          <Link to="/">Click Here Return To Homepage</Link>
        </div>
      </div>
    </>
  )
}

export default NoMatch