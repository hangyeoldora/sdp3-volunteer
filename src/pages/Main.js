/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

const Main = () => {
  let navigate = useNavigate();

  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  // data api
  const [apiData, setApiData] = useState([]);
  const [apiCheck, setApiCheck] = useState(false);
  const [inputItem, setInputItem] = useState("");

  
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

  const likeAPost = (postId) => {
    axios
      .post(
        "https://sdp3-application.herokuapp.com/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
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
                      <ThumbUpIcon onClick={() => {
                        likeAPost(value.id);
                      }} 
                      // likedPosts array에 존재하는지
                        className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"} 
                      />
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

export default Main;
