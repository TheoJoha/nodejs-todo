const data = [
    {id: 1, name: "todo1", description: "...", time: 10},
    {id: 2, name: "todo2", description: "...", time: 20},
    {id: 3, name: "todo3", description: "...", time: 30}
]

export function listAction(req,res) {
    res.send(data)
}