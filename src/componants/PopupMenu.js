// components/ExpandableRowWithBoxes.js
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ExpandableRowWithBoxes({ title, icon = null, options = [] }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(prev => !prev);

  return (
    <div className="w-full">
      {/* Header */}
      <div
        onClick={toggle}
        className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-2xl text-orange-600">{icon}</div>}
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        <div className="text-gray-500">{expanded ? <FaChevronUp /> : <FaChevronDown />}</div>
      </div>

      {/* Option list instead of boxes */}
      {expanded && options.length > 0 && (
        <ul className="mt-3 space-y-2 pl-6">
          {options.map((opt, idx) => {
            const itemContent = (
              <li className="flex items-center gap-3 py-2 px-4 bg-white rounded-md shadow hover:shadow-md transition cursor-pointer">
                <div className="text-lg text-blue-600">{opt.icon}</div>
                <span className="text-gray-800 text-sm font-medium">{opt.title}</span>
              </li>
            );

            if (opt.href) {
              return (
                <a key={idx} href={opt.href} className="block">
                  {itemContent}
                </a>
              );
            } else if (opt.onClick) {
              return (
                <button
                  key={idx}
                  onClick={opt.onClick}
                  className="block w-full text-left bg-transparent border-0 p-0"
                >
                  {itemContent}
                </button>
              );
            } else {
              return <li key={idx}>{itemContent}</li>;
            }
          })}
        </ul>
      )}
    </div>
  );
}
