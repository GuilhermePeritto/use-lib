const Fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Recupera o token do localStorage (cliente-side)
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    // Configura os headers
    const headers = new Headers(init?.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Faz a requisição com os headers modificados
    const response = await fetch(input, {
        ...init,
        headers,
    });

    return response;
};

export default Fetch;