import React from "react";
import { Button, Dropdown} from 'react-bootstrap'


export default class HostTable extends React.PureComponent {

    getHost(props) {
        console.log(props)
    
        const hostInformation = props.hostInformation;
        const hostTable = hostInformation.slice(props.tableStart, props.tableEnd).map((host) =>
          <tr key={host["Host Name"]} >
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["Host Name"]}</td>
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["Hardware"]}</td>
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["System Info"]}</td>
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["Toolkit Version"]}</td>
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["Communities"]}</td>
            <td onClick={() => { this.chooseHost(host["URI"], host["latitude"], host["longitude"]) }}>{host["pSchedulers"]}</td>
            <td><Button variant="warning" onClick={() => { this.showHostJSON({ host }) }}>View JSON</Button></td>
          </tr>
        );
        return (
          <tbody>
            {hostTable}
          </tbody>
        );
      }

      showHostJSON(host) {
        console.log("")
        alert(host["host"]["JSON"])
      }

      chooseHost(hostName, latitude, longitude) {
        console.log("")
        this.props.parentCallBack(hostName, latitude, longitude)
        // this.setState({ serviceVisibility: false });
        // this.setState({ chosenHost: hostName, chosenLat: latitude, chosenLong: longitude }, function () { this.searchService("all") })
        // this.searchService()
      }

    render() {
        return (
            <this.getHost hostInformation={this.props.hostInformation} parentCallBack={this.props.parentCallBack} tableStart = {this.props.tableStart} tableEnd= {this.props.tableEnd}/>
        );
    }
}
