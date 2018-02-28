import { Controller, Inject, Get, Post } from "../../index";

import UserService from "../services/user.service";

export default class TodoController extends Controller {
  @Inject() user: UserService;

  @Get("/todo/list")
  index(ctx, next) {
    ctx.body = [
      {
        name: "Shopping",
        state: "done"
      },
      {
        name: "Buy a house",
        state: "undone"
      }
    ];
  }
  @Post("/todo/create")
  async name(ctx, next) {
    ctx.body = "create a new todo task";
  }
}
