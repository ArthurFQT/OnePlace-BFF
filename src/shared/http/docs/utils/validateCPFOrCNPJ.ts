export function validateCPFOrCNPJ(value: string): boolean {
  if (!value) return false;

  // Remove tudo que não for número
  const cleaned = value.replace(/\D/g, '');

  // ===== VALIDAÇÃO CPF =====
  const validarCPF = (cpf: string): boolean => {
    if (cpf.length !== 11) return false;

    // Checa se todos os números são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    if (resto < 2) resto = 0;
    else resto = 11 - resto;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    if (resto < 2) resto = 0;
    else resto = 11 - resto;

    return resto === parseInt(cpf.charAt(10));
  };

  // ===== VALIDAÇÃO CNPJ =====
  const validarCNPJ = (cnpj: string): boolean => {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const calcDigito = (nums: string, pesos: number[]) => {
      let soma = 0;
      for (let i = 0; i < pesos.length; i++) {
        soma += parseInt(nums.charAt(i)) * pesos[i];
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const dig1 = calcDigito(cnpj, pesos1);
    const dig2 = calcDigito(cnpj, pesos2);

    return dig1 === parseInt(cnpj.charAt(12)) && dig2 === parseInt(cnpj.charAt(13));
  };

  if (cleaned.length === 11) return validarCPF(cleaned);
  if (cleaned.length === 14) return validarCNPJ(cleaned);

  return false;
}
