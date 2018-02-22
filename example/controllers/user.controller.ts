import { Controller, Inject, Get, Use, Context } from "../../index";

import UserService from "../services/user.service";

class UserController extends Controller {
  @Inject() user: UserService;
  @Inject() context: Context;

  @Get("/")
  index(ctx, next) {
    ctx.body = "hello world";
  }
  @Get("/hello")
  async say(ctx, next) {
    await ctx.render("index.html");
  }
  @Get("/whoami")
  async name(ctx, next) {
    ctx.body = await this.user.getUser();
  }
  @Get(/^\/user\/\w/gi)
  @Use("logger")
  async info(ctx, next) {
    console.log(this.context);
    ctx.body = "regular expression match";
  }
}

export default UserController;
