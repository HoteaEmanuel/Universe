import router from "express";
import { generateHashtags, listModels } from "../controllers/aiController.js";

const aiRouter = router.Router();
aiRouter.post("/ai/hashtags", generateHashtags);
aiRouter.get('/ai/models',listModels);
export default aiRouter;