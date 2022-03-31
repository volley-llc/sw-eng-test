/**
 * Data model for Volley users.
 */
export interface User {
    id: number;
    customerId?: number;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Create the customer record in the CRM for a user.
 * @param newUser The user data model for the customer.
 * @returns The ID of the customer record in the CRM.
 */
export async function createCustomer(newUser: User): Promise<number> {
    return 0;
}
