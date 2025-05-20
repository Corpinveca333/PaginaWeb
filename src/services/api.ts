/**
 * Clase para gestionar todas las peticiones a la API
 */
export class ApiService {
  private baseUrl: string;
  private graphqlEndpoint: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
    this.graphqlEndpoint =
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://api.example.com/graphql';
  }

  /**
   * Realiza una petición a la API REST
   */
  private async fetchRest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la petición REST:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición a la API GraphQL
   */
  private async fetchGraphQL<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en la petición GraphQL:', error);
      throw error;
    }
  }

  // Aquí se pueden agregar los métodos específicos para cada tipo de dato
  // Por ejemplo:
  // async getProducts() { ... }
  // async getServices() { ... }
  // async getProjects() { ... }
}
