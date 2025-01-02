import http, { IncomingMessage, ServerResponse } from "node:http";

// Extended ServerResponse Interface for other functionalities
interface CustomServerResponse extends ServerResponse {
  json(data: unknown): void;
  status(code: number): CustomServerResponse;
}

// Extended IncomingMessage for other functionalities
interface CustomIncomingMessage extends IncomingMessage {
  body: unknown
}

// Route Interface
interface Route {
  method: "GET" | "POST";
  path: string;
  handler: (req: CustomIncomingMessage, res: CustomServerResponse) => void;
}

class Server {
  private server!: http.Server;
  private routes: Route[] = [];

  constructor() {
    this.server = http.createServer((req, res) => this.handleRequest(req as CustomIncomingMessage, res as CustomServerResponse))
  }

  // handle user request
  private async handleRequest(req: CustomIncomingMessage, res: CustomServerResponse) {
    const route = this.routes.find((route) => route.method === req.method && route.path === req.url);
    res.json = function (data: unknown) {
      res.setHeader("Content-Type", "application/json")
      res.write(JSON.stringify(data))
      res.end()
    }

    res.status = function (statusCode: number): CustomServerResponse {
      res.statusCode = statusCode
      return res;
    }

    // parse the request data
    if (req.headers["content-type"] === "application/json") {
      let data = "";
      req.on("data", (chunkData: Buffer) => {
        data = data + chunkData.toString("utf-8")
      })
      req.on("end", () => {
        let bodyData = JSON.parse(data);
        req.body = bodyData;
      })
    }

    // run the route
    if (route) {
      try {
        route.handler(req, res);
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  }

  // handle get request
  public get(path: string, handler: (req: CustomIncomingMessage, res: CustomServerResponse) => void
  ) {
    this.routes.push({
      method: "GET",
      path,
      handler,
    });
  }

  // handle post request

  // start server (listen)
  // function overloading
  public listen(port: number, callback: () => void): http.Server;
  public listen(port: number, hostname: string, callback: () => void): http.Server;
  public listen(port: number, hostnameCallback: string | (() => void), cb?: () => void): http.Server {
    const hostname = typeof hostnameCallback === "string" ? hostnameCallback : "localhost";
    const finalCallback = typeof hostnameCallback === "function" ? hostnameCallback : cb;

    // start the server
    this.server.listen(port, hostname, () => {
      if (finalCallback) {
        finalCallback();
      } else {
        console.log(`Server is running on ${hostname}:${port}`);
      }
    });

    return this.server;
  }
}

export default Server;
