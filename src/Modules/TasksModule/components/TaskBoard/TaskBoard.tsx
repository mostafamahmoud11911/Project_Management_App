import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import axios from "axios";
import Styles from "./TaskBoard.module.css";
import { motion } from "framer-motion";
import { Header } from "../../../SharedModule/components/Header/Header";

type Task = { id: string; title: string; status: string };
type Tasks = Task[];
type ChangeStatus = (id: string, prevStatus: string, newStatus: status) => void;
export default function TaskBoard() {
  const { requestHeaders, baseUrl }: any = useContext(AuthContext);
  const { getToast } = useToast();

  const [tasksList, setTasksList] = useState<Tasks>([]);
  const [fetchcount, refetch] = useState(0);

  const getTasksList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/Task`, {
        headers: requestHeaders,
      });

      setTasksList(response.data.data);
    } catch (error: any) {
      getToast("error", error.response.data.message);
    }
  };

  const changeStatus: ChangeStatus = async (id, prevStatus, newStatus) => {
    try {
      const newTasks = tasksList.map((task) => {
        if (task.id == id) return { ...task, status: newStatus };
        return task;
      });
      setTasksList(newTasks);
      if (prevStatus == newStatus) {
        return;
      } else {
        const response = await axios.put(
          `${baseUrl}/Task/${id}/change-status`,
          { status: newStatus },
          { headers: requestHeaders }
        );
      }
    } catch (error: any) {
      refetch((prev) => prev + 1);
      getToast("error", "Cannot move the task");
    }
  };

  useEffect(() => {
    getTasksList();
  }, [fetchcount]);
  return (
    <>
     <Header title='Tasks Board' />
      <div
        className={`${Styles.boardContainer} d-flex container justify-content-center bg-white align-items-center my-5 py-5 shadow gap-5 dark-p dark-tabel`}
      >
        <div className="row">
          <Column
            tasks={tasksList}
            status="ToDo"
            title="To Do"
            changeStatus={changeStatus}
          />
          <Column
            tasks={tasksList}
            status="InProgress"
            title="InProgress"
            changeStatus={changeStatus}
          />
          <Column
            tasks={tasksList}
            status="Done"
            title="Done"
            changeStatus={changeStatus}
          />
        </div>
      </div>
    </>
  );
}
type status = "ToDo" | "InProgress" | "Done";
type columnProps = {
  title: string;
  tasks: Tasks;
  status: status;
  changeStatus: ChangeStatus;
};
const Column = ({ title, status, tasks, changeStatus }: columnProps) => {
  const filteredCards = tasks?.filter((task) => task.status === status);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  return (
    <>
      <div className="col-md-6 col-lg-4">
        <h4 className="d-flex gap-5 p-4">{title}</h4>
        <motion.div
          layout={true}
          layoutId={status}
          onDrop={(e:any) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("id");
            const prevStatus = e.dataTransfer.getData("status");
            console.log({ id, prevStatus, status });

            changeStatus(id, prevStatus, status);

            setIsDraggingOver(false);
          }}
          onDragOver={(e:any) => {
            e.preventDefault();

            setIsDraggingOver(true);
          }}
          onDragLeave={(e:any) => {
            e.preventDefault();

            setIsDraggingOver(false);
          }}
          onDragEnter={(e:any) => {
            e.preventDefault();
          }}
          className={`d-flex flex-column gap-3 px-5 py-3 ps-4 pe-4 dark-hh ${Styles.column}`}
        >
          {filteredCards.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </motion.div>
      </div>
    </>
  );
};
type TaskProps = {
  task: Task;
};
const Task = ({ task }: TaskProps) => {
  const { title, status, id } = task;
  const [isDragging, setIsDragging] = useState(false);
  return (
    <>
      <motion.div
        layout={true}
        layoutId={id}
        draggable={true}
        onDragStart={(e:any) => {
          setIsDragging(true);
          e.dataTransfer.setData("id", id);
          e.dataTransfer.setData("status", status);
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
        className={`px-5 py-3 ${Styles.task}`}
      >
        {title}
      </motion.div>
    </>
  );
};