import React from 'react'
import axios from 'axios'
import Panel from './Panel'

function AllCourses() {
  
  let baseUrl = ""
  const token = localStorage.getItem("account")
  if(typeof token==="string") baseUrl = token
  
  const [courses, setCourses] = React.useState([])
  React.useEffect(() => {
    const getallcourses = async()=>{
      await axios.get(`${baseUrl}/purchasedCourses`).then((res) => {
        setCourses(res.data.purchasedCourses)
      })
    }
    getallcourses()
    
  }, [])
  return (<div className='panel-container'>{courses.map((ele:{ title: string; imageLink: string; price: string; _id: string; }) => <Panel key={ele._id} title={ele} />)}</div>)
}

export default AllCourses