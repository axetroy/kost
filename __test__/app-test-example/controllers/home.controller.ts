import { Controller } from "../../../index";
import { All } from "../../../src/decorators";

export default class UserController extends Controller {
  @All("/")
  async index(ctx) {
    ctx.body = "hello world";
  }
}
