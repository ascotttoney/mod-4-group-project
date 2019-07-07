import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavigationBar } from './NavigationBar';
import Main from './Main';
import Parks from './Parks'
import Visit from './Visit';
import UserPage from './UserPage'
import { NoMatch } from '../components/NoMatch'
import { Layout } from './Layout';

const URL = `http://localhost:3000/`

export default class AllContainer extends Component {
  state = {
    parks: []
  }

  componentDidMount() {
    fetch(URL + 'parks')
      .then(res => res.json())
      .then(data => this.setState({ parks: data }))
  }

  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/parks" render={(props) => <Parks {...props} parks={this.state.parks} />} />
              <Route path="/visits" component={Visit} />
              <Route path="/login" component={UserPage} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    )
  }
}