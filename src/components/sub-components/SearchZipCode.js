import React from 'react'
import {InputPicker, InputGroup, AutoComplete, Icon} from 'rsuite'
import { ZipCodeContext, ZipCodeValueContext } from '../../Context/validZipCodeContext'

export default function SearchZipCode() {

    const [zipCodeContext, setZipCodeContext] = React.useContext(ZipCodeContext)
    const [zipCodeValueContext, setZipCodeValueContext] = React.useContext(ZipCodeValueContext)
    
    // use AWS API call to 'get_all_offices' function, 

    const [officeLocation, setOfficeLocation] = React.useState([])
    const refInput = React.useRef(null)
    

    const styles = {
        width: 300,
        marginBottom: 10
    };

    const handleZipCodeInput = () => {        
        setZipCodeValueContext(refInput.current.state.value)
    }

   React.useEffect(() => {
       
        fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/office-office-doctor-utilities',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(  {"body":{"task":"get_doctor_for_directory"}}  )
        }).then((res) => res.json())                
            .then((data) => {
                // console.log(data)
            setOfficeLocation(location => [...location, data.body.map(entry => entry.zipcode)])
        })
   }, [])

   const UniqueOfficeLocationSet = new Set(officeLocation[0])

    return (
        <div>
            
            <InputGroup inside style={styles}>
                <InputGroup.Button onClick={handleZipCodeInput}>
                    <Icon icon="search" size="lg" />
                </InputGroup.Button>


                <AutoComplete ref={refInput} placeholder={'Search by Zip Code'} data={Array.from(UniqueOfficeLocationSet)} />


                <InputGroup.Button>
                    <Icon icon="map-marker" size="lg" />
                </InputGroup.Button>
            </InputGroup>

            {/* {
                officeLocation.map((entry, key) => (
                    entry.body.map((item) => [item.zipcode])
                ))
            } */}



            {/* officeLocation.map((entry,key) => entry.body[key].zipcode) */}
            {/* // <InputPicker data={officeLocation} style={{ width: 224 }} /> */}

        </div>
    )
}
