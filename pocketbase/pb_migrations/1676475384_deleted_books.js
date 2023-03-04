migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pmryj0mboziaa3g");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "pmryj0mboziaa3g",
    "created": "2023-02-09 17:25:12.543Z",
    "updated": "2023-02-09 17:25:12.543Z",
    "name": "books",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5zynys0b",
        "name": "title",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ifbqidig",
        "name": "description",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
})
