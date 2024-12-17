import http from "http";
import Router from "./router.js";
import { executeMiddlewares } from "./middleware.js";

export class App {
  constructor() {
    this.router = new Router();
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  get(path, handler) {
    this.router.register("GET", path, handler);
  }

  post(path, handler) {
    this.router.register("POST", path, handler);
  }

  put(path, handler) {
    this.router.register("PUT", path, handler);
  }

  delete(path, handler) {
    this.router.register("DELETE", path, handler);
  }

  handleRequest(req, res) {
    console.log(`Incoming Request : ${req.method} ${req.url}`);
    executeMiddlewares(this.middlewares, req, res, () => {
      const { handler, params } = this.router.match(req.method, req.url);
      if (handler) {
        req.params = params;
        handler(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
      }
    });
  }

  listen(port, callback) {
    const server = http.createServer((req, res) =>
      this.handleRequest(req, res)
    );
    server.listen(port, callback);
  }
}
