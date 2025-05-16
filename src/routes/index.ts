import { Router } from "express";
import v1 from "./v1";
import v2 from "./v2";
import { authenticate } from "@/middlewares/auth.middleware";
import { errorResponse } from "@/helpers/respose.helper";
const router = Router();

router.use("/v1", v1);
router.use("/v2", v2);

router.use((req, res, next) => {
  return errorResponse(res, "Route not found", null, 404);
});
export default router;
