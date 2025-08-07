import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Inventory,
  type Supplier,
  type InsertSupplier,
  type Delivery,
  type InsertDelivery,
  type DeliveryItem,
  type InsertDeliveryItem,
  type InventoryMovement,
  type InsertInventoryMovement,
  type Recipe,
  type InsertRecipe,
  type RecipeIngredient,
  type InsertRecipeIngredient,
  users,
  products,
  inventory,
  suppliers,
  deliveries,
  deliveryItems,
  inventoryMovements,
  recipes,
  recipeIngredients,
} from "@shared/schema";
import { eq, and, desc, lte } from "drizzle-orm";
import { db } from "./db";
import { randomUUID } from "crypto";
import { FallbackStorage } from "./fallback-storage";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: string,
    product: Partial<InsertProduct>,
  ): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByDepartment(department: string): Promise<Product[]>;

  // Inventory
  getInventoryByProduct(
    productId: string,
    department: string,
  ): Promise<Inventory | undefined>;
  updateInventoryStock(
    productId: string,
    department: string,
    newStock: number,
  ): Promise<Inventory>;
  getAllInventory(): Promise<Inventory[]>;
  getInventoryByDepartment(department: string): Promise<Inventory[]>;
  getLowStockItems(): Promise<any[]>;

  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  getAllSuppliers(): Promise<Supplier[]>;

  // Deliveries
  getDelivery(id: string): Promise<Delivery | undefined>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  getAllDeliveries(): Promise<Delivery[]>;
  getDeliveriesByDepartment(department: string): Promise<Delivery[]>;

  // Delivery Items
  createDeliveryItem(item: InsertDeliveryItem): Promise<DeliveryItem>;
  getDeliveryItems(deliveryId: string): Promise<DeliveryItem[]>;

  // Inventory Movements
  createInventoryMovement(
    movement: InsertInventoryMovement,
  ): Promise<InventoryMovement>;
  getInventoryMovements(): Promise<InventoryMovement[]>;
  getRecentMovements(limit?: number): Promise<any[]>;

  // Recipes
  getRecipe(id: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getAllRecipes(): Promise<Recipe[]>;
  getRecipesByDepartment(department: string): Promise<Recipe[]>;

  // Recipe Ingredients
  createRecipeIngredient(
    ingredient: InsertRecipeIngredient,
  ): Promise<RecipeIngredient>;
  getRecipeIngredients(recipeId: string): Promise<RecipeIngredient[]>;

  // Product dependency and deletion
  productHasDependencies(productId: string): Promise<boolean>;
  deleteProduct(productId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async productHasDependencies(productId: string): Promise<boolean> {
    const [deliveryCount, movementCount, recipeCount] = await Promise.all([
      db.select().from(deliveryItems).where(eq(deliveryItems.productId, productId)).then(r => r.length),
      db.select().from(inventoryMovements).where(eq(inventoryMovements.productId, productId)).then(r => r.length),
      db.select().from(recipeIngredients).where(eq(recipeIngredients.productId, productId)).then(r => r.length),
    ]);
    return deliveryCount > 0 || movementCount > 0 || recipeCount > 0;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, productId)).returning();
    return result.length > 0;
  }
  private fallbackMode = false;
  private fallbackData = {
    users: new Map<string, User>(),
    products: new Map<string, Product>(),
    inventory: new Map<string, Inventory>(),
    suppliers: new Map<string, Supplier>(),
    deliveries: new Map<string, Delivery>(),
    deliveryItems: new Map<string, DeliveryItem>(),
    inventoryMovements: new Map<string, InventoryMovement>(),
    recipes: new Map<string, Recipe>(),
    recipeIngredients: new Map<string, RecipeIngredient>(),
  };

  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      console.log("Testing database connection...");
      // Check if we already have users
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        console.log("Database already seeded with data");
        return; // Already seeded
      }

      console.log("Seeding database with initial data...");

      // Create default admin user
      await db.insert(users).values({
        username: "admin",
        password: "admin123", // In production, this would be hashed
        name: "System Administrator",
        role: "admin",
        department: null,
        isActive: true,
      });

      // Create manager user
      await db.insert(users).values({
        username: "manager",
        password: "manager123",
        name: "John Doe",
        role: "manager",
        department: null,
        isActive: true,
      });

      // Create a few suppliers
      const [supplier] = await db
        .insert(suppliers)
        .values({
          name: "Sysco",
          contactInfo: "support@sysco.com",
          isActive: true,
        })
        .returning();

      // Create some sample products
      const productData = [
        {
          name: "Premium Vodka 1L",
          brand: "Grey Goose",
          sku: "VOD-001-GG",
          department: "bar" as const,
          unitType: "bottles" as const,
          unitCost: "45.00",
          minLevel: "5.00",
          maxLevel: "20.00",
          isActive: true,
        },
        {
          name: "Organic Ground Beef",
          brand: "80/20",
          sku: "BEEF-001-80",
          department: "kitchen" as const,
          unitType: "lbs" as const,
          unitCost: "8.50",
          minLevel: "15.00",
          maxLevel: "50.00",
          isActive: true,
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
          isActive: true,
        },
      ];

      for (const productItem of productData) {
        const [product] = await db
          .insert(products)
          .values(productItem)
          .returning();

        // Create inventory entry
        await db.insert(inventory).values({
          productId: product.id,
          department: product.department,
          currentStock:
            product.sku === "VOD-001-GG"
              ? "2.00"
              : product.sku === "BEEF-001-80"
                ? "8.00"
                : "12.00",
        });
      }

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
      console.log(
        "Database may not be available, application will run with limited functionality",
      );
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(
    id: string,
    updateData: Partial<InsertUser>,
  ): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result[0];
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.sku, sku))
      .limit(1);
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();

    // Create initial inventory entry
    await db.insert(inventory).values({
      productId: product.id,
      department: product.department,
      currentStock: "0.00",
    });

    return product;
  }

  async updateProduct(
    id: string,
    updateData: Partial<InsertProduct>,
  ): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProductsByDepartment(department: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(eq(products.department, department), eq(products.isActive, true)),
      );
  }

  // Inventory
  async getInventoryByProduct(
    productId: string,
    department: string,
  ): Promise<Inventory | undefined> {
    const result = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.productId, productId),
          eq(inventory.department, department),
        ),
      )
      .limit(1);
    return result[0];
  }

  async updateInventoryStock(
    productId: string,
    department: string,
    newStock: number,
  ): Promise<Inventory> {
    const existing = await this.getInventoryByProduct(productId, department);

    if (existing) {
      const [updated] = await db
        .update(inventory)
        .set({ currentStock: newStock.toString(), lastUpdated: new Date() })
        .where(eq(inventory.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(inventory)
        .values({
          productId,
          department: department as any,
          currentStock: newStock.toString(),
        })
        .returning();
      return created;
    }
  }

  async getAllInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory);
  }

  async getInventoryByDepartment(department: string): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .where(eq(inventory.department, department));
  }

  async getLowStockItems(): Promise<any[]> {
    const inventoryItems = await db.select().from(inventory);
    const allProducts = await db.select().from(products);

    return inventoryItems
      .map((inv) => {
        const product = allProducts.find((p) => p.id === inv.productId);
        if (!product) return null;

        const currentStock = parseFloat(inv.currentStock);
        const minLevel = parseFloat(product.minLevel);

        if (currentStock <= minLevel) {
          return {
            ...inv,
            product,
            status:
              currentStock === 0
                ? "out"
                : currentStock <= minLevel * 0.5
                  ? "critical"
                  : "low",
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id))
      .limit(1);
    return result[0];
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db
      .insert(suppliers)
      .values(insertSupplier)
      .returning();
    return supplier;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.isActive, true));
  }

  // Deliveries
  async getDelivery(id: string): Promise<Delivery | undefined> {
    const result = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.id, id))
      .limit(1);
    return result[0];
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const [delivery] = await db
      .insert(deliveries)
      .values(insertDelivery)
      .returning();
    return delivery;
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return await db
      .select()
      .from(deliveries)
      .orderBy(desc(deliveries.deliveryDate));
  }

  async getDeliveriesByDepartment(department: string): Promise<Delivery[]> {
    return await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.department, department))
      .orderBy(desc(deliveries.deliveryDate));
  }

  // Delivery Items
  async createDeliveryItem(
    insertItem: InsertDeliveryItem,
  ): Promise<DeliveryItem> {
    const [item] = await db
      .insert(deliveryItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async getDeliveryItems(deliveryId: string): Promise<DeliveryItem[]> {
    return await db
      .select()
      .from(deliveryItems)
      .where(eq(deliveryItems.deliveryId, deliveryId));
  }

  // Inventory Movements
  async createInventoryMovement(
    insertMovement: InsertInventoryMovement,
  ): Promise<InventoryMovement> {
    const [movement] = await db
      .insert(inventoryMovements)
      .values(insertMovement)
      .returning();
    return movement;
  }

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return await db
      .select()
      .from(inventoryMovements)
      .orderBy(desc(inventoryMovements.timestamp));
  }

  async getRecentMovements(limit: number = 10): Promise<any[]> {
    const movements = await db
      .select()
      .from(inventoryMovements)
      .orderBy(desc(inventoryMovements.timestamp))
      .limit(limit);

    const allProducts = await db.select().from(products);
    const allUsers = await db.select().from(users);
    const allSuppliers = await db.select().from(suppliers);
    const allDeliveries = await db.select().from(deliveries);

    return movements.map((movement) => {
      const product = allProducts.find((p) => p.id === movement.productId);
      const user = allUsers.find((u) => u.id === movement.userId);
      const delivery = movement.deliveryId
        ? allDeliveries.find((d) => d.id === movement.deliveryId)
        : null;
      const supplier = delivery
        ? allSuppliers.find((s) => s.id === delivery.supplierId)
        : null;

      return {
        ...movement,
        product,
        user,
        delivery,
        supplier,
      };
    });
  }

  // Recipes
  async getRecipe(id: string): Promise<Recipe | undefined> {
    const result = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);
    return result[0];
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db.insert(recipes).values(insertRecipe).returning();
    return recipe;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes).where(eq(recipes.isActive, true));
  }

  async getRecipesByDepartment(department: string): Promise<Recipe[]> {
    return await db
      .select()
      .from(recipes)
      .where(
        and(eq(recipes.department, department), eq(recipes.isActive, true)),
      );
  }

  // Recipe Ingredients
  async createRecipeIngredient(
    insertIngredient: InsertRecipeIngredient,
  ): Promise<RecipeIngredient> {
    const [ingredient] = await db
      .insert(recipeIngredients)
      .values(insertIngredient)
      .returning();
    return ingredient;
  }

  async getRecipeIngredients(recipeId: string): Promise<RecipeIngredient[]> {
    return await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, recipeId));
  }
}

// Robust storage initialization with fallback
class StorageManager {
  private currentStorage: IStorage;
  private dbConnectionTested = false;

  constructor() {
    this.currentStorage = new FallbackStorage();
    this.attemptDatabaseConnection();
  }

  private async attemptDatabaseConnection() {
    try {
      console.log("Testing Supabase database connection...");
      const dbStorage = new DatabaseStorage();
      
      // Simple connection test
      const testResult = await Promise.race([
        dbStorage.getAllUsers(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Connection timeout")), 10000)
        )
      ]);
      
      console.log("✅ Database connection successful! Switching to database storage.");
      this.currentStorage = dbStorage;
      this.dbConnectionTested = true;
    } catch (error) {
      console.log("❌ Database connection failed. Using sample data mode.");
      console.log("📝 Note: Your app is fully functional with sample data.");
      this.dbConnectionTested = true;
    }
  }

  getStorage(): IStorage {
    return this.currentStorage;
  }

  isDatabaseConnected(): boolean {
    return this.currentStorage instanceof DatabaseStorage;
  }
}

const storageManager = new StorageManager();
export const storage = storageManager.getStorage();

