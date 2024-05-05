import React, { useState } from 'react'
import FormInput from '../FormInput/FormInput'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from './../../App';

function Login({ handleLogin }) {



  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [backEndERR, setBackEndERR] = useState(false)

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const inputs = [

    {
      id: 1,
      name: 'email',
      type: "text",
      placeholder: "Email",
      errMessege: "Email doesn't valid",
      label: "Email",
      required: true,
      // pattern:""
    },
    {
      id: 2,
      name: 'password',
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
    }
  ]


  async function handleSumbit(e) {
    e.preventDefault()
    setIsLoading(true)

    let result = await axios
      .post(`${baseURL}/auth/login`, values)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setBackEndERR(error.response.data.message)
          setIsLoading(false);
        }
      });
    if (result?.data?.message === "done") {
      localStorage.setItem("token", result?.data.token)
      handleLogin();
      setIsLoading(false);
      navigate("/");
    } else {      
      setIsLoading(false);
    }


  }
  function handleTyping(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <>
      <form onSubmit={handleSumbit}>

        {backEndERR && <div className='alert alert-danger'>{backEndERR}</div>}
        {inputs.map((input) =>
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={handleTyping} />
        )}

        <button className='btn btn-primary mt-3' type='sumbit'> {
          isLoading ? <div className="lds-dual-ring"></div>
            : 'Login'
        }</button>


      </form>
    </>
  )
}

export default Login