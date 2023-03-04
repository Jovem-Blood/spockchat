migrate((db) => {
  const collection = new Collection({
    "id": "ks0ppht3bqrhlqn",
    "created": "2023-02-09 17:26:43.173Z",
    "updated": "2023-02-09 17:26:43.173Z",
    "name": "chapters",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "b35vvken",
        "name": "number",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "ilvdp0mj",
        "name": "book_id",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "pmryj0mboziaa3g",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": [
            "id"
          ]
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ks0ppht3bqrhlqn");

  return dao.deleteCollection(collection);
})
