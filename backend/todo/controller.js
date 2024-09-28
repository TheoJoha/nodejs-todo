import {getAll} from "./model.js"

export async function listAction(req,res) {
    const data = await getAll()
    res.send(data)
}