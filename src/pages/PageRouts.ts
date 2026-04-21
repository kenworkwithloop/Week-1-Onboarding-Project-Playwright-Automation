export type AppPageRoute = {
    path: string;
    title: string;
    link: string;
  };
  
  export const APP_PAGES = {
    home: { 
        path: '/', 
        title: 'Automation Exercise',
        link: 'Home'
    },
    products: {
      path: '/products',
      title: 'Automation Exercise - All Products',
      link: 'Products'
    },
    signupLogin: {
      path: '/login',
      title: 'Automation Exercise - Signup / Login',
      link: 'Signup / Login'
    },
    contactUs: {
      path: '/contact_us',
      title: 'Automation Exercise - Contact Us',
      link: 'Contact Us'
    },
    viewCart: {
      path: '/view_cart',
      title: 'Automation Exercise - Checkout',
      link: 'Cart',
    },
    testCases: {
      path: '/test_cases',
      title: 'Automation Practice Website for UI Testing - Test Cases',
      link: 'Test Cases'
    },
    apiList: {
      path: '/api_list',
      title: 'Automation Practice for API Testing',
      link: 'API Testing'
    },
  } as const satisfies Record<string, AppPageRoute>;
  
  export type AppPageKey = keyof typeof APP_PAGES;