export async function fetchProducts() {
  const response = await fetch('/api/products/get');
  return response.json();
}
// Centralized API helper functions for making requests to your backend
