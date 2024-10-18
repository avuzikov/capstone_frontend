class ApiProvider {
    private static apiUrl = '/users'; // Define the base URL for the API
  
    // Método para manejar el login
    static async login(email: string, password: string): Promise<{ token: string }> {
      try {
        const response = await fetch(`${this.apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
  
        const authToken = response.headers.get('Authorization');
        if (!authToken) {
          throw new Error('Token not found');
        }
  
        // Guardar el token en una cookie o en localStorage
        //document.cookie = `authToken=${authToken}; path=/`;
        return { token: authToken };
      } catch (error: any) {
        console.error('Login error:', error.message);
        throw error;
      }
    }
  
    // Método para manejar el logout
    static logout(): void {
      // Limpiar la cookie o localStorage
      document.cookie = 'authToken=; Max-Age=0; path=/'; // Eliminar el token
      console.log('Logged out');
    }
  
    // Puedes agregar más métodos para otras operaciones con la API
    static async getUserData(): Promise<any> {
      try {
        const response = await fetch(`${this.apiUrl}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`, // Usa el token para acceder a recursos protegidos
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }
  
        return data;
      } catch (error: any) {
        console.error('Fetch error:', error.message);
        throw error;
      }
    }
  
    // Método helper para obtener el token de las cookies
    private static getAuthToken(): string | null {
      const name = 'authToken=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    }
  }
  
  export default ApiProvider;