/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

const Main = () => {
  let navigate = useNavigate();

  const [listOfPosts, setListOfPosts] = useState([]);
  // 158
  const [likedPosts, setLikedPosts] = useState([]);
  //163
  const { authState } = useContext(AuthContext);

  // data api
  const [apiData, setApiData] = useState([]);
  const [apiCheck, setApiCheck] = useState(false);
  const [inputItem, setInputItem] = useState("");

  // 알레르기 저장
  const [allegyData, setAllegyData] = useState([]);
  const allergyList = ['복숭아', '토마토', '홍합','밀가루','오징어','전복', '새우', '굴', '게', '고등어', '조개류', '땅콩', '메밀', '밀', '대두', '호두', '땅콩', '난류', '가금류', '우유', '쇠고기', '돼지고기', '닭고기'];

  useEffect(() => {
    // 로그인 했는지 체크
    if(!localStorage.getItem("accessToken")){
      navigate('/login');
    } else {
      axios.get("https://sdp3-application.herokuapp.com/posts",
      { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
        // console.log(response.data);
        // likedPosts가 추가되어 obj이기 때문에 listOfPosts 추가
        setListOfPosts(response.data.listOfPosts);
        // 모든 id 목록 개별적으로 가짐
        setLikedPosts(response.data.likedPosts.map((like)=>{return like.PostId}));
      });
    }

  }, []);

  const getFoodsItem = () => {
    axios.get(`${process.env.REACT_APP_API_URL_KEY}/C002/json/1/10/PRDLST_NM=${inputItem}`).then((response) => {
      
    let foodsArray = [...apiData, response.data.C002.row];
      setApiData(foodsArray[0]);
      setApiCheck(true);
      // console.log(foodsArray[0]);
      // console.log(foodsArray[0][0].RAWMTRL_NM);
      setAllegyData(foodsArray[0][0].RAWMTRL_NM);
    }).catch((error)=>{
      console.log(error);
    });
    
  };

  const likeAPost = (postId) => {
    axios
      .post(
        "https://sdp3-application.herokuapp.com/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
      // 146
        setListOfPosts(listOfPosts.map((post)=>{
          if (post.id === postId) {
            // 게시물id와 포스트 id가 같으면 likes 필드 수정.
            if(response.data.liked){
              return {...post, Likes: [...post.Likes, 0]};
            } else {
              // 148, unlike post 배열 끝에서 pop
              const likesArray = post.Likes;
              likesArray.pop();
              return {...post, Likes: likesArray};
            }
          } else {
            return post
          }
        })
        );
        // 160
        if (likedPosts.includes(postId)){
          // 동일한 Id 필터링
          setLikedPosts(likedPosts.filter((id)=>{return id != postId;}))
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {/* <div className="searchWrap">
        <div className="inner">
          <p className="main-title">Search</p>
            <section className="apiSearchWrap">
              <div className="apiLeftSide">
                <img className="apiSearchImg" src={process.env.PUBLIC_URL + "/banner/apiSearch.jpg"} />
                <div className="searchContainer">
                  <p>Search<br /> Now!</p>
                  <div className="apiSearchContent">
                    <label>제품명</label>
                    <input type="text" onChange={(e)=>{
                          setInputItem(e.target.value);
                      }} placeholder=" 제품명을 입력하세요."/>
                  </div>
                  <a className="apiSearchBtn" onClick={getFoodsItem}>Search</a>
                </div>
              </div>
              <div className="apiRightSide">
                {
                  apiCheck == true ? <ApiFoodsData apiData={apiData} allergyList={allergyList} allegyData={allegyData} /> : <ApiNullData />
                }
              </div>
            </section>
        </div>
      </div> */}
      <div className="postWrap">
        <div className="inner postContainer">
          <p className="main-title">게시글</p>
          <ul>
            {listOfPosts.map((value, key) => {
              return (
                <div key={key}>
                  <li>
                    <div className="title" onClick={() => {
                        navigate(`/post/${value.id}`);
                      }}>{value.title}
                    </div>
                    <div
                      className="content"
                      onClick={() => {
                        navigate(`/post/${value.id}`);
                      }}
                    >
                      {value.postContent}
                    </div>
                    <div className="username">{value.username}</div>
                    <div className="buttons">
                      {/* 152 */}
                      <ThumbUpIcon onClick={() => {
                        likeAPost(value.id);
                      }} 
                      // likedPosts array에 존재하는지
                        className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"} 
                      />
                      {/* 145  */}
                      <label>{value.Likes.length}</label>
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ApiFoodsData = (props) => {
  return (
    <>
      <ul className="apiFoodsTable">
        {
          props.apiData.map((value, key) => {
            return(
              <div key={key}>
                <li>
                  <p className="apiFoodsId">{key}</p>
                  <p className="apiFoodsName">품목명:<br/>{value.PRDLST_NM}</p>
                  <div className="apiFoodsRawInfo">
                    <p className="apiFoodsDcnm">유형: {value.PRDLST_DCNM	}</p>
                    <p className="apiFoodsRawName">원재료: {value.RAWMTRL_NM}</p>
                  </div>
                  </li>
                  {/* console.log(props.allergyList[key]); */}
                  {/* {console.log(value[key].RAWMTRL_NM)} */}
              </div>
            )
            
          })
        }
      </ul>
    </>
  )
};

const ApiNullData = () => {
  return(
    <>
      <p>null</p>
    </>
  );
}

export default Main;
