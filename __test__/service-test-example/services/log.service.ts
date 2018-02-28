import { Service } from "../../../index";

export default class LogService extends Service {
  level = 100; // log service should be init first
  public initedAt: Date;
  public username: string;
  async getUser() {
    return {
      name: "Axetroy"
    };
  }
  async init() {
    this.username = "admin";
    this.initedAt = new Date();

    // do some job
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }
}
