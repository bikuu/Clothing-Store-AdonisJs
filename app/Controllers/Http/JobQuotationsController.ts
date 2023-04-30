import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job_QuotationValidator from "App/Validators/Job_QuotationValidator";
import JobsQuotation from "App/Models/JobsQuotation";

export default class JobQuotationsController {
  public async index({ auth, response, params }: HttpContextContract) {
    const { id } = params;

    try {
      if (id) {
        const data = await JobsQuotation.findBy("id", id);
        if (
          data &&
          (auth.user?.id === data.consumer_id ||
            auth.user?.id === data.maker_id)
        ) {
          return response.status(200).send({ data: data });
        }
      }

      const datas = await JobsQuotation.all();
      const newDatas = datas?.map((data) => {
        if (datas && auth.user?.id === data.consumer_id) {
          return data;
        }
      });
      console.log(datas.length);
      return response.status(200).send({ datas: newDatas });
    } catch (error) {
      response.status(500).send({ msg: error });
    }
  }

  public async create({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(Job_QuotationValidator);

    try {
      if (auth.user?.role === "maker") {
        const jobsQuotation = new JobsQuotation();
        //   if(payload.maker_id)
        jobsQuotation.fill(payload);
        await jobsQuotation.save();

        return response.status(200).send({
          msg: "Successfully applied",
          data: jobsQuotation,
        });
      }
      return response
        .status(403)
        .send({ msg: "You are not aruthotized, you must be a maker." });
    } catch (error) {
      response.status(500).send({ msg: error });
    }
  }

  public async update({
    auth,
    request,
    response,
    params,
  }: HttpContextContract) {
    const { id } = params;
    const payload = await request.validate(Job_QuotationValidator);

    const jobsQuotation = await JobsQuotation.findOrFail(id);
    try {
      if (
        auth.user?.id === jobsQuotation.consumer_id ||
        auth.user?.id === jobsQuotation.maker_id
      ) {
        jobsQuotation.merge(payload);
        await jobsQuotation.save();
        return response
          .status(200)
          .send({ msg: "Updated Successfully", data: JobsQuotation });
      }
    } catch (error) {
      return response.unauthorized("Invalid credentials error");
    }
  }
  public async destroy({ auth, response, params }: HttpContextContract) {
    const { id } = params;

    const jobsQuotation = await JobsQuotation.findBy("id", id);

    try {
      if (
        jobsQuotation &&
        (auth.user?.id === jobsQuotation.consumer_id ||
          auth.user?.id === jobsQuotation.maker_id)
      ) {
        jobsQuotation.delete();

        return response.send({ msg: "JobsQuotation Deleted Succesfully" });
      }
      return response.status(403).send({ msg: "You are not authorized" });
    } catch (error) {
      return response.unauthorized("Invalid credentials error");
    }
  }
}
