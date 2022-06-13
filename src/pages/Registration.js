import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from "axios";

const Registration = () => {

    let navigate = useNavigate();

    const initialValues ={
        username: "",
        password: "",
    }
    
    const validationSchema = Yup.object().shape({
        // required()안에 문장 없어도 되고 커스텀은 문장 넣기
        username: Yup.string().min(3).max(20).required(),
        password: Yup.string().min(4).max(30).required(),
    });
    // username, password 받음
    const onSubmit = (data) => {
        axios.post("https://sdp3-application.herokuapp.com/auth", data).then(()=>{
            console.log(data);
            navigate('/');
        })
    };
  return (
    <div className="writePage">
        {/* 초기값 설정 */}
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
            <Form className="formContainer">
              <div className="formContent">
                <label>ID :</label>
                <Field autoComplete="off" id="inputCreatePost" name="username" placeholder=" 아이디를 입력하세요." />
              </div>
              <ErrorMessage name="username" component="span" />

              <div className="formContent">
                <label>Password :</label>
                <Field autoComplete="off" type="password" id="inputCreatePost" name="password" placeholder=" 비밀번호를 입력하세요." />
              </div>
              <ErrorMessage name="password" component="span" />
                <button type="submit">등록하기</button>
            </Form>
        </Formik>
    </div>
  )
}

export default Registration;