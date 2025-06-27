
// components/
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="space-y-1">
            <li>Careers</li>
            <li>Press</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Help</h3>
          <ul className="space-y-1">
            <li>Payments</li>
            <li>Shipping</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Policy</h3>
          <ul className="space-y-1">
            <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <div className="flex space-x-4">
            <span>🐦</span>
            <span>📘</span>
            <span>📸</span>
          </div>
        </div>
      </div>
      <p className="text-center text-sm mt-6">© 2025 Packster E-commerce. All rights reserved.</p>
    </footer>
  );
}
