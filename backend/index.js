const express = require('express')
import {router as todoRouter} from "./todo/index.js"

const app = express()

// constants
const port = 3003

// rotue todo to todo router
app.use("/", todoRouter)

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.redirect("/todo"))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })