import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { State } from '../../store';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Chart.css';


interface ChartProps {
    vacationNames: string[];
    followersAmount: number[];
}

interface ChartState extends ChartProps {
    chartData: any,
}

class _Chart extends Component<ChartProps, ChartState> {
    constructor(ChartProps: ChartProps) {
        super(ChartProps);
        const { vacationNames, followersAmount } = ChartProps;
        console.log(vacationNames);
        this.state = {
            vacationNames,
            followersAmount,
            chartData: {
                labels: vacationNames,
                datasets: [
                    {
                        lable: 'population',
                        data: followersAmount,
                        backgroundColor: [
                            'rgba(255,99,132,0.6)',
                            'rgba(54,162,235,0.6)',
                            'rgba(255,206,86,0.6)',
                            'rgba(75,192,192,0.6)',
                            'rgba(153,102,255,0.6)',
                            'rgba(255,159,64,0.6)',
                        ]
                    }
                ]
            }
        }
    }
    render() {
        const { chartData } = this.state;
        return (
            <div className='chart'>
                <div>
                     <Link to="/vacations">Go back</Link>
                </div>
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value: any) { if (value % 1 === 0) { return value; } }
                                }
                            }]
                        },
                        title: {
                            display: true,
                            text: 'Vacations chart',
                            fontSize: 25
                        },
                        legend: {
                            display: false,
                            position: 'right'
                        }
                    }}
                />
            </div>
        )
    }
}
const mapStateToProps = (state: State) => ({
    vacationNames: state.vacationNames,
    followersAmount: state.followersAmountForChart
});

export const Chart = connect(mapStateToProps)(_Chart);