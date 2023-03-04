migrate((db) => {
  const collection = new Collection({
    "id": "pw0lm1v9lgugn2h",
    "created": "2023-02-15 15:41:47.377Z",
    "updated": "2023-02-15 15:41:47.377Z",
    "name": "messages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xersj5rq",
        "name": "content",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 255,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fv4rvu1z",
        "name": "user_id",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "user_id = @request.auth.id",
    "updateRule": "user_id = @request.auth.id",
    "deleteRule": "user_id = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pw0lm1v9lgugn2h");

  return dao.deleteCollection(collection);
})
