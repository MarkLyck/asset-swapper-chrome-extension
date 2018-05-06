import { h, Component } from 'preact'

function isURLValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

class Popup extends Component {
    constructor() {
        super();
        this.addRule = this.addRule.bind(this)
        this.removeRule = this.removeRule.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.handleSourceInput = this.handleSourceInput.bind(this)
        this.handleTargetInput = this.handleTargetInput.bind(this)

		this.state = {
            sourceValue: localStorage.sourceValue || '',
            targetValue: localStorage.targetValue || '',
            rules: JSON.parse(localStorage.getItem('rules')) || [],
            error: ''
        }
	}

    addRule(e) {
        e.preventDefault()
        if (!isURLValid(this.state.sourceValue) || !isURLValid(this.state.targetValue)) {
            if (!isURLValid(this.state.sourceValue)) {
                this.setState({ error: 'source' })
            } else {
                this.setState({ error: 'target' })
            }
            return
        }

        const rules = this.state.rules;
        rules.push({
            source: this.state.sourceValue,
            target: this.state.targetValue,
            active: true,
        })
        this.setState({
            sourceValue: '',
            targetValue: '',
            rules,
        })
        localStorage.rules = JSON.stringify(rules)
    }

    removeRule(index) {
        const rules = this.state.rules;
        rules.splice(index, 1)
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    editRule(rule, index) {
        const rules = this.state.rules;
        rules.splice(index, 1)
        this.setState({
            sourceValue: rule.source,
            targetValue: rule.target,
            rules,
        })
        localStorage.rules = JSON.stringify(rules)
    }

    toggleStatus(index) {
        const rules = this.state.rules;
        const ruleAtIndex = rules[index]
        console.log(ruleAtIndex)
        ruleAtIndex.active = !ruleAtIndex.active
        rules.splice(index, 1, ruleAtIndex)
        console.log(rules)
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    handleSourceInput(e) {
        this.setState({ sourceValue: e.target.value, error: '' })
        localStorage.sourceValue = e.target.value
    }

    handleTargetInput(e) {
        this.setState({ targetValue: e.target.value, error: '' })
        localStorage.targetValue = e.target.value
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
        const { rules, sourceValue, targetValue, error } = this.state
        const sourceIconClass = this.getIconClass(sourceValue)
        const targetIconClass = this.getIconClass(targetValue)

        return (
            <div className="container">
                <p>Enter a url you want to redirect:</p>

                <form className="form-inline">
                    <div className="input-container">
                    <i className={`sf-icon ${sourceIconClass}`} />
                        <input
                            type="text"
                            className={error === 'source' ? 'input-error' : ''}
                            placeholder="Redirect from"
                            value={sourceValue}
                            onKeyUp={this.handleSourceInput}
                        />
                    </div>

                    <i className="fas fa-angle-right" />

                    <div className="input-container">
                        <i className={`sf-icon ${targetIconClass}`} />
                        <input
                            type="text"
                            className={error === 'target' ? 'input-error' : ''}
                            placeholder="Redirect to"
                            value={targetValue}
                            onKeyUp={this.handleTargetInput}
                        />
                    </div>

                    <button onClick={this.addRule} className="add-button">Add rule</button>
                </form>

                {rules.length ? (
                    <table>
                        <thead>
                            <tr>
                                <th className="from-head">From</th>
                                <th className="target-head">To</th>
                                <th className="status-head">Status</th>
                                <th className="actions-head">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((rule, i) => (
                                <tr>
                                    <td className="source-cell">
                                        <i className={`ft-icon ${this.getIconClass(rule.source)}`} />
                                        <a href={rule.source} target="_blank" noreferrer>{rule.source}</a>
                                    </td>
                                    <td className="target-cell">
                                        <i className={`ft-icon ${this.getIconClass(rule.target)}`} />
                                        <a href={rule.target} target="_blank" noreferrer>{rule.target}</a>
                                    </td>
                                    <td onClick={() => this.toggleStatus(i)} className={`status-cell ${rule.active ? 'status-active' : 'status-disabled'}`}>
                                        {rule.active ? '● Active' : '● Disabled'}
                                    </td>
                                    <td className="actions-cell">
                                        <button onClick={() => this.editRule(rule, i)} className="edit-entry"><i className="fas fa-edit"/></button>
                                        <button onClick={() => this.removeRule(i)} className="remove-entry"><i className="fas fa-trash-alt"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : ''}
                <p className="in-small">Created by <a href="http://markdid.it" target="_blank" noreferrer>Mark Lyck</a></p>
            </div>
        )
    }
}

export default Popup