/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

const Write = () => {
  // form 초기값 설정
  const { authState } = useContext(AuthContext);
  const initialValues ={
      title: "",
      postText: "",
      // username:"",
  }
  let navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem("accessToken")) {
      navigate('/login');
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("제목은 필수입니다."),
    postContent: Yup.string().required(),
    // username: Yup.string().min(3).max(15).required(),
  });

  // 165 이후
  const onSubmit = (data) =>{
    axios.post('https://sdp3-application.herokuapp.com/posts', data, {
        headers: {accessToken: localStorage.getItem("accessToken")}
    }).then((response)=>{
      navigate('/');
    });
}

  return (
    <div className="writePage">
      {/* 초기값 설정 */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div className="formContent">
            <label>제목 :</label>
            <Field
              autoComplete="off"
              id="inputWritePost"
              name="title"
              placeholder="제목을 입력하세요"
            />
          </div>
          <ErrorMessage name="title" component="span" />

          <div className="formContent">
            <label>내용 :</label>
            <Field
              autoComplete="off"
              id="inputWritePost"
              name="postContent"
              placeholder="내용을 입력하세요."
            />
          </div>
          <ErrorMessage name="postContent" component="span" />

          {/* <div className="formContent">
            <label>Username:</label>
            <Field
              autoComplete="off"
              id="inputWritePost"
              name="username"
              placeholder="유저명을 입력하세요."
            />
          </div>
          <ErrorMessage name="username" component="span" /> */}

          <button type="submit">글쓰기</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Write;
