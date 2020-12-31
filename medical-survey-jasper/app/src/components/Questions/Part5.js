import React from 'react'
import {Link, useHistory} from 'react-router-dom'

import {Progress, Button,FlexboxGrid} from 'rsuite'
import { ProgressContext } from '../../Context/ProgressContext'

import "../../scss/part5.scss"


export default function Part5() {
    const [progress, setProgress] = React.useContext(ProgressContext)
    let history = useHistory();

    
    React.useEffect(() => {
        setProgress(16.66*5)        
    }, [])
    

    const handleUserSelect = (event) => {
        sessionStorage.setItem('part5', event.target.value)
        history.push("part6")
    }


    // once the user clicks Continue button, this will record user input into SessionStorage.
    // const handleContinue = () => {
    //     sessionStorage.setItem('part5', value)
    // }
    
    return (
        <div className="page">
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <FlexboxGrid justify="center">
                <h6 className={'part5-header'}>On a scale from "not important" to "very important," how would you rate the folowing factors?</h6>
            </FlexboxGrid>

            <br/>
            <br/>
            
                    <div id="form-wrapper">
                        <form method="GET">
                            
                            <div id="debt-amount-slider">
                                <input type="radio" onClick={handleUserSelect} name="debt-amount" id="1" value="1" required />
                                <label for="1" data-debt-amount="Not important"></label>

                                <input type="radio" onClick={handleUserSelect} name="debt-amount" id="2" value="2" required />
                                <label for="2" data-debt-amount=""></label>

                                <input type="radio" onClick={handleUserSelect} name="debt-amount" id="3" value="3" required />
                                <label for="3" data-debt-amount=""></label>

                                <input type="radio" onClick={handleUserSelect} name="debt-amount" id="4" value="4" required />
                                <label for="4" data-debt-amount=""></label>

                                <input type="radio" onClick={handleUserSelect} name="debt-amount" id="5" value="5" required />
                                <label for="5" data-debt-amount="Very important"></label>
                                
                                <div id="debt-amount-pos"></div>
                            </div>
                        </form>                        
                    </div>
  
            

            <br /><br /><br /><br />
            
            <FlexboxGrid justify="center">
            <Link to="part6">
                        <button type="submit" className={'skip-btn'}>Skip</button>
                    </Link>
                {/* <FlexboxGrid.Item>
                    <Link to="part6">
                        <Button appearance="primary" onClick={handleContinue}>Continue</Button>
                    </Link>
                </FlexboxGrid.Item> */}
            </FlexboxGrid>
        </div>
    )
}
