import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavigationBar } from './NavigationBar';
import Parks from './Parks'
import { PastVisit } from './PastVisit';
import FutureVisit from './FutureVisit';
import UserPage from './UserPage'
import { NoMatch } from '../components/NoMatch'
import { Layout } from './Layout';
import { ParkDetails } from '../components/ParkDetails';
import { Map } from '../components/Map';
import MyModal from '../components/MyModal'

const URL = `http://localhost:3000/`

export default class AllContainer extends Component {
  state = {
    form: {
      user_id: '',
      park_id: '',
      title: '',
      description: '',
      season: '',
      year: ''
    },
    modalShow: false,
    parks: [],
    showPark: false,
    pastVisits: [],
    futureVisits: [],
    search: "",
    loggedIn: false,
    user: {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
      errors: ""
    }
  }

  modalShow = () => this.setState({ modalShow: true })
  modalClose = () => this.setState({ modalShow: false })
  searchChange = (e) => e.target.value.length > 2 ? this.setState({ search: e.target.value.toLowerCase() }) : this.setState({ search: e.target.value })
  showPark = (park) => this.setState({ showPark: park })
  backToParks = () => this.setState({ showPark: false })
  filterPark = (park) => {
    const search = this.state.search
    return park.fullname.toLowerCase().includes(search) || park.description.toLowerCase().includes(search) || park.weatherInfo.toLowerCase().includes(search) || park.states.includes(search)
  }

  fetchImages(park) {
    let newParks = this.state.parks
    fetch(URL + `parks/${park.id}/images`)
      .then(res => res.json())
      .then(imgs => {
        park.imgs = imgs
        newParks.push(park)
        this.setState({ parks: newParks })
      })
  }

  async fetchParks() {
    fetch(URL + 'parks')
      .then(res => res.json())
      .then(parks =>
        parks.forEach(park => {
          this.fetchImages(park)

        })
      )
  }

  fetchVisits() {
    fetch(URL + 'past_visits')
      .then(res => res.json())
      .then(data => {
        this.setState({ pastVisits: data })
      }
      )

    fetch(URL + 'future_visits')
      .then(res => res.json())
      .then(data => { this.setState({ futureVisits: data }) }
      )
  }


  displayParks = () => {
    let parks = this.state.parks
    return parks.filter(park => this.filterPark(park))
  }

  componentDidMount() {
    this.fetchParks()
    this.fetchVisits()
  }

  handleUserInputChange = (key, value) => {
    this.setState({ user: { ...this.state.user, [key]: value } }, () => console.log(this.state.user))
  }

  handleLogin = (e) => {
    e.preventDefault()

    let userObject = {
      userName: this.state.user.userName,
      password: this.state.user.password
    }

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userObject })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert("Sorry, your username or password is incorrect.")
          this.setState({ errors: data.message }, () => console.log("errors", this.state.errors))
        }
        else {
          this.setState({ user: data.user, loggedIn: true })
          localStorage.setItem('token', data.jwt)
          window.history.pushState({ url: "/profile" }, "", "/profile")
          this.forceUpdate()
        }
      })
    e.target.parentElement.reset()
  }

  handleLogout = (e) => {
    // e.preventDefault()

    localStorage.removeItem('token')
    this.setState({ loggedIn: false })
    // window.history.pushState({ url: '/' }, "", "/")
    // this.forceUpdate()
  }



  render() {


    return (
      <React.Fragment>
        <MyModal
          form={this.state.form}
          show={this.state.modalShow}
          onHide={this.modalClose}
        />
        <NavigationBar
          searchChange={this.searchChange}
          loggedIn={this.state.loggedIn}
          handleLogout={this.handleLogout}
        />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" render={() => (
                this.state.showPark ?
                  <ParkDetails
                    park={this.state.showPark}
                    backToParks={this.backToParks}
                    modalShow={this.modalShow}
                  /> :
                  <Map
                    parks={this.displayParks()}
                    showPark={this.showPark}
                    modalShow={this.modalShow}
                  />
              )} />

              <Route path="/parks" render={() => (
                this.state.showPark ?
                  <ParkDetails
                    park={this.state.showPark}
                    backToParks={this.backToParks} /> :
                  <Parks
                    parks={this.displayParks()}
                    showPark={this.showPark}
                    modalShow={this.modalShow}
                  />
              )} />

              <Route path="/past_visits" render={() => (<PastVisit pastVisits={this.state.pastVisits} parks={this.state.parks} />)} />
              <Route path="/future_visits" render={() => (<FutureVisit futureVisits={this.state.futureVisits} />)} />

              <Route path="/login" render={() => (
                <UserPage
                  user={this.state.user}
                  handleUserInputChange={this.handleUserInputChange}
                  loggedIn={this.state.loggedIn}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout} />
              )} />

              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    )
  }
}
