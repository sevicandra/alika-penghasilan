import { ViewPajakGaji } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewPajakGajiRepository extends BaseRepository<ViewPajakGaji> {
  constructor() {
    super(ViewPajakGaji);
  }
}
