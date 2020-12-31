import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import {Panel, Progress, Button,ButtonToolbar, ButtonGroup, Header, Content, Footer, FlexboxGrid, Container} from 'rsuite'
import { ProgressContext } from '../../Context/ProgressContext'
import "../../scss/part1.scss"

export default function Part1() {
    const [progress, setProgress] = React.useContext(ProgressContext)
    const [userSelect, setUserSelect] = React.useState('A')
    const [value, setValue] = React.useState('')


    React.useEffect(() => {
        setProgress(16.66)
    }, [])
    

    // once the user clicks Continue button, this will record user input into SessionStorage.
    const handleContinue = () => {
        sessionStorage.setItem('part1',value)

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

<br /><br /><br /><br /><br />
    
    <FlexboxGrid justify="center">
        <div className="part1-content-wrapper">
        <div className="part1-header">Do you have dental insurance?</div>
        
        <ButtonGroup classPrefix={'part1-btn-group'} name="radioBTN" onClick={handleClick} onChange={value => {handleUserSelect('radioBTN',value)}} block={true} vertical size={'lg'}>
            <Button value={'Yes'} classPrefix={'btn-yes'}>Yes</Button>
            <br />
            <Button value={'No'} classPrefix={'btn-no'}>No</Button>
        </ButtonGroup>
        </div>
    </FlexboxGrid>

            <br /><br /><br /><br /><br />
            <br /><br /><br /><br />

      <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={4}>
                    <Link to="part2">
                    <Button classPrefix={'btn-skip'} loading={true}>Skip</Button>
                    </Link>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={3}>
                <Link to={value === 'No' ? "part3" : "part2"}>
                            <Button classPrefix={'btn-continue'} onClick={handleContinue}>
                            Continue
                            <svg width="29" height="22" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 11H28.1429M28.1429 11L18.1429 1M28.1429 11L18.1429 21" stroke="white" stroke-linecap="round"/>
</svg>

                            </Button>
                        </Link>
                </FlexboxGrid.Item>
            </FlexboxGrid>      
       

            {/* <Button appearance="default" loading={true}>Default</Button>
            <ButtonToolbar>
    <Button appearance="default" loading={false}>Default</Button>
    </ButtonToolbar> */}
        
        </div>
        
    )
}
