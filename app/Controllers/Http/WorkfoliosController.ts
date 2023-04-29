import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Workfolio from "App/Models/Workfolio";
import WorkfolioValidator from "App/Validators/WorkfolioValidator";
const cloudinary = require("cloudinary").v2;

export default class WorkfoliosController {
  public async index({ response, params }: HttpContextContract) {
    const { id } = params;
    try {
      if (id) {
        const data = await Workfolio.findBy("id", id);
        if (data) {
          // const categories = JSON.parse(JSON.stringify(data.categories));
          // const categoriesArray = categories
          //   .split(",")
          //   .map((category) => category.replace(/[{}"']/g, ""));

          // data.categories = categoriesArray;

          if (data.images) {
            const images = JSON.parse(JSON.stringify(data.images));
            const imagesArray = images
              .split(",")
              .map((image) => image.replace(/[{}"']/g, ""));
            data.images = imagesArray;
          }
          return response.status(200).send(data);
        }
      }
    } catch (error) {
      response.send({ msg: error });
    }
    const datas = await Workfolio.all();
    console.log(datas.length);

    try {
      if (datas) {
        for (let i = 0; i < datas?.length; i++) {
          // let categories = JSON.parse(JSON.stringify(datas[i].categories));

          // let categoriesArray = categories
          //   .split(",")
          //   .map((category) => category.replace(/[{}"']/g, ""));
          // datas[i].categories = categoriesArray;

          if (datas[i].images) {
            let images = JSON.parse(JSON.stringify(datas[i].images));
            const imagesArray = images
              .split(",")
              .map((image) => image.replace(/[{}"']/g, ""));
            datas[i].images = imagesArray;
          }
        }
        return response.status(200).send(datas);
      }
      return response.status(203).send({ msg: "No data" });
    } catch (error) {
      response.send({ msg: error });
    }
  }

  public async create({ auth, request, response }: HttpContextContract) {
    // const file = request.file("images");

    const payload = await request.validate(WorkfolioValidator);
    // return payload;
    const { images, ...others } = payload;
    try {
      if (auth.user?.role === "maker") {
        const workfolio = new Workfolio();
        workfolio.fill(others);
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

            workfolio.images = uploadedImages;
          }
          await workfolio.save();

          return response.status(200).send(workfolio);
        }
      } else {
        response.status(403).send({ msg: "Only maker can post their gigs" });
      }
    } catch (error) {
      response.send({ msg: error });
    }
  }

  public async update({
    auth,
    request,
    response,
    params,
  }: HttpContextContract) {
    const { id } = params;
    const payload = await request.validate(WorkfolioValidator);
    const { images, ...others } = payload;
    try {
      if (auth.user?.role === "maker") {
        const workfolio = await Workfolio.findOrFail(id);
        workfolio.merge(others);
        if (images) {
          const uploadedImages = await Promise.all(
            images.map(async (file) => {
              const result = await cloudinary.uploader.upload(file?.tmpPath);
              return result.secure_url;
            })
          );

          workfolio.images = uploadedImages;
        }
        await workfolio.save();

        return response.status(200).send(workfolio);
      } else {
        response.status(403).send({ msg: "Only maker can post their gigs" });
      }
    } catch (error) {
      response.send({ msg: error });
    }
  }

  public async destroy({ auth, response, params }: HttpContextContract) {
    const { id } = params;

    const data = await Workfolio.findBy("id", id);
    try {
      if (data?.user_id === auth.user?.id) {
        data?.delete();

        return response.send({ msg: "Workfolio Deleted" });
      } else {
        return response.status(401).send({ msg: "Unauthorized User" });
      }
    } catch (error) {
      response.send({ msg: error });
    }
  }
}
