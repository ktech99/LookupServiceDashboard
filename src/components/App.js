import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import { Row, Col, Container, Accordion, Card, Button, ListGroup } from 'react-bootstrap'


class App extends Component {

  constructor() {
    super();
    this.state = {
      communities: [],
      services: [],
      serviceMap: {},
      serviceDetails: []
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
    fetch('http://localhost:8080/services?serviceName='+element.community, { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
        .then(function(response){
          return response.json();
        })
        .then(function(data) {
          // console.log(Object.keys(data));
          self.setState({ services: Object.keys(data) })
          self.setState({serviceMap: data})
          var accID = document.getElementById('communityCard');
          accID.click();
          var serviceId = document.getElementById("serviceTypeCard");
          serviceId.click();
          console.log(self.state.serviceMap)
        })
        .catch(console.log)
  }

  serviceList(props) {
    const services = props.services;
    const listServices = services.map((service) =>
      <ListGroup.Item key={service} as={Button} action onClick={() => {this.serviceChoose({service})}}>
        {service}
      </ListGroup.Item>
    );
    return (
      <ListGroup>{listServices}</ListGroup>
    );
  }

  serviceChoose(element) {
    var serviceId = document.getElementById("serviceTypeCard");
    serviceId.click();
    var hostId = document.getElementById("hostNameCard");
    hostId.click();
    var detailsArray = [];
    for(var i in this.state.serviceMap){
      // alert(i); // alerts key
      // alert(foo[i]); //alerts key's value
      if(i === element.service){
        detailsArray.push(this.state.serviceMap[i]);
      }
    }
    this.setState({serviceDetails: detailsArray});
  }

  hostList(props) {
    const hosts = props.serviceDetails;
    console.log(hosts);
    for(var i in hosts){
        var host = hosts[i];
        console.log(host)  
    }
    // const listServices = hosts.map((host) =>
    //   <ListGroup.Item key={host} as={Button} action onClick={() => {this.serviceChoose({host})}}>
    //     {host}
    //   </ListGroup.Item>
    // );
    return (
      <ListGroup>
        
      </ListGroup>
    );
  }

  render() {
    return (
      <div>
        <div className="topnav">
          <img src={logo} alt="perfSONAR logo"></img>
          <input type="text" placeholder="Search.." />
          <button className="SearchButton">Search</button>
        </div>
        <Container >
          <Row>
            <Col className = "sidebar">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" id = "communityCard">
                      Communities
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body >
                      <ListGroup defaultActiveKey="#link1">
                        <div className="scrollBox">
                        <this.communityList communities={this.state.communities} />
                        </div>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" id="serviceTypeCard">
                      Service Type
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <ListGroup>
                        <div className="scrollBox">
                          <this.serviceList services = {this.state.services}/>
                        </div>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2" id="hostNameCard">
                      Host Name
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      <ListGroup>
                        <div className="scrollBox">
                          <this.hostList serviceDetails = {this.state.serviceDetails}/>
                        </div>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

              </Accordion>
            </Col>
            <Col >
            2 of 2
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

};

export default App;
