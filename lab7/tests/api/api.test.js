const axios = require("axios");

const BASE_URL = require('../../config/config').BASE_API_URL;

describe("API Tests - Automation Exercise", () => {

  test("Get All Products List returns 200 and contains products", async () => {
    const response = await axios.get(`${BASE_URL}/productsList`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("products");
    expect(response.data.products.length).toBeGreaterThan(0);
  });

  test("GET All Brands List returns 200 and contains brands", async () => {
    const response = await axios.get(`${BASE_URL}/brandsList`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("brands");
    expect(response.data.brands.length).toBeGreaterThan(0);
  });


  test("Search for a product returns 200 and contains matching results", async () => {

    const formData = new URLSearchParams();
    formData.append('search_product', 'tshirt');

    const response = await axios.post(`${BASE_URL}/searchProduct`, formData);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("products");
    expect(response.data.products.length).toBeGreaterThan(0);
  });

  test("Search product without parameter returns 400 (Bad Request)", async () => {
    try {
      await axios.post(`${BASE_URL}/searchProduct`, {});
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe("Bad request, search_product parameter is missing in POST request.");
    }
  });

  test("Verify login with invalid credentials returns 404 (User not found)", async () => {
    try {
      await axios.post(`${BASE_URL}/verifyLogin`, {
        email: "invalid@example.com",
        password: "wrongpassword",
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe("User not found!");
    }
  });

  test("Create a new user account returns 200 and success message", async () => {

    const formData = new URLSearchParams();
    formData.append("name", "John Doe");
    formData.append("email", `johndoe${Date.now()}@example.com`);
    formData.append("password", "securepassword123");
    formData.append("title", "Mr");
    formData.append("birth_date", "15");
    formData.append("birth_month", "07");
    formData.append("birth_year", "1990");
    formData.append("firstname", "John");
    formData.append("lastname", "Doe");
    formData.append("company", "Test Company");
    formData.append("address1", "123 Test Street");
    formData.append("country", "United States");
    formData.append("zipcode", "12345");
    formData.append("state", "California");
    formData.append("city", "Los Angeles");
    formData.append("mobile_number", "1234567890");
  
    const response = await axios.post(`https://automationexercise.com/api/createAccount`, formData);
  
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("User created!");
  });

  });