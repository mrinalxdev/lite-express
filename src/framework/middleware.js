export function executeMiddlewares(middlewares, req, res, done) {
  let index = 0;

  function next() {
    if (index < middlewares.length) {
      const middleware = middlewares[index];
      index++;
      middleware(req, res, next);
    } else {
      done(); // Call the final handler after all middlewares are executed
    }
  }

  next();
}
