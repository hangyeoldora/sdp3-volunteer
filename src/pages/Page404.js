import React from 'react'
import {Link} from "react-router-dom";
const Page404 = () => {
  return (
    <div>
        <h1>페이지를 찾을 수 없음</h1>
        <h3><Link to="/">Home</Link>으로 이동하세요.</h3>
    </div>
  )
}

export default Page404;