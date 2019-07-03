import clsx from "clsx";
import * as React from "react";
import { render } from "react-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const bg = require("./images/hongkong.jpg");
const addOil = require("./images/hkaddoil.png");
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      color: "#000",
      fontFamily: "sans-serif",
      padding: "1em",
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    icon: {
      margin: theme.spacing(2)
    },
    mycard: {
      backgroundColor: "transparent",
      boxShadow:
        "0px 1px 13px 0px rgba(0,0,0,0.2), 0px 1px 11px 0px rgba(0,0,0,0.14), 0px 2px 11px -1px rgba(0,0,0,0.12)",
      borderRadius: "14px",
      marginBottom: "100px"
    },
    myname: {
      textShadow: "2px 2px rgba(60, 60, 60, 0.2)"
    },
    bg: {
      animation: "$bg-loop1 5s infinite, $bg-loop2 60s infinite",
      bottom: 0,
      backgroundColor: "#fff",
      backgroundImage: `url(${bg})`,
      backgroundPosition: "100% 100%",
      backgroundRepeat: "no-repeat",
      left: 0,
      opacity: 0.01,
      pointerEvents: "none",
      position: "fixed",
      right: 0,
      top: 0,
      zIndex: -3
    },
    addme: {
      width: "90%",
      margin: "0 auto"
    },
    [theme.breakpoints.up("xl")]: {
      backgroundSize: "150vw auto"
    },
    addOil: {
      position: "fixed",
      bottom: 0,
      right: 0,
      width: "100px",
      height: "100px",
      display: "block",
      "&:hover img": {
        animation: "$rotate-img 1s 1 forwards"
      }
    },
    footer: {
      position: "absolute",
      color: "#666",
      bottom: "0.5em",
      left: "0.5em",
      fontSize: "0.5em"
    },
    socialLinks: {
      display: "flex",
      justifyContent: "space-around",
      "& a": {
        fontSize: "2.5em",
        color: "#007bff",
        textDecoration: "none",
        backgroundPosition: "bottom",
        backgroundRepeat: "repeat-x",
        backgroundSize: "50%",
        borderBottom: 0,
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "10px",
        "&:hover": {
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg id='squiggle-link' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:ev='http://www.w3.org/2001/xml-events' viewBox='0 0 20 4'%3E%3Cstyle type='text/css'%3E.squiggle{animation:shift .3s linear infinite;}@keyframes shift {from {transform:translateX(0);}to {transform:translateX(-20px);}}%3C/style%3E%3Cpath fill='none' stroke='%23009bff' stroke-width='1' class='squiggle' d='M0,3.5 c 5,0,5,-3,10,-3 s 5,3,10,3 c 5,0,5,-3,10,-3 s 5,3,10,3'/%3E%3C/svg%3E")`,
          textDecoration: "none",
          animation: "$social-links-loop1 10s infinite"
        }
      }
    },
    line1: {
      height: "1px",
      backgroundColor: "#007bff",
      width: "100%",
      animation: "$line-loop1 2s 1",
      marginBottom: "5px"
    },
    "@keyframes rotate-img": {
      "0%": {
        transform: "none"
      },
      "100%": {
        transform: "rotate(-90deg)"
      }
    },
    "@keyframes line-loop1": {
      "0%": { width: 0 },
      "100%": { width: "100%" }
    },
    "@keyframes social-links-loop1": {
      "0%": { paddingLeft: "8px", paddingRight: "8px" },
      "23%": { paddingLeft: "16px", paddingRight: 0 },
      "69%": { paddingLeft: 0, paddingRight: "16px" },
      "92%": { paddingLeft: "8px", paddingRight: "8px" }
    },
    "@keyframes bg-loop1": {
      "0%": { opacity: 0.01 },
      "10%": { opacity: 0.01 },
      "50%": { opacity: 0.1 },
      "90%": { opacity: 0.01 },
      "100%": { opacity: 0.01 }
    },
    "@keyframes bg-loop2": {
      "0%": { backgroundPosition: "100% 100%" },
      "50%": { backgroundPosition: "0% 0%" },
      "100%": { backgroundPosition: "100% 100%" }
    }
  })
);

function App() {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card className={clsx(classes.card, classes.mycard)}>
        <CardContent>
          <Typography variant="h3" component="h3" className={classes.myname}>
            Steven Chong
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            - Fintech | Salesforce | Hong Kong
          </Typography>
          <p className="aboutme">Proud father of my daughters.</p>
          <p className="aboutme">
            Experienced software development professional.
          </p>
        </CardContent>
        <CardActions>
          <Button
            fullWidth={true}
            href="StevenChong.vcf"
            download="StevenChong.vcf"
            className={classes.addme}
            variant="contained"
            color="primary"
          >
            ADD ME TO YOUR CONTACTS
          </Button>
        </CardActions>
        <CardContent>
          <div className={classes.line1} />
          <div className={classes.socialLinks}>
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
            <a href="skype:hk90388912?chat" className={classes.socialLinks}>
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
        </CardContent>
      </Card>
      <a href="#top" className={classes.addOil}>
        <img src={addOil} alt="香港加油" />
      </a>
      <div className={classes.bg} />
      <div className={classes.footer}>&copy; 2019 Steven Chong</div>
    </Box>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
