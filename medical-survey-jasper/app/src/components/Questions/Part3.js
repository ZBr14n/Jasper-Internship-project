import React from 'react'
import {Link} from 'react-router-dom'

import {Button, ButtonGroup, FlexboxGrid, Container } from 'rsuite'
import { ProgressContext } from '../../Context/ProgressContext'
import "../../scss/part3.scss"


export default function Part3() {
    const [progress, setProgress] = React.useContext(ProgressContext)
    const [userSelect, setUserSelect] = React.useState('A')
    const [value, setValue] = React.useState('')

    React.useEffect(() => {
        setProgress(16.66*3)        
    }, [])

    // once the user clicks Continue button, this will record user input into SessionStorage.
    const handleContinue = () => {
        sessionStorage.setItem('part3', value)
    }

    // allow the user to select only one response per question.
    const handleUserSelect = (name, value) => {        
        setUserSelect({[name]: value})        
    }

    // when user clicks button, set local state to their response
    const handleClick = (event) => {
        setValue(event.target.value)
    }

    return (
        <div className="page">
            <br/>
            <br/>
            <br/>
            <br/>
            <FlexboxGrid justify="center">            
                <FlexboxGrid.Item>
                    <div className="part3-header">Why would you like to see a dentist?</div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <br/>
            
            <FlexboxGrid justify="center">            
                <FlexboxGrid.Item>
                <ButtonGroup name="radioBTN" onClick={handleClick} onChange={value => {handleUserSelect('radioBTN',value)}} block={true} vertical size={'lg'}>
                    <Button classPrefix={'part3-btn'} value={'I need a routine checkup and cleaning'}>I need a routine checkup and cleaning</Button>
                    <small>Example: a semi-annual checkup</small>
                    <br/><br/>

                    <Button classPrefix={'part3-btn'} value={'I need to schedule a specific treatment'}>I need to schedule a specific treatment</Button>
                    <small>Example: a root canal, implant, or extraction</small>
                    <br/><br/>

                    <Button classPrefix={'part3-btn'}value={'I have to see a dentist ASAP for an urgent issue'}>I have to see a dentist ASAP for an urgent issue</Button>
                    <small>Example: bleeding, tooth pain, a chipped tooth</small>
                    <br/><br/>
                </ButtonGroup>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            

            
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={4}>
                    <Link to="part4">
                        <Button classPrefix={'btn-skip'}>Skip</Button>
                    </Link>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={4}>
                    <Link to="part4">
                        <Button classPrefix={'btn-continue'} onClick={handleContinue}>
                            
                            <svg width="137" height="22" viewBox="0 0 137 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.87" d="M6.1192 7.01562C5.04628 7.01562 4.20253 7.39583 3.58795 8.15625C2.97337 8.91667 2.66608 9.96615 2.66608 11.3047C2.66608 12.7057 2.96035 13.7656 3.54889 14.4844C4.14264 15.2031 4.99941 15.5625 6.1192 15.5625C6.60358 15.5625 7.07233 15.5156 7.52545 15.4219C7.97858 15.3229 8.44993 15.1979 8.93951 15.0469V16.6484C8.04368 16.987 7.02806 17.1562 5.89264 17.1562C4.22076 17.1562 2.93691 16.651 2.04108 15.6406C1.14524 14.625 0.697327 13.1745 0.697327 11.2891C0.697327 10.1016 0.913472 9.0625 1.34576 8.17188C1.78326 7.28125 2.41347 6.59896 3.23639 6.125C4.05931 5.65104 5.02545 5.41406 6.13483 5.41406C7.30149 5.41406 8.37962 5.65885 9.3692 6.14844L8.69733 7.70312C8.31191 7.52083 7.90306 7.36198 7.47076 7.22656C7.04368 7.08594 6.59316 7.01562 6.1192 7.01562ZM20.1192 12.6641C20.1192 14.0755 19.7572 15.1771 19.0333 15.9688C18.3093 16.7604 17.3015 17.1562 16.0098 17.1562C15.2025 17.1562 14.489 16.974 13.8692 16.6094C13.2494 16.2448 12.7728 15.7214 12.4395 15.0391C12.1062 14.3568 11.9395 13.5651 11.9395 12.6641C11.9395 11.263 12.2989 10.1693 13.0176 9.38281C13.7364 8.59635 14.7494 8.20312 16.0567 8.20312C17.3067 8.20312 18.2963 8.60677 19.0255 9.41406C19.7546 10.2161 20.1192 11.2995 20.1192 12.6641ZM13.8301 12.6641C13.8301 14.6589 14.5671 15.6562 16.0411 15.6562C17.4994 15.6562 18.2286 14.6589 18.2286 12.6641C18.2286 10.6901 17.4942 9.70312 16.0255 9.70312C15.2546 9.70312 14.6947 9.95833 14.3458 10.4688C14.002 10.9792 13.8301 11.7109 13.8301 12.6641ZM31.088 17H29.2442V11.6875C29.2442 11.0208 29.1088 10.5234 28.838 10.1953C28.5723 9.86719 28.1478 9.70312 27.5645 9.70312C26.7885 9.70312 26.2208 9.93229 25.8614 10.3906C25.502 10.849 25.3223 11.6172 25.3223 12.6953V17H23.4864V8.35938H24.9239L25.1817 9.49219H25.2755C25.5359 9.08073 25.9057 8.76302 26.3848 8.53906C26.864 8.3151 27.3952 8.20312 27.9786 8.20312C30.0515 8.20312 31.088 9.25781 31.088 11.3672V17ZM38.1114 15.6719C38.5593 15.6719 39.0072 15.6016 39.4551 15.4609V16.8438C39.252 16.9323 38.989 17.0052 38.6661 17.0625C38.3484 17.125 38.0176 17.1562 37.6739 17.1562C35.9343 17.1562 35.0645 16.2396 35.0645 14.4062V9.75H33.8848V8.9375L35.1505 8.26562L35.7755 6.4375H36.9083V8.35938H39.3692V9.75H36.9083V14.375C36.9083 14.8177 37.0176 15.1458 37.2364 15.3594C37.4603 15.5677 37.752 15.6719 38.1114 15.6719ZM44.2755 17H42.4395V8.35938H44.2755V17ZM42.3301 6.07031C42.3301 5.74219 42.4187 5.48958 42.5958 5.3125C42.7781 5.13542 43.0359 5.04688 43.3692 5.04688C43.6921 5.04688 43.9421 5.13542 44.1192 5.3125C44.3015 5.48958 44.3926 5.74219 44.3926 6.07031C44.3926 6.38281 44.3015 6.63021 44.1192 6.8125C43.9421 6.98958 43.6921 7.07812 43.3692 7.07812C43.0359 7.07812 42.7781 6.98958 42.5958 6.8125C42.4187 6.63021 42.3301 6.38281 42.3301 6.07031ZM55.7598 17H53.9161V11.6875C53.9161 11.0208 53.7807 10.5234 53.5098 10.1953C53.2442 9.86719 52.8197 9.70312 52.2364 9.70312C51.4603 9.70312 50.8926 9.93229 50.5333 10.3906C50.1739 10.849 49.9942 11.6172 49.9942 12.6953V17H48.1583V8.35938H49.5958L49.8536 9.49219H49.9473C50.2077 9.08073 50.5775 8.76302 51.0567 8.53906C51.5359 8.3151 52.0671 8.20312 52.6505 8.20312C54.7234 8.20312 55.7598 9.25781 55.7598 11.3672V17ZM65.6583 17L65.4005 15.8672H65.3067C65.0515 16.2682 64.6869 16.5833 64.213 16.8125C63.7442 17.0417 63.2077 17.1562 62.6036 17.1562C61.5567 17.1562 60.7755 16.8958 60.2598 16.375C59.7442 15.8542 59.4864 15.0651 59.4864 14.0078V8.35938H61.338V13.6875C61.338 14.349 61.4734 14.8464 61.7442 15.1797C62.015 15.5078 62.4395 15.6719 63.0176 15.6719C63.7885 15.6719 64.3536 15.4427 64.713 14.9844C65.0775 14.5208 65.2598 13.7474 65.2598 12.6641V8.35938H67.1036V17H65.6583ZM74.7442 17.1562C73.4005 17.1562 72.3484 16.7656 71.588 15.9844C70.8327 15.1979 70.4551 14.1172 70.4551 12.7422C70.4551 11.3307 70.8067 10.2214 71.5098 9.41406C72.213 8.60677 73.1791 8.20312 74.4083 8.20312C75.5489 8.20312 76.4499 8.54948 77.1114 9.24219C77.7728 9.9349 78.1036 10.888 78.1036 12.1016V13.0938H72.3458C72.3718 13.9323 72.5984 14.5781 73.0255 15.0312C73.4525 15.4792 74.0541 15.7031 74.8301 15.7031C75.3406 15.7031 75.8145 15.6562 76.252 15.5625C76.6947 15.4635 77.1687 15.3021 77.6739 15.0781V16.5703C77.226 16.7839 76.7728 16.9349 76.3145 17.0234C75.8562 17.112 75.3327 17.1562 74.7442 17.1562ZM74.4083 9.59375C73.8249 9.59375 73.3562 9.77865 73.002 10.1484C72.6531 10.5182 72.4447 11.0573 72.377 11.7656H76.2989C76.2885 11.0521 76.1166 10.513 75.7833 10.1484C75.4499 9.77865 74.9916 9.59375 74.4083 9.59375Z" fill="white"/>
<path d="M109 11H136.143M136.143 11L126.143 1M136.143 11L126.143 21" stroke="white" stroke-linecap="round"/>
</svg>

                        </Button>
                    </Link>
                </FlexboxGrid.Item>
            </FlexboxGrid>
           
        </div>
    )
}
