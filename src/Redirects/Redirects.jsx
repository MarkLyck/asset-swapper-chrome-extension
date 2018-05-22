import { h } from 'preact'
import './redirects.css'

const Redirects = ({ children }) => (
    <ul className="redirects">
        {children}
    </ul>
)

export default Redirects