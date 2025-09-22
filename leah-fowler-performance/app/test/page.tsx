export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-black mb-4">Test Page</h1>
        <p className="text-lg text-gray-700 mb-4">If you can see this text, the issue is with specific components.</p>

        <div className="bg-blue-500 text-white p-4 rounded mb-4">
          Blue box with white text
        </div>

        <div className="bg-red-500 text-white p-4 rounded mb-4">
          Red box with white text
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          Green box with white text
        </div>
      </div>
    </div>
  )
}
