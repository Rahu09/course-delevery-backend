import React from 'react'
import axios from 'axios'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, TextField, Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../store/atoms/users'
import { Link } from 'react-router-dom';

function Login() {

  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const navigate = useNavigate()
  const setUser = useSetRecoilState(userState)
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      "username": username,
      "password": password
    }

    if(value ==="admin"){
      axios.post("/api/admin/login", {}, {
        headers: user
      }).then((res) => {
        localStorage.setItem('account',"/api/admin")
        setUser({
          isLoading: false,
          userLogin: true
        })
        navigate('/')
      })
      // console.log("admin");
    }else if(value ==="user"){
      axios.post("/api/users/login", {}, {
        headers: user
      }).then((res) => {
        localStorage.setItem('account',"/api/users")
        setUser({
          isLoading: false,
          userLogin: true
        })
        navigate('/')
      })
      // console.log("user");
    }else{
      alert("Select any one role USER or ADMIN")
    }


  }

  return (
    <div className='signup--container gradient'>
      <div className='signup-head'>
        <h1>Welcome To Course Delivery</h1>
        <h2>login to your account.</h2>
      </div>

      <Card className='signup--container--card'>
        <TextField className='text' onChange={(e) => setUsername(e.target.value)} id="outlined-basic" label="username" variant="outlined" />
        <TextField className='text' onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="password" type={"password"} variant="outlined" />
        <FormControl className='login--radio'>
          <FormLabel id="demo-controlled-radio-buttons-group" style={{color:"black", textAlign:"center", textDecoration:"underline"}}>LOG IN AS</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value="admin" control={<Radio />} label="admin" />
            <FormControlLabel value="user" control={<Radio />} label="user" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>login</Button>

      </Card>
      <br />
      <div>Don't have an account yet? <Link to="/Signup">Signup</Link></div>
    </div>
  )
}

export default Login