import '../style/NavBar.css'
import { NavLink } from "react-router-dom"

function NavBar() {
    return (
        <div className='navbar'>
            <NavLink to='/' className='home-link'>Home</NavLink>
            <NavLink to='/user/'>👤</NavLink>
        </div>
    )

}

export default NavBar