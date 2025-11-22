function NoContentFound() {
  return (
    <div className="text-center flex justify-center">
      <div className="bg-slate-600 grid grid-cols-4 text-white w-1/2 rounded-lg py-5 mb-4">
        <div className="col-span-4">
          <h1 className="text-2xl py-3">No questions found</h1>
        </div>
      </div>
    </div>
  );
}

export default NoContentFound;