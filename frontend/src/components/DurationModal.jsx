import React from "react";
import { IoClose } from "react-icons/io5";

function DurationModal({ todo, onClose }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    const displayHours = date.getHours() % 12 || 12;
    
    return `${day}/${month}/${year}, ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'paused':
        return 'status-paused';
      case 'ongoing':
        return 'status-ongoing';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Activity History</h3>
          <button className="close-button" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-body">
          <table className="activity-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {todo.activities && todo.activities.length > 0 ? (
                [...todo.activities].reverse().map((activity, index) => (
                  <tr key={index} className={getStatusColor(activity.status)}>
                    <td>{activity.status}</td>
                    <td>{formatDate(activity.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>No activity history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DurationModal;

