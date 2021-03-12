import React from 'react'

import SearchZipCode from './sub-components/SearchZipCode'
import SearchDoctorNames from './sub-components/SearchDoctorNames'

import Availability from '../data/Availability'
import InsuranceCarriers from '../data/InsuranceCarriers'
import Purpose from '../data/Purpose'
import TypeOfDoctor from '../data/TypeOfDoctor'
import 'rsuite/dist/styles/rsuite-default.css'
import {Slider, ButtonToolbar, Button, Sidenav, Sidebar,
        Rate, SelectPicker, Dropdown, Icon, AutoComplete, InputGroup,
        Container, Header, Content, Footer,
        Avatar, Input, Panel, List,
        FlexboxGrid, FormGroup, Radio, RadioGroup, PanelGroup
      } from 'rsuite'

import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem'
import "../scss/sidenav.scss"
import InsurancePlans from '../data/InsurancePlans'
import { AverageRatingValueContext } from '../Context/AverageRatingContext'
import { TimeAvailValueContext } from '../Context/TimeAvailContext'



export default function SideNav(props){
    const [averageRatingContext, setAverageRatingContext] = React.useContext(AverageRatingValueContext)
    const [timeAvailContext, setTimeAvailContext] = React.useContext(TimeAvailValueContext)
    


    // if user select "use insurance", make a collapsible dropdown that ask for insurance input
    // if survey says "no" insurance, 
    const [InsurFields, setInsurFields] = React.useState(false)


    // parse quiz result and assign it to a variable to be matched with the sidenav individual fields.
    const mapQuizResults = (whichPart) => {

      // let firstSpaceIndex = props.surveyResult.map(entry => entry.split('|').map(entry => entry.indexOf(' ')))
      
      let getSpecificPart = props.surveyResult.map(entry => entry.split('|').map(entry => entry.includes(whichPart) ? entry : null))
      // console.log(getSpecificPart)

      return getSpecificPart
    }

    const NoInsurance = (value) => {      
      if(String(mapQuizResults("part1")).includes(value)===false){
        setInsurFields(false)
      }
    }
    const HaveInsurance = (value) => {
      if(String(mapQuizResults("part1")).includes(value)===true){
        setInsurFields(true)        
      }
    }



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
      
      part4Parse = part4Parse.map(entry => entry.map(entry => entry))
      part4Parse.forEach((entry) => {
        if(entry !== null){
          storePurposeInfo.push(entry.map(entry => entry !== null ? entry.substring(entry.indexOf(':')+2) : null))
        }
      })

      // parse substring until first occurence of the char "<"
      let findCharIndex = storePurposeInfo.map((entry) => entry[6].indexOf('<'))
      
      // console.log(storePurposeInfo.map(entry => entry.substring(0,findCharIndex[0])))      
      return storePurposeInfo.map((entry) => entry[6].substring(0,findCharIndex[0]))[0]
    }

        
    const styles = {
        width: 200,
        marginBottom: 10
      };
      

      
      // more filters -- rating
      const dropdownMoreFilters = ({ ...props }) => (
        <>
          <br />
          <br />
          <Dropdown {...props}>

            <FlexboxGrid justify="left">
              <Dropdown.Item>

                  <FlexboxGrid justify="left">
                    Average Rating
                    <FlexboxGrid.Item><Rate defaultValue={0} onChange={(value, event)=>{setAverageRatingContext(String(value))}} value={averageRatingContext !== "" ? averageRatingContext : null} /></FlexboxGrid.Item>
                  </FlexboxGrid>

                  <FlexboxGrid justify="left">
                    {/* Availability
                    <FlexboxGrid.Item>
                      <SelectPicker searchable={false} placeholder={'Next three days'} data={Availability} style={{ width: 224 }} />
                    </FlexboxGrid.Item> */}
                  </FlexboxGrid>

              </Dropdown.Item>
            </FlexboxGrid>
          
          </Dropdown>
        </>
      );


            

    const instance = (
        <div style={{ width: 400 }}>            
          <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
            <Sidenav.Body>

{/* to be deleted */}
{/* <List sortable onSort={handleSortEnd}>
          {data.map(({ text, disabled }, index) => (
            <List.Item key={index} index={index}>
              {text}
            </List.Item>
          ))}
        </List> */}

                {/* {navfilter} */}

        <FlexboxGrid justify="left">
            <FlexboxGridItem>
                  <InputGroup inside style={styles}>
                      <InputGroup.Button>
                        <Icon icon="search" />
                      </InputGroup.Button>

                      {/* <Input placeholder={'Search by Doctor'} /> */}
                      <SearchDoctorNames />
                  </InputGroup>
            </FlexboxGridItem>  
        </FlexboxGrid>



                
{/* value={InsurFields === true ? "Yes" : null} checked={InsurFields}  
onChange={(value, checked)=>HaveInsurance(value)}  
collapsible={InsurFields === true ? false : true}
 || ParseInsuranceInfo().map(entry => entry[1]) !== "" 

 collapsible={InsurFields === true ? false : true}
 ParseInsuranceInfo().map(entry => entry[1] !== "" ? "Yes" : "No")
*/}
<FlexboxGrid justify="left">
  <FlexboxGrid.Item>
    
      <FormGroup controlId="radioList">
        <RadioGroup name="radioList" defaultValue={ParseInsuranceInfo()[1] !== "" ? "Yes" : "No"}>
          <div className="insurance-container">
              <span>Insurance</span>
              
              <span>
                  <svg width="25" height="31" viewBox="0 0 25 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                  <path d="M13.2812 3.0068V2.3248C13.2812 2.11926 13.1989 1.92214 13.0524 1.7768C12.9059 1.63146 12.7072 1.5498 12.5 1.5498C12.2928 1.5498 12.0941 1.63146 11.9476 1.7768C11.8011 1.92214 11.7188 2.11926 11.7188 2.3248V2.99905C9.18839 3.11884 6.76528 4.04879 4.8125 5.64955C3.81249 6.44691 3.00256 7.45373 2.4407 8.59794C1.87884 9.74214 1.57895 10.9954 1.5625 12.2681C1.56354 12.4416 1.62326 12.6098 1.7321 12.7456C1.84094 12.8815 1.9926 12.9772 2.16278 13.0174C2.33297 13.0576 2.51183 13.04 2.67071 12.9673C2.82959 12.8947 2.9593 12.7713 3.03906 12.6168C3.90811 12.3486 4.8172 12.2306 5.72656 12.2681C6.6385 12.2303 7.5502 12.3483 8.42188 12.6168C8.48667 12.7458 8.58643 12.8543 8.70994 12.9301C8.83346 13.0059 8.97584 13.0461 9.12109 13.0461C9.26635 13.0461 9.40873 13.0059 9.53225 12.9301C9.65576 12.8543 9.75552 12.7458 9.82031 12.6168C10.4333 12.4152 11.0731 12.3055 11.7188 12.2913V20.8163C11.7188 21.0218 11.6364 21.219 11.4899 21.3643C11.3434 21.5097 11.1447 21.5913 10.9375 21.5913C10.7303 21.5913 10.5316 21.5097 10.3851 21.3643C10.2386 21.219 10.1562 21.0218 10.1562 20.8163V20.0413C10.1562 19.8358 10.0739 19.6386 9.92743 19.4933C9.78091 19.348 9.5822 19.2663 9.375 19.2663C9.1678 19.2663 8.96909 19.348 8.82257 19.4933C8.67606 19.6386 8.59375 19.8358 8.59375 20.0413V20.8163C8.59375 21.4329 8.84068 22.0243 9.28022 22.4603C9.71976 22.8964 10.3159 23.1413 10.9375 23.1413C11.5591 23.1413 12.1552 22.8964 12.5948 22.4603C13.0343 22.0243 13.2812 21.4329 13.2812 20.8163V12.2913C13.9295 12.3048 14.572 12.4145 15.1875 12.6168C15.2523 12.7458 15.3521 12.8543 15.4756 12.9301C15.5991 13.0059 15.7415 13.0461 15.8867 13.0461C16.032 13.0461 16.1744 13.0059 16.2979 12.9301C16.4214 12.8543 16.5211 12.7458 16.5859 12.6168C17.4576 12.3483 18.3693 12.2303 19.2812 12.2681C20.1906 12.2306 21.0997 12.3486 21.9688 12.6168C22.0505 12.7673 22.1801 12.8867 22.3374 12.9565C22.4946 13.0263 22.6708 13.0426 22.8383 13.0028C23.0059 12.963 23.1555 12.8694 23.2639 12.7365C23.3723 12.6036 23.4333 12.4389 23.4375 12.2681C23.4375 7.37005 18.9453 3.3478 13.2812 3.0068ZM19.2734 10.7568C18.12 10.6983 16.9666 10.8723 15.8828 11.2683C14.8045 10.8593 13.6535 10.6721 12.5 10.7181C11.3491 10.6597 10.1983 10.8338 9.11719 11.2296C8.03343 10.8336 6.88 10.6595 5.72656 10.7181C4.9012 10.7044 4.0766 10.7745 3.26562 10.9273C3.63364 9.31708 4.53603 7.87607 5.82812 6.8353C7.70567 5.30329 10.0691 4.47969 12.5 4.5103C17.1172 4.5103 20.9688 7.2848 21.7344 10.9196C20.9231 10.7693 20.0985 10.7018 19.2734 10.7181V10.7568Z" fill="#151515"/>
                  </g>
                  <defs>
                  <clipPath id="clip0">
                  <rect width="25" height="31" fill="white"/>
                  </clipPath>
                  </defs>
                  </svg>
              </span>
          </div>
        <Radio value="No" onChange={(value, checked)=>NoInsurance(value)}>No, I will pay myself</Radio>
        <Radio value="Yes" onChange={(value, checked)=>HaveInsurance(value)}>Yes, I will use insurance</Radio>
        <Panel collapsible={InsurFields === true ? false : true}>
          <Container><SelectPicker placeholder={document.referrer === window.location.origin+"/quiz" ? ParseInsuranceInfo()[0] : ""} data={InsuranceCarriers} style={{ width: 224 }} /></Container>
          <Container><SelectPicker placeholder={document.referrer === window.location.origin+"/quiz" ? ParseInsuranceInfo()[4] : ""} data={InsurancePlans} style={{ width: 224 }} /></Container>
        </Panel>
        </RadioGroup>
      </FormGroup>
            
  </FlexboxGrid.Item>  
</FlexboxGrid>


<FlexboxGrid justify="left">
  <FlexboxGridItem>
    
    {/*  google autocomplete */}        
    <SearchZipCode />
        
  </FlexboxGridItem>  
</FlexboxGrid>



<FlexboxGrid justify="left">
  
    <FlexboxGrid.Item>
      <div className="side__nav-type-of-doctor">
        <span>Type of Doctor</span>
        <span>
          <svg width="28" height="35" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.2696 1.87198C23.9784 1.5805 23.5758 1.3999 23.1309 1.3999H20.4454C20.1483 1.3999 19.9084 1.6407 19.9084 1.93694V3.01102C19.9084 3.30782 20.1486 3.54806 20.4454 3.54806H22.5938V6.23354V7.71166C22.5938 9.00638 21.7614 10.1076 21.0886 11.1478C20.0307 12.7833 17.6378 12.7833 16.5797 11.1484C15.8836 10.0732 15.0744 9.05286 15.0744 7.71166V6.23354V3.54806H17.2229C17.52 3.54806 17.7599 3.30782 17.7599 3.01102V1.93694C17.7599 1.6407 17.5197 1.3999 17.2226 1.3999H14.5371C14.0922 1.3999 13.6896 1.5805 13.3978 1.87198C13.106 2.16346 12.9257 2.56638 12.9257 3.0113V6.23382V6.60202C12.9257 8.46514 13.4902 10.1992 14.4416 11.8011C16.137 14.6545 17.7599 15.6163 17.7151 17.167C17.6857 18.1615 17.7151 19.1586 17.7151 20.1546C17.7151 22.5234 15.787 24.4515 13.4182 24.4515H12.3884C10.0193 24.4515 8.09152 22.5234 8.09152 20.1546V16.2808C9.64412 15.8188 10.777 14.3827 10.777 12.6791C10.777 10.6029 9.09336 8.9193 7.01716 8.9193C4.9404 8.9193 3.25732 10.6029 3.25732 12.6791C3.25732 14.3827 4.38964 15.8188 5.9428 16.2808V20.1543C5.94364 23.7139 8.82876 26.5999 12.3887 26.5999H13.4185C16.9776 26.5999 19.8638 23.7139 19.8638 20.1546V18.4163C19.8638 17.5959 19.8412 16.0809 20.1996 15.3422C21.3935 14.3869 22.7506 13.3926 23.4666 11.9408C24.4788 10.3767 24.7423 8.46514 24.7423 6.6023V6.2341V3.0113C24.7423 2.56638 24.5614 2.16374 24.2696 1.87198ZM5.00368 12.6791C5.00368 11.5692 5.90752 10.6651 7.01772 10.6651C8.12764 10.6651 9.03176 11.5692 9.03176 12.6791C9.03176 13.7896 8.12764 14.6932 7.01772 14.6932C5.90724 14.6935 5.00368 13.7896 5.00368 12.6791Z" fill="#151515"/>
          </svg>
        </span>
      </div>
      <Container>
        <SelectPicker placeholder={'Dentist'}  data={TypeOfDoctor} style={{ width: 224 }} />
      </Container>
    </FlexboxGrid.Item>
             
</FlexboxGrid>

<FlexboxGrid justify="left">
  
    <FlexboxGrid.Item>
        <div className="sidenav__purpose">
          <span>Purpose</span>
            <span><svg width="27" height="34" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
            <path d="M24.4198 27.064C24.2535 27.1726 24.0514 27.2105 23.8574 27.1695C23.6635 27.1284 23.4936 27.0117 23.3848 26.8449L17.8798 18.4431L15.9898 19.8333C15.8611 19.9272 15.7062 19.9774 15.5473 19.9769C15.3884 19.9774 15.2335 19.9272 15.1048 19.8333L13.4998 18.6471L11.8948 19.8333C11.7663 19.9279 11.6114 19.9788 11.4523 19.9788C11.2932 19.9788 11.1382 19.9279 11.0098 19.8333L9.12729 18.4431L3.61479 26.86C3.54756 26.9629 3.45637 27.0476 3.34918 27.1069C3.24199 27.1661 3.12205 27.1981 2.99979 27.2C2.85234 27.2017 2.70807 27.1568 2.58729 27.0715C2.42166 26.9619 2.30581 26.7908 2.26506 26.5954C2.2243 26.4 2.26196 26.1964 2.36979 26.0289L12.8698 9.97331C12.9384 9.86831 13.032 9.78222 13.142 9.72285C13.252 9.66348 13.375 9.6327 13.4998 9.63331C13.6233 9.63395 13.7448 9.66533 13.8534 9.72464C13.962 9.78396 14.0544 9.86937 14.1223 9.97331L24.6223 26.0138C24.6776 26.0961 24.7162 26.1886 24.7359 26.2859C24.7557 26.3833 24.7561 26.4836 24.7373 26.5812C24.7185 26.6787 24.6808 26.7716 24.6263 26.8545C24.5718 26.9373 24.5016 27.0085 24.4198 27.064Z" fill="#151515"/>
            <path d="M19.4998 2.68199C19.5151 2.83611 19.483 2.99125 19.4079 3.12639C19.3328 3.26154 19.2182 3.37016 19.0798 3.43754L14.2498 5.80999V7.55532C14.2498 7.75571 14.1708 7.94788 14.0301 8.08958C13.8895 8.23127 13.6987 8.31087 13.4998 8.31087C13.3009 8.31087 13.1101 8.23127 12.9695 8.08958C12.8288 7.94788 12.7498 7.75571 12.7498 7.55532V0.755319C12.7462 0.712582 12.7462 0.669612 12.7498 0.626875C12.7462 0.581614 12.7462 0.536136 12.7498 0.490875C12.7933 0.432166 12.8437 0.378901 12.8998 0.332208C12.9196 0.295282 12.9422 0.259922 12.9673 0.22643C13.0018 0.196949 13.0395 0.171595 13.0798 0.150875C13.1148 0.116461 13.1554 0.0883496 13.1998 0.0677636H13.3198L13.4998 -0.000236407C13.5422 -0.00388226 13.5849 -0.00388226 13.6273 -0.000236407C13.6697 -0.00447849 13.7124 -0.00447849 13.7548 -0.000236407L19.0048 1.96421C19.1509 2.01744 19.2771 2.11509 19.3658 2.24368C19.4544 2.37226 19.5013 2.52542 19.4998 2.68199Z" fill="#151515"/>
            </g>
            <defs>
            <clipPath id="clip0">
            <rect width="27" height="34" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </span>
        </div>
      <Container>
        <SelectPicker placeholder={document.referrer === window.location.origin+"/quiz" ? ParsePurposeInfo() : ""}  data={Purpose} style={{ width: 224 }} />
      </Container>
    </FlexboxGrid.Item>
             
</FlexboxGrid>




             
{/* <FlexboxGrid justify="left">    
    
        <FlexboxGridItem>
                <ButtonToolbar>
                    <DropdownInsurance eventKey="1" title="More Filters" trigger="click" />
                </ButtonToolbar>
        </FlexboxGridItem>
      
</FlexboxGrid>       */}

              <PanelGroup accordion>
                {/* More filters (rating & availaility) */}
                <ButtonToolbar>
                    <dropdownMoreFilters eventKey="1" title="More Filters" trigger="click" />
                </ButtonToolbar>
              </PanelGroup>

              <FlexboxGrid justify="center">
                <FlexboxGridItem>
                    <Button classPrefix={'sidenav__btn-reset'}>Reset Filters</Button>
                </FlexboxGridItem>
              </FlexboxGrid>
                              
              
            </Sidenav.Body>
          </Sidenav>
        </div>
      );
    


      
    return (
      
      <div className="sidenav__wrapper">                        

          <Container>

              {/* instance object from App.js component */}
              <Sidebar>{instance}</Sidebar>

              {/* {console.log(props.surveyResult.map(entry => entry.split('|')))} */}
              
              {/* <button type="submit">{ParseInsuranceInfo().map(entry => entry.map(entry => entry[1])) + " " + ParseInsuranceInfo().map(entry => entry.map(entry => entry[4]))}</button> */}

              
              {/* {mapQuizResults('part1')} */}

    {/* <h1>{console.log(ParseInsuranceInfo().map(entry => entry[1]))}</h1>

    {console.log(ParseInsuranceInfo())} */}
              
                            
          </Container>


    {/* <h3>{console.log(ParsePurposeInfo())}</h3> */}
        </div>
      
    )
}
