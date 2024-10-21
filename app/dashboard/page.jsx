"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogOut, Pencil, Share, Trash } from 'lucide-react';
import { db } from '@/configs/index';
import { JsonForms } from '@/configs/schema';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../_components/ProtectedRoute';

function Dashboard() {
  const router = useRouter();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      fetchForms();
    }
  }, []);

  const fetchForms = async () => {
    try {
      const forms = await db.select().from(JsonForms);
      const formsWithTitles = forms.map(processForm);
      setForms(formsWithTitles);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const processForm = (form) => {
    let parsedForm;
    try {
      parsedForm = JSON.parse(form.jsonform);
    } catch (parseError) {
      console.error('Error parsing JSON for form ID:', form.id, parseError);
      parsedForm = {};
    }
    return {
      id: form.id,
      title: parsedForm.title || 'No Title',
      token: form.token,
    };
  };

  const handleFetchError = (error) => {
    console.error('Error fetching forms:', error);
    toast.error('Error fetching forms');
  };

  const deleteForm = async (id) => {
    if (!id) return;

    try {
      const response = await fetch('/api/delete-form', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Form silme işlemi başarısız oldu!');
      }

      setForms(prevForms => prevForms.filter(form => form.id !== id));
      toast.success('Form başarıyla silindi!');
    } catch (error) {
      console.error('Delete Form Error:', error);
      toast.error('Form silinirken bir hata oluştu: ' + error.message);
    }
  };

  const handleShare = (id) => {
    const shareURL = `${window.location.origin}/share-form/${id}`;
    navigator.clipboard.writeText(shareURL);
    toast.success('Form bağlantısı kopyalandı!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className='p-6'>
      <ToastContainer />
      <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
        <h2 className='font-bold sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-0'>Formlarım</h2>
        <div className='flex space-x-2 sm:space-x-4'>
          <Button
            className="gap-1"
            onClick={() => {
              if (forms.length >= 3) {
                toast.warning('Form Limitine Ulaştınız!');
              } else {
                router.push('/create-form');
              }
            }}
          >
            Form Oluştur<Pencil width={15} height={15} />
          </Button>
          <Button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 gap-1'>Çıkış Yap<LogOut width={20} /></Button>
        </div>
      </div>


      {forms.length === 0 ? (
        <div className='flex flex-col sm:flex-row items-center'>
          <p>Henüz kaydedilmiş bir form yok.</p>
          </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {forms.map((form) => (
            <div key={form.id} className='bg-white border border-b rounded-lg p-4'>
              <h3 className='font-bold text-center text-xl mb-10'>{form.title}</h3>
              <div className='flex items-center justify-center space-x-4'>
                <Button variant="link"
                  onClick={() => handleShare(form.id)}
                  className='text-blue-500 hover:underline flex items-center'
                >
                  <Share className='mr-1' /> <span>Paylaş</span>
                </Button>
                <Button variant="link"
                  onClick={() => deleteForm(form.id)}
                  className='text-red-500 hover:underline flex items-center'
                >
                  <Trash className='mr-1' /> <span>Sil</span>
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

export default Dashboard;
