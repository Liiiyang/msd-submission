import React, { Component } from "react";
import Layout from "./components/Layout";
import { Form, Dropdown, Message } from "semantic-ui-react";
import request from "superagent";
import "./App.css";
import Activity from "./components/displayActivity";
import Weather from "./components/displayWeather";
import moment from "moment";

const appOptions = [
  { key: 1, text: "Weather Forecast", value: "weather" },
  { key: 2, text: "Add Activity", value: "activity" },
  { key: 3, text: "Edit Activity", value: "edit" },
  { key: 4, text: "Delete Activity", value: "delete" }
];

const currentYear = new Date().getFullYear();

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

class App extends Component {
  state = {
    formOptions: "",
    month: "",
    day: "",
    title: "",
    description: "",
    date: "",
    requests: [],
    index: "",
    summary: "",
    temperature: "",
    day_weather: "",
    date_weather: "",
    errorMessage: ""
  };

  componentDidMount() {
    request
      .get("http://localhost:5000/api/user")
      .then(async res => {
        //console.log("Test: " + res.body[0]._id);
        let requests = await Promise.all(
          Array(parseInt(res.body.length))
            .fill()
            .map((element, index) => {
              return res.body[index];
            })
        );
        this.setState({ requests: requests });
      })
      .catch((err, res) => {
        if (err || !res.ok) {
          console.log("Oh no! err");
        } else {
          console.log("Success");
        }
      });
  }

  getWeather = async e => {
    e.preventDefault();
    this.setState({ errorMessage: "" });

    const date = `${currentYear}-${this.state.month}-${this.state.day}`;
    const unixTime = new Date(date).getTime() / 1000;

    //console.log(date);
    // console.log("Unix Timee: " + unixTime);

    request
      .get(`http://localhost:3001/api/darkSky?time=${unixTime}`)
      .then(async res => {
        // console.log("Test: " + res.body);
        // console.log(res.body.currently.summary);
        // console.log(res.body.currently.temperature);
        var d = new Date(unixTime * 1000);
        var dayofWeek = weekday[d.getDay()];
        // console.log(dayofWeek);
        this.setState({
          summary: res.body.currently.summary,
          temperature: res.body.currently.temperature,
          day_weather: dayofWeek,
          date_weather: date
        });
      })
      .catch((err, res) => {
        if (err || !res.ok) {
          console.log("Oh no! err");
          this.setState({ errorMessage: "Invalid Month or date" });
        } else {
          console.log("Success");
        }
      });
  };

  saveData = async e => {
    e.preventDefault();

    this.setState({ errorMessage: "" });
    var date = moment(this.state.date);
    if (date.isValid()) {
      request
        .post("http://localhost:5000/api/user")
        .send({
          title: this.state.title,
          description: this.state.description,
          date: this.state.date
        })
        .then(response => {
          request.get("http://localhost:5000/api/user").then(async res => {
            let requests = await Promise.all(
              Array(parseInt(res.body.length))
                .fill()
                .map((element, index) => {
                  return res.body[index];
                })
            );
            this.setState({ requests: requests });
            // console.log(this.state.requests);
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ errorMessage: "Invalid Date" });
    }
  };

  editData = async e => {
    e.preventDefault();
    this.setState({ errorMessage: "" });
    var date = moment(this.state.date);
    if (date.isValid()) {
      request
        .put(
          `http://localhost:5000/api/user/${
            this.state.requests[this.state.index]._id
          }`
        )
        .send({
          title: this.state.title,
          description: this.state.description,
          date: this.state.date
        })
        .then(response => {
          request.get("http://localhost:5000/api/user").then(async res => {
            let requests = await Promise.all(
              Array(parseInt(res.body.length))
                .fill()
                .map((element, index) => {
                  return res.body[index];
                })
            );
            this.setState({ requests: requests });
            // console.log(this.state.requests);
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ errorMessage: "Invalid Date" });
    }
  };

  deleteData = async e => {
    e.preventDefault();
    request
      .del(
        `http://localhost:5000/api/user/${
          this.state.requests[this.state.index]._id
        }`
      )
      .then(response => {
        request.get("http://localhost:5000/api/user").then(async res => {
          let requests = await Promise.all(
            Array(parseInt(res.body.length))
              .fill()
              .map((element, index) => {
                return res.body[index];
              })
          );
          this.setState({ requests: requests });
          // console.log(this.state.requests);
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const formOptions = this.state.formOptions;
    let choice, buttonOptions;
    if (this.state.formOptions === "weather") {
      choice = (
        <div>
          <h4>Enter the Month and Day</h4>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Month"
              placeholder="Month (e.g. 02)"
              value={this.state.month}
              onChange={event => this.setState({ month: event.target.value })}
            />
            <Form.Input
              fluid
              label="Day"
              placeholder="Day (e.g. 23)"
              value={this.state.day}
              onChange={event => this.setState({ day: event.target.value })}
            />
          </Form.Group>
        </div>
      );
      buttonOptions = this.getWeather;
    } else if (this.state.formOptions === "activity") {
      choice = (
        <div>
          <h4>Enter your activity</h4>
          <Form.Group widths="equal">
            <Form.Input
              required
              fluid
              label="Title"
              placeholder="Title"
              value={this.state.title}
              onChange={event => this.setState({ title: event.target.value })}
            />
            <Form.Input
              required
              fluid
              label="Description"
              placeholder="Description"
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
            <Form.Input
              required
              fluid
              label="Date"
              placeholder="Date (e.g. YYYY-MM-DD)"
              value={this.state.date}
              onChange={event => this.setState({ date: event.target.value })}
            />
          </Form.Group>
        </div>
      );
      buttonOptions = this.saveData;
    } else if (this.state.formOptions === "edit") {
      choice = (
        <div>
          <h4>Edit your activity</h4>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="ID"
              placeholder="ID"
              value={this.state.index}
              onChange={event => this.setState({ index: event.target.value })}
            />
            <Form.Input
              fluid
              label="Title"
              placeholder="Title"
              value={this.state.title}
              onChange={event => this.setState({ title: event.target.value })}
            />
            <Form.Input
              fluid
              label="Description"
              placeholder="Description"
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
            <Form.Input
              fluid
              label="Date"
              placeholder="Date"
              value={this.state.date}
              onChange={event => this.setState({ date: event.target.value })}
            />
          </Form.Group>
        </div>
      );
      buttonOptions = this.editData;
    } else if (this.state.formOptions === "delete") {
      choice = (
        <div>
          <h4>Delete your activity</h4>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="ID"
              placeholder="ID"
              value={this.state.index}
              onChange={event => this.setState({ index: event.target.value })}
            />
          </Form.Group>
        </div>
      );
      buttonOptions = this.deleteData;
    }
    return (
      <Layout>
        <Form
          error={!!this.state.errorMessage}
          onSubmit={buttonOptions}
          style={{ marginBottom: 10 }}
        >
          <Dropdown
            style={{ marginBottom: "5px" }}
            placeholder="Choose your activity"
            openOnFocus
            selection
            options={appOptions}
            value={this.state.formOptions}
            onChange={(event, data) =>
              this.setState({ formOptions: data.value })
            }
          />
          {choice}
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Form.Button color="red">Submit</Form.Button>
        </Form>
        <Weather
          summary={this.state.summary}
          temperature={this.state.temperature}
          day={this.state.day_weather}
          date={this.state.date_weather}
        />
        <Activity requests={this.state.requests} />
      </Layout>
    );
  }
}

export default App;
