"use client";
import React, { useEffect, useState } from 'react';
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
  const [itemsPerPage, setItemsPerPage] = useState(); // Default value

  useEffect(() => {
    // Set itemsPerPage based on window size
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 640 ? 2 : 5);
    };

    updateItemsPerPage(); // Initial call

    // Add event listener to update itemsPerPage on resize
    window.addEventListener('resize', updateItemsPerPage);
    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // Cleanup
    };
  }, []); // Run only once on mount

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
      const res = await fetch(`/api/responses/${encodeURIComponent(title)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch responses');
      }
      const data = await res.json();
      setResponses(data);
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

  const headers = responses.length > 0 && responses[0].formvalues ?
    Object.keys(JSON.parse(responses[0].formvalues)) : [];

  // Pagination logic
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
            <div className="flex items-center gap-2"> {/* Flex container for buttons */}
              {responses.length > 0 && (
                <Button variant="success" onClick={downloadExcel} className='gap-y-5 gap-1'>İndir<Download width={15} height={15} /></Button>
              )}
              <Button onClick={() => router.push('/responses')} className="gap-1">
                <ArrowLeft width={20} />Geri
              </Button>
            </div>
          </div>


          {responses.length === 0 ? (
            <p>Henüz yanıt yok.</p>
          ) : (
            <div className='overflow-x-auto'>
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
                    const parsedValues = JSON.parse(response.formvalues);
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

          {/* Pagination controls */}
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
        </>
      )}
    </div>
  );
};

export default ResponsesPage;
