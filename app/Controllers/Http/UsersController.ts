import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";
import Hash from "@ioc:Adonis/Core/Hash";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all();
    return response.send(users);
  }

  public async register({ request, response }: HttpContextContract) {
    // const {id, email, first_name,last_name, password} = request.body();
    const payload = await request.validate(UserValidator);

    try {
      const users = await User.create(payload);
      return response.status(200).send(users);
    } catch (error) {
      response.send(error);
    }
  }
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      // Lookup user manually
      const user = await User.findBy("email", email);
      if (!user) return response.unauthorized("Email not found");
      // Verify password
      if (!(await Hash.verify(user.password, password))) {
        return response.unauthorized("Invalid credentials");
      }
      const token = await auth.attempt(email, password);
      response.status(200).send(token);
    } catch {
      return response.unauthorized("Invalid credentials error");
    }
  }

  public async logout({ auth, response }) {
    await auth.use("api").revoke();
    return {
      revoked: true,
    };
  }

  public async update({ request, response, params }: HttpContextContract) {
    // const {id, email, first_name,last_name, password} = request.body();
    const { id } = params;
    const payload = await request.validate(UserValidator);

    const user = await User.findOrFail(id);
    user.merge(payload);
    await user.save();

    return response.status(200).send(user);
  }
  public async delete({ response, params }: HttpContextContract) {
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
