import React from "react";

const InputField = ({ label, type, name, value, onChange, placeholder }) => {
    return (
        <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-orange-500 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-inherit placeholder-gray-400"
            />
        </div>
    );
};
export default InputField;
