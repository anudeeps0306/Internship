import express from "express";
import mongoose from "mongoose";
import { Product } from "./models/product.js";

const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect("mongodb://localhost/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());

app.get("/products/:id", (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    })
    .catch((error) => {
      next(error); // Pass the error to the error handling middleware
    });
});

app.get("/products", (req, res, next) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      next(error); // Pass the error to the error handling middleware
    });
});

app.put("/products/:id", (req, res, next) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  Product.findByIdAndUpdate(id, { price }, { new: true })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    })
    .catch((error) => {
      next(error); // Pass the error to the error handling middleware
    });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof mongoose.Error.ValidationError) {
    // Handle validation errors
    res.status(400).json({ error: err.message });
  } else if (err instanceof mongoose.Error.CastError) {
    // Handle invalid ID errors
    res.status(400).json({ error: "Invalid product ID" });
  } else {
    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
