# Role based Access Control #
Role based Access Control is a security framework which restricts the access of resources within the application to the users based on their roles.
Each role comes with a set of permissions. Instead of assigning permissions individually, users are assigned to predetermined roles which helps in easier management and enhances security.

It should be applied in applications involving number of stakeholders so that there are no unwanted changes or modifications and only required permissions are assigned to the users.

## Installation ##
- npm i
- This project uses **MongoDB** as the database
- You'll need to provide the following set of environment variables
  - DB_URL (Connection String of MongoDB Database)
  - SESSION_SECRET (Get a random secret generator and use the generated key)
  - ADMIN_EMAIL

This project implements a role based access control using NodeJS. It has three set of roles
- Admin
- Developer
- Inbox

The admin can manage all the other users, update their roles or even remove them
Developer and inbox have the same privileges at this point of time.

It also has an invitation feature, and it maintains a document with a list of invitations along with its status. 
Since I did not have access to any mail client I have taped it together to work by redirecting it to the `/accept-invitation` URL just after inviting the user.

### Routes ###
`/auth`

- `/register`: This url features the registration form, it accepts email and password. 
While saving the password in database it goes through a *pre-save* hook which converts the plain text to a hash value.

- `/login`: Features a login form which uses `passport`, which is a node JS middleware to authenticate the users.

- `/send-invite`: This route provides an interface to invite the users with a pre-selected role.

- `/accept-invite`: This is the route which provides the interface for registering in the application. The `email` field comes pre-filled as the invitation was sent to this email only.

`/admin`: A middleware is applied to this route as well as all sub-routes which ensures no unwanted access. 
- `/users`: Interface for listing all the users and managing them
- `/user/:id`: Interface for a specific user id.
- `/update-role`: Helps in managing the users and updating their roles

### Further Improvements ###
I would be working on several things to make it a production ready application. Following is the list
- Integrating an email client for inviting users
- UI Improvements

I am open to contributions from fellow developers, have already opened up issues, feel free to take them up and tag me in case you need any clarification