import { ENV_CONFIG } from './env.config';

export const API_CONFIG = {
  baseURL: ENV_CONFIG.API_BASE_URL,
  endpoints: {
    // Authentication
    auth: {
      signin: '/auth/signin',
      signinWeb: '/auth/signin_web',
      signup: '/auth/signin-up-all',
      refresh: '/auth/refreshtoken',
      checkUsername: (username: string) => `/check_username_up/${username}`,
      checkEmail: (email: string) => `/check_email_up/${email}`,
      checkTelephone: (telephone: string) => `/check_telephone_up/${telephone}`,
      checkNumeroEnr: (numeroEnr: string) => `/check_num_enr_up/${numeroEnr}`,
    },
    // Categories
    categories: {
      getAll: '/categorie',
      getById: (id: number) => `/categorie/${id}`,
      search: (query: string) => `/categorie/search/${query}`,
    },
    // Subcategories
    subcategories: {
      getAll: '/sous_categorie',
      getByCategory: (categoryId: number) => `/sous_categorie/categorie/${categoryId}`,
    },
    // Artisans
    artisans: {
      getAll: '/artisans',
      getById: (id: number) => `/artisans/${id}`,
      search: (query: string) => `/artisans/search/${query}`,
      getByCategory: (categoryId: number) => `/artisans/categorie/${categoryId}`,
      getBySubcategory: (subcategoryId: number) => `/artisans/sous_categorie/${subcategoryId}`,
      getPages: (page: number) => `/artisans_pages/${page}`,
      searchPages: (page: number, query: string) => `/artisans/search/page/${page}/${query}`,
      getPremium: '/auth/artisans_last_premium',
    },
    // Students (for future use)
    students: {
      getAll: '/etudiants',
      getById: (id: number) => `/etudiants/${id}`,
      getByUser: (userId: number) => `/etudiants/user/${userId}`,
      getByToken: '/artisan_token',
      search: (query: string) => `/etudiants/search/page/1/${query}`,
    },
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const getAuthHeaders = (token?: string) => ({
  ...API_CONFIG.headers,
  ...(token && { Authorization: `Bearer ${token}` }),
});
