import React, { useState } from 'react'
import FormInput from '../FormInput/FormInput'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../App.js';

function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [backEndERR, setBackEndERR] = useState(false)

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
  })

  const inputs = [
    {
      id: 1,
      name: 'firstName',
      type: "text",
      placeholder: "First Name",
      errMessege: "Name must be 3-16 characters and shouldn't include any special charecter ",
      label: "First Name",
      required: true,
      pattern: '^[A-Za-z][A-Za-z0-9_]{1,16}$'

    },
    {
      id: 2,
      name: 'lastName',
      type: "text",
      placeholder: "Last Name",
      errMessege: "Name must be 3-16 characters and shouldn't include any special charecter ",
      label: "Last Name",
      required: true,
      pattern: '^[A-Za-z][A-Za-z0-9_]{1,16}$'
    },
    {
      id: 3,
      name: 'email',
      type: "email",
      placeholder: "Email",
      errMessege: "Email doesn't valid",
      label: "Email",
      required: true,
      // pattern:""
    },
    {
      id: 4,
      name: 'age',
      type: "text",
      placeholder: "Age",
      errMessege: 'Age must be number',
      label: "Age",
      required: true,
      pattern: '^[0-9]+$'
    },
    {
      id: 5,
      name: 'password',
      type: "password",
      placeholder: "Password",
      errMessege: "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters",
      label: "Password",
      required: true,
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$'
    }
  ]

  async function handleSumbit(e) {
    e.preventDefault()
    setIsLoading(true)    
    let result = await axios
      .post(`${baseURL}/auth/signup`, values)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setBackEndERR(error.response.data?.message)
          setIsLoading(false);
        }
      });
    if (result?.data?.message === "done") {
      setIsLoading(false);
      navigate("/login");
    } else {
      setBackEndERR(result?.data?.message)
      setIsLoading(false);

    }
  }
  function handleTyping(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  // console.log(values)

  return (
    <>
      <form onSubmit={handleSumbit}>

        {backEndERR && <div className='alert alert-danger'>{backEndERR}</div>}
        {inputs.map((input) =>
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={handleTyping} />
        )}

        <button className='btn btn-primary mt-3' type='sumbit'> {
          isLoading ? <div className="lds-dual-ring"></div>
            : 'Sign Up'
        }</button>


      </form>
    </>
  )
}

export default Register