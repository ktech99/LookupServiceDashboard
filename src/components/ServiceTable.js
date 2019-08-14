import React, {Component} from 'react';
import '../styles/Table.css';

class ServiceTable extends Component{
  
    render() {
      return (
        <table class="flat-table">
            <thead>
                <th>Service Name</th>
                <th>Addresses</th>
                <th>Geographic Location</th>
                <th>Communities</th>
                <th>Version</th>
                <th>Example Command-Line</th>
            </thead>
            {/* todo loop this */}
            <tbody>
                <tr>
                    <td>John</td>
                    <td>Smith</td>
                    <td>Seattle</td>
                    <td>$12.95</td>
                    <td>Seattle</td>
                    <td>$12.95</td>
                </tr>
                <tr>
                    <td>Eddy</td>
                    <td>Johnston</td>
                    <td>Palo Alto</td>
                    <td>$15</td>
                    <td>Seattle</td>
                    <td>$12.95</td>
                </tr>
            </tbody>
        </table>
      );
    }
  
  };
  
  
  export default ServiceTable;
  