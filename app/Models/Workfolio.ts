import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Workfolio extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public user_id: number;
  @column()
  public skill: string;
  @column()
  public images: string[];
  @column()
  public categories: string[];
  @column()
  public description: string;
  @column()
  public experience: string;
  @column()
  public price: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
