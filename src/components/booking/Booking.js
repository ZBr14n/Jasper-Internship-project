import React, {useState} from 'react';
// custom slider
// import Slider, { Range } from 'rc-slider';
import Slider from 'react-input-slider';
import { useEffect } from 'react';
import App from './App';
import Appointment from './appointment';
// import './appointment.css';


// import './App.css';

function getSchedule(entries) {
  // function that returns availability hash of providers
  //

  let location = {}; // dictionary to be returned
  // Key: location, 
  //value:  array of start and end time/date for location

  for (const entry in entries) {
    let temp = entries[entry].fullUrl
    let end = temp.length
    let start = end - 2
    let key = temp.slice(start, end)

    if (location[key]) {
      location[key].push(entries[entry].resource.planningHorizon)
    } else {
      location[key] = [entries[entry].resource.planningHorizon];
    }
    //location.push(temp.slice(start, end))

  }
  console.log(location);
}

class Booking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      // ! toggle true/false using these two states for integrated/non-integrated
      start: false, // prop passed to booking
      nonIntegrated: true, // manually toggle this between the two types of integrated vs non-integrated

      
      datePicked: false,
      reviewed: false,
      confirmed: false,
      isLoggedIn: false,
      intakeDone: false,
      appointmentTime: '',
      schedules: {},
      patientData: {},
      doctorInfo: {},

    };
    this.IsLoggedIn = this.IsLoggedIn.bind(this);
    this.DatePicked = this.DatePicked.bind(this);
    this.Review = this.Review.bind(this);

    //this.Confirmed = this.Confirmed.bind(this);

  };

  IsLoggedIn() {
    // returns true and changes the vaule of isLoggedIn if there is a user logged in
    // isLogged in being set to true changes the app to exclude prompt to sign in.
    // This also prompts a check of the value of the intakeDone. if done the intake
    // view will not render.
    if (this.props.patientId !== "" && this.props.providerId !== "") {
      this.setState({
        isLoggedIn: true
      })
      return true
    }
    return false
  }

  // this needs to be linked to ehr column in office
  EMRIntegration = (event) => {
    /*
    EMRIntegration changes the value the this.state.start to either pull up the integrated case, or the non-integrated case
    */
    this.setState({
      start: false,
      datePicked: false
    })
  }

  DatePicked = (event) => {
    /*
    DatePicked changes the value the this.state.datePicked once a user has chosen
    an appointment time and date. This will change the view to either the Log In/Sign 
    Up prompt or it will go straight to the confirmation step.
    */
    console.log("In Booking.DatePicked with event ", event)
    this.setState({
      start: false,
      datePicked: true,
      appointmentTime: event
    })
    console.log(
      "isLoggedIn: ", this.isLoggedIn,
      "start: ", this.state.start,
      "datePicked: ", this.state.datePicked,
      "appointmentTime: ", this.state.appointmentTime,
      "reviewed: ", this.state.reviewed,
      "confirmed: ", this.state.confirmed
    )
  }

  Review = (event) => {

    console.log("In Booking.Review with event ", event)
    this.setState({
      datePicked: false,
      reviewed: true,
      nonIntegrated: false
    })
    console.log(
      "isLoggedIn: ", this.isLoggedIn,
      "start: ", this.state.start,
      "datePicked: ", this.state.datePicked,
      "appointmentTime: ", this.state.appointmentTime,
      "reviewed: ", this.state.reviewed,
      "confirmed: ", this.state.confirmed
    )

    const appointmentData = fetch("https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/appointment-utilities", {
        method: "POST",
        body: JSON.stringify({
          "body": {
            "task": "add_patient_appointment",
            "patient_id": 1,
            "dependent_id": null,
            "office_id": 111,
            "doctor_id": null,
            "booked_datetime": "2020-10-10 19:49",
            "appointment_date": "2020-08-01",
            "start_time": "08:00",
            "end_time": "21:20",
            "timezone": "est",
            "booking_status": "pending",
            "check_in_status": null,
            "check_out_status": null,
            "billing_status": null,
            "purpose": null,
            "appointment_details": null,
            "booking_meta": null,
            "doctor_name": null
          }
        }),
      })
      .then(appointmentData => appointmentData.json())
      .then(appointmentData => {
        console.log("add_patient_appointment response:")
        console.log(appointmentData);
      })
      .catch((error) => {
        console.log("add_patient_appointment error:")
        console.error(error);
      });

    console.log("appointmentData result:");
    console.log(appointmentData);

    // WIP
    const response = fetch("https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/appointment-utilities", {
      method: "POST",
      body: JSON.stringify({
        "body": {
          "task": "get_patient_appointment",
          "patient_id": 1
        }
      }),
    })
      .then(check => check.json())
      .then(check => {
        console.log("get_patient_appointment response:")
        console.log(JSON.stringify(check.body, null, 2));
      })
      .catch((error) => {
        console.log("get_patient_appointment error:")
        console.error(error);
      });

    console.log("response result:");
    console.log(response);

  }
 
  componentDidMount() {
    //This is check to see if a user is logged in.
    //when the booking component is used it will be passed
    //the userId and the officeId and that will used to 
    //verify that a person is logged in. This can be seen in
    //App.js
    this.IsLoggedIn();

    //The data from this section is not currently being used. It contains the
    //data needed to populate the calendar.
    const response1 = fetch('https://api.opendental.com/fhir/v2/schedule', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //test server authentication developerKey/customerApi
        // can be found at https://www.opendental.com/resources/OpenDentalFHIR19-4Spec.pdf page 5
        // to check for newer versions go to https://www.opendental.com/manual/fhir.html
        'Authorization': 'ODFHIR NFF6i0KrXrxDkZHt/VzkmZEaUWOjnQX2z'
      },
    })
      .then(openDentalData => openDentalData.json())
      .then(data => this.setState((state) => {

        let entries = data.entry;
        // console.log(entries, "open Dental", openDentalData)
        // array of entries sent to getSchedule to be parsed into usable data 
        // regarding available appointment times.
        let temp = getSchedule(entries);
        return {
          //hardcoded set state to be replaces with function that will parse
          //through the array of available times returned by getSchedule
          schedules: temp

        }
      }));
    // console.log("open Dental", openDentalData);

    const patientData = fetch("https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/patient-utilities", {
      method: "POST",
      body: JSON.stringify({
        "task": "get_patient",
        "patient_id": this.props.patientId
      }),
    })
      .then(patientData => patientData.json())
      .then(patientData => {
        this.setState({
          patientData: patientData.body.personal_info
        })
        console.log("hello", JSON.stringify(patientData, null, 2));
      })
      .catch((error) => {
        console.log("This is the error:")
        console.error(error);
      });
  }
  render() {
    return (
      <div>
        {this.state.isLoggedIn === true ? <p>Logged In</p> : <p>Sign Up/In</p>}
        {/* possible need to change the logic for the displaying of intergrated vs nonintergrated */}
        {this.state.start === false && this.state.nonIntegrated === true && <NonIntegratedForm patientInfo={this.state.patientData} appTime={this.state.appointmentTime} review={this.Review} nonIntegrated="false" />}
        {this.state.start === true && <Calendar changeStart={this.DatePicked} />}
        {this.state.datePicked === true && this.state.isLoggedIn === true && <Review patientInfo={this.state.patientData} appTime={this.state.appointmentTime} review={this.Review} />}
        {this.state.reviewed === true && <Confirmation />}
        <p>{this.state.appointmentData}</p>
      </div>
    )
  }
}

export default Booking;

/*
=================================
            Doctor info
=================================
*/

const doctorInfo = {
  "first_name": "test",
  "last_name": "doctor",
  "address_line_1": "123 Rainbow Road",
  "image": "https://source.unsplash.com/240x240/?dentist"
}

/*
=================================
            Patient info
=================================
*/

const patientInfo = {
  "first_name": "Anne",
  "last_name": "Apple",
}

const dependentInfo = {
  "first_name": "test",
  "last_name": "doctor",
  "email": "123 Rainbow Road",
  "image": "https://source.unsplash.com/240x240/?dentist"
}
/*
=================================
            Calendar
=================================
*/

const monthDays = {
  1: 30,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 31,
  12: 30
};

function getStart(MonthList, day, date, monthDay) {
  console.log("day, date start", date - day)
  const estimatedDate = date - day
  console.log("estimated Date", estimatedDate)
  if (estimatedDate < 0) {
    const startDate = (MonthList[monthDay - 1] + 1) - date
    return startDate
  }

  return estimatedDate

}
function getEnd(MonthList, day, date, monthDay) {

  const estimatedEnd = date + (6 - day)

  if (estimatedEnd > MonthList[monthDay]) {
    const endDate = estimatedEnd - MonthList[monthDay]
    return endDate
  }
  return estimatedEnd
}
function getWeek(start, end, MonthList, monthDay, year) {
  let weekList = []
  for (let i = start; i <= end; i++) {
    let temp = monthDay.toString() + '/' + i.toString() + '/' + year.toString()
    if (i === MonthList[monthDay]) {
      monthDay = monthDay + 1
      i = 0
    }
    weekList.push(temp)
  }
  return weekList
}

class Calendar extends React.Component {
  
  constructor(props) {

    super(props);
    const today = new Date();
    const currentDate = today.getDate();
    const currentDay = today.getDay();
    const currentMonth = today.getMonth() + 1;
    const CurrentYear = today.getFullYear();
    const startWeek = getStart(monthDays, currentDay, currentDate, currentMonth);
    const endWeek = getEnd(monthDays, currentDay, currentDate, currentMonth);
    const nextWeek = getStart(monthDays, currentDay, currentDate + 7, currentMonth);
    const previousWeek = getStart(monthDays, currentDay, currentDate - 7, currentMonth);
    const nextEnd = getEnd(monthDays, currentDay, currentDate + 7, currentMonth);
    const previousEnd = getEnd(monthDays, currentDay, currentDate - 7, currentMonth);
    const weekDays = getWeek(startWeek, endWeek, monthDays, currentMonth, CurrentYear);
    
    this.state = {
      two: false,
      start: startWeek,
      end: endWeek,
      nextStart: nextWeek,
      nextEnd: nextEnd,
      previousStart: previousWeek,
      previousEnd: previousEnd,
      week: weekDays,
      month: currentMonth,
      year: CurrentYear,
      monthList: monthDays,
      dayNum: currentDay,
      chosenAppointment: "",
      timeString: 'T09:00:00-07:00',
      dateString: '2020-09-15',
      dateString2: '2020-09-15',
      dateobj: new Date('2020-09-15T09:00:00-07:00'),
      dateobj2: new Date('2020-09-15T09:00:00-07:00'),
      
      
    }
    // binding functions to component
    this.changeWeekback = this.changeWeekback.bind(this);
    this.changeWeekforward = this.changeWeekforward.bind(this);
    this.changeMonthforward = this.changeMonthforward.bind(this);
    this.changeMonthback = this.changeMonthback.bind(this);
  }
  // called when prev is called and used to change the week
    changeWeekback() {
      if (!this.state.two){
      var temp = this.state.dateString.split('-');
      } else {
      var temp = this.state.dateString2.split('-');
      }
      let newD = '';
      let holder;
      const months = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      }

      if (parseInt(temp[2]) - 7 >= 1){
        holder = parseInt(temp[2])
        temp[2] = "" + (holder - 7);
        console.log("2 - 7 >=1", temp, holder);
       
      } else {
        holder = (parseInt(temp[2]) + months[parseInt(temp[1])]) - 7;
        temp[2] = "" + holder
        if (parseInt(temp[1]) > 1){
          temp[1] = '' + (parseInt(temp[1]) - 1)
      }else {
        temp[1] = "12"
        temp[0] = '' + (parseInt(temp[0]) - 1)
        console.log('temp 0', temp[0])
      }
      console.log("else", temp)
      }
      newD = temp.join('-');
      console.log("after if parse of temp, newD:", newD)
      if (this.state.two){
        this.setState({
          dateString: newD,
          dateobj: new Date(newD),
          two: !this.state.two

        })
        console.log("saved in one");
      } else {
        this.setState({
          dateString2: newD,
          dateobj2: new Date(newD),
          two: !this.state.two

        })
        console.log("saved in two");

      }
      console.log("end", temp) 
    }

    // called when next is called and used to change the week
    changeWeekforward() {
      if (!this.state.two){
        var temp = this.state.dateString.split('-');
        } else {
        var temp = this.state.dateString2.split('-');
        }
      let newD = '';
      let holder;
      const months = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      }

      if (parseInt(temp[2]) + 7 < 30){
        holder = parseInt(temp[2]) + 7;
        temp[2] = "" + holder
      } else {
        holder = 7 - (months[parseInt(temp[1])] - parseInt(temp[2]));
        temp[2] = "" + holder
        if (parseInt(temp[1]) < 10){
          temp[1] = '' + (parseInt(temp[1]) + 1)
      } else if (parseInt(temp[1]) < 12){
        temp[1] = '' + (parseInt(temp[1]) + 1)
        
      }else {
        temp[1] = "01"
        temp[0] = '' + (parseInt(temp[0]) + 1)
        console.log('temp 0', temp[0])
      }
      }
      newD = temp.join('-');
      if (this.state.two){
        this.setState({
          dateString: newD,
          dateobj: new Date(newD),
          two: !this.state.two

        })
        console.log("saved in one");
      } else {
        this.setState({
          dateString2: newD,
          dateobj2: new Date(newD),
          two: !this.state.two

        })
        console.log("saved in two");

      }
      console.log(months[parseInt(temp[1])]) 
    }

    changeMonthforward() {
      if (!this.state.two){
        var currDateObjStrList = this.state.dateString.split('-');
        } else {
        var currDateObjStrList = this.state.dateString2.split('-');
        }
     let monthNum;
     console.log(currDateObjStrList);
     if (parseInt(currDateObjStrList[1]) < 12){
     currDateObjStrList[1] = "" + (parseInt(currDateObjStrList[1]) + 1);
     monthNum = this.state.month + 1
    } else if (parseInt(currDateObjStrList[1]) === 12){
      currDateObjStrList[1] = '01'
      monthNum = 1
      currDateObjStrList[0] = '' + (parseInt(currDateObjStrList[0]) + 1);
    }
     currDateObjStrList[2] = "02";
     console.log(currDateObjStrList);
     let DateObjStr = currDateObjStrList.join('-');
     if (this.state.two){
      this.setState({
        dateString: DateObjStr,
        dateobj: new Date(DateObjStr),
        two: !this.state.two,
        month: monthNum
      })
      console.log("saved in one");
    } else {
      this.setState({
        dateString2: DateObjStr,
        dateobj2: new Date(DateObjStr),
        two: !this.state.two,
        month: monthNum
      })
      console.log("saved in two");

    }
    //  console.log(dayob, dayob.getDay());
    }

    changeMonthback() {
      if (!this.state.two){
        var currDateObjStrList = this.state.dateString.split('-');
        } else {
        var currDateObjStrList = this.state.dateString2.split('-');
        }
     let monthNum;
     console.log(currDateObjStrList);
     if (parseInt(currDateObjStrList[1]) > 1){
     currDateObjStrList[1] = "" + (parseInt(currDateObjStrList[1]) - 1);
     monthNum = this.state.month - 1
    } else if (parseInt(currDateObjStrList[1]) === 1){
      currDateObjStrList[1] = '12'
      monthNum = 12
      currDateObjStrList[0] = '' + (parseInt(currDateObjStrList[0]) - 1);
    }
     currDateObjStrList[2] = "02";
     console.log(currDateObjStrList);
     let DateObjStr = currDateObjStrList.join('-');
     if (this.state.two){
      this.setState({
        dateString: DateObjStr,
        dateobj: new Date(DateObjStr),
        two: !this.state.two,
        month: monthNum
      })
      console.log("saved in one");
    } else {
      this.setState({
        dateString2: DateObjStr,
        dateobj2: new Date(DateObjStr),
        two: !this.state.two,
        month: monthNum
      })
      console.log("saved in two");

    }
    //  console.log(dayob, dayob.getDay());
    }
  // array for table..but how to increase flexibly?
  createTable = () => {
    const days = [
      [
        { id: 1, number: 1},
        null,
        { id: 2, number: 2},
        { id: 3, number: 3},
        { id: 4, number: 4 },
        null,
        { id: 5, number: 5},
        { id: 6, number: 6, isReserved: false }
      ],
      [
        { id: 7, number: 1},
        { id: 8, number: 2 },
        null,
        { id: 9, number: '3' },
        { id: 10, number: '4' },
        null,
        { id: 11, number: 5},
        { id: 12, number: 6, isReserved: false }
      ],
      [
        { id: 13, number: 1},
        { id: 14, number: 2 },
        null,
        { id: 15, number: '3' },
        { id: 16, number: '4' },
        null,
        { id: 17, number: 5 },
        { id: 18, number: 6 }
      ],
      [
        { id: 19, number: 1 },
        { id: 20, number: 2 },
        null,
        { id: 21, number: 3 },
        { id: 22, number: '4' },
        null,
        { id: 23, number: 5 },
        { id: 24, number: 6 }
      ],
      [
        { id: 25, number: 1 },
        { id: 26, number: 2 },
        null,
        { id: 27, number: '3' },
        { id: 28, number: '4' },
        null,
        { id: 29, number: 5 },
        { id: 30, number: 6 }
      ],
      // [
      //   { id: 31, number: 1 },
      //   { id: 32, number: 2 },
      //   null,
      //   { id: 33, number: 3 },
      //   { id: 34, number: '4' },
      //   null,
      //   { id: 35, number: 5 },
      //   { id: 36, number: 6 }
      // ],
      // [
      //   { id: 37, number: 1, periods: 2 },
      //   { id: 38, number: 2 },
      //   null,
      //   { id: 39, number: '3' },
      //   { id: 40, number: '4' },
      //   null,
      //   { id: 41, number: 5},
      //   { id: 42, number: 6, isReserved: false }
      // ]
    ];

    const days2 = [
      [
        { id: 1, number: 1},
        null,
        { id: 2, number: 3, periods: 2 },
        { id: 3, number: 4 },
        { id: 4, number: 5 },
        null,
        { id: 5, number: 6},
        { id: 6, number: 7, isReserved: false }
      ],
      [
        { id: 7, number: 1, periods: 2 },
        { id: 8, number: 2 },
        null,
        { id: 9, number: '3' },
        { id: 10, number: '4' },
        null,
        { id: 11, number: 5},
        { id: 12, number: 6, isReserved: false }
      ],
      [
        { id: 13, number: 1, periods: 3 },
        { id: 14, number: 2 },
        null,
        { id: 15, number: '3' },
        { id: 16, number: '4' },
        null,
        { id: 17, number: 5 },
        { id: 18, number: 6 }
      ],
      [
        { id: 19, number: 1, periods: 2 },
        { id: 20, number: 2 },
        null,
        { id: 21, number: 3 },
        { id: 22, number: '4' },
        null,
        { id: 23, number: 5 },
        { id: 24, number: 6 }
      ],
      [
        { id: 25, number: 1, periods: 2  },
        { id: 26, number: 2 },
        null,
        { id: 27, number: '3' },
        { id: 28, number: '4' },
        null,
        { id: 29, number: 5 },
        { id: 30, number: 6 }
      ],
    ];
    console.log(this.state.dateobj);

    return <Appointment 
            two={this.state.two} 
            days={days} 
            days2={days2}
            date={new Date(this.state.dateString)}
            dateObj={new Date(this.state.dateString2)}
            />
  }
  render() {
    
    // inline styling
    const calendarStyle = {
      background: "#FCFCFC",
      boxShadow: "0px 7px 14px rgba(0, 0, 0, 0.2), 0px 12px 36px rgba(0, 0, 0, 0.14), 0px 7px 44px rgba(0, 0, 0, 0.12)",
      borderRadius: "10px",
      padding:"2em"
    };
    const tableStyle = {
      border: '0px',
      width: '800px'
    };

    const months = {
      1: "Jan",
      2: "Feb",
      3: "March",
      4: "April",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sept",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    }

    let month = months[this.state.month];
    // let date = new Date('2020-09-15')

    return (
      <div className="calendar" style={calendarStyle}>
        <h1 className="title">Book An Appointment</h1>
        <h4 className="subtext">For:&nbsp;&nbsp;&nbsp;
          <select name="selectPatient" id="selectPatient" style={{width:"auto",padding:"0px 60px 0px 20px"}}>
            <option value="">Cleaning</option>
            <option value="">Tooth ache</option>
            <option value="">Emergency</option>
            <option value="">Audi</option>
          </select>
        </h4>
        <h4 className="subtext">Pick an available time to schedule your visit.</h4>
        <div>
        <div className="month-change" style={{float:'left'}}>
        <button onClick={this.changeMonthback} value={this.state.month-1} className="prevMonth" style={{background:'none'}}>&lt;</button>
        <span style={{fontSize:"28px",fontWeight:"600"}}>{months[this.state.month]}</span>
        <button onClick={this.changeMonthforward} value={this.state.month+1}  className="nextMonth" style={{background:'none'}}>&gt;</button>
        </div>
        <div className="week-change" style={{float:'right'}}>
          <button onClick={this.changeWeekback} value={this.state.start} className="prevWeek" style={{background:'none',fontSize:"20px"}}>&lt;</button>
          <span className="Week">{!this.state.two ? this.state.dateString : this.state.dateString2}</span>
          <button onClick={this.changeWeekforward} value={this.state.start+6}  className="nextWeek" style={{background:'none',fontSize:"20px"}}>&gt;</button>
        </div>
        </div>

        <div>
          <table id="calendarStyle" style={tableStyle}>

            {/* <tr style={{border:"0px"}}>
              <td className="weekDayRow" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Sun</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Mon</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Tues</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Wed</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Thurs</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Fri</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center",fontSize:"20px",fontWeight:"600"}}>Sat</td>
            </tr> */}

            {/* <tr style={{border:"0px"}}>
              <td className="weekDayRow" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
              <td className="weekDayRow borderCalendar" style={{border:"0px",padding: "3px",textAlign:"center"}}>{month}</td>
            </tr> */}
            
          </table>
          {this.createTable()}
          
        </div>

      </div>
    )
  }
}



const NonIntegratedForm = props => {

//   const { Range } = Slider;
  

//   class CustomizedRange extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         lowerBound: 20,
//         upperBound: 40,
//         value: [20, 40],
//         x: 10,
//         y: 10,
//       };
//     }};

  const calendarStyle = {
    background: "#FCFCFC",
    boxShadow: "0px 7px 14px rgba(0, 0, 0, 0.2), 0px 12px 36px rgba(0, 0, 0, 0.14), 0px 7px 44px rgba(0, 0, 0, 0.12)",
    borderRadius: "10px",
    padding:"2em"
  };
  const formBottomStyle = {
    position: "relative",
    top: "-6em",
    left: "1em"
  }
  const wrapperStyle = { width: 400, margin: 50 };

  return (
    <div className="calendar" style={calendarStyle}>
        <h1 className="title">Book An Appointment</h1>
        <select name="selectPatient" id="selectPatient" style={{width:"auto",padding:"0px 60px 0px 20px"}}>
          <option value="">Cleaning</option>
          <option value="">Tooth ache</option>
          <option value="">Emergency</option>
          <option value="">Audi</option>
        </select>
          <p>Drag the bar to select the time of day that works best for you.</p>
          <div className="slider">
            {/* ({x}, {y}) */}
            
            <App />
            {/* <Slider axis="y" y={y} /> */}
          </div>
          <div style={formBottomStyle}>
          <p>Someone from the doctor’s office will reach out to schedule your appointment within this time frame.</p>
          
          <p><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" style={{display:"none"}}></input>
          <label htmlFor="vehicle1"> Mornings, before 9AM</label>
          </p>
          <p>
          <input type="checkbox" id="vehicle2" name="vehicle2" value="Car" style={{display:"none"}}></input>
          <label htmlFor="vehicle2"> Evenings, after 5AM</label>
          </p>
          <p>
          <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat" style={{display:"none"}}></input>
          <label htmlFor="vehicle3"> Weekdays (Mon-Fri)</label>
          </p>
          <p>
          <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat" style={{display:"none"}}></input>
          <label htmlFor="vehicle3"> Weekends (Sat-Sun)</label>
          </p>
          </div>
          <div className="confirmButton">
            <button className="btn btn-primary" value={props.appTime} onClick={props.review}>Confirm and Send to Office</button>
          </div>
    </div>
  )
}

const Review = props => {
  const doctorimage = {
    borderRadius:'20px',
    maxWidth: '120px'
  }
  return <div>

    <div><a href="#" className="back"> &lt; Back</a></div>

    <h3 style={{textAlign:"center",paddingBottom:"30px"}}>Confirm Your Appointment</h3>

    <div className="welcome">
      <h2 style={{color:"#037971",fontSize:"40px"}}>You're almost there!</h2>
      <p className="welcomeP" style={{color:"#595959",fontSize:"16px"}}>Confirm the details below</p>
    </div>
    <hr></hr>
    <h4 style={{color:"#151515",fontSize:"22px"}}>Appointment Review for:&nbsp;&nbsp;&nbsp;
      <select name="selectPatient" id="selectPatient" style={{width:"auto",padding:"0px 60px 0px 20px"}}>
        <option value="">{patientInfo.first_name} {patientInfo.last_name}</option>
        <option value="">Saab</option>
        <option value="">Mercedes</option>
        <option value="">Audi</option>
      </select>
    </h4>
      <div class="row align-row-center" style={{padding:"50px 0px"}}>
        <div class="col-lg-2 col-sm-5"><img class="img-fluid" style={doctorimage} src={doctorInfo.image}></img></div>
        <div class="col-lg-3 col-sm-6">
          <div>Dr. {doctorInfo.first_name} {doctorInfo.first_name}</div>
          <div style={{fontSize:"18px",fontWeight:"600",textDecoration:"underline"}}>{props.appTime}</div>
          <div style={{fontSize:"18px",fontWeight:"600",textDecoration:"underline"}}>For: Root Canal</div> 
          <div>At: {doctorInfo.address_line_1} </div> 
        </div>
      </div>
    <hr></hr>
    <a href="#">Save to calendar</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#">Send me a reminder</a>
    <div className="confirmButton">
      <button class="btn btn-primary" value={props.appTime} onClick={props.review} style={{float:"right"}}>Confirm and Send to Office</button>
    </div>

  </div>
}

const Confirmation = props => {
  return <div>
    <div><a href="#" className="back"> &lt; Back to Search </a></div>
    <h3 style={{textAlign:"center"}}>Great!  Your request for an appointment has been submitted to the provider.</h3>

    <div className="Dashboard" style={{paddingBottom:"50px"}}>
      <p style={{textAlign:"center"}}>Once your provider confirms your appointment, they will send you a link to complete the rest of your check-in.</p>
    </div>
    <div className="steps">
      <h4>Next Steps</h4>
    </div>
    <ul class="timeline">
				<li class="complete">
					<p>Find the perfect dentist</p>
				</li>
				<li class="complete">
					<p>Make an appointment</p>
				</li>
				<li class="current">
					<p>Office confirms appointment</p>
				</li>
        <li class="incomplete">
					<p>Fill out the Patient intake forms</p>
				</li>
        <li class="incomplete">
					<p>Pay the copay for this visit</p>
				</li>
			</ul>
    <div className="stepButtons" style={{float:"right"}}>
      <button className="btn btn-primary patientdashboard">Patient Portal</button>
    </div>
  </div>

}