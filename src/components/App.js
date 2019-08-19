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
      communities: [],
      services: []
    }
    this.communityChoose = this.communityChoose.bind(this); 
    this.communityList = this.communityList.bind(this);
    this.serviceList = this.serviceList.bind(this);
    this.serviceChoose = this.serviceChoose.bind(this);
  }

  componentDidMount() {

    fetch('http://localhost:8080/groupCommunities', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ communities: data })
        //console.log(this.state.communities)
      })
      .catch(console.log)
  }

  communityList(props) {
    const communities = props.communities;
    const listCommunities = communities.map((community) =>
      <ListGroup.Item key={community} as={Button} action onClick={() => {this.communityChoose({community})}}>
        {community}
      </ListGroup.Item>
    );
    return (
      <ListGroup>{listCommunities}</ListGroup>
    );
  }

   communityChoose(element) {
    let self = this;
    fetch('http://localhost:8080/services', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
        .then(function(response){
          return response.json();
        })
        .then(function(data) {
          self.setState({ services: data })
          console.log(data)
        })
        .catch(console.log)
    console.log(element.community);
  }

  serviceList(props) {
    const services = props.services;
    const listServices = services.map((service) =>
      <ListGroup.Item key={service} as={Button} action onClick={function(){this.serviceChoose({service})}}>
        {service}
      </ListGroup.Item>
    );
    return (
      <ListGroup>{listServices}</ListGroup>
    );
  }

  serviceChoose(element) {
  
    console.log(element.service);
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
            <Col>
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Communities
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body >
                    <ListGroup defaultActiveKey="#link1">
                      <this.communityList communities={this.state.communities} />
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Service Type
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <ListGroup>
                        <this.serviceList services = {this.state.services}/>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col >2 of 2</Col>
          </Row>
        </Container>
      </div>
    );
  }

};

export default App;
