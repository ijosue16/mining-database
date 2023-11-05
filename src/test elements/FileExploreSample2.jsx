import React, { useState } from 'react';
import { Select, Tag, Input, Button } from 'antd';

const { Option } = Select;

const App = () => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [editableFields, setEditableFields] = useState([]);

  const options = [
    { value: 'gold', hex: '#FFD700', rgb: 'rgb(255, 215, 0)' },
    { value: 'lime', hex: '#00FF00', rgb: 'rgb(0, 255, 0)' },
    { value: 'green', hex: '#008000', rgb: 'rgb(0, 128, 0)' },
    { value: 'cyan', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)' },
  ];

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const handleTagClose = (removedTag) => {
      const newSelectedValues = selectedValues.filter((tag) => tag !== removedTag);
      setSelectedValues(newSelectedValues);

      const indexToRemove = selectedValues.indexOf(removedTag);
      const fields = [...editableFields];
      fields.splice(indexToRemove * 3, 1);
      fields.splice(indexToRemove * 3, 1);
      fields.splice(indexToRemove * 3, 1);
      setEditableFields(fields);
    };

    return (
      <Tag
        color={'red'}
        closable={closable}
        onClose={() => handleTagClose(value)}
        style={{ marginRight: 3, display: 'flex', alignItems: 'center' }}
      >
        {label}
      </Tag>
    );
  };

  const handleSelectChange = (values) => {
    setSelectedValues(values);
    const initialFields = values.reduce((acc, val) => {
      const foundOption = options.find(option => option.value === val);
      if (foundOption) {
        acc.push({
          value: foundOption.value,
          hex: foundOption.hex,
          rgb: foundOption.rgb
        });
      }
      return acc;
    }, []);
    setEditableFields(initialFields);
  };

  const handleInputChange = (value, index, field) => {
    const fields = [...editableFields];
    fields[index][field] = value;
    setEditableFields(fields);
  };

  const removeDynamicFields = (index) => {
    const updatedSelectedValues = [...selectedValues];
    updatedSelectedValues.splice(index, 1);
    setSelectedValues(updatedSelectedValues);

    const fields = [...editableFields];
    fields.splice(index, 1);
    setEditableFields(fields);
  };

  const handleOutput = () => {
    console.log(editableFields);
  };

  return (
    <div>
      <Select
        mode="multiple"
        tagRender={tagRender}
        style={{ width: '100%' }}
        value={selectedValues}
        onChange={handleSelectChange}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.value}
          </Option>
        ))}
      </Select>

      <br />

      {editableFields.map((obj, index) => (
        <div key={obj.value}>
          <Tag color={'blue'} style={{ marginBottom: '5px' }}>
            {obj.value}
            <span
              style={{ marginLeft: '10px', cursor: 'pointer' }}
              onClick={() => removeDynamicFields(index)}
            >
              -
            </span>
          </Tag>
          <Input
            placeholder="Hex Color Code"
            value={obj.hex}
            onChange={(e) => handleInputChange(e.target.value, index, 'hex')}
            style={{ marginTop: '5px' }}
          />
          <Input
            placeholder="RGB Value"
            value={obj.rgb}
            onChange={(e) => handleInputChange(e.target.value, index, 'rgb')}
            style={{ marginTop: '5px' }}
          />
        </div>
      ))}

      <Button onClick={handleOutput} style={{ marginTop: '10px' }}>
        Output
      </Button>
    </div>
  );
};

export default App;
