import React, {Component} from 'react';
import '../styles/Table.css';

class HostTable extends Component{
  
    render() {
      return (
        <table class="flat-table">
            <thead>
                <th>Host Name</th>
                <th>Hardware</th>
                <th>System Info</th>
                <th>Toolkit Version</th>
                <th>Communities</th>
            </thead>
            {/* todo loop this */}
            <tbody>
                <tr>
                    <td>John</td>
                    <td>Smith</td>
                    <td>Seattle</td>
                    <td>$12.95</td>
                    <td>Seattle</td>
                </tr>
                <tr>
                    <td>Eddy</td>
                    <td>Johnston</td>
                    <td>Palo Alto</td>
                    <td>$15</td>
                    <td>Seattle</td>
                </tr>
            </tbody>
        </table>
      );
    }
  
  };
  
  
  export default HostTable;
  