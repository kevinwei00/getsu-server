const path = require('path');
const express = require('express');
const ItemsService = require('./items-service');
const itemsRouter = express.Router();
const jsonParser = express.json();

itemsRouter
  .route('/')
  .get((req, res, next) => {
    ItemsService.getAllItems(req.app.get('db'))
      .then((items) => {
        items = items.filter((item) => !item.is_deleted);
        return res.json(items);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { item_name, max_quantity, quantity, unit_type, expiration_date } = req.body;
    const newItem = { item_name, max_quantity, quantity, unit_type, expiration_date };

    for (const [key, value] of Object.entries(newItem)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ItemsService.createItem(req.app.get('db'), newItem)
      .then((item) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${item.id}`))
          .json(item);
      })
      .catch(next);
  });

itemsRouter
  .route('/:item_id')
  .all((req, res, next) => {
    ItemsService.getItem(req.app.get('db'), req.params.item_id)
      .then((item) => {
        if (!item || item.is_deleted) {
          return res.status(404).json({
            error: { message: 'Item does not exist' },
          });
        }
        res.item = item;
        next();
      })
      .catch((error) => {
        next(error);
      });
  })
  .get((req, res) => {
    return res.json(res.item);
  })
  .delete((req, res, next) => {
    ItemsService.deleteItem(req.app.get('db'), req.params.item_id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { quantity, max_quantity } = req.body;
    const itemToUpdate = { quantity, max_quantity };

    const numberOfValues = Object.values(itemToUpdate).filter((val) => !!val).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain quantity and max_quantity',
        },
      });
    }

    ItemsService.updateItem(req.app.get('db'), req.params.item_id, itemToUpdate)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = itemsRouter;
