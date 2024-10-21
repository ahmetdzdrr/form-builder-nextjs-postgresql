import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

const MultipleChoiceOptions = ({ options, setOptions }) => {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim() === '') return;
    setOptions([...options, newOption]);
    setNewOption('');
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mt-2 space-x-4">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Yeni seçenek ekle"
        />
        <Plus
          onClick={addOption}
          width={25}
          height={25}
          className="bg-green-500 p-1 text-white rounded-xl cursor-pointer"
        />
      </div>
      {options.map((option, index) => (
        <div key={index} className="bg-gray-50 p-4 flex items-center mt-4">
          <span className="mr-2">{index + 1}. Seçenek:</span>
          <span className="flex-1">{option}</span>
          <Trash 
            width={20}
            height={20}
            onClick={() => removeOption(index)}
            className="bg-transparent text-red-500 ml-2 cursor-pointer"
          />
        </div>
      ))}

    </div>
  );
};

export default MultipleChoiceOptions;
