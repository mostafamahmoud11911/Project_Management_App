import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import NoData from "../../../SharedModule/components/NoData/NoData";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeleteData from "./../../../SharedModule/components/DeleteData/DeleteData";
import { useToast } from "../../../Context/ToastContext";
import Loading from "../../../SharedModule/components/Loading/Loading";
import Pagination from "../../../SharedModule/components/Pagination/Pagination";
import { Header } from "../../../SharedModule/components/Header/Header";
import projectImg from "../../../../assets/images/projects.jpg";
import { ProjectInterface } from "../../../../Interfaces/Interface";





export default function ProjectsList() {
  const { requestHeaders, baseUrl, loginUser }: any = useContext(AuthContext);
  const { getToast } = useToast();
  const [projectsList, setProjectsList] = useState([]);
  const [ProjectId, setProjectId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const [title, setTitle] = useState('');
  const [arrayOfPages, setArrayOfPages] = useState<number[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  
  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (id: number) => {
    setProjectId(id);
    setShowDelete(true);
  };

  const [viewedProject, setViewedProject] = useState<ProjectInterface | null>(null); 
  const [modalShow, setModalShow] = React.useState(false);
  const handleCloseViewModal = () => setModalShow(false);
  const handleViewModal = (project: ProjectInterface)=>{
    setViewedProject(project); // Set the user data
    setModalShow(true);
  }
  const navigate = useNavigate();


  //*==========================> Get ALL Projects API <===============================>> 
  const getProjectsList = async (title='', pageSize=5, pageNumber=1  ) => {
    setIsLoading(true);
    let dataUrl ="";
    if(loginUser?.userGroup=='Manager'){
      dataUrl=`${baseUrl}/Project/manager`
    }
    else{  dataUrl=`${baseUrl}/Project/employee`}
    try {
      let response = await axios.get(dataUrl, {
        headers: requestHeaders,
        params:{
          'title':title,
          pageSize: pageSize,
          pageNumber: pageNumber
        }
      });
      setProjectsList(response.data.data);
      setArrayOfPages(Array.from({ length: response.data.totalNumberOfPages }, (_, i) => i + 1));
      setTotalResults(response.data.totalNumberOfRecords);
      // console.log(arrayOfPages);


    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false);
    }
  };
  
    //*============================> useEffect <=================================>> 
  useEffect(() => {
    getProjectsList();
  }, []);

  //^=================================> Searching <======================================>> 
  const getNameValue = (input:any)=>{
    setTitle(input.target.value);
    getProjectsList(input.target.value,pageSize,1);
  }
  //&==============================> Functions of Pagination <==============================>> 
  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getProjectsList(title, pageSize, page);
  };

  // Function to handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    getProjectsList(title, size, 1);
  };

  //!=================================> Delete Project API <==============================>> 
  const onDeleteSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/Project/${ProjectId}`,

        {
          headers: requestHeaders,
        }
      );

      getToast("success", "Successfully deleted project");

      handleDeleteClose();
      getProjectsList();
    } catch (error:any) {
      getToast("error", error.response.message);
    }finally {
      setIsLoading(false);
    }
  };

  const navigateToAdd = () => {
    navigate("/dashboard/projectsdata");
  };

  const navigateToEdit = (projectId: number) => {
    navigate(`/dashboard/projectsdata/${projectId}`);
  };

  // *=========================================================================================>>
  // *=========================================================================================>>
  // *====================================> UI <===============================================>>
  return (
    <>
    <div className='font-main'>
      
      <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Body className="dark-tabel">
          <DeleteData deleteItem={"Project"} />
        </Modal.Body>
        <Modal.Footer className="dark-tabel">
          <Button className="red-btn rounded-pill px-4" onClick={onDeleteSubmit}>
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
            Project Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-tabel dark-p">
          {viewedProject && (
            <>
              <h4 className="fst-italic fw-semibold text-success">
                {viewedProject.title}
                </h4>
              <p><span className="fw-bold">Creation Date : </span> {viewedProject.creationDate}</p>
              <p><span className="fw-bold">Last Update : </span> {viewedProject.modificationDate}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="dark-tabel">
          <Button onClick={handleCloseViewModal} className="btn btn-success">Close</Button>
        </Modal.Footer>
    </Modal>

      <div
      className="w-100 compTitle header-project d-flex flex-column align-items-center flex-md-row justify-content-md-between mt-5 mb-4 bg-whit rounded-3 p-4 gap-2 gap-md-0 shadow-sm dark-tabel">

        <h1 className="fw-semibold mb-2 mb-md-0 title-project h2-dark">Projects</h1>
     
        <div>
        {loginUser?.userGroup=='Manager'?
        <button
        className='orange-btn rounded-5 px-4 py-2'
        onClick={navigateToAdd}
      >
        <i className="fa fa-plus me-2 fw-lighter"></i>
        Add New Project
      </button>
          :''}
          
        </div>

      </div>


      <div className='py-4 bg-inf px-lg-5 rounded-3 shadow-s '>

        <div className="col-lg-4">
          <div className="input-group mb-3 ">
            <span className="input-group-text rounded-5 rounded-end-0 dark-tabel " id="basic-addon1">
              <i className="fa fa-search dark-icon"></i>
            </span>
            <div></div>
            <input
              onChange={getNameValue}
              type="text"
              className="form-control rounded-5 rounded-start-0 py-2 dark-tabel"
              placeholder="Search By Title"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="categories-body ">
          <ul className="responsive-table-categories">
            <li className="table-header dark-hh">
              <div className="col col-1">#</div>
              <div className="col col-2">Project Name</div>
              <div className="col col-3">Creation Date</div>
              <div className="col col-4">Last Update</div>
              <div className="col col-5">Actions</div>
            </li>
          </ul>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {projectsList.length > 0 ? (
                projectsList.map((project:ProjectInterface, index) => (
                  <ul  className="responsive-table-categories">
                    <li key={project.id} className="table-row dark-tabel ">
                      <div className="col col-1 fw-semibold h2-dark" data-label="#">{index + 1}</div>
                      <div className="col col-2 h2-dark" data-label="Category Name :">{project.title}</div>
                      <div className="col col-3 h2-dark" data-label="Creation Date :">{project.creationDate.slice(0, 10)}</div>
                      <div className="col col-4 h2-dark" data-label="Last Update :">{project.modificationDate.slice(0, 10)}</div>
                      <div className="col col-5 h2-dark" data-label="Actions :">
                        <div className="dropdown">
                          <button className="btn dark-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-vertical"></i>
                          </button>
                          <ul className="dropdown-menu bg-success-subtl border-0 shadow-lg rounded-5 pt-2 dark-tabel">
                            <div>

                            <li className="dropdown-option">
                              <button className="dropdown-item text-decoration-none text-black h2-dark "  onClick={()=>handleViewModal(project)}>
                                <i className="fa fa-eye text-info me-2 "></i>
                                <span className="dark-p">View</span>
                              </button>
                            </li>
                            
                            <li className="dropdown-option">
                              <button className="dropdown-item text-decoration-none text-black"  onClick={() => navigateToEdit(project.id)}>
                                <i className="fa fa-edit text-warning me-2 "></i>
                                <span  className="dark-p">Edit</span>
                              </button>
                            </li>

                            <li className="dropdown-option">
                              <button className="dropdown-item text-decoration-none text-black" onClick={() => handleDeleteShow(project.id)} >
                                <i className="fa fa-trash text-danger me-2"></i>
                                <span  className="dark-p">Delete</span>
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
                <ul className="responsive-table-categories">
                  <li className="table-row">
                    <div className="col col-1">No data</div>
                  </li>
                </ul>
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
  );
}
