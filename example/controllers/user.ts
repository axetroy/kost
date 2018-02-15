import { Controller, Inject, GET, USE, Context } from "../../index";

import UserService from "../services/user";

class UserController extends Controller {
  @Inject() user: UserService;
  @Inject() context: Context;

  @GET("/")
  index(ctx, next) {
    ctx.body = "hello world";
  }
  @GET("/whoami")
  async name(ctx, next) {
    ctx.body = await this.user.getUser();
  }
  @GET(/^\/user\/\w/gi)
  @USE("logger")
  async info(ctx, next) {
    console.log(this.context);
    ctx.body = "regular expression match";
  }
}

export default UserController;
