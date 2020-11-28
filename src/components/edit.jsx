import React, { useState, useEffect } from "react";
import Base from "./base";
import Axios from "axios";
import { TextField, Button, Typography, ButtonGroup } from "@material-ui/core";
import { useParams } from "react-router-dom";

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

const INVALID_URL_WARNING_TEXT = "Please input a valid url";

function Edit() {
  const params = useParams();
  const urlEnd = params.urlEnd;

  const [originUrl, setOriginUrl] = useState(null);
  const [shortUrl, setShortUrl] = useState(null);
  const [finishMsg, setFinishMsg] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [urlWarning, setUrlWarning] = useState(null);

  useEffect(() => {
    Axios.get(
      "https://zhenyan-wang-a3-backend.herokuapp.com/api/find/" + urlEnd
    ).then((res) => {
      if (res.data.originUrl != null) {
        console.log(res.data.originUrl);
        setOriginUrl(res.data.originUrl);
        setShortUrl(res.data.shortUrl);
      }
    });
  }, []);

  function onValueChange(value) {
    setNewUrl(value);
    setUrlWarning(null);
  }

  function validateUrl() {
    try {
      return Boolean(new URL(newUrl));
    } catch (e) {
      setUrlWarning(INVALID_URL_WARNING_TEXT);
      return false;
    }
  }

  function onSubmitClick() {
    if (!validateUrl()) {
      return;
    }
    console.log(newUrl);
    Axios.put(
      "https://zhenyan-wang-a3-backend.herokuapp.com/api/put/" + urlEnd,
      { originUrl: newUrl }
    ).then((response) => {
      setOriginUrl(response.data.originUrl);
      setFinishMsg(
        "Update Success, the new origin url is " + response.data.originUrl
      );
    });
  }

  function onDeleteClick() {
    Axios.delete(
      "https://zhenyan-wang-a3-backend.herokuapp.com/api/delete/" + urlEnd
    ).then(setFinishMsg("The entry has been deleted"));
  }

  return originUrl && shortUrl ? (
    finishMsg === null ? (
      <Base title="Edit Page">
        <Typography variant="subtitle1" style={styles.input}>
          The original URL is {originUrl}
        </Typography>
        <Typography variant="subtitle1" style={styles.input}>
          The short URL ending is {shortUrl} (cannot be modified)
        </Typography>
        <form>
          <TextField
            error={urlWarning != null}
            onChange={(e) => onValueChange(String(e.target.value), false)}
            id="origin url"
            label="Update the original URL"
            helperText={urlWarning}
            fullWidth={true}
            style={styles.input}
          />
          <div style={styles.button}>
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSubmitClick()}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDeleteClick()}
              >
                Delete
              </Button>
            </ButtonGroup>
          </div>
        </form>
      </Base>
    ) : (
      <Base title="Edit Finished">
        <Typography variant="h6" style={styles.input}>
          {finishMsg}
        </Typography>
      </Base>
    )
  ) : (
    <h1>You cannot edit a short url that doesn't exist</h1>
  );
}

export default Edit;
