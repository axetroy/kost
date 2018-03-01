import * as Koa from "koa";
import { Controller } from "../../../index";
import { All, Get } from "../../../src/decorators";

export default class UserController extends Controller {
  @All("/")
  async index(ctx: Koa.Context) {
    ctx.body = "hello world";
  }
  @Get("/view")
  async view(ctx: Koa.Context) {
    console.log("enter view handler");
    await ctx.render("index");
  }
}
