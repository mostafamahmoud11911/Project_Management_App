import logo from '../../../../Modules/../assets/images/PMS 3.svg'
import { SubmitHandler,useForm } from "react-hook-form";
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'

type AuthInputs = {
  email: string;
  password: string;
  confirmPassword:string;
  seed :string;
};

export default function ResetPass() {
  const navigate = useNavigate()

  const [type, setType] = useState('password');
  const [types, setTypes] = useState('password');
  const [typeOtp, setTypeOtp] = useState('password');
  const [iconOtp, setIconOtp] = useState(eyeOff);
  const [icon, setIcon] = useState(eyeOff);
  const [icons, setIcons] = useState(eyeOff);
  //i added those 2 states to fix onchange errors
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text')
    }

    else {
      setIcon(eyeOff)
      setType('password')
    }
  }
  const handleToggleConfirm = () => {
    if (types === 'password') {
      setIcons(eye);
      setTypes('text')
    }

    else {
      setIcons(eyeOff)
      setTypes('password')
    }
  }
  const handleToggOtp = () => {
    if (typeOtp === 'password') {
      setIconOtp(eye);
      setTypeOtp('text')
    }

    else {
      setIconOtp(eyeOff)
      setTypeOtp('password')
    }
  }

  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm<AuthInputs>();

  const onSubmit: SubmitHandler<AuthInputs> = async(data) =>  {
    console.log(data)
    try {
      let response = await axios.post("https://upskilling-egypt.com:3003/api/v1/Users/Reset", data)
      toast.success('Password reset Successfuly')
      console.log(response)
      navigate('/login')
    }
    catch (error:any) {
      toast.error(error.response.data.message)
    }

  }
  return (
    <div className='auth-container-rest'>
      <div className='container-fluid'>
        <div className="row d-flex vh-100 justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="forgot text-center mb-4">
              <img src={logo} alt="logo" className='w-25' />
            </div>
            <form action="#" onSubmit={handleSubmit(onSubmit)} className='form-auth' style={{ padding: "15px 60px" }}>
              <span className='welcome-pms'>welcome to PMS</span>
              <h1 className='auth-title'>Reset Password</h1>
              <div className='auth-standard-basic'>
                <span className='e-mail'>E-mail</span> <br />
                <input className='input' placeholder='Enter your E-mail'
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invlid mail"
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="alert alert-danger">{errors.email.message} </p>
              )}
              <div className='auth-standard-basic'>
                <span className='e-mail'>OTP Verification</span> <br />
                <input className='input' placeholder='Enter Verification'
                  type={typeOtp}
                  {...register("seed", {
                    required: "OTP is required",
                    pattern: {
                       value: /^[0-9]{6}$/,
                      message: "Invlid OTP"
                    }
                  })}
                />
              </div>
              <span className="position-relative" onClick={handleToggOtp}>
                <Icon className="icon-otp" icon={iconOtp} size={25} />
              </span>
              {errors.seed && (
                <p className="alert alert-danger">{errors.seed.message} </p>
              )}
              <div className='auth-standard-basic'>
                <span className='e-mail'>New Password</span> <br />
                <input className='input'
                  type={type}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "You must specify a password",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters"
                    }
                  })}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="position-relative" onClick={handleToggle}>
                  <Icon className="icon" icon={icon} size={25} />
                </span>

              </div>
              {errors.password && (
                <p className="alert alert-danger">{errors.password.message} </p>
              )}

              <div className='auth-standard-basic'>
                <span className='e-mail'>Confirm Password</span> <br />

                <input className='input' placeholder='Confirm New Password'
                  type={types}
                  autoComplete="current-password"
                  {...register("confirmPassword", {
                    required: "You must confirm your password",
                    validate: (value) =>
                      value === watch('password') || "Passwords do not match"
                  })}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="position-relative" onClick={handleToggleConfirm}>
                  <Icon className="icon" icon={icons} size={25} />
                </span>
                {watch("confirmPassword") !== watch("password") &&
                  getValues("confirmPassword") ? (
                  <p className='alert alert-danger'>Passwords not match</p>
                ) : null}

              </div>
              <div className='text-center mt-5'>
                <button className="btn btn-warning verify">Save</button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  )
}