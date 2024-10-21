"use client";
import { useEffect, useState } from 'react';
import { db } from '@/configs/index';
import { JsonForms, Responses } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

function ShareFormPage({ params }) {
  const { id } = params;
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
        const forms = await db
          .select()
          .from(JsonForms)
          .where(eq(JsonForms.id, Number(id)));

        if (!forms || forms.length === 0) throw new Error('Form bulunamadı!');
        setForm(JSON.parse(forms[0].jsonform));
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
            const tableInputValue = data[tableInputKey] || '-'; // FormData'dan gelen değer
            formattedData.formValues[tableInputKey] = tableInputValue === "" ? "-" : tableInputValue;
          }
        });
      } else {
        formattedData.formValues[answerKey] = answer;
      }
    });
  
    console.log("Formatted Data to Insert:", formattedData);
  
    try {
      await db.insert(Responses).values({
        title: formattedData.title,
        formValues: JSON.stringify(formattedData.formValues),
      });
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
            <label className='text-sm sm:text-base md:text-lg block mb-1'>
              {index + 1}. {question.question}
              {question.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            {renderInput(question, index)}
          </div>
        ))}
        <button
          type="submit"
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm sm:text-base md:text-lg'
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

export default ShareFormPage;
