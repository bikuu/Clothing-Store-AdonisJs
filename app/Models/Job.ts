import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;
  @column()
  public title: string;
  @column()
  public images: string[];
  @column()
  public categories: string[];
  @column()
  public description: string;
  @column()
  public price: number;
  @column()
  public hiring_status: string;
  @column()
  public location: object;
  static searchByLocation(location) {
    return this.query().whereRaw(
      `location->>'city' like '%${location}%' or location->>'state' like '%${location}%' or location->>'postalcode' like '%${location}%'`
    );
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
