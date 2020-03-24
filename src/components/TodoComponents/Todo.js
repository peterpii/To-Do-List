import React from 'react';

const Todo = function(props) {
    return (
        <div>
            <p>{props.todo.task}</p>
        </div>
    )
}

export default Todo;