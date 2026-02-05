import { RefBulan } from "@/models";
import { BaseRepository } from "./base-repository";

export class RefBulanRepository extends BaseRepository<RefBulan> {
  constructor() {
    super(RefBulan);
  }
}
