import { doesNotThrow } from "assert";
import fs from "fs";
import path from "path";

export function executeMiddlewares(middlewares, req, res, done) {
  let index = 0;

  
  function next(err){
    if (!res || typeof res.writeHead !== "function"){
      console.error("Invalid response object in middleware chain")
      return;
    }

    if (err) return done(err);

    const middleware = middlewares[index++];
    if (middleware){
      middleware(req, res, next);
    } else {
      done();
    }
  }

  next();
}

export function bodyParser(req, res, next) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    if (req.headers["content-type"]?.includes("application/json")) {
      try {
        req.body = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }
    } else if (
      req.headers["content-type"]?.includes("application/x-www-form-urlencoded")
    ) {
      req.body = Object.fromEntries(new URLSearchParams(body));
    } else {
      req.body = body; // this here i am putting so that if it isn't able to go with the json
      // toh it will go with the raw text as usual.
    }

    next();
  });
}

export function errorHandler(err, req, res, next) {
  console.log("Error :", err.message);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ error: "Internal Server Error ", message: err.message }),
  );
}

export function staticFiles(directory) {
  return (req, res, next) => {
    const filePath = path.join(directory, req.url);
    fs.stat(filePath, (err, Stats) => {
      if (!err && Stats.isFile()) {
        const stream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": getContentType(filePath) });
        stream.pipe(res);
      } else {
        next();
      }
    });
  };
}

function getContentType(filePath) {
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".txt": "text/plain",
  };
  return types[ext] || "application/octet-stream";
}
