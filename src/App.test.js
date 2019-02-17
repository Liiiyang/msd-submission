import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Activity from "./components/displayActivity";
import Weather from "./components/displayWeather";

describe("MSD Test", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("Test activity planner", () => {
    const div = document.createElement("div");
    const requests = ["Test", "Test", "2019-03-15"];
    ReactDOM.render(<Activity requests={requests} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("Test weather forecast", () => {
    const div = document.createElement("div");
    const summary = "cloudy";
    const temperature = "29";
    const day_weather = "Friday";
    const date_weather = "2019-03-15";
    ReactDOM.render(
      <Weather
        summary={summary}
        temperature={temperature}
        day={day_weather}
        date={date_weather}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
