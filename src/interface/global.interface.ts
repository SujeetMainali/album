import { type Router } from "express";

export interface IRoute {
  path: string;
  route: Router;
}
