import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";

type Inputs = {
  title: string;
  description: string;
};

export default function ProjectsData() {
  const { requestHeaders, baseUrl }: any = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { getToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  // useForm hook for form validation
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  // Fetch project details if editing
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`${baseUrl}/Project/${id}`, { headers: requestHeaders })
        .then((response) => {
          const project = response.data;
          setValue("title", project.title);
          setValue("description", project.description);
        })
        .catch((error) => {
          console.log(error);
          getToast("error", "Failed to fetch project details");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, baseUrl, requestHeaders, getToast, setValue]);

  // Submit handler for creating or updating project
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        // If editing, perform update
        response = await axios.put(
          `${baseUrl}/Project/${id}`,
          {
            title: data.title,
            description: data.description,
          },
          { headers: requestHeaders }
        );
        getToast("success", "Project updated successfully");
      } else {
        // If creating, perform create
        response = await axios.post(`${baseUrl}/Project`, data, {
          headers: requestHeaders,
        });
        getToast("success", "Successfully created project");
      }
      navigate("/dashboard/projects");
    } catch (error) {
      console.log(error);
      getToast("error", "Failed to perform action");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation function to projects list
  const navigatetoProjects = () => {
    navigate("/dashboard/projects");
  };

  return (
    <>
      <div className="add-headers rounded-3 my-5 bg-white p-4 shadow-sm dark-tabel">
        <span>
          <i onClick={navigatetoProjects} className="fa fa-chevron-left me-2 dark-icon"></i>
          <span className="dark-p">View all Projects</span>
        </span>

        <h3 className="mt-4 select-btn h2-dark">Add a New Project</h3>
      </div>

      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-md-9 ">
            <div className="bg-inf">
              <div className="formContainer container m-auto bg-white p-4 rounded-4 dark-tabel">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="dark-p">Title</h5>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control rounded-3 dark-input"
                      placeholder="Name"
                      {...register("title")}
                    />
                  </div>

                  <h5 className="dark-p">Description</h5>
                  <textarea
                    rows={4}
                    className="form-control rounded-3 dark-input "
                    placeholder="Description"
                    {...register("description")}
                  ></textarea>

                  <div className="d-flex justify-content-between my-4">
                    <button onClick={navigatetoProjects} className="white-btn rounded-pill px-4 dark-tabel dark-p">
                      Cancel
                    </button>
                    <button type="submit" className="orange-btn rounded-pill px-4 py-2 ">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
