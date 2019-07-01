import * as React from "react";
import { useEffect, useState } from "react";
import { render } from "react-dom";

import axios from "axios";

import "./styles.scss";
import bg from "./images/hongkong.jpg";

const BgStyle: React.CSSProperties = {
  backgroundImage: `url(${bg})`
};

const useForceUpdate = () => useState()[1];

function App() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // Make a request
    axios
      .get("/.netlify/functions/test")
      .then(function(response) {
        // handle success
        console.log(response);
        forceUpdate(null);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
        forceUpdate(null);
      });
  });

  return (
    <div className="App">
      <blockquote className="blockquote">
        <h1 className="myname">Steven Chong</h1>
        <footer className="blockquote-footer">
          Fintech | Salesforce | Hong Kong
        </footer>
      </blockquote>
      <p className="aboutme">Proud father of my daughters.</p>
      <p className="aboutme">
        Experienced software development professional who is passionate about
        the intersection of technology and innovative solutions in meeting
        business needs.
      </p>
      <div className="line1" />
      <div className="social-links">
        <a
          href="https://facebook.com/chong1222"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-facebook-square" />
        </a>
        <a
          href="https://github.com/teamchong"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github-square" />
        </a>
        <a
          href="https://linkedin.com/in/teamchong"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin" />
        </a>
        <a
          href="https://wa.me/85290388912"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp-square" />
        </a>
        <a href="skype:hk90388912?chat">
          <i className="fab fa-skype" />
        </a>
        <a
          href={`mailto:${encodeURIComponent(
            "Steven Chong"
          )}<steven@teamchong.com>?subject=${encodeURIComponent(
            "[TeamChong.com] New Message"
          )}`}
        >
          <i className="fas fa-envelope-square" />
        </a>
      </div>
      <div className="footer">&copy; 2019 Steven Chong</div>
      <div className="bg" style={BgStyle} />
    </div>
  );
}

const rootElement = document.getElementById("root");
const AppMemo = React.memo(App);
render(<AppMemo />, rootElement);
