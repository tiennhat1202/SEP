import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderListMeal from '../components/User/OrderListMeal';

// Mock the services and data
jest.mock('../services/MealService', () => {
  return {
    getListMealToOrderCustomer: jest.fn(() => Promise.resolve({ response: { data: [] } })),
    // Mock other methods as needed
  };
});

// Create a mock CartContext
jest.mock('../store/CartContext', () => ({
  useCart: () => ({ cart: [], setCart: jest.fn() }), // Provide a mock implementation
}));

test('renders OrderListMeal component', async () => {
  render(<OrderListMeal />);
  // Check if the component renders without errors
  const headerText = screen.getByText('What do we have today?');
  expect(headerText).toBeInTheDocument();
});

test('fetches data and renders it', async () => {
  // Mock data to be returned by the service
  const mockData = [{ mealName: 'Meal 1' }, { mealName: 'Meal 2' }];
  require('../services/MealService').getListMealToOrderCustomer.mockResolvedValue({
    response: { data: mockData },
  });

  render(<OrderListMeal />);
  // Wait for data to load
  await waitFor(() => {
    // Check if the rendered data is displayed correctly
    expect(screen.getByText('Meal 1')).toBeInTheDocument();
    expect(screen.getByText('Meal 2')).toBeInTheDocument();
  });
});

test('handles search and add to cart', () => {
  render(<OrderListMeal />);
  
  // Simulate user interaction: enter search term
  const searchInput = screen.getByPlaceholderText('Search meal....');
  fireEvent.change(searchInput, { target: { value: 'Search Term' } });

  // Simulate user interaction: click "Add To Cart" button
  const addToCartButton = screen.getByText('Add To Cart');
  fireEvent.click(addToCartButton);

  // Add your assertions for search and cart functionality here
});
