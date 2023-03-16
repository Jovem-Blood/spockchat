migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pw0lm1v9lgugn2h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "riy3w65p",
    "name": "archive",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/gif",
        "image/webp"
      ],
      "thumbs": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pw0lm1v9lgugn2h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "riy3w65p",
    "name": "achive",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/gif",
        "image/webp"
      ],
      "thumbs": []
    }
  }))

  return dao.saveCollection(collection)
})
