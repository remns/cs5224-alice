import React, { Component } from 'react'
import ChartJS from "chart.js";

export default class Chart extends Component {
    chartRef = React.createRef();

    componentDidMount() {
      const myChartRef = this.chartRef.current.getContext("2d");
      new ChartJS(myChartRef, this.props.chart);
    }

    componentDidUpdate(prevProps) {
      if(this.props.chart != prevProps.chart)
      {
        const myChartRef = this.chartRef.current.getContext("2d");
        new ChartJS(myChartRef, this.props.chart);
      }
    }

    render() {
        return (
          <div>
            <canvas
                id="myChart"
                ref={this.chartRef}
            />
          </div>
        )
    }
}
