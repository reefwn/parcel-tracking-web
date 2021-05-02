import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class OrderChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData,
    };
  }

  render() {
    return (
      <Bar
        data={this.state.chartData}
        options={{
          title: {
            display: true,
            text: "Number of orders (last 7 days)",
            fontSize: 25,
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    );
  }
}

export default OrderChart;
