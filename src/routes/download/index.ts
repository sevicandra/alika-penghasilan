import { Router } from "express";
import {pdf} from "@/controllers/download.controller"


const router = Router();

router.get(`/pdf/:fileName`, pdf)


export default router;
