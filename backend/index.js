import express from "express"
import {router as todoRouter} from "./todo/index.js"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json())    // <==== parse request body as JSON


// constants
const port = 3003

// rotue todo to todo router
app.use("/todo", todoRouter)

// use todo router for other requests as well
app.use("*", todoRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })