"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function ShareFormPage({ params }) {
  const { id } = params; // URL'den alınan form ID'si
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchName, setBranchName] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      try {
        // Form verisini almak için API'ye istek
        const response = await fetch(`/api/connect-db?formId=${id}`);
        const data = await response.json();

        if (!data || data.length === 0) throw new Error('Form bulunamadı!');
        
        // JSON formatındaki veriyi al ve ayarla
        setForm(JSON.parse(data[0].jsonform));
      } catch (error) {
        setError('Form yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);


  const handleInputChange = (question, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [question]: value,
    }));
  };

  const handleSubmit = async (data) => {
    const formattedData = {
      title: form.title,
      formValues: {},
    };

    form.questions.forEach((question, index) => {
      const answerKey = `${index + 1}_${question.question}`;
      let answer = data[answerKey] || '-';

      if (question.answerType === 'multiple-choice') {
        formattedData.formValues[answerKey] = answer;
        formattedData.formValues['Şube Adı'] = answer === 'Şube' ? branchName || '-' : '-';
      } else if (question.answerType === 'table') {
        question.columns.forEach((column) => {
          for (let rowIndex = 0; rowIndex < question.rows; rowIndex++) {
            const tableInputKey = `${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`;
            const tableInputValue = data[tableInputKey] || '-';
            formattedData.formValues[tableInputKey] = tableInputValue === "" ? "-" : tableInputValue;
          }
        });
      } else {
        formattedData.formValues[answerKey] = answer;
      }
    });

    try {
      const response = await fetch('/api/submit-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formattedData.title,
          formValues: JSON.stringify(formattedData.formValues),
        }),
      });

      if (!response.ok) throw new Error('Veri kaydedilirken bir hata oluştu.');

      router.push('/thank-you');
    } catch (error) {
      console.error('Veri kaydedilirken bir hata oluştu:', error);
    } finally {
      setFormData({});
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><p className="text-lg font-bold animate-pulse">Yükleniyor...</p></div>;
  if (error) return <p>{error}</p>;
  if (!form) return <p>Form bulunamadı!</p>;

  const renderInput = (question, index) => {
    return (
        <div>
            <label className='block mb-2 font-semibold text-lg'>
                {question.question} {question.required && <span className="text-red-500">*</span>}
            </label>
            {(() => {
                switch (question.answerType) {
                    case 'short-answer':
                        return (
                            <input
                                type="text"
                                name={`${index + 1}_${question.question}`}
                                required={question.required}
                                className='text-[10px] sm:text-base md:text-lg border-b bg-transparent rounded p-2 w-full'
                                value={formData[question.question] || ''}
                                onChange={(e) => handleInputChange(question.question, e.target.value)}
                            />
                        );
                    case 'multiple-choice':
                        return (
                            <>
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className='flex items-center mb-2'>
                                        <input
                                            type="radio"
                                            name={`${index + 1}_${question.question}`}
                                            value={option}
                                            required={question.required}
                                            className='mr-2'
                                            onChange={(e) => {
                                                setBranchName(option === "Şube" ? '' : '-');
                                                handleInputChange(question.question, option);
                                            }}
                                        />
                                        <label htmlFor={`question_${index}_option_${optionIndex}`} className='cursor-pointer'>{option}</label>
                                    </div>
                                ))}
                                {question.options.includes("Şube") && branchName !== '-' && (
                                    <div className='mt-2'>
                                        <input
                                            type="text"
                                            name={`${question.question}_ŞubeAdı`}
                                            placeholder="Şube adı"
                                            value={branchName}
                                            onChange={(e) => {
                                                setBranchName(e.target.value);
                                                handleInputChange(`${question.question}_ŞubeAdı`, e.target.value);
                                            }}
                                            className='text-[10px] sm:text-base md:text-lg border-b bg-transparent rounded p-2 w-full outline-none'
                                        />
                                    </div>
                                )}
                            </>
                        );
                    case 'dropdown':
                        return (
                            <select
                                className="w-full mt-2 p-1 border rounded outline-none"
                                value={formData[question.question] || '-'}
                                onChange={(e) => handleInputChange(question.question, e.target.value)}
                            >
                                <option value="-">-</option>
                                {question.dropdownOptions.map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                ))}
                            </select>
                        );
                    case 'date':
                        return (
                            <input
                                type="date"
                                name={`${index + 1}_${question.question}`}
                                required={question.required}
                                className='border rounded p-2 w-full text-sm sm:text-base md:text-lg'
                                value={formData[question.question] || ''}
                                onChange={(e) => handleInputChange(question.question, e.target.value)}
                            />
                        );
                    case 'table':
                        return (
                            <div className='border rounded p-2 w-full'>
                                <table className='text-[10px] sm:text-base md:text-lg min-w-full'>
                                    <thead>
                                        <tr>
                                            {question.columns.map((column, colIndex) => (
                                                <th key={colIndex} className='border-b bg-gray-200 border border-gray-400'>{column.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: question.rows }, (_, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {question.columns.map((column, colIndex) => (
                                                    <td key={colIndex} className='text-[10px] sm:text-base md:text-lg border-b'>
                                                        {column.type === 'dropdown' ? (
                                                            <select
                                                                name={`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`}
                                                                className='text-[10px] sm:text-base md:text-lg border rounded p-1 w-full'
                                                                value={formData[`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`] || ''}
                                                                onChange={(e) => handleInputChange(`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`, e.target.value)}
                                                            >
                                                                <option value="-">-</option>
                                                                {column.options.map((option, optionIndex) => (
                                                                    <option key={optionIndex} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                name={`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`}
                                                                className='text-[10px] sm:text-base md:text-lg border rounded p-1 w-full'
                                                                value={formData[`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`] || ''}
                                                                onChange={(e) => handleInputChange(`${index + 1}_${question.question}_${column.name}_${rowIndex + 1}`, e.target.value)}
                                                            />
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
};

  return (
    <div className='p-10 max-w-6xl mx-auto'>
      <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6'>{form.title}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleSubmit(Object.fromEntries(formData));
      }}>
        {form.questions.map((question, index) => (
          <div key={index} className='p-6 mb-4 bg-gray-50 border rounded'>
            {renderInput(question, index)}
          </div>
        ))}
        <button
          type="submit"
          className='px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600'
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

export default ShareFormPage;
