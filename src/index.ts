import { createCustomer, User } from "./service";

const newUsers: User[] = [
    {
        id: 1,
        firstName: "Sam",
        lastName: "Wilson",
        email: "falcon@avengers.com",
    },
    {
        id: 2,
        firstName: "Wanda",
        lastName: "Maximoff",
        email: "scarlett.witch@avengers.com",
    },
    {
        id: 3,
        firstName: "Erik",
        lastName: "Stevens",
        email: "killmonger@villians.net",
    },
];

newUsers.forEach(async (user) => {
    // Create the customer record
    const customerId = await createCustomer(user);
    console.log(`Created customer (id: ${customerId}) for user ${user.firstName} ${user.lastName}`);
});

console.log("User registration complete");
