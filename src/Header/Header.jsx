import { h } from 'preact'
import './header.css'

const Header = ({ numOfActiveRedirects, handleNewRedirect }) => (
    <header className="header">
        <div className="left-content">
            <h3 className="extension-name">Switchie</h3>
            <p className="num-of-redirects">{numOfActiveRedirects} Active redirect{numOfActiveRedirects !== 1 && 's'}</p>
        </div>
        <button onClick={handleNewRedirect} className="add-rule">Add Rule</button>
    </header>
)

export default Header