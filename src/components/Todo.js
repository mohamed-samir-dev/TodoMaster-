
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCheck, faUndo, faClock } from '@fortawesome/free-solid-svg-icons';
import './Todo.css';

export const Todo = ({ task, toggleComplete, deleteTodo, editTodo }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleComplete = async () => {
        setIsToggling(true);
        try {
            await toggleComplete(task.id);
        } catch (error) {
            console.error('Error toggling todo:', error);
        } finally {
            setTimeout(() => setIsToggling(false), 300);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            setTimeout(async () => {
                await deleteTodo(task.id);
            }, 200);
        } catch (error) {
            console.error('Error deleting todo:', error);
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        editTodo(task.id);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`todo-item ${task.completed ? 'completed' : 'pending'} ${isDeleting ? 'deleting' : ''}`}>
            <div className="todo-content">
                <div className="todo-checkbox-container">
                    <button
                        className={`todo-checkbox ${task.completed ? 'checked' : ''} ${isToggling ? 'toggling' : ''}`}
                        onClick={handleToggleComplete}
                        disabled={isToggling || isDeleting}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        <div className="checkbox-inner">
                            {isToggling ? (
                                <div className="checkbox-spinner"></div>
                            ) : task.completed ? (
                                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                            ) : null}
                        </div>
                        <div className="checkbox-ripple"></div>
                    </button>
                </div>

                <div className="todo-text-container">
                    <p 
                        className={`todo-text ${task.completed ? 'completed-text' : ''}`}
                        onClick={handleToggleComplete}
                        role="button"
                        tabIndex="0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleToggleComplete();
                            }
                        }}
                    >
                        {task.task}
                    </p>
                    
                    {task.createdAt && (
                        <div className="todo-metadata">
                            <FontAwesomeIcon icon={faClock} className="metadata-icon" />
                            <span className="todo-date">
                                {task.completed ? 'Completed' : 'Created'} {formatDate(task.createdAt)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="todo-actions">
                <button
                    className="todo-action-btn edit-btn"
                    onClick={handleEdit}
                    disabled={isDeleting}
                    aria-label="Edit todo"
                    title="Edit todo"
                >
                    <FontAwesomeIcon icon={faPenToSquare} className="action-icon" />
                    <span className="btn-tooltip">Edit</span>
                </button>

                <button
                    className="todo-action-btn delete-btn"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Delete todo"
                    title="Delete todo"
                >
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        className={`action-icon ${isDeleting ? 'deleting' : ''}`} 
                    />
                    <span className="btn-tooltip">Delete</span>
                </button>

                {task.completed && (
                    <button
                        className="todo-action-btn undo-btn"
                        onClick={handleToggleComplete}
                        disabled={isToggling || isDeleting}
                        aria-label="Mark as incomplete"
                        title="Mark as incomplete"
                    >
                        <FontAwesomeIcon icon={faUndo} className="action-icon" />
                        <span className="btn-tooltip">Undo</span>
                    </button>
                )}
            </div>

            <div className="todo-priority-indicator"></div>
        </div>
    );
};
