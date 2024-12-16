import http from "http";
import { parse } from "url";
import { parse as parseBody } from "qs";
import getRawBody from "raw-body";

export class App {
  constructor() {
    this.routes = { GET: [], POST: [], PUT: [], DELETE: [] };
  }

  registerRoute(method, path, handler) {
    this.routes[method].push({ path, handler });
  }
  get(path, handler) {
    this.registerRoute("GET", path, handler);
  }

  post(path, handler) {
    this.registerRoute("POST", path, handler);
  }

  put(path, handler) {
    this.registerRoute("PUT", path, handler);
  }

  delete(path, handler) {
    this.registerRoute("DELETE", path, handler);
  }

  handleRequest(req, res) {
    const { pathname, query } = parse(req.url, true);
    const method = req.method;
    const route = this.routes[method].find((r) => r.path === pathname);

    if (!route) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end('Route not found');
    }

    const handler = route.handler;

    if (['POST', 'PUT'].includes(method)){
        getRawBody(req, {encoding : true}).then(rawBody => {
            const body = parseBody(rawBody);
            req.body = body;
            req.query = query;
            handler(req, res);
        })
        .catch(err =>{
            res.writeHead(500, {'Content-Type' : 'text/plain'});
            res.end('Error processing request body');
        })
    } else {
        req.query = query;
        handler(req, res);
    }
  }

  // starting the server 
  listen(port, callback){
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(port, callback);
  }
}
