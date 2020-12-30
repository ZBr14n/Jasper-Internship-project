import React from 'react'
import { Modal, Rate, Button } from 'rsuite'


export default function ReviewModal(props) {

    const [rating, setRating] = React.useState(0)
    const [review, setReview] = React.useState("")

    // const [textarea, setTextArea] = React.useState("")
    const handleOnChange = (event) => {
        setReview(event.target.value)
        // console.log(review)
    }

    
    // TODO: embed patient_id as variable to add reviews to a doctor.
    const addReview = (userRating, userReview) => {
        // since there will be null values in the array, we want to retrieve the value at index 0.
        const doctorID = props.DoctorID.flat().sort((a, b) => {
            return (a===null)-(b===null) || +(a>b)||-(a<b);
        });
        
        
        fetch('https://kuza36g6eb.execute-api.us-east-1.amazonaws.com/dev/office-office-doctor-utilities',{
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(  {"body":{"task":"add_doctor_review","patient_id":"1","doctor_id":`${doctorID[0]}`,"rating":`${userRating}`,"review":`${userReview}`}}  )
        }).then(res => res.json())
        .then(data => console.log(data))
        


        // console.log(props.DoctorID)
        // console.log(props.DoctorName)
        // console.log(props.DoctorID.flat().map(entry => entry)[index])
        console.log(doctorID[0])
        // console.log('addReview works!')
        props.setShow(false)        
    }

    return (
        <div>
            
            <Modal size={'sm'} show={props.show} onHide={()=>props.setShow(false)}>
                {/* <h1>test</h1> */}
                <Modal.Header>
                    <Modal.Title><h4>Leave a review for {props.DoctorName}</h4></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6>Tell us about your experience!</h6>
                    <p>Your review, along with your name and avatar, will be published on Dr. {props.DoctorName}'s directory page.</p>

                    <br />
                    <Rate value={rating} allowHalf={true} onChange={(value, event) => {setRating(value)}}  />
                    <br />
                    
                    <h6>Review</h6>
                    <textarea value={review} onChange={(event) => handleOnChange(event)}  rows="4" cols="50"></textarea>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>addReview(rating, review)} appearance="primary">
                    Ok
                    </Button>
                    <Button onClick={()=>props.setShow(false)} appearance="subtle">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
