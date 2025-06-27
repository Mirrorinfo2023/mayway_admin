// components/Header.js
export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">mirror services</div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">🔍</button>
      </div>
    </header>
  );
}
