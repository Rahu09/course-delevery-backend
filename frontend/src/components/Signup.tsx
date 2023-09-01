import React from 'react'
import axios from "axios"

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, TextField, Card, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/users";
import { Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const setUser = useSetRecoilState(userState)

  
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [exist, setExist] = React.useState(<p></p>)

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username,
      password
    }
    if(value==="admin"){
      axios.post("/api/admin/signup", body)
        .then((res) => {
          localStorage.setItem('account',"/api/admin")
          setUser({
            isLoading: false,
            userLogin: true
          })
          navigate('/')
        }).catch(() => setExist(<p>user already exist</p>))

    }else if(value=== "user"){
    axios.post("/api/users/signup", body)
      .then((res) => {
        localStorage.setItem('account',"/api/users")
        setUser({
          isLoading: false,
          userLogin: true
        })
        navigate('/')
      }).catch(() => setExist(<p>user already exist</p>))

    }else{
      alert("Select any one role USER or ADMIN")
    }
  }

  return (
    <div className='signup--container gradient'>
      <div className='signup-head'>
        <h1>Welcome To Course Delivery</h1>
        <h2>Don't have an account yet?. SIGNUP!!</h2>
      </div>

      <Card className='signup--container--card'>
        <TextField className='text' onChange={(e) => setUsername(e.target.value)} id="outlined-basic" label="username" variant="outlined" />

        <TextField className='text' onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="password" type={"password"} variant="outlined" />
        {/* <TextField className='text' onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Re-type password" type={"password"} variant="outlined" /> */}

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
        
        <Button variant="contained" onClick={handleSubmit}>Register</Button>
      </Card>
      <div >
        {exist}
      </div>
      <div>Already have an acount? <Link to="/Login">Login</Link></div>
    </div>
  )
}

export default Signup