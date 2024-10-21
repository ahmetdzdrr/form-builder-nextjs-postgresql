// components/DateInput.jsx
import React from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ selectedDate, onChange }) => {
    return (
        <div className="mt-4">
            <label className="block font-semibold mb-2">Tarih Seçin:</label>
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                className="w-full p-2 border rounded"
                dateFormat="dd/MM/yyyy"
                placeholderText="Tarih Seçin"
            />
        </div>
    );
};

export default DateInput;
