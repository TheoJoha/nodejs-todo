
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  // set state variables
  const [todos, setTodos] = useState([])
  const [filteredTodos, setFilteredTodos] = useState([])
  const [showMenu, setShowMenu] = useState(true)
  const [sortDirection, setSortDirection] = useState(true)
  const [listView, setListView] = useState(false)

  // get all todos
  useEffect(() => {
    fetch('http://localhost:3003/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        setFilteredTodos(data)
      });
  }, [])

  // filter function
  const filterTodos = (e) => {
    const filtered = todos.filter(todo => todo.name.startsWith(e.target.value))
    setFilteredTodos(filtered)
  }

  // sorting function
  const sortTodos = () => {
    let sorted = []
    if (sortDirection) {
      sorted = [...todos].sort((a, b) => b.priority - a.priority)
    } else {
      sorted = [...todos].sort((a, b) => a.priority - b.priority)
    }
    setFilteredTodos(sorted)
    setSortDirection(prev => !prev)
  }

  const switchView = () => {
    setListView(prev => !prev)
  }


  return (
    <div id="app">
      <div id="menu" onClick={() => setShowMenu(prev => !prev)} >
        Menu
      </div>
      {showMenu && <div id="menu-contents">

        <div id="filter">
          Filter: 
          <input id="todo-filter" onChange={filterTodos} />
        </div>
        <div onClick={sortTodos} id="sort">
          Sort
        </div>
        <div onClick={switchView} id="switchView">
          Switch view to {listView ? "Post-it view" : "List view"}
        </div>

        Add item:
        Edit item:
        Delete item:
      </div>}

      {!listView && <div id="todos">
        {filteredTodos && filteredTodos.map((todo) => <div
          className="todo todo-post-it-view"
          key={todo.id}>
          <div id="todo-item-name" className="todo-item-content">
            {todo.name}
          </div>
          <div id="todo-item-description" className="todo-item-content">
            {todo.description}
          </div>
          <div id="priority">
            Priority: {todo.priority == 1 ? "Low" : todo.priority == 2 ? "Medium" : todo.priority == 3 ? "High" : "Critical"}
          </div>
          <div id="time">
            Estimated time: {todo.time}
          </div>
        </div>
        )}
      </div>}

      {listView && <div id="todos">
        {filteredTodos && filteredTodos.map((todo) => <div
          className="todo todo-list-view"
          key={todo.id}>
          <div id="todo-item-name" className="todo-item-content">
            {todo.name}
          </div>
          <div id="todo-item-description" className="todo-item-content">
            {todo.description}
          </div>
          <div id="priority">
            Priority: {todo.priority == 1 ? "Low" : todo.priority == 2 ? "Medium" : todo.priority == 3 ? "High" : "Critical"}
          </div>
          <div id="time">
            Estimated time: {todo.time}
          </div>
        </div>
        )}
      </div>}

    </div>
  )
}

export default App
