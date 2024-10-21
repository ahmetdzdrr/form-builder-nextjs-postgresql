import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

const DropdownOptionsInput = ({ options, setOptions }) => {
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Yeni seçenek ekleyin"
        />
        <Plus 
          onClick={handleAddOption}
          width={25}
          height={25}
          className="ml-2 bg-green-500 p-1 text-white rounded-xl cursor-pointer"
        />
      </div>

      {options.map((option, index) => (
        <div key={index} className="bg-gray-50 p-4 flex items-center mt-4">
          <span className="mr-2">{index + 1}. Seçenek:</span>
          <span className="flex-1">{option}</span>
          <Trash 
            width={20}
            height={20}
            onClick={() => handleRemoveOption(index)}
            className="bg-transparent text-red-500 ml-2 cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default DropdownOptionsInput;
