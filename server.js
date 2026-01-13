const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// Database
const db = new sqlite3.Database("./database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    mrp INTEGER,
    price INTEGER,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Image upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Admin upload
app.post("/api/upload", upload.single("image"), (req, res) => {
  const { name, mrp, price } = req.body;
  const image = req.file.filename;
  const id = uuidv4();

  db.run(
    `INSERT INTO products (id, name, mrp, price, image) VALUES (?, ?, ?, ?, ?)`,
    [id, name, mrp, price, image],
    () => res.json({ success: true, id })
  );
});

// Get all products
app.get("/api/products", (req, res) => {
  db.all(
    `SELECT * FROM products ORDER BY created_at DESC`,
    [],
    (err, rows) => res.json(rows)
  );
});

// Get single product
app.get("/api/product/:id", (req, res) => {
  db.get(
    `SELECT * FROM products WHERE id = ?`,
    [req.params.id],
    (err, row) => res.json(row)
  );
});

app.listen(PORT, () =>
  console.log(`Bargad Wala Shop running on port ${PORT}`)
);
