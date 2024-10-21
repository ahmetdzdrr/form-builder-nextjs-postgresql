"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/configs/index'; 
import { Responses } from '@/configs/schema'; 
import { eq } from 'drizzle-orm'; 
import * as XLSX from 'xlsx'; 
import { Button } from '@/components/ui/button'; 
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ResponsesPage = () => {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = window.innerWidth < 640 ? 2 : 3; // Ekran genişliğine göre sayfa başına sütun sayısı ayarlanır

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const titleFromPath = pathSegments[pathSegments.length - 1];

    if (titleFromPath) {
      const decodedTitle = decodeURIComponent(titleFromPath);
      setTitle(decodedTitle);
      fetchResponses(decodedTitle);
    } else {
      console.warn('Title is undefined.');
      setLoading(false);
    }
  }, []);

  const fetchResponses = async (title) => {
    if (!title) return;

    try {
      console.log('Fetching responses for title:', title);
      const results = await db.select().from(Responses).where(eq(Responses.title, title));
      setResponses(results);
      console.log('Fetched responses:', results);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(responses.map(response => JSON.parse(response.formValues)));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    XLSX.writeFile(wb, `${title || 'responses'}_responses.xlsx`);
  };

  const headers = responses.length > 0 ? Object.keys(JSON.parse(responses[0].formValues)) : [];
  
  // Sayfalama mantığı
  const totalColumns = headers.length;
  const totalPages = Math.ceil(totalColumns / itemsPerPage);
  const currentHeaders = headers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className='p-6'>
      {loading ? (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-xl font-bold'>Yükleniyor...</p>
        </div>
      ) : (
        <>
          <div className='flex justify-between mb-6'>
            <h2 className='font-bold sm:text-xl md:text-2xl lg:text-3xl'>{title}</h2>
            <Button onClick={() => router.push('/dashboard/responses')} className="gap-1">
              <ArrowLeft width={20} />Geri
            </Button>
          </div>

          {responses.length === 0 ? (
            <p>Henüz yanıt yok.</p>
          ) : (
            <div className='max-w-[1100px] overflow-x-auto'>
              <table className='mb-4 min-w-full border-collapse border border-gray-200'>
                <thead>
                  <tr className='bg-gray-100'>
                    {currentHeaders.map((header) => (
                      <th key={header} className='border border-gray-300 px-2 py-1 text-center text-sm font-medium text-gray-700'>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => {
                    const parsedValues = JSON.parse(response.formValues);
                    return (
                      <tr key={response.id} className='hover:bg-gray-50'>
                        {currentHeaders.map((header) => (
                          <td key={header} className='border border-gray-300 px-2 py-1 text-center text-sm'>{parsedValues[header]}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Sayfalama kontrolü */}
          <div className="flex justify-center items-center mt-4 mb-4">
            <ChevronLeft width={20} 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} 
              disabled={currentPage === 0}
              className='cursor-pointer'
            />
            <span className='mx-4'>
              {currentPage + 1} / {totalPages}
            </span>
            <ChevronRight width={20}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} 
              disabled={currentPage === totalPages - 1}
              className='cursor-pointer'
            />
          </div>

          {/* Excel indirme butonu */}
          {responses.length > 0 && (
            <Button onClick={downloadExcel} className='gap-y-5 gap-1'>İndir<Download width={15} height={15}/></Button>
          )}
        </>    
      )}
    </div>
  );
};

export default ResponsesPage;
