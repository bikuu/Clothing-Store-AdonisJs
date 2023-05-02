/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    Route.get("/job/search", "JobsController.search");
    Route.get("/workfolio/:id?", "WorkfoliosController.index");
    Route.post("/register", "UsersController.register");
    Route.post("/login", "UsersController.login");
  });

  Route.group(() => {
    Route.get("/user/:id?", "UsersController.index");
    Route.put("/user/:id", "UsersController.update");
    Route.delete("/user/:id", "UsersController.delete");
    Route.post("/logout", "UsersController.logout");

    Route.get("/job/:id?", "JobsController.index");
    Route.post("/job/create", "JobsController.create");
    Route.put("/job/:id", "JobsController.update");
    Route.delete("/job/:id", "JobsController.destroy");

    Route.post("/workfolio/create", "WorkfoliosController.create");
    Route.put("/workfolio/:id", "WorkfoliosController.update");
    Route.delete("/workfolio/:id", "WorkfoliosController.destroy");

    Route.get("/jobquotas/:id?", "JobQuotationsController.index");
    Route.post("/jobquotas/create", "JobQuotationsController.create");
    Route.put("/jobquotas/:id", "JobQuotationsController.update");
    Route.delete("/jobquotas/:id", "JobQuotationsController.destroy");
  }).middleware("auth");
});
