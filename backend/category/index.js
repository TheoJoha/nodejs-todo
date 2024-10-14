import {Router} from "express";
import {listAction, 
    removeAction,
    saveAction,
} from "./controller.js"

const router = Router()

// routes
router.get("/", listAction)
router.delete("/delete/:id", removeAction)
router.post("/save", saveAction)

// treat other requests as getting all categories
router.get("*", listAction)


export {router}