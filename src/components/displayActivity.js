import React, { Component } from "react";
import request from "superagent";
import { Table, Button } from "semantic-ui-react";
import RequestRow from "./RequestRow";

class Activity extends Component {
  state = {
    requests: this.props.requests
  };

  renderRows() {
    return this.props.requests.map((requests, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          title={requests.title}
          description={requests.description}
          date={requests.date}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <div>
        <h4>Here is a List of Activities</h4>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Title</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Date</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </div>
    );
  }
}
export default Activity;
