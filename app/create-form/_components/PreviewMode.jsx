// previewMode.jsx
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DateInput } from '@nextui-org/react';

const PreviewMode = ({ surveyTitle, questions, setPreviewMode, saveSurvey }) => {
    return (
        <div className="p-4 bg-white shadow rounded mb-6">
            <h2 className="text-xl font-bold mb-4">Form Önizleme</h2>
            <h3 className="text-lg font-semibold mb-4">{surveyTitle}</h3>
            {questions.map((questionData, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 border rounded">
                    <p className="font-semibold">{index + 1}. {questionData.question} {questionData.required && <span className="text-red-500">*</span>}</p>
                    {questionData.answerType === 'multiple-choice' && (
                        <div>
                            <ul className="list-disc ml-6">
                                {questionData.options.map((option, idx) => (
                                    <li key={idx}>
                                        <input type="radio" name={`question-${index}`} value={option} className="mr-2" />
                                        {option}
                                    </li>
                                ))}
                            </ul>
                            {questionData.options.includes('Şube') && (
                                <div className="mt-4">
                                    <label className="block font-semibold mb-2">Şube Adı:</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        placeholder="Şube Adını Girin"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {questionData.answerType === 'short-answer' && <input className="border-b border-gray-500 w-full bg-transparent outline-none" />}
                    {questionData.answerType === 'date' && <DateInput />}
                    {questionData.answerType === 'dropdown' && (
                        <select className="w-full mt-2 p-1 border rounded outline-none">
                            <option value="-">-</option>
                            {questionData.dropdownOptions.map((option, idx) => (
                                <option key={idx} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {questionData.answerType === 'table' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-400">
                                <thead>
                                    <tr>
                                        {questionData.columns.map((col, colIdx) => (
                                            <th key={colIdx} className="bg-gray-200 border border-gray-400 px-4 py-2">
                                                {col.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(questionData.rows)].map((_, rowIndex) => (
                                        <tr key={rowIndex} className="border-b border-gray-400">
                                            {questionData.columns.map((col, colIdx) => (
                                                <td key={colIdx} className="border border-gray-400 px-4 py-2">
                                                    {col.type === 'dropdown' ? (
                                                        <select className="w-full border rounded outline-none">
                                                            <option value="-">-</option>
                                                            {col.options.map((option, idx) => (
                                                                <option key={idx} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input type="text" className="w-full border-b border-gray-500" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
            <div className="flex space-x-4 mt-4">
                <Button variant="destructive" onClick={() => setPreviewMode(false)} className="gap-1"><ArrowLeft width={15}/>Geri Dön</Button>
                <Button variant="success" onClick={saveSurvey}>Formu Kaydet</Button>
            </div>
        </div>
    );
};

export default PreviewMode;
