import * as React from "react";
import { render } from "react-dom";

import "./styles.scss";
import bg from "./images/hongkong.jpg";

const BgStyle: React.CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#000",
  backgroundImage: `url(${bg})`,
  backgroundRepeat: "no-repeat",
  opacity: 0.1,
  backgroundPosition: "-10px -10px",
  animation: "bg-loop1 10s infinite, bg-loop2 60s infinite"
};

function App() {
  return (
    <div className="App">
      <blockquote className="blockquote">
        <h1 className="myname">Steven Chong</h1>
        <footer className="blockquote-footer">
          Fintech | Salesforce | Asia Pacific | United Kingdom
        </footer>
      </blockquote>
      <p className="aboutme">
        Experienced software development professional who is passionate about
        the intersection of technology and innovative solutions in meeting
        business needs.
      </p>
      <p className="aboutme">
        I am a self-starter who continuously strives to make the best use of
        technology to create value for the business.
      </p>
      <p className="aboutme">
        I enjoy new challenges that will keep me fired up to go to work every
        morning. When given a choice, one should pursue a career that positively
        impacts one's life and the people around them.
      </p>
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
      </div>
      <div style={BgStyle} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
