export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-yellow-500">KB Dashboard</div>
        <div className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-yellow-500">
            개인
          </a>
          <a href="#" className="text-gray-600 hover:text-yellow-500">
            기업
          </a>
          <a href="#" className="text-gray-600 hover:text-yellow-500">
            금융상품
          </a>
          <a href="#" className="text-gray-600 hover:text-yellow-500">
            자산관리
          </a>
        </div>
      </div>
    </nav>
  );
}
