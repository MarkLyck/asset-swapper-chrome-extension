import { h } from 'preact'
import './header.css'

const Header = ({ numOfActiveRedirects, handleNewRedirect, toggleAllRules, rulesActive }) => (
    <header className="header">
        <div className="left-content">
            <h3 className="extension-name">Asset Swapper</h3>
            <p className="num-of-redirects">
                {rulesActive ? numOfActiveRedirects : 0} Active redirect{numOfActiveRedirects !== 1 || !rulesActive && 's'}
            </p>
        </div>
        <div className="action-container">
            <button onClick={toggleAllRules} className="dank-button power-button">
                <i className={`fas fa-power-off ${rulesActive ? 'on' : 'off'}`} />
            </button>
            <button onClick={handleNewRedirect} className="dank-button add-rule">
                <i className="fas fa-plus"/>Add Rule
            </button>
        </div>
    </header>
)

export default Header