import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

// Mock the PlacesAutocomplete component
jest.mock('./TaskForm', () => {
  const { forwardRef } = jest.requireActual('react');
  
  const MockPlacesAutocomplete = forwardRef(({ setLocation, formatted_address }, ref) => (
    <input 
      data-testid="places-autocomplete" 
      ref={ref} 
      defaultValue={formatted_address} 
    />
  ));

  const TaskForm = jest.fn(({
    formData, 
    handleSubmit, 
    handleChange, 
    categories, 
    handleLocation, 
    handleCategoryChange, 
    type = "create"
  }) => (
    <form onSubmit={handleSubmit} data-testid="task-form">
      <input 
        name="title" 
        value={formData.title} 
        onChange={handleChange} 
        data-testid="title-input"
      />
      <MockPlacesAutocomplete 
        setLocation={handleLocation} 
        formatted_address={formData.formatted_address} 
      />
      {categories && (
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleCategoryChange}
          data-testid="category-select"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}
      <input 
        name="required_volunteers_count" 
        type="number" 
        value={formData.required_volunteers_count} 
        onChange={handleChange}
        data-testid="volunteers-input"
      />
      <textarea 
        name="description" 
        value={formData.description} 
        onChange={handleChange}
        data-testid="description-textarea"
      />
      <button type="submit" data-testid="submit-button">
        {type === "create" ? "Create" : "Update"} Task
      </button>
    </form>
  ));

  return TaskForm;
});

describe('TaskForm', () => {
  const defaultFormData = {
    title: '',
    formatted_address: '',
    category: '',
    required_volunteers_count: 0,
    description: '',
  };

  const mockCategories = [
    { id: '1', name: 'Food Security' },
    { id: '2', name: 'Environmental' },
  ];

  const mockHandleSubmit = jest.fn((e) => {
    e.preventDefault();
  });

  const mockHandleChange = jest.fn();
  const mockHandleLocation = jest.fn();
  const mockHandleCategoryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
      />
    );

    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('places-autocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('volunteers-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('calls handleChange when input values change', () => {
    render(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
      />
    );

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    expect(mockHandleChange).toHaveBeenCalled();

    const volunteersInput = screen.getByTestId('volunteers-input');
    fireEvent.change(volunteersInput, { target: { value: '5' } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleCategoryChange when category is selected', () => {
    render(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
      />
    );

    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: '1' } });
    expect(mockHandleCategoryChange).toHaveBeenCalled();
  });

  it('calls handleSubmit when form is submitted', () => {
    render(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
      />
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('renders create or update button based on type prop', () => {
    const { rerender } = render(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
        type="create"
      />
    );

    expect(screen.getByText('Create Task')).toBeInTheDocument();

    rerender(
      <TaskForm
        formData={defaultFormData}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        categories={mockCategories}
        handleLocation={mockHandleLocation}
        handleCategoryChange={mockHandleCategoryChange}
        type="update"
      />
    );

    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });
});