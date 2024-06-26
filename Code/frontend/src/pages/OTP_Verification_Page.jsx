import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const OTP_Verification_Page = () => {
  let interval_1 = 0;
  const [u_id, set_u_id] = useState("");
  const [otp, set_otp] = useState("");
  const [otp_from_backend, set_otp_from_backend] = useState("");
  const navigator = useNavigate();
  const on_success_url = "/" + useParams()["success_url"];

  useEffect(() => {
    sessionStorage.setItem("otp_verified", "false");
    document.getElementById("otp").disabled = true;
    document.getElementById("submit_2").disabled = true;
    document.getElementById("resend_btn").disabled = true;

    return () => {
      clearInterval(interval_1);
    };
  }, []);

  const timer_func = () => {
    let time = 0;
    interval_1 = setInterval(() => {
      const timer_element = document.getElementById("timer");
      if (timer_element === null) {
        clearInterval(interval_1);
      } else {
        timer_element.innerHTML = `THE RESEND OTP WILL BE ENABLED IN ${
          (20000 - time) / 1000
        } seconds`;
        time += 1000;
        if (time === 20000) {
          timer_element.innerHTML = "";
          const reset_btn_element = document.getElementById("resend_btn");
          if (reset_btn_element !== null) {
            reset_btn_element.disabled = false;
          }
          clearInterval(interval_1);
        }
      }
    }, 1000);
  };

  const handle_submit_1 = async (event) => {
    event.preventDefault();
    document.getElementById("u_id").disabled = true;
    document.getElementById("submit_1").disabled = true;

    document.getElementById("otp").disabled = false;
    document.getElementById("submit_2").disabled = false;
    document.getElementById("resend_btn").disabled = true;

    timer_func();
    sessionStorage.setItem("change_password_uid", u_id);

    const get_phone_number = await axios.post(
      "http://localhost:3500/get_phone_number_from_uid",
      { u_id: u_id }
    );
    if (get_phone_number.data.success_status) {
      const phone_number = get_phone_number.data.phone_number;
      const send_otp = await axios.post("http://localhost:3500/otp/sendOTP/", {
        phoneNumber: phone_number,
      });
      if (send_otp.data.success_status) {
        set_otp_from_backend(send_otp.data.otp);
        window.alert(`OTP sent succesfully on phone number ${phone_number}`);
      } else {
        window.alert(`Couldn't send otp on phone number ${phone_number}`);
      }
    } else {
      window.alert("Could find this record!");
    }
  };

  const handle_submit_2 = (event) => {
    event.preventDefault();
    if (otp === otp_from_backend) {
      window.alert("OTP verified successfully!");
      sessionStorage.setItem("otp_verified", "true");
      return navigator(on_success_url, { replace: true });
    } else {
      window.alert("OTP verification failed!");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center landing-page">
      <div className="card w-45" style={{padding:10, borderRadius:"15px"}}>
        <h2 className="card-header text-center">OTP Verification</h2>
        <div className="card-body">
          <form onSubmit={handle_submit_1} className="mb-4">
            <div className="mb-3">
              <label htmlFor="u_id" className="form-label">
                U ID:
              </label>
              <input
                type="text"
                className="form-control"
                id="u_id"
                value={u_id}
                onInput={(e) => set_u_id(e.target.value)}
                required
              />
            </div>
            <button type="submit" id="submit_1" className="btn btn-primary w-50">
              Send OTP
            </button>
          </form>

          <form onSubmit={handle_submit_2} className="mb-4">
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                OTP:
              </label>
              <input
                type="text"
                className="form-control"
                id="otp"
                value={otp}
                onInput={(e) => set_otp(e.target.value)}
                required
              />
            </div>
            <div className=" d-flex justify-content-between align-items-center">
              <button
                type="submit"
                id="submit_2"
                className="btn btn-primary mr-10 w-50"
              >
                Submit
              </button>
              <button
                id="resend_btn"
                onClick={handle_submit_1}
                className="btn btn-secondary"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
        <p id="timer"></p>
      </div>
    </div>
  );
};
