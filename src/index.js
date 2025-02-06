import { App } from "../src/framework/app.js";
import { errorHandler, bodyParser } from "./framework/middleware.js";
const app = new App();

app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware 2 executed");
  next();
});

app.get("/", (req, res) => {
  console.log("Route handler executed");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to LITEExpress !!");
});

app.get("/user/:id", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ userId: req.params.id }));
});

app.post("/data", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Data received!" }));
});

app.use(errorHandler)



// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
