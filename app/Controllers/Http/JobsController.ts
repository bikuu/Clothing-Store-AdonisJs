import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job from "App/Models/Job";
import JobValidator from "App/Validators/JobValidator";
const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "dlnht8dzh",
//   api_key: "723915662397195",
//   api_secret: "U2ROIGkiFIyJl0ndf63LOBqmC9c",
// });

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
       
       if(data.images){
        const images = JSON.parse(JSON.stringify(data.images));
        const imagesArray = images
          .split(",")
          .map((image) => image.replace(/[{}"']/g, ""));
        data.images = imagesArray;
       }
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
      
     if(datas[i].images){
      let images = JSON.parse(JSON.stringify(datas[i].images));
      const imagesArray = images
        .split(",")
        .map((image) => image.replace(/[{}"']/g, ""));
        datas[i].images = imagesArray;
     }

      }
      return response.status(200).send(datas);
  }

  public async create({ request, response }: HttpContextContract) {
    // const file = request.file("images");

    const payload = await request.validate(JobValidator);
    // return payload;
    const { images, ...others } = payload;

    const job = new Job();
    job.fill(others);
    // Upload
    if (images) {
      if (images) {
        const uploadedImages = await Promise.all(
          images.map(async (file) => {
            const result = await cloudinary.uploader.upload(file?.tmpPath);
            return result.secure_url;
          })
        );
        // const result = await cloudinary.uploader.upload(images?.tmpPath);

        job.images = uploadedImages;
      }
      await job.save();

      return response.status(200).send(job);
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { id } = params;
    const payload = await request.validate(JobValidator);
    const { images, ...others } = payload;

    const job = await Job.findOrFail(id);
    job.merge(others);
    if (images) {
      if (images) {
        const uploadedImages = await Promise.all(
          images.map(async (file) => {
            const result = await cloudinary.uploader.upload(file?.tmpPath);
            return result.secure_url;
          })
        );

        job.images = uploadedImages;
      }
      await job.save();

      return response.status(200).send(job);
    }
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
