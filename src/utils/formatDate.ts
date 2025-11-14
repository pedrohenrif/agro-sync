// ARQUIVO: src/utils/formatDate.ts
// (Você já pode ter este arquivo, se não, crie-o)

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString; // Retorna a string original se falhar
  }
};