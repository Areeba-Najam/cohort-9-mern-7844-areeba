function App() {
  const appName = 'Notes App';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold text-brand mb-2">{appName}</h1>
      <p className="text-gray-600 text-sm">
        Vite frontend infrastructure is ready. Authorization and the remaining screens will be added in future PRs.
      </p>
    </div>
  );
}

export default App;