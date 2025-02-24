import React from "react";

const RecoverPassword = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Recuperar Senha</h2>
        <form className="flex flex-col">
          <label className="text-gray-700 font-semibold">Email</label>
          <input 
            type="email" 
            placeholder="Digite seu email" 
            className="p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white font-semibold p-3 rounded-lg mt-6 hover:bg-green-700"
          >
            Enviar link de recuperação
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Lembrou sua senha? <a href="#" className="text-blue-500 font-semibold">Fazer login</a></p>
      </div>
    </div>
  );
};

export default RecoverPassword;
