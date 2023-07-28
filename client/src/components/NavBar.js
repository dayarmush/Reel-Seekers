import { NavLink } from "react-router-dom"

function NavBar() {
    return (
        <div>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/login'>👤</NavLink>
        </div>
    )

}

export default NavBar