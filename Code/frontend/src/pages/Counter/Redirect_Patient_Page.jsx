import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const Redirect_Patient_Page = () => {
    const [patientUId, setpatientUId] = useState("");
    const [whoUId, setwhoUId] = useState("");
    const [who, setwho] = useState("");
    const [labtestingstobedone, setlabtestingstobedone] = useState("");
    const [medicinestobegiven, setmedicinestobegiven] = useState("");
    const [gotpatientdata, setgotpatientdata] = useState("");
    const [gotstaffdata, setgotstaffdata] = useState("");

    const [personInfo, setPersonInfo] = useState([]);
    const [stafflist, setstafflist] = useState({});

    const navigator = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("user_designation") !== "Counter") {
            navigator("/", { replace: true });
        }
    }, []);

    const handle_submit_1 = async (event) => {
        event.preventDefault();

        const check_role_response = await axios.post("http://localhost:3500/api_verify_role_of_person_from_u_id", { "u_id": patientUId, "expected_role": "Patient" });
        if (check_role_response.data.success_status === false) {
            window.alert("This is invalid id for patient!");
            return;
        }

        const result = await axios.post("http://localhost:3500/counter/get_patient_allhistory_by_uid/", { patient_u_id: patientUId });
        if (result.data.success_status) {
            const obj = result.data.ans
            setPersonInfo(obj)
            setgotpatientdata("True")
            console.log(personInfo)
        } else {
            window.alert(result.data.error_message);
        }
    }

    const get_staff_data = async (event) => {
        event.preventDefault();
        const result = await axios.post("http://localhost:3500/counter/get_staff_list_by_role/", { role: who });
        if (result.data.success_status) {
            setstafflist(result.data.ans)
            setgotstaffdata("True")
        } else {
            window.alert(result.data.error_message);
        }
    }

    const handle_submit_2 = async (event) => {
        event.preventDefault();

        let api_call1 = await axios.post("http://localhost:3500/get_phone_number_from_uid", { u_id: patientUId });
        if (api_call1.data.success_status) {
            const phoneNumber = api_call1.data.phone_number;

            /* let api_call = await axios.post("http://localhost:3500/otp/sendOTP", { phoneNumber: phoneNumber });
            if (api_call.data.success_status) {
                const backend_otp = api_call.data.otp;
                let otp_entered = prompt(`Please enter OTP sent to patient at number ${phoneNumber}`, '');
                if (otp_entered === backend_otp) {
                    window.alert("OTP Verification Successfull");

                    const is_active_case_paper_api_call = await axios.post("http://localhost:3500/counter/get_active_case_paper_of_patient", { patient_u_id: patientUId })
                    if (is_active_case_paper_api_call.data.success_status) {
                        const post_data = {
                            patient_u_id: patientUId,
                            who_u_id: whoUId,
                            who: who,
                            lab_testings_to_be_done: labtestingstobedone.split(","),
                            medicines_to_be_given: medicinestobegiven.split(","),
                        };
                        const result = await axios.post("http://localhost:3500/counter/add_redirection_record/", post_data);
                        if (result.data.success_status) {
                            window.alert("Redirection Record Added Successfully");
                        }
                        else {
                            window.alert(result.data.error_message);
                        }
                    }
                    else {
                        window.alert("No active case paper found so please add first active case paper and then add redirection record");
                    }
                }
                else {
                    window.alert("OTP Verification Failed");
                }
            }
            else {
                window.alert(api_call.data.error_message);
            } */

            let otp_entered = prompt(`Please enter Hello`, '');
            if (otp_entered === "Hello") {
                window.alert("OTP Verification Successfull");

                const is_active_case_paper_api_call = await axios.post("http://localhost:3500/counter/get_active_case_paper_of_patient", { patient_u_id: patientUId })
                if (is_active_case_paper_api_call.data.success_status) {
                    const post_data = {
                        patient_u_id: patientUId,
                        who_u_id: whoUId,
                        who: who,
                        lab_testings_to_be_done: labtestingstobedone.split(","),
                        medicines_to_be_given: medicinestobegiven.split(","),
                    };
                    const result = await axios.post("http://localhost:3500/counter/add_redirection_record/", post_data);
                    if (result.data.success_status) {
                        window.alert("Redirection Record Added Successfully");
                    }
                    else {
                        window.alert(result.data.error_message);
                    }
                }
                else {
                    window.alert("No active case paper found so please add first active case paper and then add redirection record");
                }
            }
            else {
                window.alert("OTP Verification Failed");
            }
        }
        else {
            window.alert(api_call1.data.error_message);
        }
    }

    return (
        <Fragment>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center landing-page">
                <div
                    className="card w-50 "
                    // style={{ padding: 10, borderRadius: "15px" }}
                    style={{
                        padding: 10,
                        borderRadius: "15px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    <h1 className="card-header text-center" style={{ padding: 20 }}>Redirect Patient</h1>
                    <div className="card-body">
                        <form onSubmit={handle_submit_1}>
                            <div className="mb-3" style={{ padding: "10px 10px 5px 10px" }}>
                                <label htmlFor="requested_uid">Enter Patient's UID:</label>
                                <input
                                    type="text"
                                    id="requested_uid"
                                    name="requested_uid"
                                    className="form-control"
                                    value={patientUId}
                                    onChange={(e) => setpatientUId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="footer d-flex justify-content-between align-items-center" style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>
                                <button type="submit" className="btn btn-primary " style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>Submit</button>
                                <button onClick={(e) => navigator("/counter/home_page")} className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 60px 10px 60px" }}>Back</button>
                            </div>
                        </form>

                        {gotpatientdata === "True" &&
                            (
                                <div>
                                    <h3>Patient History</h3>
                                    {personInfo.map((personInfoentry) => (

                                        <div className="personal-info">
                                            <h5>Record: </h5>
                                            <div>
                                                <span>StaffUID: </span>
                                                <span>{personInfoentry.who_u_id}</span>
                                            </div>
                                            <div>
                                                <span>Staff: </span>
                                                <span>{personInfoentry.who}</span>
                                            </div>
                                            <div>
                                                <span>Date: </span>
                                                <span>{personInfoentry.date_time}</span>
                                            </div>
                                            <div>
                                                {personInfoentry.lab_testing_to_be_done.length !== 0 && (<span>
                                                    <span>Lab_testing_to_be_done: </span>
                                                    <ol>
                                                        {
                                                            personInfoentry.lab_testing_to_be_done.map((test) => (
                                                                <li>{test}</li>
                                                            )
                                                            )
                                                        }
                                                    </ol></span>)}
                                            </div>
                                            <div>{Object.keys(personInfoentry.medicines_prescribed).length !== 0 &&
                                                (<span><span>Medicines_prescribed: </span>
                                                    <span>{JSON.stringify(personInfoentry.medicines_prescribed)}</span></span>)
                                            }
                                            </div>
                                            <div>
                                                {personInfoentry.extra_notes.length !== 0 && (<span>
                                                    <span>Extra Notes: </span>
                                                    <ol>
                                                        {
                                                            personInfoentry.extra_notes.map((note) => (
                                                                <li>{note}</li>
                                                            )
                                                            )
                                                        }
                                                    </ol>
                                                </span>)}
                                            </div>
                                            <p />
                                        </div>
                                    ))}
                                    <form onSubmit={get_staff_data}>
                                        <div className="form-group">
                                            <label>Redirect To</label>
                                            <select
                                                className="form-control"
                                                value={who}
                                                onInput={(e) => setwho(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Redirection Staff</option>
                                                <option value="Doctor">Doctor</option>
                                                <option value="Lab Technician">Lab Technician</option>
                                                <option value="Pharmacist">Pharmacist</option>
                                            </select>
                                        </div>
                                        <div className="footer d-flex justify-content-between align-items-center" style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>
                                            <button type="submit" className="btn btn-primary " style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>Submit</button>
                                            <button onClick={(e) => navigator("/counter/home_page")} className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 60px 10px 60px" }}>Back</button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }

                        {
                            gotstaffdata === "True" &&
                            (
                                <form>
                                    <div className="form-group">
                                        <label>{who}s</label>
                                        <select className="form-control" value={whoUId} onInput={(e) => setwhoUId(e.target.value)} required>
                                            <option value="">Select {who}s</option>
                                            {stafflist.map((stafflistentry) => (
                                                <option key={stafflistentry[0]} value={stafflistentry[0]}>
                                                    {stafflistentry[0]}({stafflistentry[1]} {stafflistentry[2]} {stafflistentry[3]})
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                </form>
                            )
                        }

                        {gotstaffdata === "True" &&
                            who === "Pharmacist" &&
                            (
                                <form onSubmit={handle_submit_2}>
                                    <div className="form-group">
                                        <label>Medication to be done: </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter medication to be given"
                                            value={medicinestobegiven}
                                            onInput={(e) => setmedicinestobegiven(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="footer d-flex justify-content-between align-items-center">
                                        <button type="submit" className="btn btn-primary " style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>Submit</button>
                                        <button onClick={(e) => navigator("/counter/home_page")} className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 60px 10px 60px" }}>Back</button>
                                    </div>
                                </form>
                            )
                        }

                        {gotstaffdata === "True" &&
                            who === "Lab Technician" &&
                            (
                                <form onSubmit={handle_submit_2}>
                                    <div className="form-group">
                                        <label>Tests to be done: </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter tests to be done"
                                            value={labtestingstobedone}
                                            onInput={(e) => setlabtestingstobedone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="footer d-flex justify-content-between align-items-center" style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>
                                        <button type="submit" className="btn btn-primary " style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>Submit</button>
                                        <button onClick={(e) => navigator("/counter/home_page")} className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 60px 10px 60px" }}>Back</button>
                                    </div>
                                </form>
                            )
                        }
                        {gotstaffdata === "True" &&
                            who === "Doctor" &&
                            (
                                <div className="footer d-flex justify-content-between align-items-center" style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>
                                    <button onClick={handle_submit_2} className="btn btn-primary " style={{ marginLeft: "10px", padding: "10px 50px 10px 50px" }}>Submit</button>
                                    <button onClick={(e) => navigator("/counter/home_page")} className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 60px 10px 60px" }}>Back</button>
                                </div>
                            )
                        }

                    </div>

                </div>
            </div>
            {/* <h1 className="card-header text-center" style={{ padding: 20 }}>Update Patient Redirection Records</h1> */}
            {/* <form onSubmit={handle_submit_1}>
                <div>
                    <label htmlFor="requested_uid">Enter Patient's UID:</label>
                    <input
                        type="text"
                        id="requested_uid"
                        name="requested_uid"
                        value={patientUId}
                        onChange={(e) => setpatientUId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Get Record</button>
            </form>

            {gotpatientdata === "True" &&
                (
                    <div>
                        <h3>Patient History</h3>
                        {personInfo.map((personInfoentry) => (

                            <div className="personal-info">
                                <h5>Record: </h5>
                                <div>
                                    <span>StaffUID: </span>
                                    <span>{personInfoentry.who_u_id}</span>
                                </div>
                                <div>
                                    <span>Staff: </span>
                                    <span>{personInfoentry.who}</span>
                                </div>
                                <div>
                                    <span>Date: </span>
                                    <span>{personInfoentry.date_time}</span>
                                </div>
                                <div>
                                    {personInfoentry.lab_testing_to_be_done.length !== 0 && (<span>
                                        <span>Lab_testing_to_be_done: </span>
                                        <ol>
                                            {
                                                personInfoentry.lab_testing_to_be_done.map((test) => (
                                                    <li>{test}</li>
                                                )
                                                )
                                            }
                                        </ol></span>)}
                                </div>
                                <div>{Object.keys(personInfoentry.medicines_prescribed).length !== 0 &&
                                    (<span><span>Medicines_prescribed: </span>
                                        <span>{JSON.stringify(personInfoentry.medicines_prescribed)}</span></span>)
                                }
                                </div>
                                <div>
                                    {personInfoentry.extra_notes.length !== 0 && (<span>
                                        <span>Extra Notes: </span>
                                        <ol>
                                            {
                                                personInfoentry.extra_notes.map((note) => (
                                                    <li>{note}</li>
                                                )
                                                )
                                            }
                                        </ol>
                                    </span>)}
                                </div>
                                <p />
                            </div>
                        ))}
                        <form onSubmit={get_staff_data}>
                            <div className="form-group">
                                <label>Redirect To</label>
                                <select
                                    className="form-control"
                                    value={who}
                                    onInput={(e) => setwho(e.target.value)}
                                    required
                                >
                                    <option value="">Select Redirection Staff</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Lab Technician">Lab Technician</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Get Staff Data</button>
                        </form>
                    </div>
                )
            }

            {
                gotstaffdata === "True" &&
                (
                    <form>
                        <div className="form-group">
                            <label>{who}s</label>
                            <select className="form-control" value={whoUId} onInput={(e) => setwhoUId(e.target.value)} required>
                                <option value="">Select {who}s</option>
                                {stafflist.map((stafflistentry) => (
                                    <option key={stafflistentry[0]} value={stafflistentry[0]}>
                                        {stafflistentry[0]}({stafflistentry[1]} {stafflistentry[2]} {stafflistentry[3]})
                                    </option>
                                ))}

                            </select>
                        </div>
                    </form>
                )
            }

            {gotstaffdata === "True" &&
                who === "Pharmacist" &&
                (
                    <form onSubmit={handle_submit_2}>
                        <div className="form-group">
                            <label>Medication to be done: </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter medication to be given"
                                value={medicinestobegiven}
                                onInput={(e) => setmedicinestobegiven(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                )
            }

            {gotstaffdata === "True" &&
                who === "Lab Technician" &&
                (
                    <form onSubmit={handle_submit_2}>
                        <div className="form-group">
                            <label>Tests to be done: </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter tests to be done"
                                value={labtestingstobedone}
                                onInput={(e) => setlabtestingstobedone(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                )
            }
            {gotstaffdata === "True" &&
                who === "Doctor" &&
                (
                    <button onClick={handle_submit_2} className="btn btn-primary">Submit</button>
                )
            } */}

        </Fragment>
    )
}