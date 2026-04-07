const http = require("http");
const { Duplex } = require("stream");

class MockSocket extends Duplex {
  constructor() {
    super();
    this.chunks = [];
    this.remoteAddress = "127.0.0.1";
    this.writable = true;
    this.readable = true;
  }

  _read() {}

  _write(chunk, encoding, callback) {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }
}

function parseResponse(rawResponse) {
  const responseText = rawResponse.toString("utf8");
  const [rawHeaders, rawBody = ""] = responseText.split("\r\n\r\n");
  const [statusLine, ...headerLines] = rawHeaders.split("\r\n");
  const [, statusCode] = statusLine.match(/^HTTP\/1\.1 (\d{3})/) || [];
  const headers = {};

  for (const headerLine of headerLines) {
    const separatorIndex = headerLine.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const headerName = headerLine.slice(0, separatorIndex).trim().toLowerCase();
    const headerValue = headerLine.slice(separatorIndex + 1).trim();
    headers[headerName] = headerValue;
  }

  let body = rawBody;
  if (headers["content-type"] && headers["content-type"].includes("application/json") && rawBody) {
    body = JSON.parse(rawBody);
  }

  return {
    body,
    headers,
    statusCode: Number(statusCode),
  };
}

function dispatchRequest(app, method, url, body) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    const socket = new MockSocket();
    const req = new http.IncomingMessage(socket);
    const res = new http.ServerResponse(req);

    req.url = url;
    req.method = method;
    req.headers = { host: "localhost" };

    let payload = null;
    if (body !== undefined) {
      payload = JSON.stringify(body);
      req.headers["content-type"] = "application/json";
      req.headers["content-length"] = Buffer.byteLength(payload);
    }

    res.assignSocket(socket);

    res.on("finish", () => {
      const parsedResponse = parseResponse(Buffer.concat(socket.chunks));
      res.detachSocket(socket);
      socket.destroy();
      resolve(parsedResponse);
    });

    res.on("error", reject);

    server.emit("request", req, res);

    process.nextTick(() => {
      if (payload !== null) {
        req.emit("data", Buffer.from(payload));
      }

      req.complete = true;
      req.emit("end");
    });
  });
}

function createPendingRequest(app, method, url) {
  return {
    send(body) {
      return dispatchRequest(app, method, url, body);
    },
    then(resolve, reject) {
      return dispatchRequest(app, method, url).then(resolve, reject);
    },
    catch(reject) {
      return dispatchRequest(app, method, url).catch(reject);
    },
  };
}

function createTestClient(app) {
  return {
    get(url) {
      return createPendingRequest(app, "GET", url);
    },
    post(url) {
      return createPendingRequest(app, "POST", url);
    },
    put(url) {
      return createPendingRequest(app, "PUT", url);
    },
    delete(url) {
      return createPendingRequest(app, "DELETE", url);
    },
  };
}

module.exports = {
  createTestClient,
};
