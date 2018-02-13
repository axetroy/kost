import { Service, Inject } from "../../index";

class UserService extends Service {
  async getUser() {
    return {
      name: "axetroy",
      age: 21
    };
  }
  async init() {
    console.log("创建一个默认账户...");
  }
}

export default UserService;
