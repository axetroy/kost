import { Controller, Get } from "../../../index";

export default class HomeController extends Controller {
  @Get("/")
  index(ctx) {
    ctx.body = "hello world";
  }
}
