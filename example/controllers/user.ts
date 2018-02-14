import { Controller, Inject, GET } from "../../index";

import UserService from "../services/user";

class UserController extends Controller {
  @Inject() user: UserService;

  @GET("/")
  index(ctx, next) {
    ctx.body = "hello world";
  }
  @GET("/whoami")
  async name(ctx, next) {
    ctx.body = await this.user.getUser();
  }
  @GET(/^\/user\/\w/gi)
  async info(ctx, next) {
    ctx.body = "regular expression match";
  }
}

export default UserController;
