import React from 'react'

// conditionally render Profile component if user searches by zip code
export const ZipCodeContext = React.createContext(false)

// store the actual user input for the zip code
export const ZipCodeValueContext = React.createContext("")