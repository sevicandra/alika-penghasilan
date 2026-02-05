import { ViewPajakKurang } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewPajakKurangRepository extends BaseRepository<ViewPajakKurang> {
  constructor() {
    super(ViewPajakKurang);
  }
}
