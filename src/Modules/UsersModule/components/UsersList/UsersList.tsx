import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import NoData from "../../../SharedModule/components/NoData/NoData";
// import Styles from "./UsersList.module.css";
import { useToast } from "../../../Context/ToastContext";
import Loading from "../../../SharedModule/components/Loading/Loading";
import { User } from "../../../../Interfaces/Interface";
import Pagination from "../../../SharedModule/components/Pagination/Pagination";
import { Button, Modal } from "react-bootstrap";
import DeleteData from "../../../SharedModule/components/DeleteData/DeleteData";


export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const { getToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [arrayOfPages, setArrayOfPages] = useState<number[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const [userId, setUserId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteClose = () => setShowDelete(false);

  const [viewedUser, setViewedUser] = useState<User | null>(null); 
  const [modalShow, setModalShow] = React.useState(false);
  const handleCloseViewModal = () => setModalShow(false);
  const handleViewModal = (user: User)=>{
    setViewedUser(user); // Set the user data
    setModalShow(true);
  }

  const handleDeleteShow = (id: number) => {
    setUserId(id);
    setShowDelete(true);
  };

  const { requestHeaders, baseUrl }: any = useContext(AuthContext);

  //*==========================> Get ALL Projects API <===============================>> 
  const getUsersList = async (title='', pageSize=5, pageNumber=1) => {
    setIsLoading(true);
    try {
      let response = await axios.get(
        `${baseUrl}/Users/Manager`,
        {
          headers: requestHeaders,
          params:{
            'title':title,
            pageSize: pageSize,
            pageNumber: pageNumber
          }
        }
      );
      setUsersList(response.data.data);
      console.log(response.data.data);
      setArrayOfPages(Array.from({ length: response.data.totalNumberOfPages }, (_, i) => i + 1));
      setTotalResults(response.data.totalNumberOfRecords);
      console.log(arrayOfPages);
      
    } catch (error: any) {
      getToast("error", error.response.message);
    }finally {
      setIsLoading(false);
    }
  };

  //?==========================> Toggle User Activete <===============================>> 
  const toggleUserActivate = async (id: number) => {
    setIsLoading(true);
    try {
      let response = await axios.put(
        `${baseUrl}/Users/${id}`,
        {},
        {
          headers: requestHeaders,
        }
      );
      console.log(response.data.data);
      
      getUsersList();
    } catch (error: any) {
      getToast("error", error.response.error);
    }finally {
      setIsLoading(false);
    }
  };

  //^=================================> Searching <======================================>> 
  const getNameValue = (input:any)=>{
    setTitle(input.target.value);
    getUsersList(input.target.value,pageSize,1);
  }
  //&==============================> Functions of Pagination <==============================>> 
  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getUsersList(title, pageSize, page);
  };

  // Function to handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    getUsersList(title, size, 1);
  };

  // !================================>DELETE<========================================
  const onDeleteSubmit = async () => {
    setIsLoading(true);
    try {
         const response = await axios.delete(
        `${baseUrl}/Project/${userId}`,

        {
          headers: requestHeaders,
        }
      );

      getToast("success", "Successfully deleted project");

      handleDeleteClose();
      getUsersList();
    } catch (error:any) {
      getToast("error", error.response.message);
    }finally {
      setIsLoading(false);
    }
  };

  // *===============================>> UseEffect <<=============================
  useEffect(() => {
    getUsersList();
  }, []);

  // *====================================================================================================
  // * ========================================> JSX <====================================================
  return (
    <>
    <Modal show={showDelete} onHide={handleDeleteClose} >
        <Modal.Body className="dark-tabel">
          <DeleteData deleteItem={"Project"} />
        </Modal.Body>
        <Modal.Footer className="dark-tabel">
          <Button className="red-btn rounded-pill px-4 " onClick={onDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal
      show={modalShow}
      onHide={handleCloseViewModal}
      className="font-main"
      // size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="dark-tabel">
          <Modal.Title id="contained-modal-title-vcenter" className="dark-p">
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-tabel">
          {viewedUser && (
            <div className="dark-p">
              <h4 className="fst-itali fw-semibold text-succes">{viewedUser.userName}</h4>
              <p><span className="fw-bold">Email : </span> {viewedUser.email}</p>
              <p><span className="fw-bold">Phone Number : </span> {viewedUser.phoneNumber}</p>
              <p>{viewedUser.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="dark-tabel">
          <Button onClick={handleCloseViewModal} className="btn btn-success">Close</Button>
        </Modal.Footer>
    </Modal>
    {/* ===========================>> HEADER <<========================================= */}
      <div
        className="w-100 header-user d-flex flex-column align-items-center flex-md-row justify-content-md-between mt-5 mb-4 rounded-3 p-4 gap-2 gap-md-0 shadow-sm dark-tabel">
        <h1 className="fw-semibold mb-2 mb-md-0 title-user h2-dark">Users</h1>
      </div>

      <div className='py-4 bg-inf px-lg-5 rounded-3 shadow-s '>
      <div className="row justify-content-center justify-content-md-start">
          {/* ====================>> SEARCH <<=================== */}
          <div className="col-lg-4">
            <div className="input-group mb-3 ">
              <span className="input-group-text rounded-5 rounded-end-0 dark-tabel" id="basic-addon1">
                <i className="fa fa-search dark-icon"></i>
              </span>
              <input
                onChange={getNameValue}
                type="text"
                className="form-control rounded-5 rounded-start-0 py-2 dark-tabel"
                placeholder="Search By Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>
          </div>

          <div className="categories-body ">
            <ul className="responsive-table-categories ">
              <li className="table-header dark-hh">
                <div className="col col-1">User Name</div>
                <div className="col col-2">Status</div>
                <div className="col col-3">Phone Number</div>
                <div className="col col-4">Email</div>
                <div className="col col-6">Actions</div>
              </li>
            </ul>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {usersList.length > 0 ? (
                  usersList.map((user: User) => (
                    <ul key={user.id} className="responsive-table-categories ">
                      <li  className="table-row dark-tabel">
                        <div className="col col-1 fw-semibold h2-dark" data-label="Username :">{user.userName}</div>
                        <div className="col col-2 h2-dark" data-label="Status :">
                        {user.status}
                        {user.isActivated ? (
                          <i
                            onClick={() => toggleUserActivate(user.id)}
                            className="fa fa-toggle-on fa-2xl text-success"
                          ></i>
                        ) : (
                            <i
                              onClick={() => toggleUserActivate(user.id)}
                              className="fa fa-toggle-off fa-2xl text-danger"
                            ></i>
                        )}
                        </div>
                        <div className="col col-3 h2-dark" data-label="Phone Number :">{user.phoneNumber}</div>
                        <div className="col col-4 h2-dark" data-label="Email :">{user.email}</div>
                        <div className="col col-5 h2-dark" data-label="Actions :">
                          <div className="dropdown">
                            <button className="btn dark-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-ellipsis-vertical"></i>
                            </button>
                            <ul className="dropdown-menu bg-success-subtl border-0 shadow-lg rounded-5 pt-2 dark-tabel">
                              <div>
      
                              <li>
                                <button className="dropdown-item text-decoration-none text-black dark-p"  onClick={()=>handleViewModal(user)}>
                                  <i className="fa fa-eye text-info me-2"></i>
                                  <span>View</span>
                                </button>
                              </li>
                              
                              <li>
                                <button className="dropdown-item text-decoration-none text-black dark-p" onClick={() => handleDeleteShow(user.id)}  >
                                  <i className="fa fa-trash text-danger me-2"></i>
                                  <span>Delete</span>
                                </button>
                              </li>
                              </div>
      
                              
                            </ul>
                          </div>
                        </div>
                      </li>
                    </ul>
                  ))
                ) : (
                  <li className="list-group-item">
                    <NoData />
                  </li>
                )}
              </>
              
            )}
          </div>

          <Pagination currentPage={currentPage}
            totalPages={arrayOfPages.length}
            pageSize={pageSize}
            totalResults={totalResults}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />

      </div>

      </div>
    </>    
    )}
    
