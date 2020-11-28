import React, { useState, useRef } from "react";
import Base from "./base";
import Axios from "axios";
import { TextField, Button, Typography } from "@material-ui/core";

const styles = {
  input: {
    marginTop: 40,
    marginBottom: 5,
  },
  button: {
    marginTop: 30,
    paddingBottom: 20,
    float: "right",
    marginLeft: 5,
  },
};

const CUSTOM_WARNING_TEXT =
  "This url ending has been used, please choose another one";
const INVALID_URL_WARNING_TEXT = "Please input a valid url";
const URL_PATH = "url/";

function App() {
  const [originUrl, setOriginUrl] = useState(null);
  const [brandedUrl, setBrandedUrl] = useState(null);

  const [shortUrl, setShortUrl] = useState(null);

  const [customWarning, setCustomWarning] = useState(null);
  const customWarningRef = useRef(customWarning);
  customWarningRef.current = customWarning;

  const [originWarning, setOriginWarning] = useState(null);

  function onOriginValueChange(value) {
    setOriginUrl(value);
    setShortUrl(null);
    setOriginWarning(null);
  }

  function onCustomValueChange(value) {
    if (value != null && value.length > 0 && value.trim()) {
      setBrandedUrl(value);
    } else {
      setBrandedUrl(null);
    }
    setShortUrl(null);
    setCustomWarning(null);
  }

  function validateOriginUrl() {
    try {
      return Boolean(new URL(originUrl));
    } catch (e) {
      setOriginWarning(INVALID_URL_WARNING_TEXT);
      return false;
    }
  }

  function onButtonClick() {
    if (!validateOriginUrl()) {
      return;
    }

    Axios.get(
      "https://zhenyan-wang-a3-backend.herokuapp.com/api/ifExist/" + brandedUrl
    ).then((res) => {
      if (brandedUrl != null && res.data) {
        setCustomWarning(CUSTOM_WARNING_TEXT);
      } else {
        Axios.post("https://zhenyan-wang-a3-backend.herokuapp.com/api", {
          originUrl: originUrl,
          shortUrl: brandedUrl,
        })
          .then((response) => {
            setShortUrl(response.data.shortUrl);
          })
          .catch((error) => console.log(error));
      }
    });
    return;
  }

  return (
    <Base title="Home Page">
      <form>
        <TextField
          error={originWarning != null}
          onChange={(e) => onOriginValueChange(String(e.target.value), true)}
          id="origin url input"
          label="Origin Url"
          helperText={originWarning}
          fullWidth={true}
          style={styles.input}
        />
        <TextField
          error={customWarning != null}
          onChange={(e) => onCustomValueChange(String(e.target.value), false)}
          id="height input"
          label="Custom Url Ending"
          helperText={customWarning}
          fullWidth={true}
          style={styles.input}
        />
        {shortUrl ? (
          <Typography variant="subtitle2">
            Shortend Link is {window.location.href + URL_PATH + shortUrl}
          </Typography>
        ) : null}
        <div style={styles.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onButtonClick()}
          >
            Get Short Url!
          </Button>
        </div>
      </form>
    </Base>
  );
}

export default App;
