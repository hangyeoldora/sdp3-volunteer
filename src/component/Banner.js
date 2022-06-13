import React from 'react';

const Banner = () => {
  return (
    <div className="banner-wrap">
        <img className="banner-img" src={process.env.PUBLIC_URL + "/banner/vol-1.jpg"} alt="메인배너이미지" />
        <div className="content-wrap">
            <p>A little help for everyone</p>
            <a href="#!">View More</a>
        </div>
    </div>
  )
}

export default Banner;