import { Card, Grid } from "@mui/material";
import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { Loading } from "./Loading";
import { courseState } from "../store/atoms/course";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { courseTitle, coursePrice, isCourseLoading, courseImage } from "../store/selectors/course";

import YoutubeEmbed from "./YoutubeEmbed";
import { Editor } from '@tinymce/tinymce-react';
 
// import {userState} from "../store/atoms/users"

function UpdateCourse() {
  let { id } = useParams();
  const setCourse = useSetRecoilState(courseState);
  const courseLoading = useRecoilValue(isCourseLoading);
  const [showCreate, setShowCreate] = useState(false);
  const [addText, setAddText] = useState(false)
  const [addVideo, setAddVideo] = useState(false)
  const [text, setText] = useState("nil")
  const [link, setLink] = useState("nil")
  const [name, setName] = useState("nil")
  const [description, setDescription] = useState("nil")
  
  // const admin = useRecoilValue(userState)
  const baseUrl = localStorage.getItem("account")

  if(baseUrl!=="/api/admin") return <div className="signup--container gradient" ><p> you are not authorized</p></div>

  useEffect(() => {
    axios.get(`${baseUrl}/course/${id}`).then(res => {
      setCourse({ isLoading: false, course: res.data.course });
    })
      .catch(e => {
        setCourse({ isLoading: false, course: null });
      });
  }, []);

  if (courseLoading) {
    return <Loading />
  }
  const handleShowCreate = () => setShowCreate(!showCreate)
  const handleAddText = () => setAddText(!addText)
  const handleAddVideo = () => setAddVideo(!addVideo)
  const handleContent = async () => {
    const search = '"';
    const replaceWith = `'`;
    const newtext = text.split(search).join(replaceWith);
    // console.log(newtext);
    // console.log(link);
    // console.log(name);
    // console.log(description);
    try {
      const res = await axios.put(`${baseUrl}/course/${id}/content`, {
        name: name,
        description: description,
        html: newtext,
        videoLink: link
      }, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        }
      })
      alert("updated sucessfully")
    }
    catch (e) {
      console.log("request to backend terminated", e);
    }
    handleShowCreate();

  }

  return <div id="update--container" className="gradient">
    <GrayTopper />
    <Grid container style={{ minHeight: "100vh" }}>
      <Grid item lg={8} md={12} sm={12}>
        <UpdateCard />
      </Grid>
      <Grid item lg={4} md={12} sm={12}>
        <CourseCard />
      </Grid>
      <Grid item lg={12} md={12} sm={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button size="large" variant="outlined" style={{ color: "#c8b6fd", borderColor: "#c8b6fd" }} onClick={handleShowCreate}>
          Add New Chapters
        </Button>
      </Grid>
    </Grid>
    <div>
      {showCreate &&
        <div className="update--content">
          <TextField
            className="txt"
            style={{ marginBottom: 10, minWidth:"300px" }}
            onChange={(e) => {
              setName(e.target.value)
            }}
            fullWidth={true}
            label="Name"
            variant="outlined"
          />
          <TextField
            className="txt"
            style={{ marginBottom: 10, minWidth:"300px" }}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            fullWidth={true}
            label="Description"
            variant="outlined"
          />
          <Button
            size={"large"}
            variant="contained"
            style={{ width: "40%", background: "black", margin: 10 }}
            onClick={handleAddText}>
            add text
          </Button>
          {addText &&
            <Textarea setText={setText} />
          }
          <Button
            size={"large"}
            variant="contained"
            style={{ width: "40%", background: "black", margin: 10 }}
            onClick={handleAddVideo}>
            add video
          </Button>
          {addVideo &&
            <TextField
              style={{ marginBottom: 10, width: "30vw", minWidth:"300px" }}
              onChange={(e) => {
                let link = e.target.value.split('?')[1].split('&')[0].split('=')[1]
                setLink(link)
              }}
              fullWidth={true}
              label="youtube link"
              variant="outlined"
            />
            // <input type="text" onChange={(e) => setLink(e.target.value)} />
          }
          {link !== "nil" &&
            <YoutubeEmbed embedId={link} />
          }
          {(addText || addVideo) &&
            <Button
              size={"large"}
              variant="contained"
              style={{ width: "40%", background: "black", margin: 10 }}
              onClick={handleContent}>
              submit
            </Button>
          }
        </div>
      }
    </div>
  </div>
}

function Textarea({ setText }) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setText(editorRef.current.getContent())
    }
  };
  return (
    <>
      <Editor
        apiKey='yv6yuqcpi2aeiebfh7tflerl31ndmk177caqdiviwkvowy4r'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue='<h1>Start creating your content... \[-]/</h1>'
        init={{
          height: 500,
          menubar: false,
          selector: 'textarea',
          skin: "oxide-dark",
          content_css: "dark",
          plugins: [
            'importcss ', '  autosave ', ' directionality ', '  visualchars ', '  template', ' codesample', ' pagebreak', ' nonbreaking', '   quickbars', ' emoticons',
            'advlist', 'autolink', ' lists', ' link', ' image', ' charmap', 'preview', 'anchor', 'searchreplace', ' visualblocks', ' code ', 'fullscreen', 'insertdatetime', ' media', 'table ', ' code', ' help', ' wordcount', 'save',
            // 'paste', ' print ', 'hr', ' noneditable', ' textpattern', '  toc', 'imagetools'
          ],
          menubar: 'file edit view insert format tools table help',
          toolbar: 'formatselect' + '|fontselect fontsizeselect formatselect | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_prefix: '{path}{query}-{id}-',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          link_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_class_list: [
            { title: 'None', value: '' },
            { title: 'Some class', value: 'class-name' }
          ],
          importcss_append: true,
          file_picker_callback: function (callback, value, meta) {
            /* Provide file and text for the link dialog */
            if (meta.filetype === 'file') {
              callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
            }

            /* Provide image and alt text for the image dialog */
            if (meta.filetype === 'image') {
              callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
            }

            /* Provide alternative source and posted for the media dialog */
            if (meta.filetype === 'media') {
              callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
            }
          },
          templates: [
            { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
            { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
            { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
          ],
          template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
          height: 600,
          image_caption: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image imagetools table',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={log}
      />
    </>
  );
}

function GrayTopper() {
  const title = useRecoilValue(courseTitle);
  return <div style={{ height: 250, background: "black", top: 0, width: "100vw", zIndex: 0, marginBottom: -250 }}>
    <div style={{ height: 250, display: "flex", justifyContent: "center", flexDirection: "column" }}>
      <div>
        <Typography style={{ color: "white", fontWeight: 600 }} variant="h3" textAlign={"center"}>
          {title}
        </Typography>
      </div>
    </div>
  </div>
}

function UpdateCard() {
  const [courseDetails, setCourse] = useRecoilState(courseState);

  const [title, setTitle] = useState<string>(courseDetails.course.title);
  const [description, setDescription] = useState<string>(courseDetails.course.description);
  const [image, setImage] = useState<string>(courseDetails.course.imageLink);
  const [price, setPrice] = useState<number>(courseDetails.course.price);
  
  const navigate = useNavigate();
  
  const baseUrl = localStorage.getItem("account")

  return <div style={{ display: "flex", justifyContent: "center" }} >
    <Card varint={"outlined"} style={{ maxWidth: 700, marginTop: "35vh" }} className="course--card">
      <div style={{ padding: 25 }}>
        <Typography style={{ marginBottom: 10 }}>Update course details</Typography>
        <TextField
          value={title}
          style={{ marginBottom: 10 }}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          fullWidth={true}
          label="Title"
          variant="outlined"
        />

        <TextField
          value={description}
          style={{ marginBottom: 10 }}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          fullWidth={true}
          label="Description"
          variant="outlined"
        />

        <TextField
          value={image}
          style={{ marginBottom: 10 }}
          onChange={(e) => {
            setImage(e.target.value)
          }}
          fullWidth={true}
          label="Image link"
          variant="outlined"
        />
        <TextField
          value={price}
          style={{ marginBottom: 10 }}
          onChange={(e:any) => {
            setPrice(e.target.value)
          }}
          fullWidth={true}
          label="Price"
          variant="outlined"
        />

        <Button
          variant="contained"
          style={{ background: "black" }}
          onClick={async () => {
            axios.put(`${baseUrl}/courses/` + courseDetails.course._id, {
              title: title,
              description: description,
              imageLink: image,
              published: true,
              price
            }, {
              headers: {
                "Content-type": "application/json"
              }
            });
            let updatedCourse = {
              _id: courseDetails.course._id,
              title: title,
              description: description,
              imageLink: image,
              price
            };
            setCourse({ course: updatedCourse, isLoading: false });
            alert('course updated')
            navigate('/Courses')
          }}
        > Update course</Button>
      </div>
    </Card>
  </div>
}

function CourseCard() {
  const title = useRecoilValue(courseTitle);
  const imageLink = useRecoilValue(courseImage);

  return <div className="uc--course--card" style={{ display: "flex", marginTop: "23vh", justifyContent: "center", width: "100%" }} >
    <Card style={{
      width: 350,
      minHeight: 200,
      borderRadius: 20,
      // marginRight: 50,
      paddingBottom: 15,
      zIndex: 2
    }} className="course--card">
      <img src={imageLink} style={{ width: 350 }} ></img>
      <div style={{ marginLeft: 10 }}>
        <Typography variant="h5">{title}</Typography>
        <Price />
      </div>
    </Card>
  </div>
}

function Price() {

  const price = useRecoilValue(coursePrice);
  return <>
    <Typography variant="subtitle2" style={{ color: "rgb(77, 49, 81)" }}>
      Price
    </Typography>
    <Typography variant="subtitle1">
      <b>Rs {price} </b>
    </Typography>
  </>
}

export default UpdateCourse;