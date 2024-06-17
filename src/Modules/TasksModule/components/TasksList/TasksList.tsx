import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import NoData from "../../../SharedModule/components/NoData/NoData";
import { useToast } from "../../../Context/ToastContext";
import Loading from "../../../SharedModule/components/Loading/Loading";
import DeleteData from "../../../SharedModule/components/DeleteData/DeleteData";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../../SharedModule/components/Pagination/Pagination";
import { TaksInterface } from "../../../../Interfaces/Interface";
import TaskBoard from "../TaskBoard/TaskBoard";

export default function TasksList() {
  const { requestHeaders, baseUrl, loginUser }: any = useContext(AuthContext);
  const { getToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showListSize, setShowListSize] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [arrayOfPages, setArrayOfPages] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [totalResults, setTotalResults] = useState(0);
  const [title, setTitle] = useState(""); // Add title state
  const [status, setStatus] = useState(""); // Add status state

  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (id: number) => {
    setTaskId(id);
    setShowDelete(true);
  };

  const [viewedTask, setViewedTask] = useState<TaksInterface | null>(null);
  const [modalShow, setModalShow] = React.useState(false);
  const handleCloseViewModal = () => setModalShow(false);
  const handleViewModal = (task: TaksInterface) => {
    setViewedTask(task);
    setModalShow(true);
  };

  const [titleValue, setTitleValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState<number[]>(
    []
  );

  const navigate = useNavigate();
  // !======================================DELETE==================================================
  const onDeleteSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/Task/${taskId}`,

        {
          headers: requestHeaders,
        }
      );

      getToast("success", "Successfully deleted task");

      handleDeleteClose();
      getTasksList("", "", pageSize, 1);
    } catch (error: any) {
      getToast("error", error.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksList = async (
    title = "",
    status = "",
    pageSize = 5,
    pageNumber = 1
  ) => {
    setIsLoading(true);
    let dataUrl = "";
    if (loginUser?.userGroup == "Manager") {
      dataUrl = `${baseUrl}/Task/manager`;
    } else {
      dataUrl = `${baseUrl}/Task`;
    }
    try {
      let response = await axios.get(dataUrl, {
        headers: requestHeaders,
        params: {
          title: title,
          status: status,
          pageSize: pageSize,
          pageNumber: pageNumber,
        },
      });
      setTasksList(response.data.data);
      setTotalResults(response.data.totalNumberOfRecords);
      setArrayOfPages(
        Array.from(
          { length: response.data.totalNumberOfPages },
          (_, i) => i + 1
        )
      );
      // console.log(arrayOfPages);
    } catch (error: any) {
      getToast("error", error.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAddTask = () => {
    navigate("/dashboard/tasksdata");
  };

  //&==============================> Functions of Pagination <==============================>>
  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getTasksList(title, status, pageSize, page);
  };

  // Function to handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page on page size change
    getTasksList(title, "", size, 1);
  };

  //?=================================>> UseEffect <<==========================================//
  useEffect(() => {
    getTasksList();
  }, []);
  // useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 0);
  //   getTasksList(title,status,5,1);
  // }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    getTasksList(event.target.value, status, pageSize, 1);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
    getTasksList(title, event.target.value, pageSize, 1);
  };

  return (
    <>
      {loginUser?.userGroup == "Manager" ? (
        <div className="font-main">
          <Modal show={showDelete} onHide={handleDeleteClose}>
            <Modal.Body className="dark-tabel">
              <DeleteData deleteItem={"task"} />
            </Modal.Body>
            <Modal.Footer className="dark-tabel">
              <Button variant="danger" onClick={onDeleteSubmit}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={modalShow}
            onHide={handleCloseViewModal}
            className="font-main"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            
          >
            <Modal.Header closeButton className="dark-tabel">
              <Modal.Title id="contained-modal-title-vcenter" className="dark-p">
                Task Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="dark-tabel">
              {viewedTask && (
                <div className="dark-p">
                  {/* <p>{viewedProject.id}</p> */}
                  <h4 className="fst-italic fw-semibold text-success">
                    {viewedTask.title}
                  </h4>
                  <p>
                    <span className="fw-bold">Status : </span>{" "}
                    {viewedTask.status}
                  </p>
                  <p>
                    <span className="fw-bold">User or Employee : </span>{" "}
                    {viewedTask.employee?.userName}
                  </p>
                  <p>
                    <span className="fw-bold">Project : </span>{" "}
                    {viewedTask.project?.title}
                  </p>
                  <p>
                    <span className="fw-bold">Creation Date : </span>{" "}
                    {viewedTask.creationDate}
                  </p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="dark-tabel">
              <Button
                onClick={handleCloseViewModal}
                className="btn btn-success"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="w-100 header-task d-flex flex-column align-items-center flex-md-row justify-content-md-between mt-5 mb-4 bg-whit rounded-3 p-4 gap-2 gap-md-0 shadow-sm dark-tabel">
            <h1 className="mb-2 mb-md-0 title-task h2-dark">Tasks</h1>

            <div>
              <button
                className="orange-btn rounded-5 px-4 py-2"
                onClick={navigateToAddTask}
              >
                <i className="fa fa-plus me-2 fw-lighter"></i>
                Add New Task
              </button>
            </div>
          </div>

          <div className="py-4 px-lg-5 rounded-3">
            <div className="row justify-content-center justify-content-md-start">
              <div className="col-12 col-md-7 col-lg-4">
                <div className="input-group mb-3 ">
                  <span
                    className="input-group-text rounded-5 rounded-end-0 dark-tabel"
                    id="basic-addon1"
                  >
                    <i className="fa fa-search dark-icon"></i>
                  </span>
                  <input
                    onChange={handleTitleChange}
                    type="text"
                    className="form-control rounded-5 rounded-start-0 py-2 select-hover dark-tabel"
                    placeholder="Search By Title"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>

              <div className="col-6 col-md-5 col-lg-1 px-lg-2 bg-inf filter-container">
                <div className="position-relative bg-blac ">
                  <select
                    onChange={handleSelect}
                    className="form-control border-0 rounded-5 py-2 filter-select dark-p dark-tabel"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Filter
                    </option>
                    <option value="ToDo">to do</option>
                    <option value="InProgress">in progress</option>
                    <option value="Done">done</option>
                  </select>

                  <div className="position-absolute filter-icon">
                    <i className="fa-solid fa-filter text-muted dark-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="categories-body">
              <ul className="responsive-table-categories">
                <li className="table-header dark-hh">
                  <div className="col col-1">Title</div>
                  <div className="col col-2">Status</div>
                  <div className="col col-3">User</div>
                  <div className="col col-4">Project</div>
                  <div className="col col-5">Date Created</div>
                  <div className="col col-5">Actions</div>
                </li>
              </ul>

              {isLoading ? (
                <Loading />
              ) : (
                <>
                  {tasksList.length > 0 ? (
                    tasksList.map((task: TaksInterface) => (
                      <ul className="responsive-table-categories ">
                        <li key={task.id} className="table-row dark-tabel">
                          <div className="col col-1 dark-p" data-label="Title :">
                            <span className="fw-semibold">{task.title}</span>
                          </div>
                          <div className="col col-2 dark-p" data-label="Status :">
                            {task.status}
                          </div>
                          <div className="col col-3 dark-p" data-label="User :">
                            {task.employee?.userName}
                          </div>
                          <div className="col col-4 dark-p" data-label="Project :">
                            {task.project?.title}
                          </div>
                          <div
                            className="col col-5 dark-p"
                            data-label="Date Created :"
                          >
                            {task.creationDate.slice(0, 10)}
                          </div>
                          <div className="col col-6 " data-label="Actions :">
                            <div className="dropdown">
                              <button
                                className="btn dark-icon"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa fa-ellipsis-vertical"></i>
                              </button>
                              <ul className="dropdown-menu bg-success-subtl border-0 shadow-lg rounded-5 pt-2 dark-tabel">
                                <div>
                                  <li>
                                    <button
                                      className="dropdown-item text-decoration-none text-black dark-p"
                                     
                                      onClick={() => handleViewModal(task)}
                                    >
                                      <i className="fa fa-eye text-info me-2"></i>
                                      <span>View</span>
                                    </button>
                                  </li>

                                  <li>
                                    <Link
                                      className="dropdown-item text-decoration-none text-black dark-p"
                                      to={`/dashboard/tasksedit/${task.id}`}
                                      state={{ type: "edit", taskData: task }}
                                    >
                                      <i className="fa fa-edit text-warning me-2"></i>
                                      <span>Edit</span>
                                    </Link>
                                  </li>

                                  <li>
                                    <button
                                      className="dropdown-item text-decoration-none text-black dark-p"
                                      onClick={() => handleDeleteShow(task.id)}
                                     
                                    >
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

            <Pagination
              currentPage={currentPage}
              totalPages={arrayOfPages.length}
              pageSize={pageSize}
              totalResults={totalResults}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      ) : (
        <TaskBoard />
      )}
    </>
  );
}
