import { DateTime } from "luxon";
import {
  BaseModel,
  beforeFetch,
  beforeSave,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public first_name: string;
  @column()
  public last_name: string;
  @column()
  public email: string;
  @column()
  public password: string;
  @column()
  public role: string;
  @column()
  public address: string;
  @column()
  public phone: number;
  @column()
  public dob: Date;
  @column()
  public imageProfile: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
  // @beforeFetch()
  // public static async comparePassword(user:User){
  //   if(user.$dirty.password){
  //     user.password = await Has
  //   }
  // }
}
