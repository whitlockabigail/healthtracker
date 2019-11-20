import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import Radio from "@material-ui/core/Radio";
import DissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import VeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import VerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import { Line } from "react-chartjs-2";
var unirest = require("unirest");
var moment = require("moment");

function Charts(props) {
  const [temp_array, setTempArray] = useState([]);
  const [sleep_array, setSleepArray] = useState([]);
  const [happiness_array, setHappinessArray] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.uid)
      .collection("surveys")
      .onSnapshot(snapshot => {
        const temp_array = [];
        const sleep_array = [];
        const happiness_array = [];

        snapshot.forEach(s => {
          const data = s.data();
          const temp_object = { x: data.date, y: data.temp };
          temp_array.push(temp_object);
          const sleep_object = { x: data.date, y: data.sleepHours };
          sleep_array.push(sleep_object);
          const happiness_object = { x: data.date, y: data.happiness };
          happiness_array.push(happiness_object);
        });

        setHappinessArray(happiness_array);
        setTempArray(temp_array);
        setSleepArray(sleep_array);
      });

    return unsubscribe;
  }, [props.uid]);

  const data = {
    datasets: [
      {
        label: "Happiness",
        data: happiness_array,
        backgroundColor: "transparent",
        borderColor: "red",
        yAxisID: "y-axis-2"
      },
      {
        label: "Sleep",
        data: sleep_array,
        backgroundColor: "transparent",
        borderColor: "blue",
        yAxisID: "y-axis-2"
      },
      {
        label: "Temperature",
        data: temp_array,
        backgroundColor: "transparent",
        borderColor: "green",
        yAxisID: "y-axis-1"
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          id: "y-axis-1"
        },
        {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "right",
          id: "y-axis-2"
          // grid line settings
        }
      ],
      xAxes: [
        {
          type: "time",
          time: {
            unit: "month"
          }
        }
      ]
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40
      }}
    >
      <Paper style={{ width: 500 }}>
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <Typography>Health Stats Over Time</Typography>
        </div>
        <Line data={data} options={options} />
      </Paper>
    </div>
  );
}

function Survey(props) {
  const [happiness, setHappiness] = useState(4);
  const [sleepHours, setSleepHours] = useState(8);
  const [temp, setTemp] = useState(70);
  const [lon, setLon] = useState(-111);
  const [lat, setLat] = useState(44);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    var req = unirest(
      "GET",
      "https://community-open-weather-map.p.rapidapi.com/weather"
    );

    req.query({
      lat: lat,
      lon: lon,
      units: "imperial"
    });

    req.headers({
      "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      "x-rapidapi-key": "2ab76a46c3msh95a7e9a72dc4326p1f1d13jsna9d018bfce1d"
    });

    req.end(function(res) {
      if (res.error) throw new Error(res.error);
      setTemp(res.body.main.temp);
    });
  }, [lat, lon]);

  const handleSave = () => {
    let today = moment().format("YYYY-MM-DD HH:mm");
    db.collection("users")
      .doc(props.uid)
      .collection("surveys")
      .add({
        temp: temp,
        happiness: happiness,
        sleepHours: sleepHours,
        date: today
      })
      .then(() => {
        props.push("/app/charts/");
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper
        style={{ marginTop: 30, padding: 20, maxWidth: 400, width: "100%" }}
      >
        <Typography>How many hours did you sleep last night?</Typography>
        <TextField
          fullWidth
          value={sleepHours}
          onChange={e => {
            setSleepHours(e.target.value);
          }}
        />
        <Typography style={{ marginTop: 30 }}>
          How happy do you feel today?
        </Typography>
        <div>
          <Radio
            icon={<VeryDissatisfiedIcon />}
            checkedIcon={<VeryDissatisfiedIcon />}
            checked={happiness === 1}
            onChange={() => {
              setHappiness(1);
            }}
          />
          <Radio
            icon={<DissatisfiedIcon />}
            checkedIcon={<DissatisfiedIcon />}
            checked={happiness === 2}
            onChange={() => {
              setHappiness(2);
            }}
          />
          <Radio
            icon={<SatisfiedIcon />}
            checkedIcon={<SatisfiedIcon />}
            checked={happiness === 3}
            onChange={() => {
              setHappiness(3);
            }}
          />
          <Radio
            icon={<VerySatisfiedIcon />}
            checkedIcon={<VerySatisfiedIcon />}
            checked={happiness === 4}
            onChange={() => {
              setHappiness(4);
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          onClick={handleSave}
        >
          Save
        </Button>
      </Paper>
    </div>
  );
}

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            Health Tracker App
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List>
          <ListItem button to="/app/" component={Link}>
            <ListItemText primary="Take Survey" />
          </ListItem>
          <ListItem button to="/app/charts" component={Link}>
            <ListItemText primary="Chart" />
          </ListItem>
        </List>
      </Drawer>
      <Route
        path="/app/charts"
        render={props => {
          return <Charts uid={user.uid} />;
        }}
      />
      <Route
        exact
        path="/app/"
        render={props => {
          return <Survey uid={user.uid} push={props.history.push} />;
        }}
      />
    </div>
  );
}
