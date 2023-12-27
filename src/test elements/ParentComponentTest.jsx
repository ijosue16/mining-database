// ParentComponent.js
import React from 'react';
import ChildFormComponent from './ChildComponentTest';

const ParentComponent = () => {
  const handleFormSubmit = (formData) => {
    console.log('Form data received in parent component:', formData);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <ChildFormComponent onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ParentComponent;
