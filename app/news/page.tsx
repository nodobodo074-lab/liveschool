export default function News() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">სიახლეები</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">ახალი სასწავლო მასალები</h2>
          <p className="text-gray-600">ჩვენ დავამატეთ ახალი სასწავლო მასალები მათემატიკისა და ქიმიისთვის.</p>
          <p className="text-sm text-gray-500 mt-2">2026-04-14</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">ონლაინ კურსები</h2>
          <p className="text-gray-600">ახალი ონლაინ კურსები ხელმისაწვდომია ყველა მოსწავლისთვის.</p>
          <p className="text-sm text-gray-500 mt-2">2026-04-10</p>
        </div>
      </div>
    </div>
  );
}