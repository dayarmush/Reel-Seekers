import { NavLink } from "react-router-dom"

function NavBar({ setSearchCenter }) {
    return (
        <div>
            <NavLink to='/' onClick={() => setSearchCenter({})}>Home</NavLink>
            <NavLink to='/user/'>👤</NavLink>
        </div>
    )

}

export default NavBar