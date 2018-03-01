import { Controller, Get, Use } from "../../../index";

export default class UserController extends Controller {
  @Use("limit") // limit is not a valid middleware, it will throw an error when init
  @Get("/")
  async index(ctx, next) {}
}
