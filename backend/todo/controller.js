import {getAll, remove, get, save} from "./model.js"

export async function listAction(req,res) {
    const data = await getAll()
    res.send(data)
}

export async function removeAction(req, res) {
    const id = parseInt(req.params.id, 10)
    console.log(id)
    await remove(id)
    res.redirect(req.baseUrl)
}

/* export async function createAction(req, res) {
    let todo = {id: "", name: "", description: "", time: ""}

    if (req.params.id) {
        todo = await getAll(parseInt(req.params.id, 10))
    }

} */

export async function saveAction(req, res) {

    const todo = {
        id: req.body.id,
        name: req.body.name,
        priority: req.body.priority,
        description: req.body.description,
        time: req.body.time,
        due: req.body.due | "",
        tags: req.body.tags,
        doneAt: req.body.doneAt | "",
        createdAt: req.body.createdAt | new Date(),
        completed: req.body.completed,
        inProgess: req.body.inProgress,
    }

    await save(todo)

    res.redirect(req.baseUrl)
}