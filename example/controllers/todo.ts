import { Controller, Inject, GET } from "../../index";

import UserService from "../services/user";

export default class TodoController extends Controller {
  @Inject() user: UserService;

  @GET("/todo/list")
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
  @GET("/whoami")
  async name(ctx, next) {
    ctx.body = await this.user.getUser();
  }
}
