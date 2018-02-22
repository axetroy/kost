import { Controller$ } from "../controller";
export declare function Use(middlewareName: string, options?: any): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
