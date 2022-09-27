# OH MY GOODS!

## Description

This is the backend repository for the React application `Oh My Goods`. The ultimate application to store all your devices or valuable goods (or anything with a S/N!). You can search if any other device is stored by other user on our database and you can mark any good if it's lost or stolen, aswell as trade your items and export them as a PDF.

---

## Models

### User

Users in the database have the following properties:

```js
(userSchema = {
  email: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  idNumber: {
    type: String,
    unique: true,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
}),
  {
    timestamps: true,
  };
```

### Item

Items in the database have the following properties:

```js
(itemSchema = {
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  newItem: {
    type: String,
    default: "Yes",
  },
  type: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  transactionToken: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  previousOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}),
  {
    timestamps: true,
  };
```

### Alert

Alerts in the database have the following properties:

```js
(alertSchema = {
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}),
  {
    timestamps: true,
  };
```

### Transaction

Alerts in the database have the following properties:

```js
(transactionSchema = {
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}),
  {
    timestamps: true,
  };
```

---

## API endpoints and usage

| Action                         | Method | Endpoint              | Req.body                                                     | Private/Public |
| ------------------------------ | ------ | --------------------- | ------------------------------------------------------------ | -------------- |
| SIGN UP user                   | POST   | /api/v1/auth/signup   | { username, email, password, fullName, idNumber, telephone } | Public         |
| LOG IN user                    | POST   | /api/v1/auth/login    | { email, password }                                          | Public         |
| GET logged in user             | GET    | /api/v1/auth/me       |                                                              | Private        |
| PUT edits user                 | PUT    | /api/v1/auth/user     | {username, password, id}                                     | Private        |
| GET logged in user             | GET    | /api/v1/auth/getuser  |                                                              | Private        |
| GET items from user            | GET    | /api/v1/items         |                                                              | Private        |
| Search for items               | POST   | /api/v1/items/search  | { serialNumber }                                             | Private        |
| GET one item                   | GET    | /api/v1/items/:id     |                                                              | Private        |
| Creates an item                | POST   | /api/v1/items         | { name, brand, type, serialNumber, imagesUrl }               | Private        |
| Uploads picture for cloudinary | POST   | /api/v1/items/upload  | { imagesUrl }                                                | Private        |
| Edits an item                  | POST   | /api/v1/items/:id     | { name, brand, type, serialNumber, imagesUrl }               | Private        |
| Deletes an item                | DELETE | /api/v1/items/:id     |                                                              | Private        |
| Searches for stolen alert      | GET    | /api/v1/alerts/:id    |                                                              | Private        |
| Creates for stolen alert       | POST   | /api/v1/alerts/:id    |                                                              | Private        |
| Deletes an stolen alert        | DELETE | /api/v1/alerts/:id    |                                                              | Private        |
| Shows all transactions         | GET    | /api/v1/transactions  |                                                              | Private        |
| Creates transfer process       | POST   | /api/v1/transfer/:id  |                                                              | Private        |
| Accepts transfer process       | POST   | /api/v1/receive       |                                                              | Private        |
| Deletes transfer token         | DELETE | /api/v1/deletoken/:id |                                                              | Private        |

---

## Useful links

- [Frontend repository](https://github.com/cristianalarcon23/OMG-FE)
- [Frontend deploy](https://www.ohmygoods.es)
