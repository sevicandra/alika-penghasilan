import { Router } from "express";
import z from "zod";
import { tteController } from "@/controllers/v2/tte.controller";
import { validateBody } from "@/middlewares/validate-request.middleware";

const router = Router();

const bodySchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
  passphrase: z.string("passphrase is required").min(1, "passphrase is required"),
});

router.post("/", validateBody(bodySchema), tteController.tte);
router.post("/Kp4s", validateBody(bodySchema), tteController.tteKp4s);
export default router;
