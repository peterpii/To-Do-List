import React, {Component} from 'react';
import TodoList from './components/TodoComponents/TodoList';
import TodoForm from './components/TodoComponents/TodoForm';
import Pomodoro from './components/Timer-Components/Pomodoro';

/*
This application keeps people who are taking online classes 
    or working remotely full-time on track
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [{
        // task: '',
        // id: '',
        // completed: false
      }],
      todo: '',
      restMinutes: 5,
      workMinutes: 25,
      seconds: 0,    // starts with 25 minutes and 0 seconds
      break: false,  // assuming not starting a day with a break!
      start: false,  // tells the application whether or not it should display workMinutes
      interval: ''
    }
  }
  
  render() {
    return (
      <div className="App">
        <h1>To-Do List</h1>
        <TodoList 
          todos={this.state.todos}
          toggleComplete={this.toggleComplete}
        />
        <TodoForm 
          todos={this.state.todos}
          value={this.state.todo}
          inputChangeHandler={this.inputChangeHandler}
          addTask={this.addTask}
          removeTasks={this.removeTasks}
        />
        <Pomodoro 
          timer={this.timer}
          workMinutes={this.state.workMinutes}
          restMinutes={this.state.restMinutes}
          seconds={this.state.seconds}
          start={this.state.start}
          break={this.state.break}
          startTimer={this.startTimer}
          pauseTimer={this.pauseTimer}
        />
      </div>
    );
  };

  // This function is taking what you type into the input bar, and adding it to state.
  inputChangeHandler = event => {
    this.setState({[event.target.name] : event.target.value})
  }

  // Add task button
  addTask = event => {
    event.preventDefault(); // prevent the page from refreshing every time adding a new to-do item
    let newTask = {
      task: this.state.todo,
      id: Date.now(),
      completed: false
    }

    this.setState({
      todos: [...this.state.todos, newTask],  // using the spread operator to make sure only have one array
      todo: '' // reset todo to an empty string so it can be filled in again
    })
  }

  // Remove tasks
  removeTasks = event => {
    event.preventDefault(); // prevent the page from refreshing
    this.setState(prevState => {
      return {
        todos: prevState.todos.filter(todo => {
          return !todo.completed
        })
      }
    })
  }

  // Marking items as complete
  toggleComplete = itemID => {
    const todos = this.state.todos.map(todo => {
      if(todo.id === itemID) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    this.setState({todos, todo: ''});
  };

  // local storage
  addLocalStorage() {
    for(let key in this.state) {
      if(localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        try {
          value = JSON.parse(value);
          this.setState({[key]: value});
        }
        catch(event) {
          this.setState({[key]: value});
        }
      }
    }  
  }

  saveLocalStorage() {
    for(let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  };

  // Upon loading the application, this function will pull tasks that were saved to local storage and render to the page
  componentDidMount() {
    this.addLocalStorage();
    window.addEventListener("beforeunload", this.saveLocalStorage.bind(this));
  };

  // Clean up
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveLocalStorage.bind(this));
  };

  // Timer functions
  timer = () => {
    this.setState({
      seconds: this.state.seconds === 0 ? 59 : this.state.seconds-1
    });

    /* 
      Handling minutes
       - check if break is true or false, if true setState on minutes
       - check against seconds for whether or not to subtract a minute
    */
    if(this.state.break) {
      this.setState({restMinutes: this.state.seconds === 0 ? 
      this.state.restMinutes-1 : this.state.restMinutes === 5 ? 4 :
      this.state.restMinutes});
    }

    // if restMinutes === -1, reset break to false, reset restMinutes to 5
    if(this.state.restMinutes === -1) {
      this.setState({restMinutes: 5, break: false})
    }
    else {
      this.setState({workMinutes: this.state.seconds === 0 ? 
      this.state.workMinutes-1 : this.state.workMinutes === 25 ? 24 : 
      this.state.workMinutes})

      if(this.state.workMinutes === -1) {
        this.setState({workMinutes: 25, break: true})
      }
    }
  }

  startTimer = () => {
    this.setState({
      interval: setInterval(this.timer, 1000),
      start: !this.state.start
    })
  }

  pauseTimer = () => {
    this.setState(prevState => {
      return {
        restMinutes: prevState.restMinutes,
        workMinutes: prevState.workMinutes,
        seconds: prevState.seconds,
        break: prevState.break,
        start: false,
        interval: clearInterval(prevState.interval)
      };
    })
  }
}

export default App;
