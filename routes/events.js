/*
  Rutas de Usuarios / Events
  host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
const { 
  getEventos, 
  crearEvento, 
  actualizarEvento, 
  eliminarEvento 
} = require('../controllers/events');

const router = Router();

// Middleware para validar token
router.use( validarJWT );


router.get('/', getEventos);

router.post(
  '/', 
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
    validarCampos
  ],
  crearEvento
);

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router