import React from 'react';

const TodoForm = props => {
    return (
        <form>
            <input name='todo' type='text' onChange={props.inputChangeHandler} placeholder='Enter a task' />
            <button onClick={props.addTask}>Add a Task</button>
            <button>Remove Completed</button>
        </form>
    )
}

export default TodoForm;