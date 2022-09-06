# OH MY GOODS!

## Description

This is the backend repository for the React application `Oh My Goods`. The ultimate application to store all your devices or valuable goods (or anything with a S/N!). You can search if any other device is stored by other user on our database and you can mark any good if it's lost or stolen.

---

## Instructions

## Models

### User

Users in the database have the following properties:

```js
{
  "fullName": String,
  "username": String,
  "email": String,
  "hashedPassword": String,
  "idNumber": String
}
```

### Item

Items in the database have the following properties:

```js
{
  "name": String,
  "brand": String,
  "isNew": Boolean,
  "type": String,
  "serialNumber": String,
  "warrantyPicture": String,
  "snPicture": String,
  "itemPicture": String,
  "owner": id
}
```

### Alert

Alerts in the database have the following properties:

```js
{
  "itemId": String,
  "userId": String
}
```

---

## API endpoints and usage

| Action             | Method | Endpoint            | Req.body                                                          | Private/Public |
| ------------------ | ------ | ------------------- | ----------------------------------------------------------------- | -------------- |
| SIGN UP user       | POST   | /api/v1/auth/signup | { username, email, password, fullName, idNumber, profilePicture } | Public         |
| LOG IN user        | POST   | /api/v1/auth/login  | { email, password }                                               | Public         |
| GET logged in user | GET    | /api/v1/auth/me     |                                                                   | Private        |
| PUT edits user     | PUT    | /api/v1/auth/user   | {username, password, id}                                          | Private        |

---

## Useful links

- [Presentation slides]()
- [Frontend repository]()
- [Frontend deploy]()
- [Deployed REST API]()
