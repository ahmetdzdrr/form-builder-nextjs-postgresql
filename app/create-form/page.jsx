"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '../_components/ProtectedRoute';

const PreviewMode = dynamic(() => import('./_components/PreviewMode'));
const MultipleChoiceOptions = dynamic(() => import('./_components/MultipleChoiceOptions'));
const MultipleChoiceTable = dynamic(() => import('./_components/MultipleChoiceTable'));
const DropdownOptionsInput = dynamic(() => import('./_components/DropdownOptionsInput'));
const QuestionInput = dynamic(() => import('./_components/QuestionInput'));
const AnswerTypeSelector = dynamic(() => import('./_components/AnswerTypeSelector'));

const CreateSurvey = () => {
    const [surveyTitle, setSurveyTitle] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [questions, setQuestions] = useState([
        { question: '', answerType: 'short-answer', columns: [], rows: 0, options: [], required: false, dropdownOptions: [] }
    ]);
    const [previewMode, setPreviewMode] = useState(false);
    const router = useRouter();

    const addQuestion = () => {
        setQuestions([...questions, { question: '', answerType: 'short-answer', columns: [], rows: 0, options: [], required: false, dropdownOptions: [] }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleAnswerTypeChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].answerType = value;
        setQuestions(newQuestions);
    };

    const handleOptionsChange = (index, options) => {
        const newQuestions = [...questions];
        newQuestions[index].options = options;
        setQuestions(newQuestions);
    };

    const handleColumnsChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].columns = value;
        setQuestions(newQuestions);
    };

    const handleRowsChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].rows = value;
        setQuestions(newQuestions);
    };

    const handleRequiredChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].required = value;
        setQuestions(newQuestions);
    };

    const handleDropdownOptionsChange = (index, options) => {
        const newQuestions = [...questions];
        newQuestions[index].dropdownOptions = options.map(option => option.name || option);
        setQuestions(newQuestions);
    };

    const saveSurvey = async () => {
        if (!surveyTitle) {
            toast.error('Lütfen anket başlığını doldurun!');
            return;
        }

        const surveyData = {
            title: surveyTitle,
            questions: questions,
        };

        const jsonSurveyData = JSON.stringify(surveyData);

        try {
            const response = await fetch('/api/save-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonform: jsonSurveyData }),
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Anket kaydetme başarısız oldu!');
            }
            
            toast.success('Form başarıyla kaydedildi!');
            router.push('/dashboard');

        } catch (error) {
            toast.error(`Hata: ${error.message}`);
            console.error('Anket kaydetme hatası:', error);
        }
    };

    const handlePreview = () => {
        if (!surveyTitle) {
            toast.error('Lütfen anket başlığını doldurun!');
            return;
        }
        setPreviewMode(true);
    };

    return (
        <ProtectedRoute>
            <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
                <div className="flex sm:flex-row justify-between items-center mb-12">
                    <h1 className="text-xl sm:text-2xl font-bold">Form Oluştur</h1>
                    <Button onClick={() => router.push('/dashboard')} className="mt-4 sm:mt-0 gap-1">
                        <ArrowLeft width={15} />Geri
                    </Button>
                </div>

                {!previewMode && (
                    <div className="mb-4">
                        <label className="h-5 flex mb-4 items-center">
                            <span className='font-semibold'>Form Başlığı:</span>
                            <Info
                                className="ml-2 cursor-pointer"
                                onMouseEnter={() => setShowInfo(true)}
                                onMouseLeave={() => setShowInfo(false)}
                            />
                            {showInfo && (
                                <p className="ml-2 p-1 bg-white border rounded shadow-md text-sm text-gray-700">
                                    Türkçe karakterler ve boşluk <span className='underline font-bold'>içermemeli!</span>
                                </p>
                            )}
                        </label>
                        <Input
                            type="text"
                            value={surveyTitle}
                            onChange={(e) => setSurveyTitle(e.target.value)}
                            className="w-full outline-none focus:outline-none"
                            placeholder="Anket Başlığını Girin"
                            required
                        />
                    </div>
                )}

                {previewMode ? (
                    <PreviewMode
                        surveyTitle={surveyTitle}
                        questions={questions}
                        setPreviewMode={setPreviewMode}
                        saveSurvey={saveSurvey}
                    />
                ) : (
                    <>
                        {questions.map((questionData, index) => (
                            <div key={index} className="mb-6 p-4 bg-white shadow rounded">
                                <QuestionInput question={questionData.question} setQuestion={(value) => handleQuestionChange(index, value)} />
                                <AnswerTypeSelector answerType={questionData.answerType} setAnswerType={(value) => handleAnswerTypeChange(index, value)} />
                                {questionData.answerType === 'multiple-choice' && (
                                    <MultipleChoiceOptions options={questionData.options} setOptions={(options) => handleOptionsChange(index, options)} />
                                )}
                                {questionData.answerType === 'dropdown' && (
                                    <DropdownOptionsInput
                                        options={questionData.dropdownOptions}
                                        setOptions={(options) => handleDropdownOptionsChange(index, options)}
                                    />
                                )}
                                {questionData.answerType === 'table' && (
                                    <MultipleChoiceTable
                                        columns={questionData.columns}
                                        setColumns={(value) => handleColumnsChange(index, value)}
                                        rows={questionData.rows}
                                        setRows={(value) => handleRowsChange(index, value)}
                                        dropdownOptions={questionData.dropdownOptions}
                                        setDropdownOptions={(options) => handleDropdownOptionsChange(index, options)}
                                    />
                                )}
                                <div className='mb-2'>
                                    <input
                                        type="checkbox"
                                        checked={questionData.required}
                                        onChange={(e) => handleRequiredChange(index, e.target.checked)}
                                        className="ml-2"
                                    />
                                    <label className="ml-1">Zorunlu</label>
                                </div>
                                <Button variant="destructive" onClick={() => removeQuestion(index)} className="font-bold gap-2 items-center">Soruyu Sil</Button>
                            </div>
                        ))}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button variant="default" onClick={addQuestion}>Soru Ekle</Button>
                            <Button variant="warning" onClick={handlePreview}>Önizleme</Button>
                        </div>
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default CreateSurvey;
