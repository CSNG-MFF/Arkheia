import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Simulations</h1>
                </Link>
                <Link to="/about">
                    <h1>About</h1>
                </Link>
                <Link to="/documentation">
                    <h1>Documentation</h1>
                </Link>
            </div>
        </header>
    )
}

export default NavBar