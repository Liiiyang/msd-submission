import React, { Component } from "react";
import { Card, Grid } from "semantic-ui-react";

class Weather extends Component {
  renderCards() {
    const items = [
      {
        header: `Date: ${this.props.date} ${this.props.day}`,
        description: `Weather: ${this.props.summary}`,
        meta: `Temperature: ${this.props.temperature}`
      }
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <div>
        <h4>Here is the Weather Forecast</h4>
        <Grid style={{ marginBottom: 10 }}>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Weather;
