import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AnswerTypeSelector = ({ answerType, setAnswerType }) => {
  return (
    <div className="flex items-center mb-4 space-x-4">
      <label className="font-semibold">Türü:</label>
      <Select 
        value={answerType}
        onValueChange={(value) => setAnswerType(value)}  // Shadcn select için onValueChange kullanıyoruz
      >
        <SelectTrigger>
          <SelectValue placeholder="Cevap türü seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="short-answer">Kısa Cevap</SelectItem>
            <SelectItem value="multiple-choice">Çoktan Seçmeli</SelectItem>
            <SelectItem value="date">Tarih</SelectItem>
            <SelectItem value="dropdown">Dropdown Menü</SelectItem>
            <SelectItem value="table">Tablo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AnswerTypeSelector;
