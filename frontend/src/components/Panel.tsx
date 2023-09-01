import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@mui/material";
// import star from  "public/star.png"

function Panel(Props: { title: { title: string; imageLink: string; price: string; _id: string; }; }) {
  const navigate = useNavigate();
  const { title, imageLink, price, _id } = Props.title

  const account = localStorage.getItem("account")
  return (
    <div className="card">

      <img
        src={imageLink}
        className="card--image"
      />
      <div className="card--stats">
        <img src={"./star.png"} className="card--star" />
        <span>4</span>
        <span className="gray">(33) • </span>
        <span className="gray"> online</span>
      </div>
      <p className="card--title">{title}</p>
      <p className="card--price">
        <span className="bold">From Rs{price}</span> / person
      </p>
      <div id='panal--button'>
        <Button size="large" variant="outlined" style={{ color: "#c8b6fd", borderColor: "#c8b6fd" }} onClick={() => navigate(`/CoursePage/${_id}`)}>COURSE CONTENT</Button>
        {account==="/api/admin" && <Button size="large" variant="outlined" style={{ color: "#c8b6fd", borderColor: "#c8b6fd" }} onClick={() => navigate(`/updateCourse/${_id}`)}>UPDATE COURSE</Button>}
      </div>
    </div>
  )
}

export default Panel