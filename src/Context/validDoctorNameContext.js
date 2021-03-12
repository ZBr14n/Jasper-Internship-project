import React from 'react'

// conditionally render Profile component if user searches by Doctor Name
export const DoctorNameContext = React.createContext(false)

// store the actual user input for the doctor search
export const DoctorNameValueContext = React.createContext("")