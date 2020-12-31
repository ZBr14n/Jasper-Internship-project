import React from 'react'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom'

import {Button, FlexboxGrid, InputPicker, Alert} from 'rsuite'
import { ProgressContext } from '../../Context/ProgressContext'
import dataCarriers from '../../Dummy Data/dummyCarriers'
import dataPlans from '../../Dummy Data/dummyPlans'
import "../../scss/part2.scss"

export default function Part2() {
    
    const [progress, setProgress] = React.useContext(ProgressContext)
    const [getValue, setValue] = React.useState(null)

    let history = useHistory();

    React.useEffect(()=>{
        setProgress(16.66*2)
    },[])
  

    const getCarrier = (value, item, event) => {
        // setValue(value)
        sessionStorage.setItem('Insurance Carrier', value)

    }
    const getPlan = (value, item, event) => {      
        sessionStorage.setItem('Insurance Plan', value)
        // history.push("part4")
    }
    // const handleContinue = () => {
    //     sessionStorage.setItem('part2', value)
    // }

    return (
        <div className="page-2">

            <br /><br />

            <FlexboxGrid justify="center">
                <FlexboxGrid.Item>
                    <h6>Choose your insurance carrier?</h6>

                    <InputPicker id="insur-carrier" onSelect={(value, item, event)=>{getCarrier(value,item,event)}} groupBy="role" placeholder={'Type Here...'} data={dataCarriers} style={{ width: 724 }} />

                    <h6>Choose your insurance plan</h6>

                    <InputPicker id="insur-plan" onSelect={(value, item, event)=>{getPlan(value,item,event)}} groupBy="role" placeholder={'Type Here...'} data={dataPlans} style={{ width: 724 }} />
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <br /><br />

            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={4}>
                    <Link to="part3">
                        <Button classPrefix={'part2-skip'}>Skip</Button>
                    </Link>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={3}>
                    <Link to="part3">
                        <Button classPrefix={'part2-continue'}>Continue</Button>
                    </Link>
                </FlexboxGrid.Item>
            </FlexboxGrid>
           
            
            
        </div>
    )
}
