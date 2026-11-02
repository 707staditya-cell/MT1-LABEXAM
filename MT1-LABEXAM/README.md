# MT1-LABEXAM — Shopping Cart Management

Full Stack Development MT1 practical project using Node.js HTTP, FS and Express.js. No database is used; cart data is stored in JavaScript arrays.

## Requirements
- Node.js 18 or later
- npm
- Postman (for API testing)

## Setup
```bash
npm install
```

## Run Part A — Core HTTP + FS server
```bash
npm run start:http
```
Runs independently at http://localhost:3000

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Welcome HTML |
| GET | `/cart` | Cart array as JSON |
| GET | `/about` | Application information |
| GET | `/home` | Reads and serves `public/index.html` using `fs` |
| POST | `/add-to-cart` | Adds a product from a JSON body |

Example POST body for `http://localhost:3000/add-to-cart`:
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```
Required fields: `id`, `productName`, `price`, `quantity`. Price must be zero or greater; quantity must be a positive integer.

## Run Part B — Express REST API
Open a second terminal:
```bash
npm run start:express
```
Runs independently at http://localhost:4000

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cart` | Retrieve all products |
| GET | `/cart/:id` | Retrieve one product |
| POST | `/cart` | Add a product (returns 201) |
| PUT | `/cart/:id` | Update a product |
| DELETE | `/cart/:id` | Delete a product |

Each returned product includes `totalPrice = price × quantity`. Data is held in memory and resets when the server restarts.

### Postman examples
Base URL: `http://localhost:4000`

**POST** `/cart` — Body → raw → JSON:
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

**PUT** `/cart/1` — Body → raw → JSON:
```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```

For POST and PUT, select `Content-Type: application/json`.

## GitHub submission
Create a public/private GitHub repository named **MT1-LABEXAM**, then from this project folder run:
```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```
After completing and testing each module, commit and push:
```bash
git add .
git commit -m "Implement Node.js HTTP and FS server"
git push
```
```bash
git add .
git commit -m "Implement Express shopping cart CRUD API"
git push
```
Replace `YOUR-USERNAME` with your GitHub username. Do not commit `node_modules`.

## Screenshots to capture for submission
Save your own genuine screenshots in `screenshots/`:
1. `http-server-running.png` — terminal showing HTTP server running on port 3000.
2. `http-home-fs.png` — browser showing `http://localhost:3000/home`.
3. `express-server-running.png` — terminal showing Express server running on port 4000.
4. `postman-get-all.png` — GET `/cart`.
5. `postman-get-one.png` — GET `/cart/1`.
6. `postman-post.png` — successful POST `/cart` (201).
7. `postman-put.png` — successful PUT `/cart/1`.
8. `postman-delete.png` — successful DELETE `/cart/1`.
9. `github-commits.png` — repository page showing commit history.

The screenshots folder contains a checklist placeholder. Capture screenshots from your own running application; no fabricated screenshots are included.
