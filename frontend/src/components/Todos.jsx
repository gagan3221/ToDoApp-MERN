import React, { useContext, useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import AuthContext from "../context/AuthContext";
import TodosContext from "../context/TodosContext";
import DurationModal from "./DurationModal";

function Todos({ todo: t, serialNumber }) {
  const [duration, setDuration] = useState(t.activeDuration || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { dispatch } = useContext(TodosContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let interval;
    if (t.status === 'ongoing') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(t.activeDuration || 0);
    }
    return () => clearInterval(interval);
  }, [t.status, t.activeDuration]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const updateStatus = async (newStatus) => {
    const response = await fetch(`http://localhost:5000/api/todos/${t._id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TODO", payload: json });
      
      // Show notification
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };

  const handleResume = () => {
    updateStatus('ongoing');
  };

  const handlePause = () => {
    updateStatus('paused');
  };

  const handleEnd = () => {
    updateStatus('completed');
  };

  const handleStop = () => {
    updateStatus('paused');
  };

  const getStatusDisplay = () => {
    if (t.status === 'ongoing') return 'ongoing';
    if (t.status === 'completed') return 'completed';
    if (t.status === 'paused') return 'paused';
    return 'pending';
  };

  const getResumeButtonText = () => {
    return (t.status === 'pending' || !t.status) ? 'Start' : 'Resume';
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {showNotification && (
        <div className="notification">
          <FaCheckCircle size={20} />
          <span>Task status updated</span>
        </div>
      )}
      
      <tr className="todo-row">
        <td>{serialNumber}</td>
        <td className="activity-name">{t.todo}</td>
        <td className="duration-cell">
          <span className="duration-badge">{formatDuration(duration)}</span>
          {(t.status === 'pending' || t.status === 'paused' || !t.status) ? (
            <button className="btn-resume-inline" onClick={handleResume} title={t.status === 'pending' || !t.status ? 'Start timer' : 'Resume timer'}>
              {getResumeButtonText()}
            </button>
          ) : null}
          
          {t.status === 'ongoing' ? (
            <button className="btn-pause-inline" onClick={handlePause} title="Pause timer">
              Pause
            </button>
          ) : null}
        </td>
        <td>
          <span className={`status-badge status-${t.status || 'pending'}`}>
            {getStatusDisplay()}
          </span>
        </td>
        <td className="actions-cell">
          {t.status === 'ongoing' && (
            <button className="btn-stop" onClick={handleStop} title="Stop timer">
              Stop
            </button>
          )}
          
          {(t.status === 'ongoing' || t.status === 'paused') && (
            <button className="btn-end" onClick={handleEnd} title="Complete task">
              End
            </button>
          )}
          
          <button className="btn-check" onClick={handleEnd} title="Mark as completed">
            <FaCheckCircle size={20} />
          </button>
          
          <button className="btn-view" onClick={openModal} title="View activity history">
            <IoEyeSharp size={20} />
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <DurationModal todo={t} onClose={closeModal} />
      )}
    </>
  );
}

export default Todos;
