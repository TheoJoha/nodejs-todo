let data = [
    {id: 1, name: "todo1", description: "...", time: 10},
    {id: 2, name: "todo2", description: "...", time: 20},
    {id: 3, name: "todo3", description: "...", time: 30}
]

export function getAll() {
    return Promise.resolve(data)
}

export function remove(id) {
    data = data.filter(todo => todo.id !== id)
    return Promise.resolve()
}