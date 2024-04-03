import React, { Fragment, useState } from "react";
import axios from "axios";

export const Print_Case_Paper = () => {
    const [uId, setUId] = useState("");
    const [casePaper, setcasePaper] = useState({});

    const handle_form_submit = async (event) => {
        event.preventDefault();
        const result = await axios.post("http://localhost:3500/counter/get_active_case_paper_of_patient", { patient_u_id: uId });
        if (result.data.success_status) {
            setcasePaper(result.data.ans)
            console.log(casePaper)
        } else {
            window.alert(result.data.error_message);
        }
    }

    const handle_print = async (event) => {
        event.preventDefault();
        const result = await axios.post("http://localhost:3500/counter/mark_latest_active_case_paper_inactive", { patient_u_id: uId });
        if (result.data.success_status == false) {
            window.alert(result.data.error_message);
        }
    }

    return (
        <Fragment>
            <h1>Print Case Paper</h1>
            <form onSubmit={handle_form_submit}>
                <div>
                    <label htmlFor="requested_uid">Enter Patient's UID:</label>
                    <input
                        type="text"
                        id="requested_uid"
                        name="requested_uid"
                        value={uId}
                        onChange={(e) => setUId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {
                Object.keys(casePaper).length != 0 &&
                (
                    <div>
                        <h3>Patient History</h3>
                        <div className="personal-info">
                            <div>
                                <span>Start Date: </span>
                                <span>{casePaper.start_date_time}</span>
                            </div>
                            {casePaper.history_id_array.length > 0 && (<div>
                                <span>
                                    <span>History Ids: </span>
                                    <ol>
                                        {
                                            casePaper.history_id_array.map((id) => (
                                                <li>{id}</li>
                                            )
                                            )
                                        }
                                    </ol></span>
                            </div>)}
                        </div>
                        <button onClick={handle_print}>Print</button>
                    </div>
                )
            }
        </Fragment>
    )
}