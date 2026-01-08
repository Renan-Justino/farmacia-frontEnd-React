import React from 'react';

interface ResponsiveTableProps {
  headers: string[];
  data: Array<Record<string, React.ReactNode>>;
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
  className?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  headers, 
  data, 
  onRowClick,
  className = '' 
}) => {
  return (
    <>
      {/* Tabela Desktop/Tablet */}
      <div className={`hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={`hover:bg-dpsp-light-blue/10 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            onClick={() => onRowClick?.(row, rowIndex)}
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          >
            <div className="space-y-3">
              {headers.map((header, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {header}:
                  </span>
                  <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                    {row[header]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveTable;

