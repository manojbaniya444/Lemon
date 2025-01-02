import Server from "@lib/app"

// app export interface
export function lemon(): Server {
  // new instance of server create
    return new Server();
  }

// export app
export default lemon