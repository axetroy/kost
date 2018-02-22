import { Controller$ } from "../controller";
export declare function Get(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Post(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Put(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Delete(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Head(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Patch(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Options(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function All(path: string | RegExp): (target: Controller$, propertyKey: string, descriptor: PropertyDescriptor) => void;
