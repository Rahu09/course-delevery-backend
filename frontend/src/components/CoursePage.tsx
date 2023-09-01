import axios from "axios";
import React, { useEffect, useState, useRef } from "react"
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "./Loading";
import { courseState } from "../store/atoms/course";
import { contentState } from "../store/atoms/content"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { coursePrice, isCourseLoading, courseImage, courseTitle, courseDescription } from "../store/selectors/course";
import Cookies from 'js-cookie';

// import {userState} from "../store/atoms/users"


function CoursePage() {
  const navigate = useNavigate();
  let { id } = useParams();

  const setCourse = useSetRecoilState(courseState)
  const courseLoading = useRecoilValue(isCourseLoading);
  const title = useRecoilValue(courseTitle)
  const image = useRecoilValue(courseImage)
  const Description = useRecoilValue(courseDescription)
  const [content, setContent] = useRecoilState<any>(contentState)
  const [chapters, setChapters] = useState<chapter[]>([])
  const [purchased, setPurchased] = useState([])
  const [bought, setBought] = useState(false)

  // const admin = useRecoilValue(userState)
  const baseUrl = localStorage.getItem("account")
  Cookies.remove('username');


  // const [course, setCourse] = useRecoilState(courseState)

  // console.log(course);
  // console.log(purchased);

  type purchasedCourses = {
    _id: string
    title: string
    description: string
    price: number
    imageLink: string
    published: boolean
    __v: number
  }

  useEffect(() => {
    axios.get(`${baseUrl}/course/${id}`).then(res => {
      // console.log("success course");
      setCourse({ isLoading: false, course: res.data.course });

    }).catch(e => {
      console.log("error course");
      setCourse({ isLoading: false, course: null });
    });

    axios.get(`${baseUrl}/course/${id}/content`).then(res => {
      // console.log("success content");
      setContent({ isLoading: true, content: res.data });

    }).catch(e => {
      console.log("error content");
      setContent({ isLoading: false, content: null });
    });

    if (baseUrl === '/api/users') {
      axios.get(`${baseUrl}/purchasedCourses`).then(res => {
        // console.log("success content");
        setPurchased(res.data.purchasedCourses.map((ele: purchasedCourses) => ele._id))

      }).catch(e => {
        console.log("error content");
      });
    }

  }, []);
  
  type chapter = {
    name: string
    description: string
    html: string
    _id: object
  }
  type allcontent = {
    __id:object
    id:string
    chapters:chapter[]
  }


  useEffect(() => {
    if (content.content)
      setChapters(content.content.chapters)
  }, [content])

  useEffect(() => {
    setBought(purchased.find((ele) => ele === id) === id)
  }, [purchased])

  // let btnTxt = false
  // btnTxt = purchased.find((ele) => ele === id) === id

  const handlePurchase = () => {
    if (baseUrl === "/api/admin") { navigate(`/course/${id}`) }
    else if (bought === true) { navigate(`/course/${id}`) }
    else {
      axios.post(`${baseUrl}/courses/${id}`).then((res) => {
        setBought(true)
        alert("COURSE PURCHESED")
      })
    }
  }
  // console.log(baseUrl==="/");
  if (courseLoading) {
    return <Loading />
  }
  return (
    <div className='coursepage--container'>
      <div id="cp--title">{title}</div>
      <div style={{ fontSize: "30px", paddingBottom: "50px", color: "grey", textAlign: "center" }}>An interactive online course</div>
      <div id="cp--image"><img src={image} alt="course image" /></div>
      <div id="cp--Description">{Description}</div>
      {/* purchase logic */}


      <Button
        id="cp--button"
        size={"large"}
        variant="contained"
        style={{ width: "30%" }}
        onClick={handlePurchase}
      >
        {(baseUrl === "/api/admin") ? "START COURSE" : (bought ? "START COURSE" : "PURCHASE COURSE")}
      </Button>


      <p style={{ fontSize: "45px", textDecoration: "underline", textDecorationThickness: "1px", marginBottom: "0px", textAlign: "center" }}>WHAT WILL YOU LEARN?</p>
      <p style={{ fontSize: "20px", color: "grey", textDecorationThickness: "1px", margin: "0px" }}>Chapter list</p>
      <div id="cp--chapters--container">{
        chapters && chapters.length != 0 ?
          chapters.map((ele: chapter, ind) => {
            return (<div id="cp--chapter" key={ind}>
              <div id="cp--chapter--ind">{ind + 1}</div>
              <div id="cp--chapter--details">
                <p id="cp--chapter--title">{ele.name}</p>
                <p id="cp--chapter--des">{ele.description}</p>
              </div>
            </div>)

          }) : "loding"
      }</div>
    </div>
  )
}

export default CoursePage