/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("68ure97lf8yte9y");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "68ure97lf8yte9y",
    "created": "2024-06-11 07:03:58.720Z",
    "updated": "2024-06-11 07:03:58.720Z",
    "name": "tags_prefs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "un4yiqon",
        "name": "nom",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "varsrydd",
        "name": "associe_a",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
