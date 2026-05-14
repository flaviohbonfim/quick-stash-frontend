import type { AxiosError } from 'axios'

/**
 * Extrai mensagem de erro da resposta da API.
 * Tenta ler a mensagem do campo `message`, `error` ou `detail`.
 */
export function formatApiError(error: unknown): string {
  if (!error) {
    return 'Erro desconhecido'
  }

  // Axios error — extrair da response
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string; detail?: string }>

    // Tentar extrair mensagem do corpo da resposta
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error
    }
    if (axiosError.response?.data?.detail) {
      return typeof axiosError.response.data.detail === 'string'
        ? axiosError.response.data.detail
        : JSON.stringify(axiosError.response.data.detail)
    }

    // Mensagem padrão do Axios
    if (axiosError.message) {
      return axiosError.message
    }

    return `Erro ${axiosError.response?.status}: ${axiosError.response?.statusText || 'Sem detalhes'}`
  }

  // Error object nativo
  if (error instanceof Error) {
    return error.message
  }

  // String
  if (typeof error === 'string') {
    return error
  }

  return 'Erro desconhecido'
}

/**
 * Verifica se o erro é um erro de rede (sem resposta do servidor).
 */
export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const axiosError = error as AxiosError

  // Network error: sem response, code 'ERR_NETWORK' ou 'ECONNABORTED'
  if (!axiosError.response) {
    return true
  }

  return false
}

/**
 * Verifica se o erro é de autenticação (401).
 */
export function isAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const axiosError = error as AxiosError

  return axiosError.response?.status === 401
}

/**
 * Verifica se o erro é um AxiosError.
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'isAxiosError' in error &&
    (error as { isAxiosError?: boolean }).isAxiosError === true
  )
}
