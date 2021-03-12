import React from 'react'
import {Rate, Icon, FlexboxGrid, } from 'rsuite'
import { ZipCodeValueContext } from '../Context/validZipCodeContext'
import "../scss/profile.scss"
import ProfileModal from './sub-components/ProfileModal'
import { DoctorNameValueContext } from '../Context/validDoctorNameContext'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { AverageRatingValueContext } from '../Context/AverageRatingContext'
import { TimeAvailValueContext } from '../Context/TimeAvailContext'

export default function Profile(props) {
    const [averageRatingContext, setAverageRatingContext] = React.useContext(AverageRatingValueContext)
    const [timeAvailContext, setTimeAvailContext] = React.useContext(TimeAvailValueContext)

    const [zipCodeValueContext, setZipCodeValueContext] = React.useContext(ZipCodeValueContext)
    const [doctorNameValueContext, setDoctorNameValueContext] = React.useContext(DoctorNameValueContext)
    
    // stores info about Doctor and Offices
    const [doctorDirectory, setDoctorDirectory] = React.useState([])
    
    const [doctorReview, setDoctorReview] = React.useState([])
    const [patientName, setPatientName] = React.useState([])
    // const [getDoctorID, setDoctorID] = React.useState()
    const [geoCode, setGeoCode] = React.useState([])

    const [filterDoctorDirectory, setFilterDoctorDirectory] = React.useState([])

    const containerStyle = {
        width: '400px',
        height: '400px',
        padding: '20px'
      };
      
      const center = {
        lat: -3.745,
        lng: -38.523
      };


    React.useEffect(() => {
        fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/office-office-doctor-utilities',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(  {"body":{"task":"get_doctor_for_directory"}}  )
        }).then((res) => res.json()).then((data) => {

            setDoctorDirectory(profile => [...profile, data])

            // nested fetch starts below:
            data.body.map((entry) => (
                fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/office-office-doctor-utilities',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },                    
                    body: JSON.stringify(  {"body":{"task":"get_doctor_review_by_doctor","doctor_id":`${entry.doctor_id}`}  })
                }).then((res) => res.json()).then((doctor_review) => {
                    // console.log(doctor_review)
                    // setOfficeDoctor(profile => [...profile, office_doctor_info.body.map(entry => )])
                    setDoctorReview(review => [...review, doctor_review.body.map((entry) => entry)])

                    doctor_review.body.map((entry) => (
                        fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/patient-utilities',{
                            method: 'POST',
                            // mode: 'no-cors',
                            headers: {     
                                "Access-Control-Allow-Headers": "Content-Type",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                                "Access-Control-Allow-Credentials": true
                            },                    
                            body: JSON.stringify(  {"body": {"task": "get_patient","patient_id":`${entry.patient_id}`}}  )
                        }).then((res) => res.json()).then((patientName) => {
                            // console.log(patientName)
                            setPatientName(name => [...name, patientName.body.map((entry) => entry)])
                        })
                            
                    ))})
                    
            ))
        })
            
    }, [])

    const ParseInsuranceInfo = () => {
      
        let part2Parse = props.surveyResult.map(entry => entry.split('|')).flat()
        part2Parse = part2Parse.map(entry => entry.includes("Carrier") || entry.includes("Plan") || entry.includes("part1") ? entry : null)
        part2Parse = part2Parse.map(entry => entry !== null ? entry.substring(entry.lastIndexOf(':')+2) : null)
  
        // console.log(part2Parse)
        return part2Parse
    }
    const ParsePurposeInfo = () => {
        let storePurposeInfo = []
        let part4Parse = props.surveyResult.map(entry => entry.split('|').map(entry => entry.includes("part4") ? entry : null))
        
        let part4parse4 = part4Parse.map(entry => entry.map(entry => entry))
        part4parse4.forEach((entry) => {
          if(entry !== null){
            storePurposeInfo.push(entry.map(entry => entry !== null ? entry.substring(entry.indexOf(':')+2) : null))
          }
        })
  
        // parse substring until first occurence of the char "<"
        let findCharIndex = storePurposeInfo.map(entry => entry[6].indexOf('<'))
        
        // console.log(storePurposeInfo.map(entry => entry.substring(0,findCharIndex[0])))      
        return storePurposeInfo.map(entry => entry[6].substring(0,findCharIndex[0]))[0]
      }



    /**
     * Primary based filter to start with: doctor name, zip code
     * Secondary filters that depend on primary filters: time avail, rating, 
     */
    const HandleFilters = () => {
        let filteredData = []

        if(averageRatingContext !== ""){
            filteredData = doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
                (entry.zipcode === zipCodeValueContext) || 
                (entry.first_name + " " + entry.last_name === doctorNameValueContext)))
            
            filteredData = filteredData.flat()
            filteredData = filteredData.filter(entry => entry.rating === averageRatingContext ? entry : null)
            console.log(filteredData)
            // return filteredData    
        }else{
            filteredData = doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
                (entry.zipcode === zipCodeValueContext) || 
                (entry.first_name + " " + entry.last_name === doctorNameValueContext)))
            
            filteredData = filteredData.flat()
            // console.log(filteredData)
        }


        // ! add data to AWS to test accepts_insurance and accepts_purposes field.
        // if(ParseInsuranceInfo()[1]==='Yes'){
        //     filteredData = doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        //         (entry.zipcode === zipCodeValueContext) || 
        //         (entry.first_name + " " + entry.last_name === doctorNameValueContext)))
            
        //     filteredData = filteredData.flat()
        //     filteredData = filteredData.filter(entry => entry.accepts_insurance === ParseInsuranceInfo()[0] || entry.accepts_insurance === ParseInsuranceInfo()[4] ? entry : null)
        // }
        // if(ParsePurposeInfo() !== ""){
        //     filteredData = doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        //         (entry.zipcode === zipCodeValueContext) || 
        //         (entry.first_name + " " + entry.last_name === doctorNameValueContext)))
            
        //     filteredData = filteredData.flat()
        //     filteredData = filteredData.filter(entry => entry.accepts_purposes === ParseInsuranceInfo() ? entry : null)
        // }


        
        return filteredData
    }

    
    
    // Modal state
    const refID = React.useRef(null)
    
    const [indexMarker, setIndexMarker] = React.useState(-1)
    
    const [show, setShow] = React.useState(false)
    const [overflow, setOverflow] = React.useState(false)
    const ModalClose = () => {
        setShow(false)
    }
    const ModalOpen = (id,event) => {                
                
        setShow(true)
        setIndexMarker(id)

        let DoctorFullAdress = doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
            (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
            (key===id ? [entry.address_line_1, entry.address_line_2, entry.zipcode, entry.state, entry.country].join('+') : null)))
    
        
            // console.log(DoctorFullAdress)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${DoctorFullAdress.flat().map(entry => entry !== null ? entry : null).join('')}&key=`)
            .then(res => res.json())
            .then(data => {
                setGeoCode(street =>  [...street, data.results.map(entry => entry.geometry.location)])
            })

            // {console.log(data.results.map(entry => entry.geometry.location))}

        // console.log(DoctorFullAdress.flat().map(entry => entry !== null ? entry : null).join(''))
    }

    
    return (
        <div>
            <FlexboxGrid>
                <FlexboxGrid.Item>


               {/* <button type="submit" onClick={SetFilteredData}>run filter</button> */}
            
            
            {/* {console.log('offices: ' + offices)} */}
            {/* {console.log('officeDoctor: ' + officeDoctor.map(entry => entry.body.map(entry => entry).filter(item => item.office_id === '101').map(entry => entry.first_name + ' ' + entry.last_name + ' | ')    ))} */}


            {/* {console.log('offices: ' + offices.map(    (entry) => entry.body.map((entry) => entry).filter(item => item.zipcode === zipCodeValueContext).map(entry => entry.office_id)     ))} */}

            
            {/* {
                doctorDirectory.map(    
                    (entry) => entry.body.map((entry) => entry).filter(entry => entry.zipcode === zipCodeValueContext).map((entry, key) => (
                        <ul key={key}>
                            <li>{entry.first_name + " " + entry.last_name}</li>
                        </ul>
                    ))
                )
            } */}


            {/* When user enters first name or last name of the doctor, pass user input here to filter for their first name and last and display all their info in this direcotyr listing */}
            {/* {
                officeDoctor.map(
                    entry => entry.body.map(entry => entry).filter(item => item.office_id === '101').map(entry => entry.office_id)    )
                )
            } */}



{/* {console.log(doctorNameValueContext)} */}
            {/* TODO: display doctor's firstname, lastname, specialty, office address, ratings */}
            <div className="profile">                
                {/* {
                    filterDoctorDirectory.flat().map(entry => (
                        <h6>{entry.first_name + " " + entry.last_name}</h6>
                    ))
                } */}
            
                
                {/* {HandleFilters()} */}

                {/* {ParsePurposeInfo()} */}


                
                {
                    HandleFilters().map((entry,key) => (
                        <a href="#" onClick={(event)=>ModalOpen(key,event)} key={key} id={entry.doctor_id} ref={refID} className="profile__container-link">
                                    
                        <div className="profile__wrapper" key={key} id={entry.doctor_id} ref={refID}>
                        
                            <div className="profile__index">{key+1}</div>
                            <div className="profile__photo">
                                <img src={entry.image} alt="profile image" />
                            </div>

                            <ul className="profile__list">
                                {/* <li>{entry.doctor_id}</li> */}
                                <li>Dr. {entry.first_name + " " + entry.last_name}</li>
                                <li>{entry.specialty}</li>
                                <li>at {entry.address_line_1 !== "" || entry.address_line_2 !== "" ? entry.address_line_1 + " " + entry.address_line_2 : null}</li>
                                <li><span><Icon icon='check' size='1x' /></span><span>Accepts Insurance</span></li>
                                          
                                <li><span><Rate value={entry.rating} readOnly allowHalf /></span><span><button type="submit" className="profile__view--btn">View</button></span></li>
                                {/* <li>{entry.address_line_1 + " " + entry.address_line_2 + " " + entry.zipcode + " " + entry.state + " " + entry.country}</li> */}
                            </ul>
                        </div>

                    </a>
                    ))
                }

                


                

                <ProfileModal 
                    overflow={overflow}
                    show={show}
                    ModalClose={ModalClose}
                    ModalOpen={ModalOpen}                   
                    doctorDirectory={doctorDirectory}
                    indexMarker={indexMarker}                    
                    refID={refID}
                    // getDoctorID={getDoctorID}                    
                    surveyResult={props.surveyResult}
                    parseInsuranceInfo={document.referrer === window.location.origin+"/quiz" ? ParseInsuranceInfo() : ""}
                    parsePurposeInfo={document.referrer === window.location.origin+"/quiz" ? ParsePurposeInfo() : ""}
                    doctorReview={doctorReview}
                    patientName={patientName}
                    geoCode={geoCode.flat()}
                />
            </div>

            </FlexboxGrid.Item>

            </FlexboxGrid>
            
        </div>
    )

}
