import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Notebook", price: 120, quantity: 3, category: "Stationery" },
  { id: 3, productName: "Water Bottle", price: 299, quantity: 1, category: "Accessories" }
];

function isValidProduct(product, requireId = true) {
  if (!product || typeof product !== "object" || Array.isArray(product)) return false;
  const validId = !requireId || (product.id !== undefined && product.id !== null && String(product.id).trim() !== "");
  const validName = typeof product.productName === "string" && product.productName.trim() !== "";
  const validPrice = Number.isFinite(Number(product.price)) && Number(product.price) >= 0;
  const validQuantity = Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0;
  return validId && validName && validPrice && validQuantity;
}

function itemWithTotal(product) {
  return { ...product, totalPrice: product.price * product.quantity };
}

// GET /cart - retrieve all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart.map(itemWithTotal));
});

// GET /cart/:id - retrieve one cart item
app.get("/cart/:id", (req, res) => {
  const product = cart.find(item => String(item.id) === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.status(200).json(itemWithTotal(product));
});

// POST /cart - add a product
app.post("/cart", (req, res) => {
  const product = req.body;
  if (!isValidProduct(product)) {
    return res.status(400).json({
      message: "Invalid product. Required: id, productName, price (0 or more), quantity (positive integer)."
    });
  }
  if (cart.some(item => String(item.id) === String(product.id))) {
    return res.status(409).json({ message: "A product with this id already exists." });
  }

  const newProduct = {
    id: product.id,
    productName: product.productName.trim(),
    price: Number(product.price),
    quantity: Number(product.quantity),
    category: typeof product.category === "string" && product.category.trim()
      ? product.category.trim()
      : "General"
  };
  cart.push(newProduct);
  return res.status(201).json({
    message: "Product added successfully",
    product: itemWithTotal(newProduct)
  });
});

// PUT /cart/:id - update an existing product
app.put("/cart/:id", (req, res) => {
  const index = cart.findIndex(item => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found." });

  const updatedData = { ...cart[index], ...req.body, id: cart[index].id };
  if (!isValidProduct(updatedData, false)) {
    return res.status(400).json({
      message: "Invalid product details. productName, price and quantity must be valid."
    });
  }

  cart[index] = {
    ...updatedData,
    productName: updatedData.productName.trim(),
    price: Number(updatedData.price),
    quantity: Number(updatedData.quantity),
    category: typeof updatedData.category === "string" && updatedData.category.trim()
      ? updatedData.category.trim()
      : "General"
  };
  return res.status(200).json({
    message: "Product updated successfully",
    product: itemWithTotal(cart[index])
  });
});

// DELETE /cart/:id - delete a product
app.delete("/cart/:id", (req, res) => {
  const index = cart.findIndex(item => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found." });

  const [deletedProduct] = cart.splice(index, 1);
  return res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct
  });
});

// Invalid route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Malformed JSON and other request errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
