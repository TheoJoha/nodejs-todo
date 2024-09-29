import {Router} from express;
import {listAction, 
    removeAction,
    saveAction,
} from "./controller.js"

const router = Router()

router.get("/", listAction)
router.get("/delete/:id", removeAction)
// router.get("/delete/:id", removeAction)
router.post("/save", saveAction)

export {router}