
import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { v4 as uuidv4 } from 'uuid';
import { EditTodoForm } from './EditTodoForm';
import './TodoWrapper.css';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (todoText) => {
        if (todoText.trim() === '') return;

        const newTodo = {
            id: uuidv4(),
            task: todoText.trim(),
            completed: false,
            isEditing: false,
            createdAt: new Date().toISOString()
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
    };

    const toggleComplete = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const editTodo = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
            )
        );
    };

    const editTask = (newTask, id) => {
        if (newTask.trim() === '') return;

        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id
                    ? { ...todo, task: newTask.trim(), isEditing: false }
                    : todo
            )
        );
    };

    const clearCompleted = () => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    };

    const getFilteredTodos = () => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };

    const filteredTodos = getFilteredTodos();
    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    const completedTodosCount = todos.filter(todo => todo.completed).length;

    return (
        <div className="todo-wrapper">
            <div className="todo-container">
                <header className="todo-header">
                    <h1 className="todo-title">Todo Manager</h1>
                    <p className="todo-subtitle">Stay organized and productive</p>
                </header>

                <div className="todo-form-section">
                    <TodoForm addTodo={addTodo} />
                </div>

                {todos.length > 0 && (
                    <div className="todo-stats">
                        <div className="stats-item">
                            <span className="stats-number">{activeTodosCount}</span>
                            <span className="stats-label">Active</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-number">{completedTodosCount}</span>
                            <span className="stats-label">Completed</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-number">{todos.length}</span>
                            <span className="stats-label">Total</span>
                        </div>
                    </div>
                )}

                {todos.length > 0 && (
                    <div className="todo-filters">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                            onClick={() => setFilter('active')}
                        >
                            Active
                        </button>
                        <button
                            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </button>
                        {completedTodosCount > 0 && (
                            <button
                                className="clear-completed-btn"
                                onClick={clearCompleted}
                            >
                                Clear Completed
                            </button>
                        )}
                    </div>
                )}

                <div className="todo-list">
                    {filteredTodos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No todos yet</h3>
                            <p>
                                {filter === 'all'
                                    ? "Add your first todo above to get started!"
                                    : `No ${filter} todos found.`
                                }
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div key={todo.id} className="todo-item-wrapper">
                                {todo.isEditing ? (
                                    <EditTodoForm
                                        editTodo={editTask}
                                        task={todo}
                                    />
                                ) : (
                                    <Todo
                                        task={todo}
                                        toggleComplete={toggleComplete}
                                        deleteTodo={deleteTodo}
                                        editTodo={editTodo}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
