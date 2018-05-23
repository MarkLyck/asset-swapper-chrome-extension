import { h } from 'preact'
import './redirects.css'

const Redirects = ({ children }) => (
    <ul className="redirects">
        {children}
        {children.length < 1? (
            <h3 className="no-rules">Looks like you don't have any redirects set up. Click "Add Rule" to get started.</h3>
        ) : ''}
    </ul>
)

export default Redirects