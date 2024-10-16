let data = [
    {id: 1, name: "todo1", description: "...", time: 10, priority: 1, due: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), doneAt: "", createdAt: "", tags: [], completed: false, inProgress: false},
    {id: 2, name: "todo2", description: "...", time: 20, priority: 1, due: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), doneAt: "", createdAt: "", tags: [], completed: false, inProgress: false},
    {id: 3, name: "todo3", description: "...", time: 30, priority: 3, due: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), doneAt: "", createdAt: "", tags: [], completed: false, inProgress: false}
]

function getNextId() {
    return Math.max(...data.map((todo) => todo.id)) + 1
}

function insert(todo) {
    todo.id = getNextId()
    data.push(todo)
}

function update(todo) {
    todo.id = parseInt(todo.id, 10)
    const index = data.findIndex((item) => item.id === todo.id)
    data[index] = todo
    console.log("updating new todo", todo)
}

export function getAll() {
    return Promise.resolve(data)
}

export function get(id) {
    return Promise.resolve(data.find((todo) => todo.id === id))
}

export function remove(id) {
    data = data.filter(todo => todo.id !== id)
    return Promise.resolve()
}

export function save(todo) {
    console.log(todo.id, todo, "create new todo")
    if (todo.id == "" || typeof todo.id == "undefined") {
        insert(todo)
    } else {
        update(todo)
    }
    return Promise.resolve()
}