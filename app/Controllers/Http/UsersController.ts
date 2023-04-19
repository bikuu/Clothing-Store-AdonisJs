// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
  public async index({ response }) {
    const users = await User.all();
    return response.send(users);
  }
  public async store({ request, response }) {
    // const {id, email, first_name,last_name, password} = request.body();
    const payload = await request.validate(UserValidator);

    try {
      const users = await User.create(payload);
      return response.send(users);
    } catch (error) {
      response.send(error);
    }
  }
  public async update({ request, response, params }) {
    // const {id, email, first_name,last_name, password} = request.body();
    const { id } = params;
    const payload = await request.validate(UserValidator);

    const users = await Database.from("users").where("id", id).update(payload);
    return response.send(users);
  }
  public async delete({ response, params }) {
    // const {id, email, first_name,last_name, password} = request.body();
    const { id } = params;
    // const payload = await request.validate(UserValidator)

    const user = await User.findBy("id", id);
    if (user) {
      user.delete();

      return response.send("Deleted");
    }
  }
}
