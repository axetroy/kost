import { Service, Inject } from "../../../index";

class OrmService extends Service {
  async getUser() {
    return {
      name: "axetroy",
      age: 21
    };
  }
  async init() {
    console.log("初始化数据库连接...");
  }
}

export default OrmService;
