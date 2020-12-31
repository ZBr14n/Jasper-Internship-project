import React from 'react'
import {Progress, FlexboxGrid, Button} from 'rsuite'
import {useHistory, Link} from 'react-router-dom'

import { ProgressContext, ProgressURL } from '../Context/ProgressContext'
import "../scss/ProgressBar.scss"

export default function ProgressBar() {

    const {Line} = Progress
    
    const [progress, setProgress] = React.useContext(ProgressContext)
        
    return (
        <div>

            <FlexboxGrid justify="center">                
                <FlexboxGrid.Item>
                    <Line percent={progress} showInfo={false} strokeColor={'#037971'} status={null} />

                </FlexboxGrid.Item>
            </FlexboxGrid>


        </div>
    )
}
