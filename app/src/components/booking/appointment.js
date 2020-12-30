import React, { Component } from 'react';
// import './appointment.css';
import { AppointmentPicker } from 'react-appointment-picker';
 
export default class Appointment extends Component {
  constructor(props){
    super(props);
    this.state = {
    loading: false,
    continuousLoading: true,
    startDate: this.props.date
  };
 }
  addAppointmentCallback = ({
    addedAppointment: { day, number, time, id },
    addCb
  }) => {
    this.setState(
      {
        loading: true
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(
          `Added appointment ${number}, day ${day}, time ${time}, id ${id}`
        );
        addCb(day, number, time, id);
        this.setState({ loading: false });
      }
    );
  };
 
  removeAppointmentCallback = ({ day, number, time, id }, removeCb) => {
    this.setState(
      {
        loading: true
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(
          `Removed appointment ${number}, day ${day}, time ${time}, id ${id}`
        );
        removeCb(day, number);
        this.setState({ loading: false });
      }
    );
  };
 
  addAppointmentCallbackContinuousCase = ({
    addedAppointment: { day, number, time, id },
    addCb,
    removedAppointment: params,
    removeCb
  }) => {
    this.setState(
      {
        continuousLoading: true
      },
      async () => {
        if (removeCb) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log(
            `Removed appointment ${params.number}, day ${params.day}, time ${params.time}, id ${params.id}`
          );
          removeCb(params.day, params.number);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(
          `Added appointment ${number}, day ${day}, time ${time}, id ${id}`
        );
        addCb(day, number, time, id);
        this.setState({ continuousLoading: false });
      }
    );
  };
 
  removeAppointmentCallbackContinuousCase = (
    { day, number, time, id },
    removeCb
  ) => {
    this.setState(
      {
        continuousLoading: true
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(
          `Removed appointment ${number}, day ${day}, time ${time}, id ${id}`
        );
        removeCb(day, number);
        this.setState({ continuousLoading: false });
      }
    );
  };
 

componentDidUpdate(prevProps){
  if(prevProps.date !== this.props.date){
      this.setState({
          startDate: this.props.date
      })
      // window.location.reload(true);
  }
  // window.location.reload(true);
  // window.location.reload(false);
}
  render() {
    console.log("appointment file", this.state.startDate, this.props.dateObj, this.props.two);
    const { loading, continuousLoading } = this.state;
    return ( <div>
      {
        this.props.two === false &&
        <AppointmentPicker
          addAppointmentCallback={this.addAppointmentCallback}
          removeAppointmentCallback={this.removeAppointmentCallback}
          initialDay={this.props.date}
          days={this.props.days}
          maxReservableAppointments={1}
          alpha={false}
          visible
          selectedByDefault
          loading={true}
          continuous={true}
          unitTime={900000}
        />
}
{
        this.props.two === true &&
        <AppointmentPicker
          addAppointmentCallback={this.addAppointmentCallback}
          removeAppointmentCallback={this.removeAppointmentCallback}
          initialDay={this.props.dateObj}
          days={this.props.days2}
          maxReservableAppointments={1}
          alpha={false}
          visible
          selectedByDefault
          loading={true}
          continuous={true}
          unitTime={900000}
        />
}

</div>
    );
  }
}
