
import { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from "react-datepicker"
import { sv } from 'date-fns/locale/sv';
registerLocale('sv', sv)
import './App.css'
import axios from "axios"
import 'react-datepicker/dist/react-datepicker.css'
import { TfiClose, TfiCheck, TfiCheckBox, TfiFilter, TfiViewList, TfiViewGrid } from "react-icons/tfi";
import { TbProgressCheck, TbCheck, TbEdit, TbTags } from "react-icons/tb";



function App() {

  // set state variables
  // todos
  const [todos, setTodos] = useState([])
  // functionality
  const [listView, setListView] = useState(false)
  const [categories, setCategories] = useState([])
  const [triggerRender, setTriggerRender] = useState(false)
  // sort diretction variables
  const [sortByEstimatedTimeDirection, setSortByEstimatedTimeDirection] = useState(true)
  const [sortByDueDateDirection, setSortByDueDateDirection] = useState(true)
  const [sortByPriorityDirection, setSortByPriorityDirection] = useState(true)
  // new tag
  const [newTagName, setNewTagName] = useState("")
  // new todo variables
  const [newTodoName, setNewTodoName] = useState("")
  const [newTodoDescription, setNewTodoDescription] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState("Low")
  const [newTodoDue, setNewTodoDue] = useState("")
  const [newTodoTags, setNewTodoTags] = useState([])
  const [newTodoTime, setNewTodoTime] = useState("")
  const [newTodoId, setNewTodoId] = useState("")
  // show/hide state variables
  const [showMenu, setShowMenu] = useState(false)
  const [showNewTodoMenu, setShowNewTodoMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showManageTags, setShowManageTags] = useState(false)
  const [showGroupActions, setShowGroupActions] = useState(false)
  const [showSavingOptions, setShowSavingOptions] = useState(false)
  // other state variables
  const [todoIsEdited, setTodoIsEdited] = useState(false)
  // filter state variables
  const [todoNameFilter, setTodoNameFilter] = useState("")
  const [todoPriorityFilter, setTodoPriorityFilter] = useState("")
  const [todoTagsFilter, setTodoTagsFilter] = useState([])
  const [todoTimeMinFilter, setTodoTimeMinFilter] = useState("0")
  const [todoTimeMaxFilter, setTodoTimeMaxFilter] = useState(3600 * 24 * 365)
  const [todoDueDateFilter, setTodoDueDateFilter] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [todoStatusFilter, setTodoStatusFilter] = useState("all")

  /////////////////////////////////////////////////////
  // useEffect hooks
  /////////////////////////////////////////////////////


  // get all todos
  useEffect(() => {
    // get all todos
    fetch('http://localhost:3003/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTodos(data);
      });

    // get all categories
    fetch('http://localhost:3003/category')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, [])

  /////////////////////////////////////////////////////
  // functions
  /////////////////////////////////////////////////////


  // filter functions
  const filterTodosByName = (e) => {
    setTodoNameFilter(e.target.value)
  }

  // sort by priority
  const sortTodosByPriority = () => {
    let sorted = []
    if (sortByPriorityDirection) {
      sorted = [...todos].sort((a, b) => b.priority - a.priority)
    } else {
      sorted = [...todos].sort((a, b) => a.priority - b.priority)
    }
    setTodos(sorted)
    setSortByPriorityDirection(prev => !prev)
  }

  // sort by estimated time
  const sortTodosByEstimatedTime = () => {
    let sorted = []
    if (sortByEstimatedTimeDirection) {
      sorted = [...todos].sort((a, b) => b.time - a.time)
    } else {
      sorted = [...todos].sort((a, b) => a.time - b.time)
    }
    setTodos(sorted)
    setSortByEstimatedTimeDirection(prev => !prev)
  }

  // sort by due date
  const sortTodosByDueDate = () => {
    let sorted = []
    if (sortByDueDateDirection) {
      sorted = [...todos].sort((a, b) => b.due - a.due)
    } else {
      sorted = [...todos].sort((a, b) => a.due - b.due)
    }
    setTodos(sorted)
    setSortByDueDateDirection(prev => !prev)
  }

  // switch between list-view and post-it-view
  const switchView = () => {
    setListView(prev => !prev)
  }

  // create tag function
  const submitTag = () => {
    axios.post('http://localhost:3003/category/save', {
      tagName: newTagName,
    })
      .then(function (response) {
        console.log(response);

        // get all categories
        fetch('http://localhost:3003/category')
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setCategories(data);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // add a tag to the selected tags for todo in creation
  const addTagToNewTodo = (tag) => {
    setNewTodoTags(prev => {
      const newTags = prev.filter(prevTag => prevTag.id != tag.id)
      newTags.push(tag)
      return newTags
    })
  }

  // remove tag from new todo in making
  const removeTagFromTodoInMaking = (id) => {
    setNewTodoTags(prev => prev.filter(tag => tag.id != id))
  }

  // delete todo
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3003/todo/delete/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  }

  // delete tag
  const deleteTag = (id) => {
    axios
      .delete(`http://localhost:3003/category/delete/${id}`)
      .then(() => {
        setCategories(categories.filter(tag => tag.id != id));
      });
  }

  // create new todo
  const createNewTodo = () => {
    axios.post('http://localhost:3003/todo/save', {
      name: newTodoName,
      description: newTodoDescription,
      priority: newTodoPriority,
      time: newTodoTime,
      tags: newTodoTags,
      due: newTodoDue,
      completed: false,
      id: newTodoId,
      inProgress: false,
    })
      .then(function (response) {
        console.log(response);
        resetActiveTodo()

        // get all todos
        fetch('http://localhost:3003/todo')
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setTodos(data);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const editTodo = (todo) => {
    setNewTodoName(todo.name)
    setNewTodoDescription(todo.description)
    setNewTodoPriority(todo.priority)
    setNewTodoDue(todo.due)
    setNewTodoTags(todo.tags)
    setNewTodoTime(todo.time)
    setNewTodoId(todo.id)
    setTodoIsEdited(true)
  }

  const resetActiveTodo = () => {
    setNewTodoName("")
    setNewTodoDescription("")
    setNewTodoPriority("")
    setNewTodoDue("")
    setNewTodoTags("")
    setNewTodoTime("")
    setNewTodoId("")
    setTodoIsEdited(false)
  }

  // mark as in progress
  const todoIsInProgress = (id) => {
    const todoToBeUpdated = todos.filter(todo => todo.id == id)[0]
    todoToBeUpdated.inProgress = !todoToBeUpdated.inProgress
    axios.post('http://localhost:3003/todo/save', todoToBeUpdated)
      .then(function (response) {
        console.log(response)
        // get all todos
        fetch('http://localhost:3003/todo')
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setTodos(data);
          })
          .then(() => {
            console.log(triggerRender)
            setTriggerRender(prev => !prev)
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    /* setTodos(prev => prev.map(todo => {
      if (todo.id == id) {
        todo.completed = !todo.completed
      }
      return todo
    })) */
  }

  // mark todo as completed
  const todoIsCompleted = (id) => {
    const todoToBeUpdated = todos.filter(todo => todo.id == id)[0]
    todoToBeUpdated.completed = !todoToBeUpdated.completed
    axios.post('http://localhost:3003/todo/save', todoToBeUpdated)
      .then(function (response) {
        console.log(response)
        // get all todos
        fetch('http://localhost:3003/todo')
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setTodos(data);
          })
          .then(() => {
            console.log(triggerRender)
            setTriggerRender(prev => !prev)
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    /* setTodos(prev => prev.map(todo => {
      if (todo.id == id) {
        todo.completed = !todo.completed
      }
      return todo
    })) */
  }

  const storeTodosInLocalStorage = () => {
    localStorage.setItem("myTodos", JSON.stringify(todos))
  }



  return (
    <div id="app">
      <button id="menu" onClick={() => setShowMenu(prev => !prev)} >
        Menu
      </button>
      {showMenu && <div id="menu-contents">
        {/* Filter */}
        <button onClick={() => setShowFilterMenu(prev => !prev)} id="filter">
          {showFilterMenu ? "Hide Filter Menu" : "Filter Menu"}
        </button>
        {showFilterMenu && <div id="filter-functionality-container">
          <div id="filter-by-name-div">
            Filter by name: <input id="todo-filter-by-name" onChange={filterTodosByName} />
          </div>
          <div id="filter-by-tags-div">
            Filter by tags:
          </div>
          <div id="filter-by-priority-div">
            Filter by priority:
            <div>Priority:
              <select
                value={todoPriorityFilter} // ...force the select's value to match the state variable...
                onChange={e => setTodoPriorityFilter(e.target.value)} // ... and update the state variable on any change!
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Critical</option>
                <option value="">All (no filter)</option>
              </select>
            </div>
          </div>
          <div id="filter-by-estimated-div">
            Filter by estimated time in minutes (max): <input value={todoTimeMaxFilter} onChange={(e) => setTodoTimeMaxFilter(e.target.value)} />
            Filter by estimated time in minutes (min): <input value={todoTimeMinFilter} onChange={(e) => setTodoTimeMinFilter(e.target.value)} />
          </div>
          Filter by Due Date:
          <div id="filter-by-due-date-div">
            Filter by due date (up until):
            <DatePicker
              locale="sv"
              id="filter-todos-by-due-date"
              selected={todoDueDateFilter}
              onChange={(date) => setTodoDueDateFilter(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <button onClick={() => setTodoPendingFilter(prev => !prev)} >Filter by pending:</button>
          <div>
            <select
              value={todoStatusFilter} // ...force the select's value to match the state variable...
              onChange={e => setTodoStatusFilter(e.target.value)} // ... and update the state variable on any change!
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In progress</option>
              <option value="completed">Completed</option>
              <option value="all">All (no filter)</option>
            </select>
          </div>

          {/* Group actions */}
          {/* <button>{showGroupActions ? "Hide Group actions" : "Show Group actions"}</button>
          <div>
            <button>Delete all filtered todos</button>
            <button>Mark all filtered todos as completed</button>
            <button>Mark all filtered todos as in progress</button>
            <button>Mark all filtered todos as pending</button>
          </div> */}

        </div>}
        {/* New Todo */}
        <button onClick={() => setShowNewTodoMenu(prev => !prev)} id="newTodo">
          {showNewTodoMenu ? "Hide New Todo" : "New Todo"}
        </button>
        {showNewTodoMenu && <div id="newTodoMenu">
          <div>Name: <input value={newTodoName} id="newTodoName" onChange={e => setNewTodoName(e.target.value)} /></div>
          <div>Description: <textarea value={newTodoDescription} rows="5" cols="40" id="newTodoDescription" onChange={e => setNewTodoDescription(e.target.value)} /></div>
          <div>Due Date:
            <DatePicker
              locale="sv"
              id="newTodoDue"
              selected={newTodoDue}
              onChange={(date) => setNewTodoDue(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
          </div>
          <div>Priority: <select
            value={newTodoPriority} // ...force the select's value to match the state variable...
            onChange={e => setNewTodoPriority(e.target.value)} // ... and update the state variable on any change!
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select></div>
          <div>
            Estimated time (in minutes): <input value={newTodoTime} id="newTodoTime" onChange={e => setNewTodoTime(e.target.value)} />
          </div>
          <div>Selected tags: <div className="tags-container">
            {newTodoTags.length > 0 && newTodoTags.map(tag => <div className="selected-tag" onClick={() => removeTagFromTodoInMaking(tag.id)} key={tag.id}>{tag.name}</div>)}
          </div>
            Tags: <div className="tags-container">
              {categories.map(tag => <div id="todo-tag-selection" key={tag.id} onClick={() => addTagToNewTodo(tag)} >{tag.name}</div>)}
            </div> </div>
          <button onClick={() => { createNewTodo(); setTodoIsEdited(false) }}>{todoIsEdited ? "Finish Edited Todo" : "Create New Todo"}</button>
          {todoIsEdited && <button onClick={() => resetActiveTodo()} >Stop Editing Todo</button>}
        </div>}

        {/* Sorting functionality */}
        <button onClick={() => setShowSortMenu((prev) => !prev)} id="sort-menu-div" >
          {showSortMenu ? "Hide Sort menu" : "Show Sort menu"}
        </button>
        {showSortMenu && <div>
          <button onClick={sortTodosByPriority}>Sort by priority</button>
          <button onClick={sortTodosByEstimatedTime} >Sort by estimated time</button>
          <button onClick={sortTodosByDueDate} >Sort by due date</button>
        </div>}

        {/* Change View */}
        <button onClick={switchView} id="switchView">
          Switch to {listView ? "Post-it view" : "List view"}
        </button>
        <button onClick={() => setShowManageTags(prev => !prev)} id="showManageTags">
          {showManageTags ? "Hide Manage Tags" : "Manage Tags"}
        </button>

        {/* Manage tags */}
        {showManageTags && <div id="manageTags" >
          <div id="create-new-tag">
            <input onChange={e => setNewTagName(e.target.value)} id="newTagName" /><button onClick={submitTag} >Create new tag</button>
          </div>
          {categories.map(tag => <div key={tag.id} onClick={() => deleteTag(tag.id)} className="tag">{tag.name} </div>)}
        </div>}

        {/* Store todos locally */}
        <button onClick={() => setShowSavingOptions(prev => !prev)} >{showSavingOptions ? "Hide saving options" : "Show saving options"}</button>
        {showSavingOptions && <div> <button onClick={storeTodosInLocalStorage} >Save todos locally</button> </div>}
        

      </div>}

      {/* Render all todos */}
      {<div id="todos">
        {/* Filtering and mapping */}
        {todos && todoDueDateFilter && todoStatusFilter && (typeof todoNameFilter === "string" || todoNameFilter) && (typeof todoPriorityFilter === "string" || todoPriorityFilter) && (typeof todoTimeMaxFilter === "string" || todoTimeMaxFilter) && (typeof todoTimeMinFilter === "string" || todoTimeMinFilter) && todos.filter((todo) => todoNameFilter === "" || todo.name.startsWith(todoNameFilter)).filter((todo) => todoStatusFilter == "all" ? true : todoStatusFilter == "pending" && !todo.completed && !todo.inProgress ? true : todoStatusFilter == "completed" && todo.completed ? true : todoStatusFilter == "inProgress" && todo.inProgress ? true : false).filter((todo) => todo.due <= todoDueDateFilter).filter((todo) => todo.time >= todoTimeMinFilter ? true : todo.time == "" ? true : false).filter(todo => todo.time <= todoTimeMaxFilter ? true : todo.time == "" ? true : false).filter((todo) => { if (todoPriorityFilter == "") { return true } else { return todo.priority == todoPriorityFilter } }).map((todo) => <div
          className={"todo " + (listView ? "todo-list-view " : "todo todo-post-it-view ") + (todo.completed ? "todo-completed " : "")}
          key={todo.id}>
          <div id="todo-item-name" className="todo-item-content">
            {todo.name}
          </div>
          <div id="todo-item-description" className="todo-item-content">
            {todo.description}
          </div>
          <div className="todo-funcionality-container">
            <button className="complete-todo todo-button" onClick={() => todoIsCompleted(todo.id)} >
              <TbCheck color="green" size="2rem" />
            </button>
            <button className="inProgress-todo todo-button" onClick={() => todoIsInProgress(todo.id)} >
              <TbProgressCheck color="green" size="1.5rem" />
            </button>
            <button className="delete-todo todo-button" onClick={() => deleteTodo(todo.id)} id="deleteTodo" >
              <TfiClose color="red" size="1.5rem" />
            </button>
            <button className="edit-todo todo-button" onClick={() => { setShowMenu(true); setShowNewTodoMenu(true); editTodo(todo) }} id="editTodo" >
              <TbEdit size="1.5rem" />
            </button>
            <div>
              <TbTags size="1.5rem" /> <div className="todo-tags-per-todo-container" >{todo.tags.map(tag => <div key={tag.id}>{tag.name}</div>)}</div>
            </div>
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
