/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

const Main = () => {
  // const [listOfPosts, setlistOfPosts] = useState([]);


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

  let navigate = useNavigate();

  useEffect(() => {
    // 163, 로그인 했는지 체크
    if(!authState.status){
      navigate('/login');
    } else {
      axios.get("http://localhost:3001/posts",
      // 157
      { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
        // console.log(response.data);
        // likedPosts가 추가되어 obj이기 때문에 listOfPosts 추가
        setListOfPosts(response.data.listOfPosts);
        // 158, 모든 id 목록 개별적으로 가짐
        setLikedPosts(response.data.likedPosts.map((like)=>{return like.PostId}));
      });
    }
    // 식품안전나라 test
    // axios.get(
    //   `http://openapi.foodsafetykorea.go.kr/api/sample/C002/json/1/10`).then((response)=>{
    //     console.log(response.data);
    //   })
  }, []);

  
  // const getFoodsItem = () => {
  //   searchItem = inputItem;
  //   axios.get(`http://localhost:3001/api/byId/${searchItem}`).then((response) => {
      
  //   let foodsArray = [...apiData, response.data.C002.row];
  //     setApiData(foodsArray);
  //     setApiCheck(true);
  //     console.log(response.data);
  //   });
  //   // .catch((error)=>{
  //   //   console.log(error);
  //   // });
    
  // }

  const getFoodsItem = () => {
    axios.get(`http://openapi.foodsafetykorea.go.kr/api/7bb345a5cae7405fb10f/C002/json/1/10/PRDLST_NM=${inputItem}`).then((response) => {
      
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
        "http://localhost:3001/likes",
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
      <ul className="postWrap">
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
      <label>검색:</label>
      <input type="text" onChange={(e)=>{
            setInputItem(e.target.value);
        }}/>
      <button onClick={getFoodsItem}>click</button>
      {
        apiCheck == true ? <ApiFoodsData apiData={apiData} allergyList={allergyList} allegyData={allegyData} /> : null
      }
    </div>
  );
};

const ApiFoodsData = (props) => {
  return (
    <>
      {
        props.apiData.map((value, key) => {
        console.log(props.allergyList[key]);

          return(
            <div key={key}>
              {/* {console.log(value[key].RAWMTRL_NM)} */}
              <h1>품목명: {value.PRDLST_NM}</h1>
              <h3>유형: {value.PRDLST_DCNM	}</h3>
              <h3>원재료: {value.RAWMTRL_NM}</h3>
            </div>
          )
          
        })
      }
      
    </>
  )
}

export default Main;
