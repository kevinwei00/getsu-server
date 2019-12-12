# Getsu (Server)

This is the backend code for Getsu, a household inventory tracker by **Kevin Wei**.

- [Link to Live App](https://getsu-client.kevinwei.now.sh/)
- [Link to Client Repo](https://github.com/kevinwei00/getsu-client)

## API Endpoints

### ▸ `GET /api/items`

Returns an array of items that the logged in user has submitted to the database.

**Example response**

```JSON
[
  {
    "item_id": "f65e6867-e724-4ca0-b024-1b005e0423ba",
    "item_name": "Purple Yams",
    "max_quantity": 3,
    "quantity": 1.5,
    "unit_type": "units",
    "expiration_date": "2019-12-12T05:00:00.000Z",
    "is_deleted": false
  }
]
```

- **`item_id`**`- string` - uuid of an item
- **`item_name`**`- string` - name of an item
- **`max_quantity`**`- float` - maximum quantity of an item (i.e. the quantity that the item starts with when it was first entered)
- **`quantity`**`- float` - current quantity of an item
- **`unit_type`**`- string` - string representation of an item's unit of measurement (i.e. _3 lbs_, _3 pieces_, _3 units_)
- **`expiration_date`**`- string` - timestamp in ISO format denoting when an item expires
- **`is_deleted`**`- boolean` - internally used to soft delete an item while keeping its entry in the database

### ▸ `POST /api/items`

To submit an item to the database, 4 fields are required in the body of the POST request, otherwise the server responds with a `400`. The 5th field _expiration_date_ is optional and defaults to _null_ (i.e. the item has no expiration date because it is a non-perishable). Note that there is no user field that denotes which user the item belongs to. This is because internally, the database creates a relationship between the item and the logged in user via an intermediate table.

**Example request**

```JSON
{
  "item_name": "Onions",
  "max_quantity": 10,
  "quantity": 10,
  "unit_type": "oz",
  "expiration_date": "2019-12-12T05:00:00.000Z"
}
```

### ▸ `GET /api/items/:item_id`

Returns a single item belonging to the logged in user, specified by _item_id_.

**Example response**

```JSON
{
  "item_id": "f65e6867-e724-4ca0-b024-1b005e0423ba",
  "item_name": "Purple Yams",
  "max_quantity": 3,
  "quantity": 1.5,
  "unit_type": "units",
  "expiration_date": "2019-12-12T05:00:00.000Z",
  "is_deleted": false
}
```

### ▸ `DELETE /api/items/:item_id`

Deletes a single item belonging to the logged in user, specified by _item_id_. Note that the item is not actually removed from the database; instead, the _is_deleted_ flag is set to true which means it won't be returned with a `GET /api/items` request, and returns a `404` on a `GET /api/items/:item_id` request.

### ▸ `PATCH /api/items/:item_id`

To update an item in the database, 4 fields are required in the body of the PATCH request, otherwise the server responds with a `400`. A successful PATCH updates the item with the supplied fields.

**Example request**

```JSON
{
  "item_name": "Vitamins",
  "max_quantity": 5,
  "quantity": 5,
  "expiration_date": "2019-12-12T05:00:00.000Z"
}
```

## Technology Stack

_React, Node, Express, PostgreSQL, Mocha/Chai, Jest/Enzyme, HTML5, CSS3_
