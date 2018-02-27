import { Service } from "../../../index";

export default class UserService extends Service {
  public username: string;
  async getUser() {
    return {
      name: "Axetroy"
    };
  }
  async init() {
    this.username = "admin";
  }
}
