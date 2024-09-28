import {getAll, remove} from "./model.js"

export async function listAction(req,res) {
    const data = await getAll()
    res.send(data)
}

export async function removeAction(req, res) {
    const id = parseInt(req.params.id, 10)
    await remove(id)
    res.redirect(req.baseUrl)
}