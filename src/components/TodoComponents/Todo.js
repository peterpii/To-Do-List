import React from 'react';

const Todo = function(props) {
    return (
        <div 
            key={props.todo.id}
            onClick={event => {
                props.toggleComplete(props.todo.id);
            }}>
            <p>{props.todo.task}</p>
        </div>
    )
}

export default Todo;