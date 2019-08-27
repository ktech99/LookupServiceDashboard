import React, { Component } from 'react';
import '../styles/App.css';
import logo from "../image/Logo.png";
import { Jumbotron, Button, ListGroup, Dropdown, ButtonToolbar, Table, Tab, Row, Col, Nav } from 'react-bootstrap'
import Search from "react-search"
import { thisExpression } from '@babel/types';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

class App extends Component {

  constructor() {
    super();
    this.state = {
      groupCommunities: [],
      selectedGroupCommunity: "",
      pSchedulerTests: [],
      chosenSchedulers: [],
      keys: [],
      chosenKey: "",
      searchTerm: "",
      hostResults: [],
      serviceVisibility: true,
      chosenHost: ""
    }
    this.getCommunities = this.getCommunities.bind(this);
    this.getPschedulers = this.getPschedulers.bind(this);
    this.searchHost = this.searchHost.bind(this);
    this.getHost = this.getHost.bind(this);
    this.chooseHost = this.chooseHost.bind(this);
    this.searchService = this.searchService.bind(this)
  }

  componentDidMount() {

    fetch('http://localhost:8080/groupCommunities', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ groupCommunities: data })
      })
      .catch(console.log)

    fetch('http://localhost:8080/getAllKeys', { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        data = data.map(value => ({ id: 1, value: value }))
        this.setState({ keys: data })
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
          current.textContent = "Communities: " + { community }.community; // changing dropdown name
          this.setState({ selectedGroupCommunity: { community }.community })
        }}>
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

  updateSearch() {
    this.setState({ searchTerm: document.getElementById("searchBar").value })
  }

  keySelect(items) {
    if (items.length !== 0) {
      this.setState({ chosenKey: items });
      console.log(items[0]["value"])
    }
  }

  searchHost() {
    if (this.state.chosenKey.length !== 0) {
      var key = this.state.chosenKey[0]["value"]
    } else {
      var key = ""
    }
    fetch('http://localhost:8080/search?key=' + key + "&groupCommunity=" + this.state.selectedGroupCommunity + "&pSchedulers=" + this.state.chosenSchedulers + "&searchTerm=" + this.state.searchTerm + "&limit=10", { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        this.setState({ hostResults: data })
      })
      .catch(console.log)
    console.log(this.state.hostResults)
  }

  getHost(props) {
    const hostInformation = props.hostInformation;
    const hostTable = hostInformation.map((host) =>
      <tr key={host["Host Name"]} >
        <td onClick={() => { this.chooseHost(host["URI"]) }} >{host["Host Name"]}</td>
        <td onClick={() => { this.chooseHost(host["URI"]) }}>{host["Hardware"]}</td>
        <td onClick={() => { this.chooseHost(host["URI"]) }}>{host["System Info"]}</td>
        <td onClick={() => { this.chooseHost(host["URI"]) }}>{host["Toolkit Version"]}</td>
        <td onClick={() => { this.chooseHost(host["URI"]) }}>{host["Communities"]}</td>
        <td onClick={() => { this.chooseHost(host["URI"]) }}>{host["pSchedulers"]}</td>
        <td><Button variant="warning" onClick={() => { this.showHostJSON({ host }) }}>View JSON</Button></td>
      </tr>
    );
    return (
      <tbody>
        {hostTable}
      </tbody>
    );
  }

  chooseHost(hostName) {
    this.setState({ serviceVisibility: false });
    this.setState({ chosenHost: hostName }, function () { this.searchService() })
    // this.searchService()
  }

  showHostJSON(host) {
    console.log(host)
    alert(host["host"]["JSON"])
  }

  searchService() {
    console.log(this.state.chosenHost)
    fetch('http://localhost:8080/searchService?hosts=' + this.state.chosenHost, { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        // this.setState({hostResults: data})
      })
      .catch(console.log)
    document.getElementById("informationTabs-tab-second").click();
  }


  render() {
    return (
      <div>
        <Jumbotron className="head">
          <div>
            <Search items={this.state.keys}
              placeholder="Eneter a key (optional) : "
              maxSelected={1}
              multiple={true}
              onItemsChanged={this.keySelect.bind(this)} className="searchBarField" id="keySelector" />

            {/* <input type="text" placeholder="Field Name.." className="searchBarField" /> */}
            <input type="text" placeholder="Search.." className="searchBar" onChange={this.updateSearch.bind(this)} id="searchBar" />
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
            <Button variant="warning" onClick={() => { this.searchHost() }}>Submit</Button>
          </div>
        </Jumbotron>

        <Tab.Container id="informationTabs" defaultActiveKey="first" className="informationTabs">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item id="hostTab">
                  <Nav.Link eventKey="first">Host Information</Nav.Link>
                </Nav.Item>
                <Nav.Item id="serviceTab">
                  <Nav.Link eventKey="second" disabled={this.state.serviceVisibility} >Service Information</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Host Name</th>
                        <th>Hardware</th>
                        <th>System Info</th>
                        <th>Toolkit-Version</th>
                        <th>Communities</th>
                        <th>Pscheduler Tests</th>
                        <th>JSON</th>
                      </tr>
                    </thead>
                    <this.getHost hostInformation={this.state.hostResults} />
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Service Name</th>
                        <th>Address</th>
                        <th>geographic Location</th>
                        <th>Communities</th>
                        <th>Version</th>
                        <th>Example Command</th>
                      </tr>
                    </thead>
                    {/* <this.getHost hostInformation = {this.state.hostResults}/> */}
                  </Table>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

      </div>
    );
  }

};

export default App;
