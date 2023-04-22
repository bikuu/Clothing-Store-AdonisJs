import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job_QuotationValidator from "App/Validators/Job_QuotationValidator";
import JobsQuotation from "App/Models/JobsQuotation";

export default class JobQuotationsController {
  public async index({ response, params }: HttpContextContract) {
    const { id } = params;
    if (id) {
      const data = await JobsQuotation.findBy("id", id);
      if (data) {
        return response.status(200).send(data);
      }
    }
    const datas = await JobsQuotation.all();
    console.log(datas.length);
    return response.status(200).send(datas);
  }

  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(Job_QuotationValidator);

    try {
      const jobsQuotation = new JobsQuotation();
      //   if(payload.maker_id)
      jobsQuotation.fill(payload);
      await jobsQuotation.save();

      return response.status(200).send(jobsQuotation);
    } catch (error) {
      response.send(error);
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { id } = params;
    const payload = await request.validate(Job_QuotationValidator);

    const jobsQuotation = await JobsQuotation.findOrFail(id);
    try {
      jobsQuotation.merge(payload);
      await jobsQuotation.save();
      return response.status(200).send(JobsQuotation);
    } catch (error) {
      return response.unauthorized("Invalid credentials error");
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    const { id } = params;

    const jobsQuotation = await JobsQuotation.findBy("id", id);
    if (jobsQuotation) {
      jobsQuotation.delete();

      return response.send({ msg: "JobsQuotation Deleted Succesfully" });
    }
  }
}
