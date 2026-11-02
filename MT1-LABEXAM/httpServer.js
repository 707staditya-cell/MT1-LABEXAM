import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Notebook", price: 120, quantity: 3, category: "Stationery" },
  { id: 3, productName: "Water Bottle", price: 299, quantity: 1, category: "Accessories" }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, statusCode, message, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(message);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must contain valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function isValidProduct(product) {
  return product &&
    product.id !== undefined && product.id !== null && String(product.id).trim() !== "" &&
    typeof product.productName === "string" && product.productName.trim() !== "" &&
    Number.isFinite(Number(product.price)) && Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (req.method === "GET" && pathname === "/") {
    return sendText(
      res,
      200,
      "<!DOCTYPE html><html><head><title>Shopping Cart</title></head><body><h1>Welcome to Shopping Cart Management</h1><p>Node.js HTTP Module Server</p><p>Visit <a href='/cart'>/cart</a> or <a href='/home'>/home</a>.</p></body></html>",
      "text/html; charset=utf-8"
    );
  }

  if (req.method === "GET" && pathname === "/cart") {
    return sendJson(res, 200, cart);
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendText(res, 200, "Shopping Cart Management Application built using Node.js HTTP and FS modules.");
  }

  if (req.method === "GET" && pathname === "/home") {
    const indexPath = path.join(__dirname, "public", "index.html");
    return fs.readFile(indexPath, "utf8", (error, html) => {
      if (error) {
        console.error("Unable to read public/index.html:", error.message);
        return sendText(res, 500, "Unable to load the home page.");
      }
      return sendText(res, 200, html, "text/html; charset=utf-8");
    });
  }

  if (req.method === "POST" && pathname === "/add-to-cart") {
    try {
      const product = await readRequestBody(req);
      if (!isValidProduct(product)) {
        return sendJson(res, 400, {
          message: "Invalid product. Required: id, productName, price (0 or more), quantity (positive integer)."
        });
      }
      if (cart.some(item => String(item.id) === String(product.id))) {
        return sendJson(res, 409, { message: "A product with this id already exists." });
      }
      const newProduct = {
        id: product.id,
        productName: product.productName.trim(),
        price: Number(product.price),
        quantity: Number(product.quantity),
        ...(product.category ? { category: String(product.category) } : {})
      };
      cart.push(newProduct);
      return sendJson(res, 201, { message: "Product added successfully", product: newProduct });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  return sendJson(res, 404, { message: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
