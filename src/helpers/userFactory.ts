export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

export function uniqueEmail(workerIndex = 0): string {
  return `ae_${Date.now()}_${workerIndex}_${Math.floor(Math.random() * 1e6)}@example.com`;
}

export function buildNewUserPayload(workerIndex = 0): CreateUserPayload {
  const email = uniqueEmail(workerIndex);
  return {
    name: 'Automation User',
    email,
    password: 'password123',
    title: 'Mr',
    birth_date: '1',
    birth_month: 'January',
    birth_year: '1990',
    firstname: 'Auto',
    lastname: 'Mation',
    company: 'TestCo',
    address1: '1 Test Street',
    address2: '',
    country: 'United States',
    zipcode: '90210',
    state: 'California',
    city: 'Los Angeles',
    mobile_number: '5551234567',
  };
}

export function payloadToFormRecord(
  payload: CreateUserPayload,
): Record<string, string> {
  return { ...payload };
}
