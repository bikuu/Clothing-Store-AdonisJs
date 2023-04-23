import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job_QuotationValidator from "App/Validators/Job_QuotationValidator";
import JobsQuotation from "App/Models/JobsQuotation";

export default class JobQuotationsController {
  public async index({ auth, response, params }: HttpContextContract) {
    const { id } = params;

    if (id) {
      const data = await JobsQuotation.findBy("id", id);
      if (
        data &&
        (auth.user?.id === data.consumer_id || auth.user?.id === data.maker_id)
      ) {
        return response.status(200).send(data);
      }
    }

    const datas = await JobsQuotation.all();
    const newDatas = datas?.map((data) => {
      if (datas && auth.user?.id === data.consumer_id) {
        return data;
      }
    });
    console.log(datas.length);
    return response.status(200).send(newDatas);
  }

  public async create({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(Job_QuotationValidator);

    if (auth.user?.role === "maker") {
      const jobsQuotation = new JobsQuotation();
      //   if(payload.maker_id)
      jobsQuotation.fill(payload);
      await jobsQuotation.save();

      return response.status(200).send(jobsQuotation);
    }
    return response
      .status(403)
      .send({ msg: "You are not aruthotized, you must be a maker." });
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
        return response.status(200).send(JobsQuotation);
      }
    } catch (error) {
      return response.unauthorized("Invalid credentials error");
    }
  }
  public async destroy({ auth, response, params }: HttpContextContract) {
    const { id } = params;

    const jobsQuotation = await JobsQuotation.findBy("id", id);

    if (
      jobsQuotation &&
      (auth.user?.id === jobsQuotation.consumer_id ||
        auth.user?.id === jobsQuotation.maker_id)
    ) {
      jobsQuotation.delete();

      return response.send({ msg: "JobsQuotation Deleted Succesfully" });
    }
  }
}
