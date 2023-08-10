import '../style/NavBar.css'
import { NavLink } from "react-router-dom"

function NavBar({ setSearchCenter }) {
    return (
        <div className='navbar'>
            <NavLink to='/' onClick={() => setSearchCenter({})} className='home-link'>Home</NavLink>
            <NavLink to='/user/'>👤</NavLink>
        </div>
    )
}

export default NavBar