import React, { useState, useEffect } from 'react';
import './AlertMessage.css'; // Import CSS for styling

const AlertMessage = ({ type, message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timeout = setTimeout(() => {
                setVisible(false);
                onClose();
            }, 3000); // Adjust the timeout duration as needed (in milliseconds)
            return () => clearTimeout(timeout);
        }
    }, [message, onClose]);

    return (
        <div className={`alert-message ${type} ${visible ? 'show' : ''}`}>
            <span>{message}</span>
        </div>
    );
};

export default AlertMessage;
