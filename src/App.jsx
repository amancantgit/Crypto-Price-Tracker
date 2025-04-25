import Crypto from "./Component/Crypto";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-4">

      <h1 className="text-2xl font-bold m-auto text-center p-5 w-[500px] bg-gradient-to-r from-[#870000] to-[#190A05] text-white rounded-xl shadow-xl transform hover:scale-105 hover:from-[#870010] hover:to-[#190A05] transition-all duration-300">Today's Cryptocurrency Prices</h1>

      <Crypto />
    </div>
  );
}

export default App;

