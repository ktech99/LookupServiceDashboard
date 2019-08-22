import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import { Jumbotron, Button, ListGroup, Dropdown, ButtonToolbar } from 'react-bootstrap'



class App extends Component {

  constructor() {
    super();
    this.state = {
      groupCommunities: [],
    }
    this.getCommunities = this.getCommunities.bind(this);
  }

  componentDidMount() {

    fetch('http://localhost:8080/groupCommunities', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ groupCommunities: data })
      })
      .catch(console.log)
  }

  getCommunities(props) {
    const communities = props.communities;
    const listCommunities = communities.map((community) =>
      <Dropdown.Item  id = {community} key= {community} as={Button}  onClick={() => { 
        var current = document.getElementById("communitiesdropDown");
        current.textContent = {community}.community; // changing dropdown name
       }}>
        {/* todo onclick */}
        {community}
      </Dropdown.Item>
    );
    return (
      <Dropdown.Menu className="scrollBox">{listCommunities}</Dropdown.Menu>
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
            <Dropdown.Toggle variant="dark" id="communitiesdropDown">
              Group communities
            </Dropdown.Toggle>
              <this.getCommunities communities={this.state.groupCommunities} />
          </Dropdown>

          <Dropdown className="dropdownDiv">
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              pScheduler Tests
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <label>
                <input type="checkbox" className="schedulerCheckBox" />
                One
              </label>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="submitButton">
          <Button variant="warning">Submit</Button>
        </div>
      </Jumbotron>
    );
  }

};

export default App;
