import { Input } from '@/components/ui/input';
import React from 'react';

const QuestionInput = ({ question, setQuestion }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <label className="block mb-2 font-semibold">Soru:</label>
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Soru metnini girin..."
      />
    </div>
  );
};

export default QuestionInput;
