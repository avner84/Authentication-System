import React, { CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

const SubmitSpinner = () => {
  return (
    <PulseLoader
    color="#ffffff"
    loading={true}
    cssOverride={override}
    size={10}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
  )
}

export default SubmitSpinner