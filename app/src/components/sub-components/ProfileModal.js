import React from 'react'
import "../../scss/profile.scss"
import "../../scss/profileModal.scss"
import { GoogleMap, LoadScript, Marker, useLoadScript} from '@react-google-maps/api';

import {Rate, FlexboxGrid, Container, Icon, ButtonToolbar, Button, Modal, 
    Calendar, Badge, Popover, Whisper, Avatar, SelectPicker, PanelGroup, Panel  } from 'rsuite'
        
// import {Card, Accordion} from 'react-bootstrap'
import { DoctorNameValueContext } from '../../Context/validDoctorNameContext'
import {ZipCodeValueContext} from '../../Context/validZipCodeContext'
import ReviewModal from './ReviewModal'
// import "../scss/profile.scss"
// import PaginationBasic from './PaginationBasic'
import InsuranceCarriers from '../../data/InsuranceCarriers'
import InsurancePlans from '../../data/InsurancePlans'
import Purpose from '../../data/Purpose'

import Booking from '../booking/Booking'
import "../../scss/calendar.scss"


const libraries = ["places"]
const containerStyle = {
    width: '535px',
    height: '488px'
}


export default function ProfileModal(props) {
    
    const [zipCodeValueContext, setZipCodeValueContext] = React.useContext(ZipCodeValueContext)
    const [doctorNameValueContext, setDoctorNameValueContext] = React.useContext(DoctorNameValueContext)

    const [show, setShow] = React.useState(false)

    //this second modal will be triggered when user write a review.
    const ModalClose = () => {
        setShow(false)
        
        // If user clisk 'Ok' button trigger fetch to add doctor review and then close the modal.

    }
    const ModalOpen = () => {                
      setShow(true)
    }
           
    const reviewFilter = [{"label":"Most Recent", "value":"Most Recent"},{"label":"Most Helpful", "value":"Most Helpful"},
    {"label":"Positive Review", "value":"Positive Review"},{"label":"Negative Review", "value":"Negative Review"}]



    // for google map
    const center = {
        lat: parseFloat(props.geoCode.map(entry => entry.lat)),
        lng: parseFloat(props.geoCode.map(entry => entry.lng))
    }
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyD9ORuSLvfipK-tVUfSC0fNvomDAjoXVlo",
        libraries        
    })
    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading Maps"


    const onLoad = marker => {
    // console.log('marker: ', marker)
    }
    
    
    let DoctorID =  props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.doctor_id].join('') : null)))

    let DoctorName =  props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.first_name + " " + entry.last_name].join('') : null)))

    let doctorRating = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.rating].join('') : null)))

        // doctorRating.flat().map(entry => entry !== null ? entry[props.indexMarker] : null)
    

    let doctorDescription = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
            (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
            (key===props.indexMarker ? [entry.description].join('') : null)))


    let doctorTitle = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.title].join('') : null)))
    
    let doctorEstimatedCost = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.estimated_cost].join('') : null)))

        // accepts_insurance
    let doctorAcceptsInsurance = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
        (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
        (key===props.indexMarker ? [entry.accepts_insurance].join('') : null)))
    
    // let ModalFooterInfo = props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
    //     (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
    //     (key===props.indexMarker ? [entry.office_name, entry.website, entry.phone, entry.address_line_1, entry.address_line_2 ].join() : null)))





    return (
        <>

        
        <div>
 {/* when user clicks on individual doctor's profile, show a popup */}
 {/* onEnter={sendData} */}
 <Modal overflow={props.overflow} show={props.show} onHide={props.ModalClose} size={'lg'}>
                <Modal.Header>
                    
                    <FlexboxGrid justify="space-between" align="middle">
                        <FlexboxGrid justify="start">
                            <FlexboxGrid.Item>
                                <svg width="178" viewBox="0 0 734 278" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M228.207 178.031C224.797 178.18 222.202 177.66 220.423 176.474C218.717 175.288 217.865 173.472 217.865 171.026C217.865 168.802 218.421 167.171 219.533 166.133C220.645 165.021 222.387 164.391 224.76 164.242L228.319 164.02C233.657 163.798 236.326 160.647 236.326 154.568V106.974C236.326 104.38 237.142 102.304 238.773 100.747C240.404 99.1904 242.517 98.412 245.112 98.412C247.707 98.412 249.783 99.1904 251.34 100.747C252.971 102.304 253.786 104.38 253.786 106.974V154.346C253.786 169.024 246.446 176.845 231.766 177.809L228.207 178.031ZM342.973 166.8C343.566 168.134 343.863 169.32 343.863 170.358C343.863 172.434 343.01 174.213 341.305 175.696C339.674 177.104 337.783 177.809 335.633 177.809C334.224 177.809 332.89 177.438 331.63 176.697C330.369 175.881 329.406 174.695 328.738 173.138L322.844 160.017H285.143L279.249 173.138C278.582 174.695 277.617 175.881 276.357 176.697C275.171 177.438 273.836 177.809 272.354 177.809C270.203 177.809 268.276 177.104 266.571 175.696C264.865 174.213 264.013 172.434 264.013 170.358C264.013 169.32 264.309 168.134 264.902 166.8L294.93 103.75C295.745 101.97 296.968 100.636 298.6 99.7464C300.231 98.7829 301.973 98.3008 303.827 98.3008C305.754 98.3008 307.533 98.7829 309.165 99.7464C310.796 100.71 312.056 102.044 312.946 103.75L342.973 166.8ZM316.95 146.895L304.049 117.983L291.037 146.895H316.95ZM381.143 178.365C375.285 178.365 369.836 177.698 364.794 176.363C359.753 174.955 355.638 172.99 352.45 170.47C351.338 169.654 350.522 168.802 350.003 167.912C349.558 166.948 349.336 165.762 349.336 164.354C349.336 162.5 349.892 160.869 351.004 159.461C352.19 158.052 353.525 157.348 355.008 157.348C355.823 157.348 356.601 157.496 357.343 157.793C358.158 158.015 359.123 158.46 360.235 159.127C363.423 161.129 366.648 162.612 369.91 163.575C373.172 164.465 376.768 164.91 380.698 164.91C385.591 164.91 389.335 164.094 391.93 162.463C394.525 160.832 395.823 158.497 395.823 155.458C395.823 153.16 394.599 151.306 392.152 149.898C389.78 148.489 385.516 147.155 379.363 145.894C372.468 144.486 366.944 142.781 362.793 140.779C358.714 138.778 355.712 136.294 353.784 133.329C351.93 130.364 351.004 126.768 351.004 122.542C351.004 117.872 352.339 113.684 355.008 109.977C357.751 106.196 361.495 103.268 366.24 101.192C371.059 99.042 376.472 97.9672 382.477 97.9672C393.005 97.9672 401.68 100.599 408.501 105.862C409.613 106.752 410.391 107.679 410.836 108.642C411.355 109.532 411.615 110.644 411.615 111.978C411.615 113.832 411.021 115.463 409.835 116.871C408.723 118.28 407.425 118.984 405.943 118.984C405.127 118.984 404.349 118.873 403.607 118.65C402.94 118.428 401.976 117.946 400.716 117.205C397.676 115.277 394.858 113.832 392.264 112.868C389.743 111.904 386.517 111.422 382.588 111.422C378.065 111.422 374.506 112.312 371.912 114.091C369.317 115.796 368.019 118.168 368.019 121.208C368.019 122.987 368.501 124.47 369.465 125.656C370.503 126.768 372.171 127.769 374.47 128.658C376.842 129.548 380.178 130.475 384.479 131.438C394.562 133.662 401.791 136.516 406.165 140.001C410.614 143.485 412.838 148.267 412.838 154.346C412.838 159.09 411.503 163.279 408.834 166.911C406.239 170.544 402.532 173.361 397.713 175.362C392.968 177.364 387.444 178.365 381.143 178.365ZM434.565 178.031C431.896 178.031 429.783 177.253 428.226 175.696C426.669 174.139 425.89 172.026 425.89 169.358V107.086C425.89 104.491 426.595 102.489 428.003 101.081C429.412 99.6725 431.414 98.968 434.009 98.968H461.923C470.45 98.968 477.085 101.118 481.83 105.418C486.576 109.717 488.948 115.722 488.948 123.432C488.948 131.142 486.576 137.147 481.83 141.446C477.085 145.746 470.45 147.896 461.923 147.896H443.239V169.358C443.239 172.026 442.461 174.139 440.904 175.696C439.347 177.253 437.234 178.031 434.565 178.031ZM459.699 134.774C468.373 134.774 472.711 131.031 472.711 123.543C472.711 115.982 468.373 112.201 459.699 112.201H443.239V134.774H459.699ZM508.851 177.364C506.256 177.364 504.254 176.66 502.846 175.251C501.437 173.843 500.733 171.841 500.733 169.246V107.086C500.733 104.491 501.437 102.489 502.846 101.081C504.254 99.6725 506.256 98.968 508.851 98.968H548.22C553.707 98.968 556.45 101.192 556.45 105.64C556.45 110.162 553.707 112.423 548.22 112.423H517.637V130.771H545.996C551.483 130.771 554.226 133.032 554.226 137.554C554.226 142.002 551.483 144.226 545.996 144.226H517.637V163.909H548.22C553.707 163.909 556.45 166.17 556.45 170.692C556.45 175.14 553.707 177.364 548.22 177.364H508.851ZM631.491 166.355C632.603 167.986 633.159 169.58 633.159 171.137C633.159 173.212 632.308 174.918 630.601 176.252C628.972 177.586 627.042 178.254 624.818 178.254C623.411 178.254 622.037 177.92 620.703 177.253C619.368 176.586 618.256 175.548 617.367 174.139L602.687 152.344C601.43 150.416 600.095 149.045 598.683 148.23C597.276 147.34 595.497 146.895 593.345 146.895H584.337V169.358C584.337 172.026 583.558 174.139 582.001 175.696C580.522 177.253 578.481 178.031 575.884 178.031C573.215 178.031 571.102 177.253 569.545 175.696C567.988 174.139 567.21 172.026 567.21 169.358V107.086C567.21 104.491 567.916 102.489 569.323 101.081C570.735 99.6725 572.737 98.968 575.328 98.968H603.243C612.44 98.968 619.368 101.007 624.039 105.084C628.788 109.087 631.157 114.907 631.157 122.542C631.157 128.547 629.489 133.551 626.152 137.554C622.816 141.558 618.112 144.189 612.028 145.45C614.253 145.894 616.221 146.784 617.923 148.118C619.702 149.379 621.409 151.232 623.038 153.678L631.491 166.355ZM600.685 133.774C605.656 133.774 609.248 132.921 611.472 131.216C613.697 129.437 614.809 126.694 614.809 122.987C614.809 119.206 613.697 116.464 611.472 114.758C609.248 113.053 605.656 112.201 600.685 112.201H584.114V133.774H600.685Z" fill="black"/>
                                <path d="M172.935 116.204V63.384C172.935 57.2426 167.956 52.264 161.814 52.264H145.132C138.99 52.264 134.011 57.2426 134.011 63.384V116.204C134.011 122.345 138.99 127.324 145.132 127.324H161.814C167.956 127.324 172.935 122.345 172.935 116.204Z" fill="#F06C9B" fill-opacity="0.7"/>
                                <path d="M161.814 51.152H108.988C102.846 51.152 97.8667 56.1306 97.8667 62.272V78.952C97.8667 85.0934 102.846 90.072 108.988 90.072H161.814C167.956 90.072 172.935 85.0934 172.935 78.952V62.272C172.935 56.1306 167.956 51.152 161.814 51.152Z" fill="#F06C9B" fill-opacity="0.7"/>
                                <path d="M135.196 170.36V139C135.196 132.858 140.175 127.88 146.317 127.88H161.814C167.956 127.88 172.935 132.85 172.935 138.991V187.352C172.935 202.456 161.882 215.253 149.302 221.966C135.15 229.517 117.014 226.056 103.427 226.056C92.2644 226.056 102.825 226.056 91.2145 226.056C85.0723 226.056 80.0728 221.077 80.0728 214.936V195.64C80.0728 189.499 85.0528 184.52 91.1951 184.52H108.988C120.31 184.52 135.196 187.352 135.196 170.36Z" fill="#037971"/>
                                </svg>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <FlexboxGrid justify="end">
                            <FlexboxGrid.Item>
                                <Button classPrefix={'profileModal__login-btn'}>Login</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FlexboxGrid>

                    <hr />



                  <FlexboxGrid align="middle">
                      <FlexboxGrid.Item>
                         <Avatar classPrefix={'modal__doctorImage'} circle src="https://source.unsplash.com/287x287/?dentist" size='lg' />
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item>
                          <Container>
                            <h6>{DoctorName}</h6>
                            <p>{doctorTitle}</p>
                            <Rate defaultValue={doctorRating.flat().map(entry => entry)[props.indexMarker]} readOnly allowHalf />
                            
                          </Container>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item>
                          {/* Amber's Booking app goes here  colspan={4}*/}
                          <Booking />
                      </FlexboxGrid.Item>
                      

                  </FlexboxGrid>
                  <hr />

                <FlexboxGrid>
                    <FlexboxGrid.Item>
                        {/* if user answered 'yes' in the quiz, their insurance info should be populated here to see if it matches with each individual doctor's profile of insurance networks */}
                        {
                            doctorAcceptsInsurance === props.parseInsuranceInfo[1] ?
                                <>
                                    <FlexboxGrid align="middle">
                                        {/* <div className="profileModal__insuranceField--yes"> */}
                                            
                                            <FlexboxGrid.Item>
                                                <span><Icon icon='check' size='1x' /></span>
                                                <span> Accepts Insurance</span>
                                            </FlexboxGrid.Item>
                                        
                                    </FlexboxGrid>

                                    <br />
                                    <Container><SelectPicker placeholder={props.parseInsuranceInfo[0]} data={InsuranceCarriers} style={{ width: 224 }} /></Container>
                                    <br />
                                    <Container><SelectPicker placeholder={props.parseInsuranceInfo[4]} data={InsurancePlans} style={{ width: 224 }} /></Container>
                                </>
                            :
                                <>
                                    {/* <div className="profileModal__insuranceField--no"></div> */}
                                     <Container>Want to use insurance? See if Dr. {DoctorName} is in-network</Container>
                                     <br />
                                    <Container><SelectPicker data={InsuranceCarriers} /></Container>
                                    <br />
                                    <Container><SelectPicker data={InsurancePlans} /></Container>
                                </>
                            
                            // props.parseInsuranceInfo.map(entry => console.log(entry)),
                            // console.log(props.parseInsuranceInfo)
                            // console.log(props.parseInsuranceInfo[4])
                            // props.surveyResult.
                        }

                    </FlexboxGrid.Item>
                </FlexboxGrid>

                
                  

                <FlexboxGrid>

                    <FlexboxGrid.Item>

                        <article className="doctor__intro">
                            <div className="doctor__about">
                                <h3>About {DoctorName}</h3>
                                <p>{doctorDescription}</p>
                            </div>


                            <div className="doctor__office-map" style={{padding:'80px 0'}}>

                                {/* googlemap goes here */}
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={13}
                                >
                                    { /* Child components, such as markers, info windows, etc. */ }
                                    <>
                                        <Marker
                                            onLoad={onLoad}
                                            position={center}
                                        />
                                    </>
                                </GoogleMap>
                                {/* {console.log(props.geoCode.map(entry => entry.lat) + " " + props.geoCode.map(entry => entry.lng))} */}

                            </div>
                        </article>      
                    </FlexboxGrid.Item>             

                </FlexboxGrid>                 



                <FlexboxGrid>
                    <FlexboxGrid.Item>
                        <Container>Get an estimate for your appointment cost:</Container>
                        <br />
                        <Container><SelectPicker classPrefix={'profileModal__insurance-carrier'} placeholder={props.parseInsuranceInfo[0]} data={InsuranceCarriers} style={{ width: 224 }} /></Container>,
                        <br />
                        <Container><SelectPicker classPrefix={'profileModal__insurance-plan'} placeholder={props.parseInsuranceInfo[4]} data={InsurancePlans} style={{ width: 224 }} /></Container>
                        <br />
                        <Container><SelectPicker placeholder={props.parsePurposeInfo}  data={Purpose} style={{ width: 224 }} /></Container>
                        <br />
                        <Container>The average cost for this procedure in your area is {doctorEstimatedCost !== null ? doctorEstimatedCost : "[Estimated cost here]"} .</Container>
                        <Container><small>*this average does not account for insurance coverage.</small></Container>
                        <br />
                        <Button classPrefix={'profileModal__plan-options'} appearance="default">See payment plan options</Button>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                
                
                </Modal.Header>



                <Modal.Body>          
                    
                    {/* user reviews and star ratings begin here */}                    
                    <FlexboxGrid align="middle">
                         <FlexboxGrid.Item>
                            <h3>Recent Reviews</h3>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item>
                            <SelectPicker data={reviewFilter} placeholder={reviewFilter[0].label} searchable={false} style={{ width: 224 }} />
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item>
                            
                            <a href="#" onClick={()=>ModalOpen()}>Write reviews
                               <span>
                                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0)">
                                        <path d="M7.29688 14.0625H5.79688C5.38266 14.0625 5.04688 14.3983 5.04688 14.8125C5.04688 15.2267 5.38266 15.5625 5.79688 15.5625H7.29688C7.71109 15.5625 8.04688 15.2267 8.04688 14.8125C8.04688 14.3983 7.71109 14.0625 7.29688 14.0625Z" fill="#037971"/>
                                        <path d="M11.7969 17.3628H5.79688C5.38266 17.3628 5.04688 17.6986 5.04688 18.1128C5.04688 18.527 5.38266 18.8628 5.79688 18.8628H11.7969C12.2111 18.8628 12.5469 18.527 12.5469 18.1128C12.5469 17.6986 12.2111 17.3628 11.7969 17.3628Z" fill="#037971"/>
                                        <path d="M18.4197 22.7778H3.68219C3.05164 22.7778 2.44691 22.5273 2.00104 22.0815C1.55517 21.6356 1.30469 21.0309 1.30469 20.4003V5.65533C1.30469 5.02478 1.55517 4.42005 2.00104 3.97419C2.44691 3.52832 3.05164 3.27783 3.68219 3.27783H11.7972C11.9961 3.27783 12.1869 3.35685 12.3275 3.4975C12.4682 3.63815 12.5472 3.82892 12.5472 4.02783C12.5472 4.22674 12.4682 4.41751 12.3275 4.55816C12.1869 4.69881 11.9961 4.77783 11.7972 4.77783H3.68219C3.56632 4.77684 3.45141 4.79881 3.34408 4.84246C3.23675 4.88612 3.13913 4.9506 3.05685 5.03218C2.97457 5.11376 2.90926 5.21083 2.86469 5.31779C2.82013 5.42474 2.79718 5.53946 2.79719 5.65533V20.3928C2.79915 20.625 2.89223 20.847 3.05637 21.0112C3.22051 21.1753 3.44257 21.2684 3.67469 21.2703H18.4197C18.6518 21.2684 18.8739 21.1753 19.038 21.0112C19.2021 20.847 19.2952 20.625 19.2972 20.3928V12.2778C19.2972 12.0789 19.3762 11.8882 19.5169 11.7475C19.6575 11.6069 19.8483 11.5278 20.0472 11.5278C20.2461 11.5278 20.4369 11.6069 20.5775 11.7475C20.7182 11.8882 20.7972 12.0789 20.7972 12.2778V20.3928C20.7982 20.7057 20.7374 21.0157 20.6184 21.305C20.4993 21.5943 20.3244 21.8573 20.1035 22.0788C19.8826 22.3004 19.6202 22.4762 19.3313 22.5961C19.0423 22.7161 18.7325 22.7778 18.4197 22.7778Z" fill="#037971"/>
                                        <path d="M12.2767 14.2503H9.82422V11.7978C9.82414 11.5664 9.86983 11.3373 9.95864 11.1236C10.0475 10.9099 10.1776 10.7159 10.3417 10.5528L17.8792 3.00027C18.0341 2.84335 18.2186 2.71875 18.422 2.63371C18.6255 2.54867 18.8437 2.50488 19.0642 2.50488C19.2847 2.50488 19.503 2.54867 19.7064 2.63371C19.9098 2.71875 20.0943 2.84335 20.2492 3.00027L21.0817 3.83277C21.2364 3.98738 21.3591 4.17095 21.4428 4.37299C21.5265 4.57503 21.5696 4.79158 21.5696 5.01027C21.5696 5.22896 21.5265 5.44551 21.4428 5.64754C21.3591 5.84958 21.2364 6.03315 21.0817 6.18777L13.4992 13.7328C13.1738 14.0567 12.7358 14.2421 12.2767 14.2503ZM11.3242 12.7503H12.2767C12.3114 12.7508 12.3458 12.7444 12.378 12.7315C12.4102 12.7186 12.4395 12.6995 12.4642 12.6753L20.0017 5.13027C20.0324 5.09936 20.0496 5.05757 20.0496 5.01402C20.0496 4.97046 20.0324 4.92868 20.0017 4.89777L19.1692 4.07277C19.1383 4.04208 19.0965 4.02486 19.053 4.02486C19.0094 4.02486 18.9676 4.04208 18.9367 4.07277L11.3992 11.6178C11.375 11.6425 11.3558 11.6718 11.343 11.704C11.3301 11.7362 11.3237 11.7706 11.3242 11.8053V12.7503Z" fill="#037971"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0">
                                        <rect width="24" height="30" fill="white"/>
                                        </clipPath>
                                        </defs>
                                        </svg>
                                </span>                                                           
                            </a>
                            
                                                                                   
                        </FlexboxGrid.Item>
                       

                        <ReviewModal 
                            show={show}
                            setShow={setShow}
                            ModalClose={ModalClose}
                            ModalOpen={ModalOpen}
                            DoctorName={DoctorName}
                            DoctorID={DoctorID}
                        />
                    </FlexboxGrid>



{/* {console.log(DoctorID.flat().map(entry => entry))} */}
{/* {console.log(props.doctorReview.flat().map(entry => String(entry.doctor_id) === DoctorID.flat().map(entry => entry)[0] ? entry : null))} */}

{/* {console.log(props.patientName.body.map(entry => entry.first_name + ' ' + entry.last_name))} */}
{/* {console.log(props.patientName.flat().map(entry => String(entry.doctor_id) === DoctorID.flat().map(entry => entry)[0] ? entry : null))} */}
{/* {console.log(props.patientName.flat())} */}

{
    props.doctorReview.flat().map(entry => String(entry.doctor_id) === DoctorID.flat().map(entry => 
        entry)[0] ? (
            <FlexboxGrid align="middle">
                <FlexboxGrid.Item>
                    <Avatar alt={'patient image'} src={'https://source.unsplash.com/287x287/?dentist'} circle={true} size={'sm'} classPrefix={'profileModal__patientImage'} />
                </FlexboxGrid.Item>
                
                <FlexboxGrid.Item>
                    <div>{props.patientName.flat().map(entry2 => entry.patient_id === entry2.patient_id ? entry2.first_name + ' ' + entry2.last_name : null)[0]}</div>
                    <br />
                    <div style={{width:'200px'}}>{entry.review}</div>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item>
                    <Rate defaultValue={entry.rating} readOnly />
                    <Container><small>was this review helpful? <span><a href="http://">Yes </a></span><span><a href="http://"> No</a></span></small></Container>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        )
    
    : null)
}



<div className="footer-flex">
<FlexboxGrid justify="space-between" align="top">
    <FlexboxGrid.Item>
        <article className={'profileModal__footer'}>
            {
                // console.log(ModalFooterInfo),
                // console.log(ModalFooterInfo.map(entry => entry))
// [entry.office_name, entry.website, entry.phone, entry.address_line_1, entry.address_line_2 ].join()
                props.doctorDirectory.map((entry) => entry.body.map((entry) => entry).filter(entry => 
                    (entry.zipcode === zipCodeValueContext) || (entry.first_name + " " + entry.last_name === doctorNameValueContext)).map((entry, key) => 
                    (key===props.indexMarker ? (
                        <>
                            <h3 style={{color:'#FCFCFC'}}>About {entry.office_name}</h3>
                            <br />

                            <p className={'footer-section-paragraphs'}>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos officiis ex vitae repellat, dolorem odio sunt, ullam, ad totam porro debitis enim iure obcaecati. Aliquid nobis saepe illum culpa id!
                            </p>
                            
                            <div>
                                <p style={{color:'#FCFCFC'}}>Website: {entry.website}</p>
                                <p style={{color:'#FCFCFC'}}>Phone: {entry.phone}</p>
                                <p style={{color:'#FCFCFC'}}>{entry.address_line_1 !== null ? entry.address_line_1 : entry.address_line_2}</p>
                            </div>
                        </>
                    ) 
                    : null )))
            }
            
        </article>
    </FlexboxGrid.Item>

    <FlexboxGrid.Item><img src="https://source.unsplash.com/350x350/?office" /></FlexboxGrid.Item>
</FlexboxGrid>
</div>

                   
                    {/* <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque, obcaecati animi! Laboriosam facilis ullam omnis voluptatem at corrupti! Minima et quasi mollitia deserunt praesentium veritatis harum ut magnam deleniti, nisi illo, vitae voluptatibus tempore sunt dolore laudantium exercitationem expedita saepe iste incidunt possimus temporibus. Consectetur officiis quo excepturi perspiciatis impedit! Officia similique qui distinctio ullam in nisi dolor iure delectus expedita molestiae laborum soluta dolorem facere eaque saepe molestias repellat repellendus vitae doloremque ex, commodi autem incidunt ut? Ratione id explicabo, sit a dolores asperiores praesentium magni tempora quos aut esse assumenda aspernatur, sequi architecto error, quasi iste ut. Esse unde quas, praesentium laboriosam omnis harum commodi. Unde soluta cumque, tempora vitae atque tenetur! Minima, perferendis! Delectus distinctio sed tempora odio consequuntur, laboriosam voluptas quam recusandae aperiam perspiciatis consectetur mollitia eos ipsa natus ipsum quos neque ea. Numquam voluptate alias rem omnis excepturi, corrupti fuga est harum asperiores atque dolores minima ipsam quidem praesentium beatae porro velit nulla ipsa sequi dolor minus maxime quae. Similique nobis quia voluptatum rerum quos deserunt consequuntur provident sequi dolore explicabo nemo saepe quis ipsum eius reprehenderit, animi inventore quam. Minus nihil maxime, commodi a quis unde repellat, debitis, tenetur nostrum laborum obcaecati. Quis impedit repellendus provident sequi. Deserunt dolor eum, aspernatur quos saepe eligendi fuga sit neque exercitationem est temporibus corrupti accusantium ex dicta beatae? Sunt beatae ipsum explicabo facilis dolorem, saepe maiores aliquid natus nobis fugiat qui tenetur? Exercitationem sed odit possimus quo perspiciatis ratione nemo eum vero asperiores molestiae incidunt fuga dignissimos doloribus alias repellat rerum, minima eaque a libero provident repellendus explicabo id. Temporibus dolorum vitae ad reiciendis earum distinctio fugiat ipsam rem corporis quas? Dicta dolorem, illum provident sint perferendis minus natus, nam in ducimus corrupti itaque? Rem veniam officia commodi odit quas suscipit rerum atque, beatae repellendus numquam quasi repudiandae expedita perspiciatis tempore deserunt enim temporibus, quo adipisci. Eos fugiat itaque nam. Minus illo iure voluptatem, a architecto sequi corrupti laborum autem delectus. Beatae, harum maxime ex at autem excepturi impedit ullam iste doloremque temporibus et, placeat voluptas possimus neque? Voluptates voluptatem beatae itaque, atque expedita, dolore delectus veniam consequatur, deleniti rerum vero. Sunt repellendus rerum doloremque aut labore eum quia pariatur accusamus ratione fuga quae nulla aperiam mollitia dolor, omnis molestias necessitatibus ullam. Excepturi fugit voluptatum tempore quia, harum repudiandae alias exercitationem ad, voluptate magnam nihil eum beatae perspiciatis amet tenetur laudantium ullam id rerum suscipit reprehenderit rem maiores eligendi. Iste ut rem modi explicabo exercitationem fuga ullam natus atque sequi doloribus quam enim harum laboriosam libero laudantium, ex soluta iusto aliquid animi dolore! Expedita, officiis blanditiis facilis facere sunt iste labore corporis minima non tempore unde dolores minus iusto exercitationem accusamus earum. Animi eveniet alias rerum dolores quam ea sunt eius dolorum modi doloribus nam illum saepe voluptatem, architecto quas corporis optio iste cumque eum nostrum enim sapiente earum? Nostrum quis autem magnam nemo, doloribus dolores. Iusto magnam laboriosam animi ab eligendi tenetur placeat at praesentium nesciunt sunt tempora nisi cupiditate reprehenderit dignissimos, accusamus magni exercitationem numquam facere. Minima repellat accusamus amet voluptatem nihil exercitationem atque rerum cum debitis magnam et dolor, culpa praesentium natus quos sequi molestias, aperiam ut? Consequuntur magnam, dignissimos neque voluptates rem eos pariatur placeat earum aspernatur nobis, asperiores ut. Inventore voluptate eaque officiis similique fuga magnam harum sed accusantium, assumenda, facilis sint, excepturi iste quis ducimus. Ratione aliquam ducimus earum totam ea voluptatibus dolores maiores nesciunt sit, obcaecati fugit pariatur voluptatem consequatur eveniet, at dolore laboriosam tenetur, ipsa soluta! Eaque, magni porro nulla possimus ut ex? Similique maiores ex corrupti repellendus, nesciunt veniam cumque porro officia dicta earum soluta sunt aliquam quod rerum. Aspernatur vitae dignissimos perspiciatis iure voluptatibus itaque, eligendi alias perferendis. Laudantium asperiores pariatur, maiores recusandae quam amet, harum voluptatum ullam earum voluptatibus optio ratione aliquid eum tempora ducimus magni. Repudiandae tempora iusto eveniet id aperiam ipsum quo ea saepe minima tenetur adipisci accusamus magni non nihil dolores velit, voluptas, doloribus impedit quisquam laboriosam quas voluptatum aut corrupti magnam. At voluptate quis quae, veniam reprehenderit rem, sunt nemo enim quisquam ad earum, optio repudiandae nulla dolores eos ratione consectetur laboriosam repellendus voluptatem consequuntur modi in maxime error? Velit eligendi sunt, ab iste minima itaque iusto suscipit sit. Quibusdam voluptas hic placeat necessitatibus exercitationem ipsam ipsum impedit consectetur aperiam doloribus possimus, facere inventore cum, rerum voluptate? Amet dolorem maiores ipsam velit veritatis voluptatibus accusantium, beatae suscipit quasi ducimus obcaecati dolorum ut rerum illo incidunt mollitia itaque commodi natus reprehenderit maxime libero doloremque iure error eligendi. Itaque dignissimos laudantium commodi eum rem, officia, incidunt neque, voluptatibus voluptatum non nemo! Molestias, corporis? At quae explicabo maxime harum. Voluptatum nulla odit, quas corporis porro voluptatem quae est ut? Aliquid amet ut tenetur alias suscipit a sit nesciunt nulla facilis deserunt itaque beatae officiis nam quas nostrum dolorum similique ducimus id, ea eaque eius debitis.</p> */}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.ModalClose} appearance="primary">
                    Ok
                    </Button>
                    <Button onClick={props.ModalClose} appearance="subtle">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


        </>
    )
}
