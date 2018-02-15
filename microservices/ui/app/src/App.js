import React, { Component } from 'react';
import './App.css';
import xhr from 'xhr';
import Plot from './Plot';
class App extends Component {
  state = {
    location: '',
  data: {},
  dates: [],
  temps: []
  }
  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=d231efc52bef00d653e1d966b0840736&units=metric';
    var url = urlPrefix + location + urlSuffix;

    var self = this;

    xhr({
      url: url
    }, function (err, data) {
      var body = JSON.parse(data.body);
           var list = body.list;
           var dates = [];
           var temps = [];
           for (var i = 0; i < list.length; i++) {
             dates.push(list[i].dt_txt);
             temps.push(list[i].main.temp);
           }

           self.setState({
             data: body,
             dates: dates,
             temps: temps
           });
         });
       };


changeLocation = (evt) => {
  this.setState({
    location: evt.target.value
  });
};
render() {
  var currentTemp = 'not loaded yet';
  if (this.state.data.list) {
    currentTemp = this.state.data.list[0].main.temp;
  }
  return (
    <div>
      <h1>Weather App</h1>
      <h2>Using Plotly library</h2>
      <form onSubmit={this.fetchData}>
        <label>I want to know the weather for
          <input
            placeholder={"City, Country"}
            type="text"
            value={this.state.location}
            onChange={this.changeLocation}
          />
        </label>
        <label> from
        <input type="date" id="start_date" name="start_date" min="1742-11-01" />
        </label>
        <label>
        to
        <input type="date" id="end_date" name="end_date" min="1742-11-01" />
        </label>
      </form>
      {/*
        Render the current temperature and the forecast if we have data
        otherwise return null
      */}
      {(this.state.data.list) ? (
        <div className="wrapper">
          <p className="temp-wrapper">
            <span className="temp">{ currentTemp }</span>
            <span className="temp-symbol">°C</span>
          </p>
          <h2>Forecast</h2>
          <Plot
            xData={this.state.dates}
            yData={this.state.temps}
            type="scatter"
          />
        </div>
      ) : null}

    </div>
  );
}
}
export default App;
