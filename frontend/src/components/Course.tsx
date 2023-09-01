import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import YoutubeEmbed from "./YoutubeEmbed"
import parse from 'html-react-parser';

// import {userState} from "../store/atoms/users"
// import { useRecoilValue } from 'recoil'

function Course() {
  let { id } = useParams();
  const [ind, setInd] = useState(0)
  const [content, setContent] = useState([]);
  const [show, setShow] = useState({
    name:"",
    description:"",
    html: "",
    videoLink: "",
    _id: ""
  })
  
  // const admin = useRecoilValue(userState)
  const baseUrl = localStorage.getItem("account")
  useEffect(()=>{
    const allChapters = async()=>{
      const res = await axios.get(`${baseUrl}/course/${id}/content`)
      setContent(res.data.chapters)
    }
    allChapters()
  },[])

  useEffect(()=>{
    // console.log('curr');
    setShow(content[0])
    setInd(0)
  },[content])

  // console.log(show);
  const handleprev = () => {
    if (ind !== 0) {
      // console.log('prev');
      setShow(content[ind - 1])
      setInd(ind - 1)
    }
  }
  const handlenext = () => {
    if (ind !== content.length - 1) {
      // console.log('next');
      setShow(content[ind + 1])
      setInd(ind + 1)
    }
  }
  const handlenav = (index:number) => {
    setInd(index)
    setShow(content[index])
    // console.log('next');
  }


  return (
    <div className='course'>
      <div className='course--nav'>
        <button onClick={handleprev}>prev</button>
        <h1>{show ? show.name : ""}</h1>
        <button onClick={handlenext}>next</button>
      </div>
      <div className='course--body'>
        <div className='chapter--index'>
          {content.map((ele, index) => <button
            onClick={() => handlenav(index)}
            key={index}
            className='nav--button'
            style={{ height: `${100 / content.length}%`, background: `${ind === index ? "#473f5d" : "#2c193900"}` }}
          >
            ch.{index + 1}
          </button>)}
        </div>
        <div className='course--container'>
          <div className='text--container'>
            {show && parse(show.html)}
          </div>
          <div className='video--container'>
            {show && <YoutubeEmbed embedId={show.videoLink} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course