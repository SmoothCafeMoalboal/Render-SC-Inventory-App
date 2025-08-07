import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertSupplierSchema, 
  insertDeliverySchema,
  insertDeliveryItemSchema,
  insertInventoryMovementSchema,
  insertRecipeSchema,
  insertRecipeIngredientSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, you'd set up proper session management
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { department } = req.query;
      const products = department 
        ? await storage.getProductsByDepartment(department as string)
        : await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/sku/:sku", async (req, res) => {
    try {
      const product = await storage.getProductBySku(req.params.sku);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const updateData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
 
  // In server/routes.ts

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const productId = req.params.id;

      const hasDependencies = await storage.productHasDependencies(productId);
      if (hasDependencies) {
        return res.status(400).json({
          message: "Cannot delete product with existing inventory, recipes, or deliveries."
        });
      }

      const deleted = await storage.deleteProduct(productId);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });


  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const { department } = req.query;
      const inventory = department
        ? await storage.getInventoryByDepartment(department as string)
        : await storage.getAllInventory();
      
      // Enrich with product data
      const products = await storage.getAllProducts();
      const enrichedInventory = inventory.map(inv => {
        const product = products.find(p => p.id === inv.productId);
        return { ...inv, product };
      });
      
      res.json(enrichedInventory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockItems();
      res.json(lowStockItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/inventory/:productId/:department", async (req, res) => {
    try {
      const { newStock } = req.body;
      const inventory = await storage.updateInventoryStock(
        req.params.productId,
        req.params.department,
        parseFloat(newStock)
      );
      res.json(inventory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Deliveries routes
  app.get("/api/deliveries", async (req, res) => {
    try {
      const { department } = req.query;
      const deliveries = department
        ? await storage.getDeliveriesByDepartment(department as string)
        : await storage.getAllDeliveries();
      
      // Enrich with supplier and user data
      const suppliers = await storage.getAllSuppliers();
      const users = await storage.getAllUsers();
      
      const enrichedDeliveries = deliveries.map(delivery => {
        const supplier = suppliers.find(s => s.id === delivery.supplierId);
        const user = users.find(u => u.id === delivery.receivedBy);
        return { ...delivery, supplier, receivedByUser: user };
      });
      
      res.json(enrichedDeliveries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/deliveries", async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.parse(req.body);
      const delivery = await storage.createDelivery(deliveryData);
      res.json(delivery);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/deliveries/:id/items", async (req, res) => {
    try {
      const items = await storage.getDeliveryItems(req.params.id);
      
      // Enrich with product data
      const products = await storage.getAllProducts();
      const enrichedItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, product };
      });
      
      res.json(enrichedItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/delivery-items", async (req, res) => {
    try {
      const itemData = insertDeliveryItemSchema.parse(req.body);
      const item = await storage.createDeliveryItem(itemData);
      
      // Update inventory
      const product = await storage.getProduct(item.productId);
      if (product) {
        const currentInventory = await storage.getInventoryByProduct(item.productId, product.department);
        const currentStock = currentInventory ? parseFloat(currentInventory.currentStock) : 0;
        await storage.updateInventoryStock(
          item.productId,
          product.department,
          currentStock + parseFloat(item.quantity)
        );
        
        // Log inventory movement
        await storage.createInventoryMovement({
          productId: item.productId,
          department: product.department,
          movementType: "delivery",
          quantity: item.quantity,
          userId: "system", // You'd get this from auth
          notes: `Delivery item added`,
          deliveryId: item.deliveryId,
        });
      }
      
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Inventory movements routes
  app.get("/api/inventory-movements", async (req, res) => {
    try {
      const movements = await storage.getInventoryMovements();
      res.json(movements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/inventory-movements/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const movements = await storage.getRecentMovements(limit);
      res.json(movements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory-movements", async (req, res) => {
    try {
      const movementData = insertInventoryMovementSchema.parse(req.body);
      const movement = await storage.createInventoryMovement(movementData);
      
      // Update inventory based on movement type
      const product = await storage.getProduct(movement.productId);
      if (product) {
        const currentInventory = await storage.getInventoryByProduct(movement.productId, movement.department);
        const currentStock = currentInventory ? parseFloat(currentInventory.currentStock) : 0;
        const quantity = parseFloat(movement.quantity);
        
        let newStock = currentStock;
        if (movement.movementType === "transfer_in" || movement.movementType === "delivery" || movement.movementType === "adjustment") {
          newStock = currentStock + quantity;
        } else if (movement.movementType === "transfer_out" || movement.movementType === "usage") {
          newStock = Math.max(0, currentStock - quantity);
        }
        
        await storage.updateInventoryStock(movement.productId, movement.department, newStock);
        
        // Handle transfers (update target department as well)
        if (movement.movementType === "transfer_out" && movement.toDepartment) {
          const targetInventory = await storage.getInventoryByProduct(movement.productId, movement.toDepartment);
          const targetStock = targetInventory ? parseFloat(targetInventory.currentStock) : 0;
          await storage.updateInventoryStock(movement.productId, movement.toDepartment, targetStock + quantity);
          
          // Create corresponding transfer_in movement
          await storage.createInventoryMovement({
            productId: movement.productId,
            department: movement.toDepartment,
            movementType: "transfer_in",
            quantity: movement.quantity,
            fromDepartment: movement.department,
            userId: movement.userId,
            notes: `Transfer from ${movement.department}`,
          });
        }
      }
      
      res.json(movement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Recipes routes
  app.get("/api/recipes", async (req, res) => {
    try {
      const { department } = req.query;
      const recipes = department
        ? await storage.getRecipesByDepartment(department as string)
        : await storage.getAllRecipes();
      res.json(recipes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.json(recipe);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/recipes/:id/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getRecipeIngredients(req.params.id);
      
      // Enrich with product data
      const products = await storage.getAllProducts();
      const enrichedIngredients = ingredients.map(ingredient => {
        const product = products.find(p => p.id === ingredient.productId);
        return { ...ingredient, product };
      });
      
      res.json(enrichedIngredients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/recipe-ingredients", async (req, res) => {
    try {
      const ingredientData = insertRecipeIngredientSchema.parse(req.body);
      const ingredient = await storage.createRecipeIngredient(ingredientData);
      res.json(ingredient);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const inventory = await storage.getAllInventory();
      const products = await storage.getAllProducts();
      const lowStockItems = await storage.getLowStockItems();
      
      const departmentStats = {
        kitchen: { totalItems: 0, totalValue: 0, lowStockCount: 0 },
        bar: { totalItems: 0, totalValue: 0, lowStockCount: 0 },
        coffee: { totalItems: 0, totalValue: 0, lowStockCount: 0 },
        commissary: { totalItems: 0, totalValue: 0, lowStockCount: 0 },
      };
      
      // Calculate stats for each department
      inventory.forEach(inv => {
        const product = products.find(p => p.id === inv.productId);
        if (product && departmentStats[inv.department as keyof typeof departmentStats]) {
          departmentStats[inv.department as keyof typeof departmentStats].totalItems += 1;
          const value = parseFloat(inv.currentStock) * parseFloat(product.unitCost || "0");
          departmentStats[inv.department as keyof typeof departmentStats].totalValue += value;
        }
      });
      
      // Count low stock items per department
      lowStockItems.forEach((item: any) => {
        if (item.product && departmentStats[item.department as keyof typeof departmentStats]) {
          departmentStats[item.department as keyof typeof departmentStats].lowStockCount += 1;
        }
      });
      
      res.json({
        departmentStats,
        totalLowStockItems: lowStockItems.length,
        criticalItems: lowStockItems.filter(item => item.status === 'critical').length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
