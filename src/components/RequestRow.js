import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class RequestRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const { id, title, description, date } = this.props;
    return (
      <Row>
        <Cell>{id}</Cell>
        <Cell>{title}</Cell>
        <Cell>{description}</Cell>
        <Cell>{date}</Cell>
      </Row>
    );
  }
}

export default RequestRow;
