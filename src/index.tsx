import clsx from "clsx";
import * as React from "react";
import { render } from "react-dom";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const bg = require("./images/hongkong.jpg");
const addOil = require("./images/hkaddoil.png");
const vCardContent =
  "data:image/png;base64,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";
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      color: "#000",
      fontFamily: "Verdana, Geneva, sans-serif",
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      paddingTop: "50px",
      paddingBottom: "50px",
      paddingLeft: "50px",
      paddingRight: "50px"
    },
    popover: {
      border: "1px solid #000",
      boxShadow:
        "0px 1px 13px 0px rgba(0,0,0,0.2), 0px 1px 11px 0px rgba(0,0,0,0.14), 0px 2px 11px -1px rgba(0,0,0,0.12)"
    },
    myCard: {
      backgroundColor: "transparent",
      boxShadow:
        "0px 1px 13px 0px rgba(0,0,0,0.2), 0px 1px 11px 0px rgba(0,0,0,0.14), 0px 2px 11px -1px rgba(0,0,0,0.12)",
      borderRadius: "14px"
    },
    addMe: {
      position: "absolute",
      top: "25px",
      left: "-50px",
      transform: "rotate(-45deg)",
      width: "200px",
      background: "#007bff",
      textAlign: "center",
      lineHeight: "50px",
      letterSpacing: 1,
      color: "#f0f0f0",
      textDecoration: "none"
    },
    addMeQr: {
      display: "inline-block",
      padding: "30px"
    },
    myName: {
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
    [theme.breakpoints.up("xl")]: {
      backgroundSize: "150vw auto"
    },
    vCardQR: {
      width: "200px",
      height: "200px"
    },
    addOil: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100px",
      height: "100px",
      display: "block",
      "& img": {
        width: "100%"
      },
      "&.hover img": {
        animation: "$rotate-img 1s 1 forwards"
      },
      zIndex: 1
    },
    footer: {
      position: "absolute",
      color: "#666",
      bottom: "0.5em",
      right: "0.5em",
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
        width: "100px",
        height: "100px",
        transform: "none"
      },
      "100%": {
        width: "500px",
        height: "500px",
        transform: "rotate(-90deg) translate(300px, 0)"
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
      "50%": { opacity: 0.2 },
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

function AboutMe({ classes }: { classes: Record<string, string> }) {
  return (
    <CardContent>
      <Typography variant="h3" component="h3" className={classes.myName}>
        Steven Chong
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        - Fintech | Salesforce | Hong Kong
      </Typography>
      <p className="aboutme">Proud father of my daughters.</p>
      <p className="aboutme">Experienced software development professional.</p>
    </CardContent>
  );
}

function SocialBar({ classes }: { classes: Record<string, string> }) {
  return (
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
        <a href="skype:hk90388912" className={classes.socialLinks}>
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
  );
}

function AddMe({ classes }: { classes: Record<string, string> }) {
  function handlePopoverOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorEl(null);
  }

  const [anchorEl, setAnchorEl] = React.useState(null as HTMLElement);
  const open = Boolean(anchorEl);

  return (
    <a
      href="StevenChong.vcf"
      download="StevenChong.vcf"
      className={classes.addMe}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <i className="fas fa-address-card" /> Add me
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <a
          href="StevenChong.vcf"
          download="StevenChong.vcf"
          className={classes.addMeQr}
        >
          <img
            src={vCardContent}
            alt="ADD ME TO YOUR CONTACTS"
            className={classes.vCardQR}
          />
        </a>
      </Popover>
    </a>
  );
}

function App() {
  function handleAddOil(e: React.MouseEvent<HTMLAnchorElement>) {
    setIsAddOil(!e.currentTarget.classList.contains("hover"));
  }

  const classes = useStyles();
  const [isAddOil, setIsAddOil] = React.useState(null);

  return (
    <Box
      className={classes.root}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card className={clsx(classes.card, classes.myCard)}>
        <AboutMe classes={classes} />
        <SocialBar classes={classes} />
      </Card>

      <AddMe classes={classes} />
      <a
        className={clsx(classes.addOil, { hover: isAddOil })}
        href="#"
        onMouseEnter={handleAddOil}
        onMouseOut={handleAddOil}
      >
        <img src={addOil} alt="香港加油" />
      </a>
      <div className={classes.bg} />
      <div className={classes.footer}>&copy; 2019 Steven Chong</div>
    </Box>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
