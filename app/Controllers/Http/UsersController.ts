import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
const cloudinary = require("cloudinary").v2;

import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";
import Hash from "@ioc:Adonis/Core/Hash";

export default class UsersController {
  public async index({ auth, response, params }: HttpContextContract) {
    const { id } = params;
    await auth.use("api").authenticate();
    const user = auth.user;
    try {
      if (id) {
        const data = await User.findBy("id", id);

        return response.status(200).send(data);
      }
      return response.status(200).send({ data: user });
    } catch (error) {
      response.send({ msg: error });
    }
  }

  public async register({ request, response }: HttpContextContract) {
    // const {id, email, first_name,last_name, password} = request.body();
    const payload = await request.validate(UserValidator);
    const { image, ...others } = payload;

    try {
      const user = new User();
      user.fill(others);
      if (image) {
        const result = await cloudinary.uploader.upload(image?.tmpPath);

        user.image = result.secure_url;
      }
      await user.save();

      return response
        .status(200)
        .send({ msg: "User created sucessfully", data: user });
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
      response
        .status(200)
        .send({ msg: "logged in sucessfully", token: token, data: user });
    } catch {
      return response.unauthorized("Invalid credentials error");
    }
  }

  public async logout({ auth, response }) {
    try {
      await auth.use("api").revoke();
      return response.status(201).send({
        revoked: true,
        msg: "User is logged out",
      });
    } catch (error) {
      return response.unauthorized({ msg: error });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    // const {id, email, first_name,last_name, password} = request.body();
    const { id } = params;
    const payload = await request.validate(UserValidator);
    const { image, ...others } = payload;

    const user = await User.findOrFail(id);
    try {
      user.merge(others);
      if (image) {
        const result = await cloudinary.uploader.upload(image?.tmpPath);

        user.image = result.secure_url;
      }
      await user.save();
      return response
        .status(200)
        .send({ msg: "User updated sucessfully", updatedUser: user });
    } catch (error) {
      return response.unauthorized("Invalid credentials error");
    }
  }
  public async delete({ response, params }: HttpContextContract) {
    // const {id, email, first_name,last_name, password} = request.body();
    const { id } = params;
    // const payload = await request.validate(UserValidator)

    const user = await User.findBy("id", id);
    try {
      if (user) {
        user.delete();

        return response.send({ msg: "User Deleted Succesfully" });
      }
    } catch (error) {
      return response.unauthorized({ msg: error });
    }
  }
}
