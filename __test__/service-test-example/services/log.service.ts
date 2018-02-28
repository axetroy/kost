import { Service } from "../../../index";

export default class LogService extends Service {
  level = 100; // log service should be init first
  public initedAt: Date;
  async init() {
    this.initedAt = new Date();

    // do some job
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }
}
