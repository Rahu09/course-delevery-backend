import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import axios from "axios";

import React, { useState, useRef } from "react"
import YoutubeEmbed from "./YoutubeEmbed";
import { Editor } from '@tinymce/tinymce-react';


// import {userState} from "../store/atoms/users"
// import { useRecoilValue } from 'recoil'

function AddCourse() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [price, setPrice] = useState(0)
	const [chapter, setChapter] = useState(false)
	const [content, setContent] = useState([])

  // const admin = useRecoilValue(userState)
  const baseUrl = localStorage.getItem("account")


	const handleSubmit = async (e:any) => {
		e.preventDefault();
		const body = {
			title: title,
			description: description,
			price,
			imageLink: image,
			published: true
		}
		const res = await axios.post(`${baseUrl}/courses`, body);
		const courseID = res.data.courseId;
		const contentBody = {
			id: courseID,
			chapters: content
		}
		await axios.post(`/${baseUrl}/course/${courseID}/content`, contentBody);
		alert("Added course!");
	}
	const handleAddChapter = () => {
		setChapter(!chapter);
	}
	// const handleTest = () => {
	// 	console.log(content);
	// }

	if(baseUrl!=="/api/admin") return <div className="signup--container gradient" ><p> you are not authorized</p></div>

	return <div className="signup--container gradient" style={{ height: "100%", minHeight: "83vh" }}>
		<div style={{ display: "flex", justifyContent: "center" }}>
			<Card varint={"outlined"} className='signup--container--card' style={{ width: "30vw", padding: 20 }}>
				<TextField
					style={{ marginBottom: 10 }}
					onChange={(e) => {
						setTitle(e.target.value)
					}}
					fullWidth={true}
					label="Title"
					variant="outlined"
				/>

				<TextField
					style={{ marginBottom: 10 }}
					onChange={(e) => {
						setDescription(e.target.value)
					}}
					fullWidth={true}
					label="Description"
					variant="outlined"
				/>

				<TextField
					style={{ marginBottom: 10 }}
					onChange={(e) => {
						setImage(e.target.value)
					}}
					fullWidth={true}
					label="Image link"
					variant="outlined"
				/>

				<TextField
					style={{ marginBottom: 10 }}
					onChange={(e:any) => {
						setPrice(e.target.value)
					}}
					fullWidth={true}
					label="Price"
					variant="outlined"
				/>

				<Button
					size={"large"}
					variant="contained"
					onClick={handleSubmit}
					style={{ width: "40%" }}
				> Add course</Button>
			</Card>
		</div>
		{
			chapter ? (
				<div>
					<AddChapters setContent={setContent} setChapter={setChapter} />
				</div>
			) : (
				<Button
					size={"large"}
					variant="contained"
					style={{ width: "20%", background: "black", marginTop: "20px" }}
					onClick={handleAddChapter}>
					Add Chapters
				</Button>
			)
		}
		{/* <button onClick={handleTest}>testing</button> */}
	</div >
}

function AddChapters(props: { setContent: any; setChapter: any; }) {
	const {setContent, setChapter} = props 
	const [addText, setAddText] = useState(false)
	const [addVideo, setAddVideo] = useState(false)
	const [text, setText] = useState("nil")
	const [link, setLink] = useState("nil")
	const [name, setName] = useState("nil")
	const [description, setDescription] = useState("nil")

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
		setContent((oldArr: any) => [
			...oldArr,
			{
				name:name,
				description:description,
				html: newtext,
				videoLink: link
			}
		])
		setChapter(((oldCh: any) => !oldCh))
	}

	return (
		<div className="update--content">
			<TextField
				style={{ marginBottom: 10 }}
				onChange={(e) => {
					setName(e.target.value)
				}}
				fullWidth={true}
				label="Name"
				variant="outlined"
			/>
			<TextField
				style={{ marginBottom: 10 }}
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
				style={{ width: "40%", background: "black", marginBottom: 10 }}
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
					style={{ marginBottom: 10, width: "30vw" }}
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
					style={{ width: "40%", background: "black" }}
					onClick={handleContent}>
					submit
				</Button>
			}
		</div>
	)
}

function Textarea(props: { setText: any; }) {
	const { setText } = props
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
					toolbar_sticky: false,
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
export default AddCourse;