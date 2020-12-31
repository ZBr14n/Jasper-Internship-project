import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss"

import {BrowserRouter as Router} from 'react-router-dom'
import "./scss/index.scss";
import App from "./App";
import Header_Nav from "./components/Header";
import Footer_Nav from "./components/Footer";


const rootEl = document.getElementById("md-react-app");
if (rootEl) {
  const settings = JSON.parse( rootEl.getAttribute( 'data-default-settings' ) );
  ReactDOM.render(
    <React.StrictMode>


      <Router>

          <Header_Nav />            
          
          <App settings={settings} />
          
          {/* <Footer_Nav /> */}
          
      </Router>

    </React.StrictMode>,
    rootEl
  );
}
