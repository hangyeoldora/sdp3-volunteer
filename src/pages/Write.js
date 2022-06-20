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
  });

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

          <button type="submit">글쓰기</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Write;
