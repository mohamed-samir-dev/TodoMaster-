
import React, { useState, useEffect, useRef } from 'react';
import './EditTodoForm.css';

export const EditTodoForm = ({ editTodo, task, onCancel }) => {
    const [value, setValue] = useState(task.task);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const trimmedValue = value.trim();
        
        if (trimmedValue === '') {
            setError('Todo cannot be empty');
            return;
        }

        if (trimmedValue === task.task) {
            if (onCancel) onCancel();
            return;
        }

        setIsSubmitting(true);
        
        try {
            await editTodo(trimmedValue, task.id);
        } catch (error) {
            setError('Failed to update todo');
            console.error('Error updating todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setValue(task.task); 
        setError('');
        if (onCancel) onCancel();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
        if (error) setError('');
    };

    const isValueChanged = value.trim() !== task.task;
    const isValueEmpty = value.trim() === '';

    return (
        <div className="edit-todo-wrapper">
            <form className="edit-todo-form" onSubmit={handleSubmit}>
                <div className="edit-input-group">
                    <div className="edit-input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className={`edit-todo-input ${error ? 'error' : ''}`}
                            value={value}
                            placeholder="Edit your todo..."
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitting}
                            maxLength={200}
                            aria-label="Edit todo text"
                        />
                        <div className="input-actions">
                            <span className="character-count">
                                {value.length}/200
                            </span>
                        </div>
                    </div>
                    
                    {error && (
                        <div id="edit-error" className="error-message" role="alert">
                            <span className="error-icon">⚠</span>
                            {error}
                        </div>
                    )}
                </div>
                
                <div className="edit-form-buttons">
                    <button
                        type="submit"
                        className={`edit-save-btn ${(!isValueChanged || isValueEmpty) ? 'disabled' : ''}`}
                        disabled={!isValueChanged || isValueEmpty || isSubmitting}
                        aria-label="Save changes"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="loading-spinner"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">✓</span>
                                <span>Save</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        className="edit-cancel-btn"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        aria-label="Cancel editing"
                    >
                        <span className="btn-icon">✕</span>
                        <span>Cancel</span>
                    </button>
                </div>
            </form>
            
            <div className="edit-form-hint">
                <span className="hint-text">
                    Press <kbd>Enter</kbd> to save • <kbd>Esc</kbd> to cancel
                </span>
            </div>
        </div>
    );
};
