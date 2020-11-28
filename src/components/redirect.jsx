import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Axios from "axios";

function Redirect(props) {
  const params = useParams();
  const urlEnd = params.urlEnd;

  useEffect(() => {
    Axios.get(
      "https://zhenyan-wang-a3-backend.herokuapp.com/api/find/" + urlEnd
    ).then((res) => {
      if (res.data.originUrl != null) {
        window.location.href = res.data.originUrl;
      }
    });
  }, [urlEnd]);

  return <h1>Short Url Not found!</h1>;
}

export default Redirect;
