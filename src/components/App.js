import React, {Component} from 'react';
import '../styles/App.css';
import Header from './Header'
import Sidebar from './Sidebar'
import MapWithMarkers from "./Map"
import ServiceTable from "./ServiceTable"
import HostTable from "./HostTable"

class App extends Component{
  constructor(){
    super();
    this.state = {
      results: {}
    }
  }

  render() {
    return (
      <div className="App"> {/* Parent Div */}
      
        <Header /> 

        <Sidebar />
        <MapWithMarkers />
        <ServiceTable />
        <HostTable />
      </div>
    );
  }

};


export default App;
