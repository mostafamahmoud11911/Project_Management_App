import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {  Modal } from 'react-bootstrap';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';


import { useForm } from 'react-hook-form';
import Style from './sidebar.module.css'
import axios from 'axios';

import { FieldError } from 'react-hook-form';
import { useToast } from "../../../Context/ToastContext";


  
export default function SideBar() {

  const { setLoginUser, baseUrl, requestHeaders,loginUser } = useAuth();
  let { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { getToast } = useToast();
  const navigate = useNavigate();
  const [placeholder, setPlaceholder] = useState<Placeholders>({
    oldPassword: 'Enter your old password',
    newPassword: 'Enter your new password',
    confirmNewPassword: 'Confirm your new password',
  });  
  const [showPassword, setShowPassword] = useState({
    oldPassword: true,
    newPassword: true,
    confirmNewPassword: true,
  });
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [iconRotation, setIconRotation] = useState(1);
  let [isCollapse, setIsCollapse] = useState(true);
  let [collapsedWidth, setCollapsedWidth] = useState("80px");

  const updateCollapsedWidth = () => {
    const width = window.innerWidth;
    if (width <= 576) {
      setCollapsedWidth("60px");
    } else if (width <= 768) {
      setCollapsedWidth("80px");
    } else if (width <= 992) {
      setCollapsedWidth("80px");
    } else {
      setCollapsedWidth("80px");
    }
  };

  useEffect(() => {
    updateCollapsedWidth();
    window.addEventListener('resize', updateCollapsedWidth);
    return () => window.removeEventListener('resize', updateCollapsedWidth);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setLoginUser(null);
    navigate("/login");
  }
  
  // ?============================================================================================
  interface PasswordState {
    oldPassword: boolean;
    newPassword: boolean;
    confirmNewPassword: boolean;
  }

  interface Placeholders {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  const togglePassword = (field: keyof PasswordState) => {
    setShowPassword((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };
  
  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
    setIconRotation(prevRotation => prevRotation === 1 ? -1 : 1);
  }
  
  const onSubmit = async (data: any) => {
    try{
      
      let response = await axios.put(`${baseUrl}/Users/ChangePassword`, data,
        {
          headers: requestHeaders
        });
     
     
     
     getToast("success", response.data.message)
      logout()
      console.log(data);
      
    }
    catch (error) {
      
      console.log(error);
    }
  }
  

  // *========================================><=============================================//
  return (
    
    <>

      <div className='sidebar-container sticky-top'>
      <Sidebar 
          collapsed={isCollapse} 
          // breakPoint={breakPoint}
          collapsedWidth={collapsedWidth}
          className='border-0 bg-danger'
          >
          <Menu className='my-5 py-5'>

            <MenuItem
              className='text-center d-none d-md-block'
              onClick={handleCollapse}
            >
              <div className="icon-container bg-warnin p-2 rounded-3" style={isCollapse? { transform: `scaleX(${iconRotation})` }: { transform: `scaleX(${iconRotation})` }}>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </MenuItem>
            
            <MenuItem 
              className='mt-4 mb-2'
              component={<Link to="" />} 
              icon={<i className="fa-solid fa-house"></i>}
            >
              <span>Home</span>
            </MenuItem>

{loginUser?.userGroup=='Manager'?  <MenuItem 
            className="mb-2"
              component={<Link to="users" />} 
              icon={<i className="fa-solid fa-users"></i>}
            >
              Users
            </MenuItem>:''}
          

            <MenuItem 
            className="mb-2"
              component={<Link to="projects" />} 
              icon={<i className="fa-solid fa-bars-progress"></i>}
            >
            Projects
            </MenuItem>

            <MenuItem 
            className="mb-2"
              component={<Link to="tasks" />} 
              icon={<i className="fa-solid fa-tasks"></i>}
            >
            Tasks
            </MenuItem>

            <MenuItem 
            className="mb-2"
              onClick={handleShow}
              icon={<i className="fa-solid fa-unlock"></i>}
            >
              Change Password
            </MenuItem>

            <MenuItem 
            className="mb-2"
              onClick={logout}
              icon={<i className="fa-solid fa-circle-left"></i>}
            >
              Logout
            </MenuItem>

            

          </Menu>
        </Sidebar>        

        <Modal className='pt-4' show={show} onHide={handleClose}>
    
  
          <Modal.Body className={`${Style.modalBody} form-container p-5 bg-main rounded-2 dark-tabel`}>
            <p className='text-white pt-md-3'>welcome to APP</p>
            <h3 className='fw-bold mb-5 text-main position-relative'>Change Password</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='d-flex flex-column gap-2'>

              <div className={`${Style.height} `}>
                <div className={`${Style.inputContainer} ${errors.oldPassword && Style.inputError}`}>
                  <label htmlFor="oldpass" className="me-1">
                      Old Password
                  </label>
                  <div className="d-flex align-items-end">
                    <input 
                      type={showPassword.oldPassword ? 'text' : 'password'} 
                      className={`text-white flex-grow-1 pb-2 bg-transparent border-0 `}
                      placeholder={placeholder.oldPassword}
                      id="oldpass"
                      {...register('oldPassword', {
                          required: '* Old Password is required',
                          pattern: {
                              value: /.{3,}/,
                              message:'* Invalid Password'
                          }
                      })}
                      onFocus={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, oldPassword: '' }))}
                      onBlur={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, oldPassword: 'Enter your old password' }))}
                    />
                    <span
                        onClick={() => togglePassword('oldPassword')}
                        className={`text-white bg-inf ${Style.icon}`}>
                        {showPassword.oldPassword ?
                            <i className="fa-regular fa-eye"></i> :
                            <i className="fa-regular fa-eye-slash"></i>
                          }
                    </span>
                  </div>
                </div>
                {errors.oldPassword && <p className='text-warning mt-1'>{(errors.oldPassword as FieldError).message}</p>}
              </div>


              <div className={`${Style.height} `}>
                <div className={`${Style.inputContainer} ${errors.newPassword && Style.inputError}`}>
                  <label htmlFor="new" className="me-1">
                      New Password
                  </label>
                  <div className="d-flex align-items-end">
                    <input 
                      type={showPassword.newPassword ? 'text' : 'password'} 
                      className={`text-white flex-grow-1 pb-2 bg-transparent border-0 `}
                      placeholder={placeholder.newPassword}
                      id="new"
                      {...register('newPassword', {
                          required: '* New Password is required',
                          pattern: {
                              value: /.{3,}/,
                              message:'* Invalid Password'
                          }
                      })}
                      onFocus={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, newPassword: '' }))}
                      onBlur={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, newPassword: 'Enter your new password' }))}
                    />
                    <span
                        onClick={() => togglePassword('newPassword')}
                        className={`text-white ${Style.icon}`}>
                        {showPassword.newPassword ?
                            <i className="fa-regular fa-eye"></i> :
                            <i className="fa-regular fa-eye-slash"></i>
                          }
                    </span>
                  </div>
                </div>
                {errors.newPassword && <p className='text-warning mt-1'>{(errors.newPassword as FieldError).message}</p>}
              </div>


              <div className={`${Style.height} `}>
                <div className={`${Style.inputContainer} ${errors.confirmNewPassword && Style.inputError}`}>
                  <label htmlFor="confirm" className="me-1">
                      Confirm New Password
                  </label>
                  <div className="d-flex align-items-end">
                    <input 
                      type={showPassword.confirmNewPassword ? 'text' : 'password'} 
                      className={`text-white flex-grow-1 pb-2 bg-transparent border-0 `}
                      placeholder={placeholder.confirmNewPassword}
                      id="confirm"
                      {...register('confirmNewPassword', {
                          required: '* Please confirm your password',
                          validate: (value) =>
                            value === watch('newPassword') ||
                            "* Password isn't a match"
                      })}
                      onFocus={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, confirmNewPassword: '' }))}
                      onBlur={() => setPlaceholder((prevPlaceholders) => ({ ...prevPlaceholders, confirmNewPassword: 'Confirm your new password' }))}
                    />
                    <span
                        onClick={() => togglePassword('confirmNewPassword')}
                        className={`text-white bg-inf ${Style.icon}`}>
                        {showPassword.confirmNewPassword ?
                            <i className="fa-regular fa-eye"></i> :
                            <i className="fa-regular fa-eye-slash"></i>
                          }
                    </span>
                  </div>
                </div>
                {errors.confirmNewPassword && <p className='text-warning mt-1'>{(errors.confirmNewPassword as FieldError).message}</p>}

              </div>

              <div className='mt-3 pb-md-3'>
                <button className="btn btn-warning w-100 mt-4">Save</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>


      

    </>
  )
}
