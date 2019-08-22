import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import { Jumbotron, Button, ListGroup, Dropdown } from 'react-bootstrap'


class App extends Component {

  constructor() {
    super();
    this.state = {
      communities: [],
    }
    // this.NavBar = this.NavBar.bind(this);
  }

  componentDidMount() {

    fetch('http://localhost:8080/groupCommunities', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ communities: data })
      })
      .catch(console.log)
  }

  communityList(props) {
    const communities = props.communities;
    const listCommunities = communities.map((community) =>
      <ListGroup.Item key={community} as={Button} action onClick={() => { this.communityChoose({ community }) }}>
        {community}
      </ListGroup.Item>
    );
    return (
      <ListGroup>{listCommunities}</ListGroup>
    );
  }


  render() {
    return (
      <Jumbotron className="head">
        <div>
          <input type="text" placeholder="Field Name.." className="searchBarField" />
          <input type="text" placeholder="Search.." className="searchBar" />
        </div>
        <div className="dropdownDiv">
          <Dropdown className="dropdownDiv">
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Group communities
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="dropdownDiv">
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Group communities
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <input type="checkbox" placeholder="Field Name.." className="searchBarField" />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Jumbotron>
    );
  }

};

export default App;
