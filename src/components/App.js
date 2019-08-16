import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import Header from './Header'
import Sidebar from './Sidebar'
import MapWithMarkers from "./Map"
import ServiceTable from "./ServiceTable"
import HostTable from "./HostTable"
import { Row, Col, Container, Dropdown, DropdownButton, Accordion, Card, Button, ListGroup } from 'react-bootstrap'

class App extends Component {
  constructor() {
    super();
    this.state = {
      results: {}
    }
  }

  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then((data) => {
      // this.setState({ results: data })
      console.log(data)
    })
    .catch(console.log)
  }

  render() {
    return (
      <div>
        <div className="topnav">
          <img src={logo}></img>
          <input type="text" placeholder="Search.." />
          <button className="SearchButton">Search</button>
        </div>
        <Container>
          <Row>
            <Col >
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Communities
      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <ListGroup>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Browser
      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <ListGroup>
                        <ListGroup.Item>Empty</ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col xs={6}>2 of 2</Col>
          </Row>
        </Container>
      </div>
    );
  }

};


export default App;
