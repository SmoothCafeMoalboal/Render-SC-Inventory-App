import { randomUUID } from "crypto";
import type {
  User, InsertUser, Product, InsertProduct, Inventory, Supplier, InsertSupplier,
  Delivery, InsertDelivery, DeliveryItem, InsertDeliveryItem, InventoryMovement,
  InsertInventoryMovement, Recipe, InsertRecipe, RecipeIngredient, InsertRecipeIngredient
} from "@shared/schema";
import type { IStorage } from "./storage";

// Simple in-memory storage for demo purposes when database is unavailable
export class FallbackStorage implements IStorage {
  async productHasDependencies(productId: string): Promise<boolean> {
    // Check if product is referenced in deliveryItems, inventoryMovements, or recipeIngredients
    const deliveryCount = Array.from(this.deliveryItems.values()).filter(item => item.productId === productId).length;
    const movementCount = Array.from(this.inventoryMovements.values()).filter(movement => movement.productId === productId).length;
    const recipeCount = Array.from(this.recipeIngredients.values()).filter(ingredient => ingredient.productId === productId).length;
    return deliveryCount > 0 || movementCount > 0 || recipeCount > 0;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const existed = this.products.delete(productId);
    // Also remove inventory entries for this product
    for (const key of Array.from(this.inventory.keys())) {
      if (key.startsWith(productId + "-")) {
        this.inventory.delete(key);
      }
    }
    return existed;
  }
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private inventory = new Map<string, Inventory>();
  private suppliers = new Map<string, Supplier>();
  private deliveries = new Map<string, Delivery>();
  private deliveryItems = new Map<string, DeliveryItem>();
  private inventoryMovements = new Map<string, InventoryMovement>();
  private recipes = new Map<string, Recipe>();
  private recipeIngredients = new Map<string, RecipeIngredient>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "admin123",
      name: "System Administrator", 
      role: "admin",
      department: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample products with inventory
    const sampleProducts = [
      {
        name: "Premium Vodka 1L",
        brand: "Grey Goose", 
        sku: "VOD-001-GG",
        department: "bar" as const,
        unitType: "bottles" as const,
        unitCost: "45.00",
        minLevel: "5.00",
        maxLevel: "20.00",
        currentStock: "2.00", // Low stock to trigger alerts
      },
      {
        name: "Ground Beef 80/20",
        brand: "Local Farm",
        sku: "BEEF-001-80", 
        department: "kitchen" as const,
        unitType: "lbs" as const,
        unitCost: "8.50",
        minLevel: "15.00",
        maxLevel: "50.00",
        currentStock: "8.00", // Low stock
      },
      {
        name: "Espresso Beans",
        brand: "Colombian Single Origin",
        sku: "COF-001-ESP",
        department: "coffee" as const,
        unitType: "lbs" as const,
        unitCost: "12.00",
        minLevel: "10.00", 
        maxLevel: "30.00",
        currentStock: "25.00",
      },
    ];

    sampleProducts.forEach(item => {
      const product: Product = {
        id: randomUUID(),
        name: item.name,
        brand: item.brand,
        sku: item.sku,
        department: item.department,
        unitType: item.unitType,
        unitCost: item.unitCost,
        minLevel: item.minLevel,
        maxLevel: item.maxLevel,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.set(product.id, product);

      // Create inventory entry
      const inventoryEntry: Inventory = {
        id: randomUUID(),
        productId: product.id,
        department: product.department,
        currentStock: item.currentStock,
        lastUpdated: new Date(),
      };
      this.inventory.set(`${product.id}-${product.department}`, inventoryEntry);
    });

    console.log("Fallback storage initialized with sample data");
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updateData, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.sku === sku);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = { ...insertProduct, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    this.products.set(product.id, product);
    
    // Create initial inventory entry
    const inventoryEntry: Inventory = {
      id: randomUUID(),
      productId: product.id,
      department: product.department,
      currentStock: "0.00",
      lastUpdated: new Date(),
    };
    this.inventory.set(`${product.id}-${product.department}`, inventoryEntry);
    
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updateData, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByDepartment(department: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.department === department && p.isActive);
  }

  // Inventory
  async getInventoryByProduct(productId: string, department: string): Promise<Inventory | undefined> {
    return this.inventory.get(`${productId}-${department}`);
  }

  async updateInventoryStock(productId: string, department: string, newStock: number): Promise<Inventory> {
    const key = `${productId}-${department}`;
    const existing = this.inventory.get(key);
    
    const inventory: Inventory = {
      id: existing?.id || randomUUID(),
      productId,
      department: department as any,
      currentStock: newStock.toString(),
      lastUpdated: new Date(),
    };
    
    this.inventory.set(key, inventory);
    return inventory;
  }

  async getAllInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryByDepartment(department: string): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(inv => inv.department === department);
  }

  async getLowStockItems(): Promise<any[]> {
    const inventoryItems = Array.from(this.inventory.values());
    const products = Array.from(this.products.values());
    
    return inventoryItems
      .map(inv => {
        const product = products.find(p => p.id === inv.productId);
        if (!product) return null;
        
        const currentStock = parseFloat(inv.currentStock);
        const minLevel = parseFloat(product.minLevel);
        
        if (currentStock <= minLevel) {
          return {
            ...inv,
            product,
            status: currentStock === 0 ? 'out' : currentStock <= minLevel * 0.5 ? 'critical' : 'low'
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const supplier: Supplier = { ...insertSupplier, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    this.suppliers.set(supplier.id, supplier);
    return supplier;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values()).filter(s => s.isActive);
  }

  // Deliveries  
  async getDelivery(id: string): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const delivery: Delivery = {
      ...insertDelivery,
      id: randomUUID(),
      totalValue: insertDelivery.totalValue ?? null,
      notes: insertDelivery.notes ?? null,
    };
    this.deliveries.set(delivery.id, delivery);
    return delivery;
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return Array.from(this.deliveries.values());
  }

  async getDeliveriesByDepartment(department: string): Promise<Delivery[]> {
    return Array.from(this.deliveries.values()).filter(d => d.department === department);
  }

  // Delivery Items
  async createDeliveryItem(insertItem: InsertDeliveryItem): Promise<DeliveryItem> {
    const item: DeliveryItem = {
      ...insertItem,
      id: randomUUID(),
      unitCost: insertItem.unitCost ?? null,
    };
    this.deliveryItems.set(item.id, item);
    return item;
  }

  async getDeliveryItems(deliveryId: string): Promise<DeliveryItem[]> {
    return Array.from(this.deliveryItems.values()).filter(item => item.deliveryId === deliveryId);
  }

  // Inventory Movements
  async createInventoryMovement(insertMovement: InsertInventoryMovement): Promise<InventoryMovement> {
    const movement: InventoryMovement = { 
      ...insertMovement, 
      id: randomUUID(),
      timestamp: new Date(),
      notes: insertMovement.notes ?? null,
      deliveryId: insertMovement.deliveryId ?? null,
      fromDepartment: insertMovement.fromDepartment ?? null,
      toDepartment: insertMovement.toDepartment ?? null,
    };
    this.inventoryMovements.set(movement.id, movement);
    return movement;
  }

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return Array.from(this.inventoryMovements.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getRecentMovements(limit: number = 10): Promise<any[]> {
    const movements = Array.from(this.inventoryMovements.values());
    const products = Array.from(this.products.values());
    const users = Array.from(this.users.values());
    
    return movements
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .map(movement => {
        const product = products.find(p => p.id === movement.productId);
        const user = users.find(u => u.id === movement.userId);
        
        return {
          ...movement,
          product,
          user,
        };
      });
  }

  // Recipes
  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const recipe: Recipe = {
      ...insertRecipe,
      id: randomUUID(),
      isActive: insertRecipe.isActive ?? true,
      description: insertRecipe.description ?? null,
    };
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(r => r.isActive);
  }

  async getRecipesByDepartment(department: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(r => r.department === department && r.isActive);
  }

  // Recipe Ingredients
  async createRecipeIngredient(insertIngredient: InsertRecipeIngredient): Promise<RecipeIngredient> {
    const ingredient: RecipeIngredient = {
      ...insertIngredient,
      id: randomUUID(),
    };
    this.recipeIngredients.set(ingredient.id, ingredient);
    return ingredient;
  }

  async getRecipeIngredients(recipeId: string): Promise<RecipeIngredient[]> {
    return Array.from(this.recipeIngredients.values()).filter(ing => ing.recipeId === recipeId);
  }
}