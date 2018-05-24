import { h, Component } from 'preact'
import './redirect.css'

import EditSVG from './edit.svg'
import TrashSVG from './trash-alt.svg'

function isURLValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

const isEditing = (index) => localStorage.getItem('editing') && JSON.parse(localStorage.getItem('editing')).hasOwnProperty(index)

class Redirect extends Component {
    state = {
        mode: this.props.rule.adding || isEditing(this.props.index) ? 'editing' : 'viewing',
        sourceValue: isEditing(this.props.index) ? JSON.parse(localStorage.getItem('editing'))[this.props.index].sourceValue : '',
        targetValue: isEditing(this.props.index) ? JSON.parse(localStorage.getItem('editing'))[this.props.index].targetValue : '',
        error: '',
    }

    editRule = () => {
        const { rule } = this.props
        this.setState({ mode: 'editing', sourceValue: rule.source, targetValue: rule.target })
    }

    saveRule = () => {
        const { sourceValue, targetValue } = this.state
        const { index, rule } = this.props

        if (!isURLValid(sourceValue) || !isURLValid(targetValue)) {
            if (!isURLValid(sourceValue)) { this.setState({ error: 'source' }) }
            else { this.setState({ error: 'target' }) }
            return
        }

        this.props.saveRule({
            source: sourceValue,
            target: targetValue,
            active: rule.active,
        }, this.props.index)
        this.setState({ mode: 'viewing' })
        let editing = JSON.parse(localStorage.getItem('editing')) || {}
        editing[index] = undefined
        localStorage.setItem('editing', JSON.stringify(editing))
    }

    handleSourceInput = e => {
        if (e.code === 'Enter') {
            this.saveRule()
            return
        }
        this.setState({ sourceValue: e.target.value, error: '' })
        const { index } = this.props
        const { targetValue } = this.state
        let editing = JSON.parse(localStorage.getItem('editing')) || {}
        editing[index] = { sourceValue: e.target.value, targetValue }
        localStorage.setItem('editing', JSON.stringify(editing))
    }

    handleTargetInput = e => {
        if (e.code === 'Enter') {
            this.saveRule()
            return
        }
        this.setState({ targetValue: e.target.value, error: '' })
        const { index } = this.props
        const { sourceValue } = this.state
        let editing = JSON.parse(localStorage.getItem('editing')) || {}
        editing[index] = { targetValue: e.target.value, sourceValue }
        localStorage.setItem('editing', JSON.stringify(editing))
    }

    getIconClass(url) {
        if (!url) return 'fas fa-link'
        if (url.includes('.json')) {
            return 'fas fa-database'
        } else if (url.includes('.js')) {
            return 'fab fa-js'
        } else if (url.includes('.css')) {
            return 'fab fa-css3-alt'
        } else {
            return 'fas fa-link'
        }
    }

    render() {
        const { rule, toggleStatus, handleEditRule, handleDeleteRule, index, rulesActive } = this.props
        const { mode, sourceValue, targetValue, error } = this.state

        return (
            <div className="redirect">
                <button className="status-container" onClick={() => toggleStatus(index)}>
                    <div className={`status status-${rule.active && rulesActive === true ? 'active' : 'disabled'}`} />
                </button>
                <i className={`file-type-icon ${this.getIconClass(rule.source)}`} />
                {mode !== 'editing' && <p className="url">{rule.source}</p>}
                {mode === 'editing' && (
                    <input
                        className={`url-input ${error === 'source' && 'input-error'}`}
                        type="text"
                        value={sourceValue}
                        onKeyUp={this.handleSourceInput}
                    />)}
                <i className="fas fa-angle-double-right" />
                <i className={`file-type-icon ${this.getIconClass(rule.target)}`} />
                {mode !== 'editing' && <p className="url">{rule.target}</p>}
                {mode === 'editing' && (
                    <input
                        className={`url-input ${error === 'target' && 'input-error'}`}
                        type="text"
                        value={targetValue}
                        onKeyUp={this.handleTargetInput}
                    />)}

                <div className="actions-container">
                    {mode === 'editing' && <button onClick={this.saveRule} className="save-entry"><i className="fas fa-check"/></button>}
                    {mode !== 'editing' && <button onClick={this.editRule} className="edit-entry"><EditSVG className="svg-icon"/></button>}
                    {(mode !== 'editing' || rule.adding) && <button onClick={() => handleDeleteRule(index)} className="remove-entry"><TrashSVG className="svg-icon" /></button>}
                </div>
            </div>
        )
    }
}

export default Redirect