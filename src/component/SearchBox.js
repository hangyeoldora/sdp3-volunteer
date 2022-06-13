/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
const SearchBox = () => {

    const [searchPlace, setSearchPlace] = useState("");
    const [centerData, setCenterData] = useState([]);
    
    // center 데이터 받는 곳
    const [centerNameArr, setcenterNameArr] = useState([]);

    const parserStr = (dataSet) => {
        const dataArr = new XMLParser().parseFromString(dataSet).children;
        setCenterData(dataArr[1].children[0].children);
        // console.log(dataArr[1].children[0].children)
    }

    useEffect(()=>{
        axios.get("http://localhost:3001/volcollection").then((response)=>{
            const dataSet = response.data;
            parserStr(dataSet);
        })
    }, []);

  return (
      <div className="inner">
          <p className="vol-center-main-title">봉사활동처 검색</p>
            <div className="vol-center-wrap">
                <div className="vol-left-container">
                    <div className="vol-center-searchBox">
                        <p>봉사활동처 검색</p>
                        <input type="text" onChange={(e)=>{setSearchPlace(e.target.value)}}/>
                        <button>Submit</button>
                    </div>
                </div>
                <div className="vol-right-contaier">
                    {
                        centerData.map((data, key) => {
                            // 이중 array라서 두 번 실행
                            return(
                                <div className="vol-right-inner" key={key}>
                                    {data.children.map((center, key) => {
                                        // 각 센터별 정보마다 요청변수는 같지만 정보가 없는 것은 빈칸으로 나와서 출력폼을 같게 하기 위해 필요한 정보만 출력함
                                        if(center.name === "addr" || center.name === "centName" || center.name === "areaName" || center.name === "telNum" || center.name === "centTypeName"){
                                            // console.log(typeof(center.value));
                                            // if(center.value==="장애인복지시설"){
                                                return(
                                                    <p key={key}>{center.value}</p>
                                                )
                                            // }
                                            // console.log("success");
                                        } else{
                                            return(
                                                <p style={{display: "none"}}>null</p>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
    </div>
  )
}

export default SearchBox;