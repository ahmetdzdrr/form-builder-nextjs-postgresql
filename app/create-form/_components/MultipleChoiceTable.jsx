import { Plus, Trash } from 'lucide-react';
import DropdownOptionsInput from './DropdownOptionsInput';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from '@/components/ui/select';

const MultipleChoiceTable = ({ columns, setColumns, rows, setRows }) => {
  
  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: 'short-answer', options: [] }]);
  };

  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  };

  const handleColumnTypeChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].type = value;
    if (value !== 'dropdown') {
      newColumns[index].options = [];
    }
    setColumns(newColumns);
  };

  const handleDropdownOptionsChange = (index, options) => {
    const newColumns = [...columns];
    newColumns[index].options = options;
    setColumns(newColumns);
  };

  const handleDeleteColumn = (index) => {
    const newColumns = columns.filter((_, colIndex) => colIndex !== index);
    setColumns(newColumns);
  };

  return (
    <div className="mb-8 p-4 border rounded bg-white">
      <label className="block mb-4 font-semibold text-lg md:text-xl">Sütun Başlıkları ve Türleri</label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1 text-sm md:text-base">Sütun Başlığı:</label>
            <Input
              value={column.name}
              onChange={(e) => handleColumnChange(index, e.target.value)}
              placeholder={`Sütun ${index + 1} başlığı`}
              className="border rounded mb-2 text-sm md:text-base"
            />

            <label className="font-medium mb-1 text-sm md:text-base">Türü:</label>
            <div className="mb-2">
              <Select
                value={column.type}
                onValueChange={(value) => handleColumnTypeChange(index, value)}
                className="w-full"
              >
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="Cevap türü seçin" />
                </SelectTrigger>
                <SelectContent className="text-sm md:text-base">
                  <SelectGroup>
                    <SelectItem value="short-answer">Kısa Cevap</SelectItem>
                    <SelectItem value="date">Tarih</SelectItem>
                    <SelectItem value="dropdown">Dropdown Menü</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteColumn(index)}
              className="text-red-500 hover:text-red-700 self-start"
            >
              <Trash width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {column.type === 'dropdown' && (
              <div className="mt-2">
                <DropdownOptionsInput
                  options={column.options || []}
                  setOptions={(options) => handleDropdownOptionsChange(index, options)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddColumn}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center mt-4 text-sm md:text-base"
      >
        <Plus width={16} height={16} className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Sütun Ekle
      </button>

      <div className="flex items-center mt-6">
        <label className="font-semibold text-sm md:text-base">Satır:</label>
        <Input
          type="number"
          min="1"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="border text-sm md:text-base"
          placeholder="Satır sayısını girin"
        />
      </div>
    </div>
  );
};

export default MultipleChoiceTable;
