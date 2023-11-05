import React, { useState, useEffect } from 'react';
import { useGetOneEditRequestQuery } from '../states/apislice';

const ReasonsToVisit = () => {
  // State to hold the selected reasons' texts
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [Editfields, setEditfields] = useState({});
  const requestId="6541e446983dc8332984b7b3"; 
  const {data,isLoading,isSuccess,isError,error}= useGetOneEditRequestQuery({requestId});
  useEffect(() => {
    if(isSuccess){
      console.log(data);
      const{data:dt}=data
      const{editRequest}=dt
      setEditfields(editRequest)
      // Editfields=editableFields;
      console.log(editRequest);
    }
  },[isSuccess]);
 

  // List of reasons with their unique texts
  const reasons = [
    'Scenic Beauty',
    'Cultural Experience',
    'Adventure Activities',
    'Historical Sites',
    // Add more reasons as needed
  ];

  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    const text = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // If the checkbox is checked, add the reason's text to the selectedReasons state
      setSelectedReasons([...selectedReasons, text]);
    } else {
      // If the checkbox is unchecked, remove the reason's text from the selectedReasons state
      const updatedReasons = selectedReasons.filter(reason => reason !== text);
      setSelectedReasons(updatedReasons);
    }
  };

  // Assuming the object is stored in a variable named 'yourObject'
// const yourObject = Editfields;
// console.log(yourObject);

// Predefined accessibility array
const accessibilityArray = ['Weight In', 'Beneficiary', 'Output'];

// Function to create a new state object
const createStateObject = (data) => {
  const stateObject = {};

  // Extract fieldname values from editableFields
  const fieldnameValues = data.editableFields?.map(field => field.fieldname);

  // Filter values found in the accessibilityArray
  const valuesFoundInAccessibility = fieldnameValues?.filter(value => accessibilityArray.includes(value));

  // Create a new state object with found values
  valuesFoundInAccessibility?.forEach(value => {
    const foundField = data.editableFields?.find(field => field.fieldname === value);
    stateObject[value] = foundField.initialValue;
  });

  return stateObject;
};

// Call the function passing your object to create the state object
const newStateObject = createStateObject(Editfields);

// Displaying the created state object
console.log('New State Object:', newStateObject);

  // Effect to console log the selected reasons whenever it changes
  // useEffect(() => {
  //   console.log('Selected Reasons:', selectedReasons);
  // }, [selectedReasons]);

  return (
    <div>
      <h2>Reasons to Visit a Place</h2>
      <form>
        {reasons.map((reason, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                value={reason}
                onChange={handleCheckboxChange}
                checked={selectedReasons.includes(reason)}
              />
              {reason}
            </label>
          </div>
        ))}
      </form>

      <h3>Selected Reasons:</h3>
      <ul>
        {selectedReasons.map((selected, index) => (
          <li key={index}>{selected}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReasonsToVisit;
