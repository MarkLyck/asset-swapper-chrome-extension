import { h, Component } from 'preact'
import Header from './Header'
import Redirects from './Redirects'
import Redirect from './Redirect'

class Popup extends Component {
    constructor() {
        super();
        this.addRule = this.addRule.bind(this)
        this.removeRule = this.removeRule.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)

		this.state = {
            rules: JSON.parse(localStorage.getItem('rules')) || [],
            rulesActive: localStorage.getItem('rulesActive') || true,
        }
	}

    addRule(e) {
        const rules = this.state.rules;
        rules.push({
            source: '',
            target: '',
            active: true,
            adding: true,
        })
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    saveRule = (updatedRule, index) => {
        const rules = this.state.rules;
        rules.splice(index, 1, updatedRule)
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    removeRule(index) {
        const rules = this.state.rules;
        rules.splice(index, 1)
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    toggleStatus(index) {
        const rules = this.state.rules;
        const ruleAtIndex = rules[index]
        ruleAtIndex.active = !ruleAtIndex.active
        rules.splice(index, 1, ruleAtIndex)
        this.setState({ rules })
        localStorage.rules = JSON.stringify(rules)
    }

    toggleAllRules = () => {
        localStorage.setItem('rulesActive', !this.state.rulesActive)
        this.setState(state => ({ rulesActive: !state.rulesActive }))
    }

    render() {
        const { rules, sourceValue, targetValue, error, rulesActive } = this.state

        return (
            <div className="container">

                <Header
                    numOfActiveRedirects={rules.filter(rule => rule.active).length}
                    handleNewRedirect={this.addRule}
                    toggleAllRules={this.toggleAllRules}
                    rulesActive={rulesActive}
                />

                <Redirects rules={rules}>
                    {rules.map((rule, i) => (
                        <Redirect
                            rule={rule}
                            index={i}
                            toggleStatus={this.toggleStatus}
                            saveRule={this.saveRule}
                            handleDeleteRule={this.removeRule}
                            rulesActive={rulesActive}
                        />)
                    )}
                </Redirects>
            </div>
        )
    }
}

export default Popup