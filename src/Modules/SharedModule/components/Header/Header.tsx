import React, { useContext } from "react";
import { AuthContext, useAuth } from "../../../Context/AuthContext";

export const Header = (props:any) => {
  const { loginUser } = useAuth();
  console.log(props.title)
  return (
    <>
      <div className="w-100 compTitle header-project d-flex flex-column align-items-center flex-md-row justify-content-md-between mt-5 mb-4 bg-whit rounded-3 p-4 gap-2 gap-md-0 shadow-sm dark-tabel">
        <h1 className="fw-semibold mb-2 mb-md-0 dark-p">{props.title}</h1>

        <div>
          {loginUser?.userGroup == "Manager" ? (
            <button
              className="orange-btn rounded-5 px-4 py-2"
              onClick={props.method}
            >
              <i className="fa fa-plus me-2 fw-lighter"></i>
              {props.button}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
