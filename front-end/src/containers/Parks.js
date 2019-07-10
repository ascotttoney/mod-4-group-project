import React, { Component } from 'react'
import { Container, Card, CardColumns, Button } from 'react-bootstrap'
import ParkCard from '../components/ParkCard'

export default class ParksContainer extends Component {
  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center">National Parks</h1>

          <CardColumns>
            <div className="p-3 row justify-content-md-center">
              {this.props.parks.map(park => {
                return <ParkCard
                  key={park.id}
                  park={park}
                  showPark={this.props.showPark}
                  planNewVisit={this.props.planNewVisit}
                  logPastVisit={this.props.logPastVisit} />
              })}
            </div>
          </CardColumns>
        </Container>
      </div>
    )
  }
}
