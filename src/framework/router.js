import { parse } from "url";

export default class Router {
  constructor() {
    this.routes = { GET: [], POST: [], PUT: [], DELETE: [] };
  }

  register(method, path, handler) {
    const paraNames = [];
    const regexPath = path.replace(/:([^/]+)/g, (_, paraName) => {
      paraNames.push(paraName);
      return "([^/]+)";
    });

    this.routes[method].push({
      regex: new RegExp(`^${regexPath}$`),
      paraNames,
      handler,
    });
  }

  match(method, url) {
    const { pathname } = parse(url, true);
    const routes = this.routes[method] || [];

    for (const route of routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = route.paraNames.reduce((acc, paraName, index) => {
          acc[paraName] = match[index + 1];
          return acc;
        }, {});
        return { handler: route.handler, params };
      }
    }

    return { handler: null, params: {} };
  }
}
