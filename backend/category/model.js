let data = [
    {id: 1, name: "Important"}, 
    {id: 2, name: "Easy"}
]

function getNextId() {
    return Math.max(...data.map((tag) => tag.id)) + 1
}

function insert(tag) {
    tag.id = getNextId()
    data.push(tag)
}

function update(tag) {
    tag.id = parseInt(tag.id, 10)
    const index = data.findIndex((item) => item.id === tag.id)
    data[index] = tag
}

export function getAll() {
    return Promise.resolve(data)
}

export function get(id) {
    return Promise.resolve(data.find((tag) => tag.id === id))
}

export function remove(id) {
    data = data.filter(tag => tag.id !== id)
    return Promise.resolve()
}

export function save(tag) {

    if (tag.id == "" || typeof tag.id == "undefined" || Object.keys(tag).length == 1) {
        insert(tag)
    } else {
        update(tag)
    }
    return Promise.resolve()
}