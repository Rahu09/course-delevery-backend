import  React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms/users'


import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';

import Cookies from 'js-cookie';

function ResponsiveAppBar() {

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [width, setWidth] = React.useState(window.innerWidth);

	useEffect(() => {
		window.addEventListener("resize", () => setWidth(window.innerWidth));
		return () => window.removeEventListener("resize", () => setWidth(window.innerWidth));
	});

	const navigate = useNavigate()
	const { userLogin } = useRecoilValue(userState)
	const setUser = useSetRecoilState(userState);
	const baseUrl = localStorage.getItem("account")

	const handleLogout = ()=>{
		let cookie = Cookies.get("token")
		// console.log(cookie);
		if(cookie===undefined) logout()
	}

	function logout() {
		localStorage.removeItem("account")
		setUser({
			isLoading: false,
			userLogin: false
		})
		navigate('/')
		setTimeout(() => alert("you have been logged out"), 500)
	}
	// useEffect(()=>{
	// 	if(userLogin) navigate('/')
	// },[userLogin])

	let show = <></>
	if (width > 850) {
		show = <div className='at--large'>
			<Button size="large" onClick={() => {
				handleLogout()
				navigate('/Courses')
				}}>All Courses</Button>
			{
				baseUrl === "/api/admin" ? 
				<Button size="large" onClick={() => {
					navigate('/addcourse')
					handleLogout()
				}}>Add Course</Button> :
				<Button size="large" onClick={() => {
					navigate('/courses/purchased')
					handleLogout()
				}}>PURCHASED</Button>
			}
			
			<Button size="large" onClick={logout}>Logout</Button>
		</div>
	} else {
		const handleOpenNavMenu = (event:any) => {
			setAnchorElNav(event.currentTarget);
		};
		const handleCloseNavMenu = () => {
			setAnchorElNav(null);
		};
		show = <div className='at--small'>
			<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="false"
					onClick={handleOpenNavMenu}
					color="inherit"
				>
					<MenuIcon />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorElNav}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
					keepMounted
					transformOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
					open={Boolean(anchorElNav)}
					onClose={() => handleCloseNavMenu()}
					sx={{
						display: { xs: "block" }
					}}
				>
					<MenuItem onClick={() => {
						setAnchorElNav(null);
						navigate('/Courses')
						handleLogout()
					}}>
						<Typography textAlign="center">Courses</Typography>
					</MenuItem>
					{baseUrl === "/api/admin" ?
						(<MenuItem onClick={() => {
							navigate('/addcourse')
							setAnchorElNav(null);
							handleLogout()
						}}>
							<Typography textAlign="center">Add course</Typography>
						</MenuItem>)
						:
						(<MenuItem onClick={() => {
							navigate('/courses/purchased')
							setAnchorElNav(null);
							handleLogout()
						}}>
							<Typography textAlign="center">purchased</Typography>
						</MenuItem>)
					}
					<MenuItem onClick={logout}>
						<Typography textAlign="center">Logout</Typography>
					</MenuItem>
				</Menu>
			</Box>
		</div>
	}

	return (
		<>
			<div className='navbar-container'>
				<div className="navbar">
					<div className="navrighit">
						<Button size="large" onClick={() => navigate('/')}>Course \\_// delevery</Button>
					</div>
					<div className="navleft">
						{userLogin ?
							show :
							<div>
								<Button size="large" onClick={() => navigate('/login')}>Login / Signup</Button>
							</div>}
					</div>
				</div>
			</div>
		</>
	)
}
export default ResponsiveAppBar;