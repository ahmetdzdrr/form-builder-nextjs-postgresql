"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import DashboardLayout from 'app/dashboard/layout';

function ResponsesForm() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [responseCounts, setResponseCounts] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/connect-db'); // Fetch from your API
        const formsData = await response.json();
        const processedForms = formsData.map(processForm);
        setForms(processedForms);
        const counts = await fetchResponseCounts(processedForms);
        setResponseCounts(counts);
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchForms();
  }, []);

  const processForm = (form) => {
    let parsedForm;

    try {
      parsedForm = JSON.parse(form.jsonform);
    } catch (parseError) {
      console.error('Error parsing JSON for form ID:', form.id, parseError);
      parsedForm = {};
    }

    return {
      title: parsedForm.title || 'No Title',
    };
  };

  const fetchResponseCounts = async (forms) => {
    const counts = await Promise.all(forms.map(async (form) => {
      try {
        const response = await fetch(`/api/responses?title=${encodeURIComponent(form.title)}`);
        const result = await response.json();
        return {
          title: form.title,
          count: result.length, // Assuming your API returns an array of responses
        };
      } catch (error) {
        console.error(`Error fetching response count for form ${form.title}:`, error);
        return {
          title: form.title,
          count: 0,
        };
      }
    }));
    return counts;
  };

  const handleFetchError = (error) => {
    console.error('Error fetching forms:', error);
  };

  const handleView = (title) => {
    const encodedTitle = encodeURIComponent(title);
    router.push(`/responses/${encodedTitle}`);
  };

  return (
    <ProtectedRoute>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='font-bold sm:text-xl md:text-2xl lg:text-3xl'>Form Cevaplarım</h2>
          <Button onClick={() => router.push('/dashboard')} className="gap-1">
            <ArrowLeft width={20} /> Geri
          </Button>
        </div>
        {forms.length === 0 ? (
          <div className='flex flex-col sm:flex-row items-center'>
            <p>Henüz cevaplanmış bir form yok.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {responseCounts.map((response) => (
              <div key={response.title} className='bg-white border rounded-lg p-6'>
                <h3 className='font-bold text-center text-lg sm:text-xl mb-2'>{response.title}</h3>
                <p className='text-center mb-4 text-gray-600'>
                  Toplam Cevap Sayısı: <span className='text-black'>{response.count}</span>
                </p>
                <div className='flex justify-center space-x-4'>
                  <Button
                    variant='link'
                    onClick={() => handleView(response.title)}
                    className='text-blue-600 hover:text-blue-800 hover:underline flex items-center'
                  >
                    <Eye className='mr-1' /> <span>Görüntüle</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default ResponsesForm;
