import React from 'react';

const Banner = () => {
  return (
    <div className="banner-wrap">
        <img className="banner-img" src={process.env.PUBLIC_URL + "/banner/banner2.jpg"}/>
        <div className="content-wrap">
            <p>You are what you eat</p>
            <a>View More</a>
        </div>
    </div>
  )
}

export default Banner;