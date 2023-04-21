import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job from "App/Models/Job";
import JobValidator from "App/Validators/JobValidator";

export default class JobsController {
  public async index({ response, params }: HttpContextContract) {
    const { id } = params;
    if (id) {
      const data = await Job.findBy("id", id);
      if (data) {
        const categories = JSON.parse(JSON.stringify(data.categories));
        const categoriesArray = categories
          .split(",")
          .map((category) => category.replace(/[{}"']/g, ""));
        data.categories = categoriesArray;
        return response.status(200).send(data);
      }
    }
    const datas = await Job.all();
    console.log(datas.length);
    for (let i = 0; i < datas?.length; i++) {
      let categories = JSON.parse(JSON.stringify(datas[i].categories));
      let categoriesArray = categories
        .split(",")
        .map((category) => category.replace(/[{}"']/g, ""));
      datas[i].categories = categoriesArray;
    }
    return response.status(200).send(datas);
  }

  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(JobValidator);
    // return payload;

    const data = await Job.create(payload);
    return response.status(200).send(data);
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { id } = params;
    const payload = await request.validate(JobValidator);

    const data = await Job.findOrFail(id);
    data.merge(payload);
    await data.save();

    return response.status(200).send(data);
  }

  public async destroy({ request, response, params }: HttpContextContract) {
    const { id } = params;

    const data = await Job.findBy("id", id);
    if (data?.user_id === request.input("user_id")) {
      //  data?.delete();

      return response.send({ msg: "Job Deleted" });
    } else {
      return response.status(401).send({ msg: "Unauthorized User" });
    }
  }
}
