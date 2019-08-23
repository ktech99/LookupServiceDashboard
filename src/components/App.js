import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import { Jumbotron, Button, ListGroup, Dropdown, ButtonToolbar } from 'react-bootstrap'
import Search from "react-search"

class App extends Component {

  constructor() {
    super();
    this.state = {
      groupCommunities: [],
      selectedGroupCommunity: "",
      pSchedulerTests: [],
      chosenSchedulers: [],
      items: [
        { id: 0, value: 'ruby' },
        { id: 1, value: 'javascript' },
        { id: 2, value: 'lua' },
        { id: 3, value: 'go' },
        { id: 4, value: 'julia' },
        { id: 5, value: 'p' }
      ]
    }
    this.getCommunities = this.getCommunities.bind(this);
    this.getPschedulers = this.getPschedulers.bind(this);
  }

  HiItems(items) {
    console.log(items)
  }

  componentDidMount() {

    fetch('http://localhost:8080/groupCommunities', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ groupCommunities: data })
      })
      .catch(console.log)

    fetch('http://localhost:8080/pSchedulerTests', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ pSchedulerTests: data })
      })
      .catch(console.log)
  }

  getCommunities(props) {
    const communities = props.communities;
    const listCommunities = communities.map((community) =>
      <Dropdown.Item id={community} key={community} as={Button}
        onClick={() => {
          var current = document.getElementById("communitiesdropDown");
          current.textContent = { community }.community; // changing dropdown name
          this.setState({ selectedGroupCommunity: { community }.community })
        }}>
        {/* todo onclick */}
        {community}

      </Dropdown.Item>
    );
    return (
      <Dropdown.Menu className="scrollBox">{listCommunities}</Dropdown.Menu>
    );
  }

  getPschedulers(props) {
    const pSchedulers = props.pSchedulers;
    const listSchedulers = pSchedulers.map((scheduler) =>
      <label key={scheduler}>
        <input type="checkbox" className="schedulerCheckBox" id={scheduler} onClick={() => {
          console.log(this.state.chosenSchedulers);
          const contains = this.state.chosenSchedulers.includes({ scheduler }.scheduler);
          if (contains) {
            var remainingItems = this.state.chosenSchedulers.filter(function (scheduler) { return scheduler !== { scheduler }.scheduler });
            this.setState({ chosenSchedulers: remainingItems });
          } else {
            this.state.chosenSchedulers.push({ scheduler }.scheduler)
          }

        }}>
        </input>
        {scheduler}
      </label>
    );
    return (
      <Dropdown.Menu className="scrollBox">
        {listSchedulers}
      </Dropdown.Menu>
    );
  }


  render() {
    return (
      <Jumbotron className="head">
        <div>
          <Search items={this.state.items}
            placeholder="Eneter a key (optional) : "
            maxSelected={1}
            multiple={true}
            onItemsChanged={this.HiItems.bind(this)} className="searchBarField" id="test" />

          {/* <input type="text" placeholder="Field Name.." className="searchBarField" /> */}
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

            <this.getPschedulers pSchedulers={this.state.pSchedulerTests} />

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
