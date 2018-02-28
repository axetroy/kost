import { Controller } from "../../../index";
import { All, Get } from "../../../src/decorators";

export default class UserController extends Controller {
  @All("/")
  async index(ctx) {
    ctx.body = "hello world";
  }
  @Get("/name")
  async name(ctx) {
    ctx.body = "axetroy";
  }
}
