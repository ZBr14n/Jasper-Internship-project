import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'

import './scss/App.scss';

import Part1 from './components/Questions/Part1'
import Part2 from './components/Questions/Part2'
import Part3 from './components/Questions/Part3'
import Part4 from './components/Questions/Part4'
import Part5 from './components/Questions/Part5'
import Part6 from './components/Questions/Part6'

import { ProgressContext } from './Context/ProgressContext';
import ProgressBar from './components/ProgressBar';


import { Link, Switch, Route, useLocation } from 'react-router-dom';
import { LocationContext } from './Context/LocationContext';
import {CSSTransition, TransitionGroup} from 'react-transition-group'

function App(props) {

  const items = props.settings.some_items || [];

  const [progress, setProgress] = React.useState(0)
  const [location, setLocation] = React.useState("")

    
  return (
    <div className="App">


      <ProgressContext.Provider value={[progress, setProgress]}>
        <LocationContext.Provider value={[location, setLocation]}>
            
            <ProgressBar />

            <Route render={({location})=>(
                <TransitionGroup>
                      <CSSTransition key={location.key} timeout={300} classNames="fade">
                          <Switch location={location}>

                            <Route exact path="/survey/">
                              <Part1 />          
                            </Route>
                            <Route path="/survey/part2">
                              <Part2 />
                            </Route>
                            <Route path="/survey/part3">
                              <Part3 />
                            </Route>

                            <Route path="/survey/part4">
                              <Part4 />
                            </Route>
                            <Route path="/survey/part5">
                              <Part5 />
                            </Route>
                            <Route path="/survey/part6">
                              <Part6 />
                            </Route>
                            
                          </Switch>
                      </CSSTransition>
                  </TransitionGroup>
            )} />
                    
        </LocationContext.Provider>
      </ProgressContext.Provider>
      
         
    </div>
  );
}

export default App;
