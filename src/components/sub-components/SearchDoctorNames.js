import React from 'react'
import {InputGroup, AutoComplete, Icon} from 'rsuite'
import { DoctorNameContext, DoctorNameValueContext } from '../../Context/validDoctorNameContext'

export default function SearchDoctorNames() {

    const [doctorNameContext, setDoctorNameContext] = React.useContext(DoctorNameContext)
    const [doctorNameValueContext, setDoctorNameValueContext] = React.useContext(DoctorNameValueContext)

    // store info about Offices
    // const [offices, setOffices] = React.useState([])

    // store all info for individual doctor for each offices
    const [officeDoctor, setOfficeDoctor] = React.useState([])

    // const [zipCodeValueContext, setZipCodeValueContext] = React.useContext(ZipCodeValueContext)

    const [doctorName, setDoctorName] = React.useState([])
    const refInput = React.useRef(null)

    const styles = {
        width: 300,
        marginBottom: 10
    };

    
    React.useEffect(() => {
        fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/office-office-doctor-utilities',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(  {"body":{"task":"get_doctor_for_directory"}}  )
        }).then((res) => res.json())
            .then((data) => {
                // console.log(data.body.map(entry => entry.first_name + " " + entry.last_name))
                setDoctorName(profile => [...profile, data.body.map(entry => entry.first_name + " " + entry.last_name)])
        })        
    },[])

    const handleDoctorNameInput = () => {
        setDoctorNameValueContext(refInput.current.state.value)
    }


    const UniqueDoctorSet = new Set(doctorName[0])

    
    return (
        <div>

            <InputGroup inside style={styles}>
                <InputGroup.Button onClick={handleDoctorNameInput}>
                    <Icon icon="search" size="lg" />
                </InputGroup.Button>


                <AutoComplete ref={refInput} placeholder={`Search by Doctor's name`} data={Array.from(UniqueDoctorSet)} />

            </InputGroup>
            
        </div>
    )
}
