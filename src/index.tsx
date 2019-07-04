import clsx from "clsx";
import * as React from "react";
import { render } from "react-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
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
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 50,
      paddingRight: 50
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
      borderRadius: 14
    },
    addMeButton: {
      cursor: "pointer",
      position: "absolute",
      top: 25,
      left: -50,
      transform: "rotate(-45deg)",
      width: 200,
      background: "#007bff",
      textAlign: "center",
      lineHeight: "50px",
      letterSpacing: 1,
      color: "#f0f0f0",
      textDecoration: "none",
      outline: "none",
      border: "none"
    },
    addMe: {
      display: "none",
      "&.hover": {
        display: "inline-block",
        position: "absolute",
        top: 25,
        left: 25
      }
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
      width: 200,
      height: 200,
      margin: "0 20px 20px 20px"
    },
    addOil: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 100,
      height: 100,
      display: "block",
      outline: "none",
      border: "none",
      animation: "$rotate-img2 1s 1 forwards",
      "&.hover": {
        animation: "$rotate-img1 1s 1 forwards"
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
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 10,
        "&:hover": {
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg id='squiggle-link' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:ev='http://www.w3.org/2001/xml-events' viewBox='0 0 20 4'%3E%3Cstyle type='text/css'%3E.squiggle{animation:shift .3s linear infinite;}@keyframes shift {from {transform:translateX(0);}to {transform:translateX(-20px);}}%3C/style%3E%3Cpath fill='none' stroke='%23009bff' stroke-width='1' class='squiggle' d='M0,3.5 c 5,0,5,-3,10,-3 s 5,3,10,3 c 5,0,5,-3,10,-3 s 5,3,10,3'/%3E%3C/svg%3E")`,
          textDecoration: "none",
          animation: "$social-links-loop1 10s infinite"
        }
      }
    },
    line1: {
      height: 1,
      backgroundColor: "#007bff",
      width: "100%",
      animation: "$line-loop1 2s 1",
      marginBottom: 5
    },
    "@keyframes rotate-img1": {
      "0%": {
        transform: "none"
      },
      "100%": {
        transform: "rotate(-90deg)"
      }
    },
    "@keyframes rotate-img2": {
      "0%": {
        transform: "rotate(-90deg)"
      },
      "100%": {
        transform: "none"
      }
    },
    "@keyframes line-loop1": {
      "0%": { width: 0 },
      "100%": { width: "100%" }
    },
    "@keyframes social-links-loop1": {
      "0%": { paddingLeft: 8, paddingRight: 8 },
      "23%": { paddingLeft: 16, paddingRight: 0 },
      "69%": { paddingLeft: 0, paddingRight: 16 },
      "92%": { paddingLeft: 8, paddingRight: 8 }
    },
    "@keyframes bg-loop1": {
      "0%": { opacity: 0.01 },
      "10%": { opacity: 0.01 },
      "50%": { opacity: 0.15 },
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
        {/* <a
          href="https://github.com/teamchong"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github-square" />
        </a> */}
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <button
        className={classes.addMeButton}
        type="button"
        onMouseEnter={handlePopoverOpen}
      >
        <i className="fas fa-address-card" /> add contact
      </button>
      <Card
        className={clsx(classes.addMe, classes.card, open ? "hover" : "")}
        raised={true}
        onMouseLeave={handlePopoverClose}
      >
        <CardHeader
          avatar={<i className="fas fa-qrcode" />}
          title="Scan QR code"
        />
        <CardMedia>
          <img
            src={vCardContent}
            alt="Scan QR code"
            className={classes.vCardQR}
          />
        </CardMedia>
        <CardActions>
          <Button
            size="small"
            color="primary"
            href="StevenChong.vcf"
            download="StevenChong.vcf"
          >
            OR DOWNLOAD HERE.
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

function App() {
  function handleAddOil(e: React.MouseEvent<HTMLElement>) {
    setIsAddOil(!e.currentTarget.classList.contains("hover"));
  }

  const classes = useStyles();
  const [isAddOil, setIsAddOil] = React.useState<Boolean | null>(null);

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
      <input
        type="image"
        className={clsx(classes.addOil, { hover: isAddOil })}
        onClick={handleAddOil}
        onMouseEnter={handleAddOil}
        onMouseOut={handleAddOil}
        src={addOil}
        alt="香港加油"
      />
      <div className={classes.bg} />
      <div className={classes.footer}>&copy; 2019 Steven Chong</div>
    </Box>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
