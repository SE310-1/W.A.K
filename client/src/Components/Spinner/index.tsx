import "./style.css";
import React from "react";
import { TailSpin } from "react-loader-spinner";

export const Spinner: React.FC = () => {
    return <div className="spinner-wrapper"><div className="spinner"><TailSpin
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="tail-spin-loading"
    radius="1"

    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  /></div></div>;

}

export default Spinner;