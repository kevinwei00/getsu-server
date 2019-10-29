const path = require('path');
const express = require('express');
const ItemsService = require('./items-service');
const { requireAuth } = require('../auth/jwt-auth');
const itemsRouter = express.Router();
const jsonParser = express.json();

itemsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ItemsService.getAllItems(req.app.get('db'), req.user.id)
      .then((items) => {
        items = items.filter((item) => !item.is_deleted);
        return res.json(items);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { item_name, max_quantity, quantity, unit_type, expiration_date } = req.body;
    const newItem = { item_name, max_quantity, quantity, unit_type };

    for (const [key, value] of Object.entries(newItem)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (expiration_date) {
      newItem.expiration_date = expiration_date;
    }
    ItemsService.createItem(req.app.get('db'), newItem, req.user.id)
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
  .all(requireAuth)
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
    const { item_name, quantity, max_quantity, expiration_date } = req.body;
    const itemToUpdate = { item_name, quantity, max_quantity, expiration_date };

    const numberOfValues = Object.values(itemToUpdate).filter((val) => !!val).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain all update fields',
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
