import {getAll, remove, get, save} from "./model.js"

export async function listAction(req,res) {
    const data = await getAll()
    res.send(data)
}

export async function removeAction(req, res) {
    const id = parseInt(req.params.id, 10)
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
        description: req.body.description,
        time: req.body.time,
    }

    await save(todo)

    res.redirect(req.baseUrl)
}