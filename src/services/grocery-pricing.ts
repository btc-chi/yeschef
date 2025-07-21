// Grocery Pricing Service
// Simulates live pricing data with realistic market variations

interface PriceData {
  basePrice: number;
  unit: string;
  category: 'protein' | 'vegetable' | 'starch' | 'other';
  seasonal?: boolean;
  locationMultiplier?: { [key: string]: number };
}

interface LivePrice {
  item: string;
  price: number;
  unit: string;
  store: string;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

// Comprehensive pricing database with more realistic data
const GROCERY_PRICING_DATABASE: Record<string, PriceData> = {
  // Proteins - Higher prices, more variation
  'chicken thigh': { basePrice: 5.99, unit: 'lb', category: 'protein' },
  'chicken breast': { basePrice: 8.99, unit: 'lb', category: 'protein' },
  'chicken': { basePrice: 6.99, unit: 'lb', category: 'protein' },
  'ground beef': { basePrice: 7.99, unit: 'lb', category: 'protein' },
  'beef short ribs': { basePrice: 12.99, unit: 'lb', category: 'protein' },
  'beef': { basePrice: 9.99, unit: 'lb', category: 'protein' },
  'salmon fillet': { basePrice: 16.99, unit: 'lb', category: 'protein' },
  'salmon': { basePrice: 14.99, unit: 'lb', category: 'protein' },
  'white fish': { basePrice: 11.99, unit: 'lb', category: 'protein' },
  'turkey breast': { basePrice: 8.99, unit: 'lb', category: 'protein' },
  'turkey': { basePrice: 7.99, unit: 'lb', category: 'protein' },
  'bacon': { basePrice: 7.99, unit: 'pack', category: 'protein' },
  'eggs': { basePrice: 4.99, unit: 'dozen', category: 'protein' },
  'tofu': { basePrice: 3.99, unit: 'pack', category: 'protein' },
  'chickpeas': { basePrice: 2.49, unit: 'can', category: 'protein' },
  'edamame': { basePrice: 4.99, unit: 'bag', category: 'protein' },
  'parmesan cheese': { basePrice: 12.99, unit: 'wedge', category: 'protein' },
  'feta cheese': { basePrice: 6.99, unit: 'container', category: 'protein' },
  'mozzarella': { basePrice: 5.99, unit: 'ball', category: 'protein' },
  'cheese': { basePrice: 6.99, unit: 'pack', category: 'protein' },
  'shrimp': { basePrice: 12.99, unit: 'lb', category: 'protein' },
  'prawns': { basePrice: 14.99, unit: 'lb', category: 'protein' },
  'scallops': { basePrice: 18.99, unit: 'lb', category: 'protein' },
  'crab': { basePrice: 16.99, unit: 'lb', category: 'protein' },
  'lobster': { basePrice: 24.99, unit: 'lb', category: 'protein' },
  'cod': { basePrice: 13.99, unit: 'lb', category: 'protein' },
  'halibut': { basePrice: 19.99, unit: 'lb', category: 'protein' },
  'tuna': { basePrice: 16.99, unit: 'lb', category: 'protein' },
  
  // Vegetables - Seasonal pricing
  'bok choy': { basePrice: 3.99, unit: 'bunch', category: 'vegetable', seasonal: true },
  'garlic': { basePrice: 2.99, unit: 'head', category: 'vegetable' },
  'ginger': { basePrice: 4.99, unit: 'lb', category: 'vegetable' },
  'shiitake mushrooms': { basePrice: 5.99, unit: 'pack', category: 'vegetable' },
  'mushrooms': { basePrice: 3.99, unit: 'pack', category: 'vegetable' },
  'spinach': { basePrice: 4.99, unit: 'bag', category: 'vegetable', seasonal: true },
  'onion': { basePrice: 1.99, unit: 'lb', category: 'vegetable' },
  'red onion': { basePrice: 2.49, unit: 'lb', category: 'vegetable' },
  'yellow onion': { basePrice: 1.99, unit: 'lb', category: 'vegetable' },
  'white onion': { basePrice: 1.99, unit: 'lb', category: 'vegetable' },
  'carrots': { basePrice: 2.49, unit: 'bag', category: 'vegetable' },
  'celery': { basePrice: 2.99, unit: 'bunch', category: 'vegetable' },
  'tomatoes': { basePrice: 4.99, unit: 'lb', category: 'vegetable', seasonal: true },
  'tomato': { basePrice: 4.99, unit: 'lb', category: 'vegetable', seasonal: true },
  'cucumber': { basePrice: 2.99, unit: 'each', category: 'vegetable', seasonal: true },
  'cucumbers': { basePrice: 2.99, unit: 'each', category: 'vegetable', seasonal: true },
  'bell pepper': { basePrice: 3.99, unit: 'each', category: 'vegetable', seasonal: true },
  'bell peppers': { basePrice: 3.99, unit: 'each', category: 'vegetable', seasonal: true },
  'eggplant': { basePrice: 4.99, unit: 'each', category: 'vegetable', seasonal: true },
  'thai basil': { basePrice: 2.99, unit: 'pack', category: 'vegetable' },
  'basil': { basePrice: 2.99, unit: 'pack', category: 'vegetable' },
  'parsley': { basePrice: 1.99, unit: 'bunch', category: 'vegetable' },
  'dill': { basePrice: 2.49, unit: 'pack', category: 'vegetable' },
  'mixed greens': { basePrice: 5.99, unit: 'container', category: 'vegetable' },
  'romaine lettuce': { basePrice: 3.99, unit: 'head', category: 'vegetable' },
  'lettuce': { basePrice: 3.49, unit: 'head', category: 'vegetable' },
  'cabbage': { basePrice: 2.99, unit: 'head', category: 'vegetable' },
  'cilantro': { basePrice: 1.99, unit: 'bunch', category: 'vegetable' },
  'jalapeño': { basePrice: 2.49, unit: 'lb', category: 'vegetable' },
  'sweet potato': { basePrice: 3.49, unit: 'lb', category: 'vegetable', seasonal: true },
  'kimchi': { basePrice: 5.99, unit: 'jar', category: 'vegetable' },
  'green onions': { basePrice: 1.99, unit: 'bunch', category: 'vegetable' },
  'green onion': { basePrice: 1.99, unit: 'bunch', category: 'vegetable' },
  'scallions': { basePrice: 1.99, unit: 'bunch', category: 'vegetable' },
  'cauliflower': { basePrice: 4.99, unit: 'head', category: 'vegetable', seasonal: true },
  'peas': { basePrice: 3.99, unit: 'bag', category: 'vegetable', seasonal: true },
  'avocado': { basePrice: 2.99, unit: 'each', category: 'vegetable' },
  'avocados': { basePrice: 2.99, unit: 'each', category: 'vegetable' },
  'zucchini': { basePrice: 3.49, unit: 'lb', category: 'vegetable', seasonal: true },
  'red bell pepper': { basePrice: 3.99, unit: 'each', category: 'vegetable', seasonal: true },
  'red bell peppers': { basePrice: 3.99, unit: 'each', category: 'vegetable', seasonal: true },
  
  // Starches - Stable pricing
  'jasmine rice': { basePrice: 4.99, unit: 'bag', category: 'starch' },
  'rice': { basePrice: 3.99, unit: 'bag', category: 'starch' },
  'linguine': { basePrice: 2.99, unit: 'box', category: 'starch' },
  'pasta': { basePrice: 2.49, unit: 'box', category: 'starch' },
  'arborio rice': { basePrice: 6.99, unit: 'bag', category: 'starch' },
  'quinoa': { basePrice: 8.99, unit: 'bag', category: 'starch' },
  'corn tortillas': { basePrice: 3.49, unit: 'pack', category: 'starch' },
  'tortilla': { basePrice: 3.99, unit: 'pack', category: 'starch' },
  'flour tortilla': { basePrice: 4.49, unit: 'pack', category: 'starch' },
  'whole wheat bread': { basePrice: 4.99, unit: 'loaf', category: 'starch' },
  'bread': { basePrice: 3.99, unit: 'loaf', category: 'starch' },
  'brioche buns': { basePrice: 5.99, unit: 'pack', category: 'starch' },
  'sweet potato fries': { basePrice: 4.99, unit: 'bag', category: 'starch' },
  'tortillas': { basePrice: 3.99, unit: 'pack', category: 'starch' },
  'burger buns': { basePrice: 4.49, unit: 'pack', category: 'starch' },
  'hamburger buns': { basePrice: 4.49, unit: 'pack', category: 'starch' },
  'wraps': { basePrice: 4.99, unit: 'pack', category: 'starch' },
  'wrap': { basePrice: 4.99, unit: 'pack', category: 'starch' },
  'pita bread': { basePrice: 3.99, unit: 'pack', category: 'starch' },
  'naan': { basePrice: 4.99, unit: 'pack', category: 'starch' },
  
  // Other - Pantry items, snacks, beverages, etc.
  'chips': { basePrice: 4.99, unit: 'bag', category: 'other' },
  'cookies': { basePrice: 5.99, unit: 'pack', category: 'other' },
  'coffee': { basePrice: 8.99, unit: 'bag', category: 'other' },
  'coffee grounds': { basePrice: 8.99, unit: 'bag', category: 'other' },
  'tea': { basePrice: 4.99, unit: 'box', category: 'other' },
  'snacks': { basePrice: 3.99, unit: 'pack', category: 'other' },
  'crackers': { basePrice: 4.49, unit: 'box', category: 'other' },
  'ice cream': { basePrice: 6.99, unit: 'pint', category: 'other' },
  'chocolate': { basePrice: 3.99, unit: 'bar', category: 'other' },
  'nuts': { basePrice: 7.99, unit: 'bag', category: 'other' },
  'almonds': { basePrice: 8.99, unit: 'bag', category: 'other' },
  'walnuts': { basePrice: 9.99, unit: 'bag', category: 'other' },
  'pretzels': { basePrice: 3.99, unit: 'bag', category: 'other' },
  'popcorn': { basePrice: 4.49, unit: 'box', category: 'other' }
};

// Location-based pricing multipliers (simulating different markets)
const LOCATION_MULTIPLIERS: Record<string, number> = {
  'new york': 1.35,
  'san francisco': 1.45,
  'los angeles': 1.25,
  'chicago': 1.15,
  'miami': 1.20,
  'seattle': 1.30,
  'boston': 1.28,
  'denver': 1.05,
  'austin': 1.10,
  'atlanta': 1.08,
  'phoenix': 1.02,
  'dallas': 1.06,
  'default': 1.0
};

// Real store chains with accurate pricing strategies (lowest to highest)
const STORE_CHAINS = [
  { name: 'Aldi', multiplier: 0.75, quality: 'budget' },           // Known for lowest prices
  { name: 'Walmart', multiplier: 0.82, quality: 'budget' },       // Everyday low prices
  { name: 'Costco', multiplier: 0.85, quality: 'bulk' },          // Bulk savings
  { name: 'Target', multiplier: 0.92, quality: 'standard' },      // Competitive pricing
  { name: 'Jewel-Osco', multiplier: 1.0, quality: 'standard' },   // Regional Midwest chain
  { name: 'Kroger', multiplier: 1.05, quality: 'standard' },      // Standard supermarket
  { name: 'Whole Foods', multiplier: 1.35, quality: 'premium' }   // Premium organic
];

class GroceryPricingService {
  private priceCache: Map<string, LivePrice> = new Map();
  private cacheExpiry: number = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Initialize some market volatility
    this.simulateMarketConditions();
  }

  private simulateMarketConditions() {
    // Add some randomness to simulate real market conditions
    setInterval(() => {
      this.priceCache.clear(); // Clear cache to force price updates
    }, this.cacheExpiry);
  }

  private getLocationMultiplier(location?: string): number {
    if (!location) return LOCATION_MULTIPLIERS.default;
    
    const city = location.toLowerCase().split(',')[0].trim();
    return LOCATION_MULTIPLIERS[city] || LOCATION_MULTIPLIERS.default;
  }

  private getSeasonalMultiplier(itemName: string): number {
    const item = GROCERY_PRICING_DATABASE[itemName.toLowerCase()];
    if (!item?.seasonal) return 1.0;

    // Simulate seasonal price variations
    const month = new Date().getMonth();
    
    // Summer vegetables cheaper (May-September)
    if (item.category === 'vegetable' && month >= 4 && month <= 8) {
      return 0.85;
    }
    
    // Winter vegetables more expensive (November-February) 
    if (item.category === 'vegetable' && (month >= 10 || month <= 1)) {
      return 1.25;
    }
    
    return 1.0;
  }

  private getMarketVolatility(): number {
    // Add ±10% random market fluctuation
    return 0.9 + (Math.random() * 0.2);
  }

  async getLivePrice(
    itemName: string, 
    location?: string, 
    preferredStore?: string
  ): Promise<LivePrice> {
    const cacheKey = `${itemName}-${location}-${preferredStore}`;
    
    // Check cache first
    const cached = this.priceCache.get(cacheKey);
    if (cached && Date.now() - cached.lastUpdated.getTime() < this.cacheExpiry) {
      return cached;
    }

    // Get base price data
    const normalizedName = itemName.toLowerCase();
    const priceData = GROCERY_PRICING_DATABASE[normalizedName];
    
    if (!priceData) {
      // Fallback for unknown items
      return {
        item: itemName,
        price: 3.99,
        unit: 'item',
        store: 'Local Market',
        lastUpdated: new Date(),
        trend: 'stable'
      };
    }

    // Calculate final price with all factors
    const locationMultiplier = this.getLocationMultiplier(location);
    const seasonalMultiplier = this.getSeasonalMultiplier(normalizedName);
    const volatilityMultiplier = this.getMarketVolatility();
    
    // Select store
    const availableStores = STORE_CHAINS.filter(store => 
      !preferredStore || store.name.toLowerCase().includes(preferredStore.toLowerCase())
    );
    const selectedStore = availableStores[Math.floor(Math.random() * availableStores.length)] || STORE_CHAINS[1];
    
    // Calculate final price
    const finalPrice = priceData.basePrice * 
                      locationMultiplier * 
                      seasonalMultiplier * 
                      volatilityMultiplier * 
                      selectedStore.multiplier;

    // Determine price trend (simplified)
    const trend = volatilityMultiplier > 1.05 ? 'up' : 
                  volatilityMultiplier < 0.95 ? 'down' : 'stable';

    const livePrice: LivePrice = {
      item: itemName,
      price: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      unit: priceData.unit,
      store: selectedStore.name,
      lastUpdated: new Date(),
      trend
    };

    // Cache the result
    this.priceCache.set(cacheKey, livePrice);
    
    return livePrice;
  }

  async getBulkPrices(
    itemNames: string[], 
    location?: string, 
    preferredStore?: string
  ): Promise<LivePrice[]> {
    const promises = itemNames.map(item => 
      this.getLivePrice(item, location, preferredStore)
    );
    
    return Promise.all(promises);
  }

  // Get price comparison across multiple stores
  async getPriceComparison(
    itemName: string, 
    location?: string
  ): Promise<LivePrice[]> {
    const promises = STORE_CHAINS.map(store => 
      this.getLivePrice(itemName, location, store.name)
    );
    
    const prices = await Promise.all(promises);
    return prices.sort((a, b) => a.price - b.price); // Sort by price ascending
  }

  // Estimate total grocery cost with price breakdown
  async estimateGroceryCost(
    items: string[], 
    location?: string
  ): Promise<{
    items: LivePrice[];
    total: number;
    averagePerItem: number;
    breakdown: { [category: string]: number };
  }> {
    const itemPrices = await this.getBulkPrices(items, location);
    const total = itemPrices.reduce((sum, item) => sum + item.price, 0);
    
    // Calculate breakdown by category
    const breakdown: { [category: string]: number } = {};
    itemPrices.forEach(item => {
      const itemData = GROCERY_PRICING_DATABASE[item.item.toLowerCase()];
      const category = itemData?.category || 'other';
      breakdown[category] = (breakdown[category] || 0) + item.price;
    });

    return {
      items: itemPrices,
      total: Math.round(total * 100) / 100,
      averagePerItem: Math.round((total / items.length) * 100) / 100,
      breakdown
    };
  }

  // Get the correct category for an item from the pricing database
  getItemCategory(itemName: string): 'protein' | 'vegetable' | 'starch' | 'other' {
    const normalizedName = itemName.toLowerCase();
    const priceData = GROCERY_PRICING_DATABASE[normalizedName];
    return priceData?.category || 'other';
  }
}

// Export singleton instance
export const groceryPricingService = new GroceryPricingService();

// Helper function for backward compatibility
export const getItemPrice = async (itemName: string, location?: string): Promise<number> => {
  const livePrice = await groceryPricingService.getLivePrice(itemName, location);
  return livePrice.price;
};