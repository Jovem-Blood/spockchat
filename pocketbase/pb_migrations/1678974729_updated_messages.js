migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pw0lm1v9lgugn2h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xersj5rq",
    "name": "content",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 255,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pw0lm1v9lgugn2h")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
