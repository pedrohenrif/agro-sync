import React from "react";
import { Leaf } from "lucide-react";

const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
      <Leaf size={32} />
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900">Bem-vindo ao AgroSync</h1>
    <p className="text-slate-500 text-base max-w-sm">Gerencie sua horta de forma inteligente e eficiente!</p>
  </div>
);

export default Home;
