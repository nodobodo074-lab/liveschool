export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ბლოგი</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">სწავლის ტექნიკები</h2>
          <p className="text-gray-600">შეიტყვეთ ეფექტური სწავლის ტექნიკების შესახებ.</p>
          <p className="text-sm text-gray-500 mt-2">2026-04-12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">ტექნოლოგია განათლებაში</h2>
          <p className="text-gray-600">როგორ ცვლის ტექნოლოგია განათლების სამყაროს.</p>
          <p className="text-sm text-gray-500 mt-2">2026-04-08</p>
        </div>
      </div>
    </div>
  );
}