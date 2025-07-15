import React, { useState, useRef } from 'react';
import './TodoForm.css';

export const TodoForm = ({ addTodo }) => {
    const [value, setValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const trimmedValue = value.trim();
        
        if (trimmedValue === '') {
            setError('Please enter a todo item');
            inputRef.current?.focus();
            return;
        }

        if (trimmedValue.length < 3) {
            setError('Todo must be at least 3 characters long');
            return;
        }

        setIsSubmitting(true);
        setIsAnimating(true);
        
        try {
            await addTodo(trimmedValue);
            setValue('');
            
            // Success animation
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            
        } catch (error) {
            setError('Failed to add todo. Please try again.');
            console.error('Error adding todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
        if (error) setError(''); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit(e);
        }
    };

    const isValueEmpty = value.trim() === '';
    const characterCount = value.length;
    const maxLength = 200;

    return (
        <div className="todo-form-wrapper">
            <form className={`todo-form ${isAnimating ? 'success-animation' : ''}`} onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2 className="form-title">
                        <span className="form-icon">✨</span>
                        Add New Todo
                    </h2>
                    <p className="form-description">What would you like to accomplish today?</p>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className={`todo-input ${error ? 'error' : ''} ${value ? 'has-content' : ''}`}
                            value={value}
                            placeholder="Enter your todo..."
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitting}
                            maxLength={maxLength}
                            aria-label="Todo input"
                            aria-describedby={error ? "input-error" : "input-hint"}
                        />
                        <div className="input-border"></div>
                        <div className="input-focus-effect"></div>
                    </div>
                    
                    <div className="input-meta">
                        <div className="input-actions">
                            <span className={`character-count ${characterCount > maxLength * 0.8 ? 'warning' : ''} ${characterCount >= maxLength ? 'danger' : ''}`}>
                                {characterCount}/{maxLength}
                            </span>
                            {value && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={() => setValue('')}
                                    aria-label="Clear input"
                                >
                                    <span className="clear-icon">✕</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div id="input-error" className="error-message" role="alert">
                            <span className="error-icon">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {!error && (
                        <div id="input-hint" className="input-hint">
                            <span>Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> for quick add</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className={`todo-submit-btn ${isValueEmpty ? 'disabled' : ''} ${isSubmitting ? 'loading' : ''}`}
                    disabled={isValueEmpty || isSubmitting}
                    aria-label="Add todo"
                >
                    {isSubmitting ? (
                        <>
                            <div className="loading-spinner"></div>
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <span className="btn-icon">+</span>
                            <span>Add Todo</span>
                            <div className="btn-ripple"></div>
                        </>
                    )}
                </button>
            </form>

            <div className="form-stats">
                <div className="quick-tips">
                    <h4>Quick Tips:</h4>
                    <ul>
                        <li>Keep todos specific and actionable</li>
                        <li>Use action verbs to start your todos</li>
                        <li>Break large tasks into smaller ones</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
