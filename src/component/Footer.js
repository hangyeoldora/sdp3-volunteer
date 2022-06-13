/* eslint-disable */
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Footer = () => {
    return( 
        <div className="footer">
            <div className="ft-wrap">
                <div className="ft-sns-wrap">
                    <p className="t-upper t-bold">follow us</p>
                    <div className="ft-sns-icon">
                        face, twit ,insta
                    </div>
                </div>
                <ul className="ft-nav t-upper">
                    <li>home</li>
                    <li>about</li>
                    <li>search</li>
                    <li>news</li>
                </ul>
                <div className="ft-menu-wrap">
                    <p>address</p>
                    <p>contact</p>
                </div>
            </div>
            <div className="ft-wrap">
                <p className="copyright">Copyright ⓒ 2022 ... All Rights Reserved.</p>
                <p className="policy">Privacy Policy</p>
            </div>
        </div>
    );
}

export default Footer;
