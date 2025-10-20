// src/api/recommendationsApi.js

/**
 * Simulates an API call to a backend service for Smart Cart Recommendations.
 * In a real environment, this would hit an actual endpoint with a database/ML engine.
 *
 * @param {Array<Object>} cartItems - The current list of items in the user's cart.
 */
export async function getSmartCartRecommendations(cartItems) {
  console.log("Analyzing cart for smart suggestions...");

  // Initialize recommendation structure
  const recommendationData = {
    missingEssentials: [],
    savingsSuggestions: [],
  };

  // --- Rule 1: Missing Essentials Check (Rule-Based Example) ---
  const hasCoffee = cartItems.some(item => item.name.toLowerCase().includes('coffee'));
  const hasMilk = cartItems.some(item => item.name.toLowerCase().includes('milk'));

  if (hasCoffee && !hasMilk) {
    recommendationData.missingEssentials.push({
      id: 'prod-milk-001',
      name: 'Whole Milk (Pairs well with coffee!)',
      price: 3.50,
    });
  }

  // --- Rule 2: Best Value Suggestion (Savings Example) ---
  const brandedCereal = cartItems.find(item => item.name.toLowerCase().includes('branded flakes'));

  if (brandedCereal && brandedCereal.price > 5) {
    recommendationData.savingsSuggestions.push({
      originalItem: brandedCereal.name,
      suggestedAlternative: {
        id: 'prod-generic-002',
        name: 'QuickBasket Value Flakes (High-Rated)',
        price: brandedCereal.price - 2.00, // Suggesting a $2 saving
        saving: 2.00,
      }
    });
  }

  // Simulate API delay for a realistic loading state
  await new Promise(resolve => setTimeout(resolve, 500));

  return recommendationData;
}
