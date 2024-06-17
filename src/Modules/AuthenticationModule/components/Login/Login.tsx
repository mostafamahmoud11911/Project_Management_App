import styles from "./Login.module.css";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import logo from "../../../../assets/images/PMS 3.png";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";

type AuthInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getUserData } = useAuth();
  const timeoutRef = useRef<number>();

  const { getToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputs>();

  const onSubmit: SubmitHandler<AuthInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `https://upskilling-egypt.com:3003/api/v1/Users/Login`,
        data
      );
      localStorage.setItem("token", res.data.token);
      getUserData();
      timeoutRef.current = setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      setLoading(false);
      getToast("success", "Logged in Successfuly");
    } catch (err: any) {
      setLoading(false);
      getToast("error", err.response.data.message);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className={styles.authContainer}>
        <div className={`container-fluid`}>
          <div
            className={`row vh-100 justify-content-center align-items-center`}
          >
            <div className={`col-md-5 bg-inf`}>
              <div className={styles.login}>
                <div className={`text-center pb-2`}>
                  <img src={logo} className={`w-25`} alt="" />
                </div>
                <div className={`${styles.content} p-5`}>
                  <div className={`mb-5`}>
                    <p>Welcome to PMS</p>
                    <h4>Login</h4>
                  </div>
                  <form
                    className="d-flex flex-column gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="bg-blac">
                      <div
                        className={`${styles.inputContainer} ${
                          errors.email && styles.inputError
                        }`}
                      >
                        <label htmlFor="email">E-mail</label>
                        <input
                          type="text"
                          id="email"
                          {...register("email", {
                            required: "*Email is required",
                            pattern: {
                              value: /^[^@]+@[^@]+\.[^@.]{2,}$/,
                              message: "Invaild mail",
                            },
                          })}
                          className={styles.inputLogin}
                          placeholder="Enter your E-mail"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-warning mt-1">
                          {(errors.email as FieldError).message}
                        </p>
                      )}
                    </div>

                    <div className="bg-inf">
                      <div
                        className={`${styles.inputContainer} ${
                          errors.email && styles.inputError
                        }`}
                      >
                        <label htmlFor="password">Password</label>
                        <div className="d-flex align-items-center">
                          <input
                            type={showPass ? "text" : "password"}
                            id="password"
                            {...register("password", {
                              required: "*Password is required",
                              pattern: {
                                value:
                                  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                                message:
                                  "The password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.",
                              },
                            })}
                            placeholder="Enter your password"
                            className={styles.inputLogin}
                          />
                          <i
                            className={`fa-regular ${
                              showPass ? "fa-eye" : "fa-eye-slash"
                            } ${styles.showPass}`}
                            onClick={() => setShowPass(!showPass)}
                          ></i>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-warning mt-1">
                          {(errors.password as FieldError).message}
                        </p>
                      )}
                    </div>

                    <div
                      className={`d-flex align-items-center justify-content-between mb-4 ${styles.textGold}`}
                    >
                      <Link
                        to="/register"
                        className={`text-decoration-none  ${styles.textGold}`}
                      >
                        Register Now ?
                      </Link>
                      <Link
                        to="/forgetpass"
                        className={`text-decoration-none   ${styles.textGold} `}
                      >
                        Forget Password ?
                      </Link>
                    </div>
                    <button
                      disabled={loading}
                      className={`btn ${styles.btn_main}`}
                    >
                      {loading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
