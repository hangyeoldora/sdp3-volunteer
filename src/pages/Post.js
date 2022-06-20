/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Post = () => {
  let { id } = useParams();

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // data 가져오기 (Home.js에서)
    axios.get(`https://sdp3-application.herokuapp.com/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    // comment 가져오기 (commnets.js)
    axios.get(`https://sdp3-application.herokuapp.com/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "https://sdp3-application.herokuapp.com/comments",
        { commentBody: newComment, PostId: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          // 새로고침없이 자동으로
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios.delete(`https://sdp3-application.herokuapp.com/comments/${id}`, {
      // 유효성 인증을 위해 header
      headers: {accessToken: localStorage.getItem('accessToken')},
    }).then(()=> {
      // 삭제 시, 재랜더링을 위해 필터 사용 (목록 유지할지 여부 체크)
      setComments(
        comments.filter((value) => {
          return value.id !== id;
      }))
    });
  }

  return (
    <div className="detailPage">
      <div className="inner">
        <h1>게시판</h1>
        <div className="detail-container">
          <div className="userInfo">
            <span className="detail-username">{postObject.username}</span>
            <div className="detail-datetime">{postObject.createdAt}</div>
          </div>
          <section className="detail-contentWrap">
            <p className="detail-id">#&nbsp;{postObject.id}</p>
            <p className="detail-title">{postObject.title}</p>
            <hr />
            <p className="detail-content">{postObject.postContent}</p>
          </section>
        </div>
        <section className="detail-commentWrap">
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Comments..."
              autoComplete="off"
              value={newComment || ''}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
            />
            <button onClick={addComment} type="submit">
              Add comment
            </button>
          </div>
          <div className="listOfComments">
            {comments.map((comment, key) => {
              return (
                <div key={key} className="comment">
                  {comment.commentBody}
                  <label>Username: {comment.username}</label>
                {authState.username === comment.username && <button onClick={()=> {deleteComment(comment.id)}}>X</button>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Post;
