const express = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = express.response) => {

  const eventos = await Evento.find().populate('user', 'name');

  return res.json({
    ok: true,
    msg: eventos
  })

}

const crearEvento = async (req, res = express.response) => {

  const evento = new Evento(req.body);

  try {

    // Obtener el token del usuario
    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    return res.json({
      ok: true,
      evento: eventoGuardado
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Pongase en contacto con el administrador"
    })
  }

}

const actualizarEvento = async (req, res = express.response) => {

  const eventoId = req.params.id;
  const uid = req.uid;

  try {

    const evento = await Evento.findById( eventoId );

    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento que desea editar no existe'
      })
    }

    if ( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene el privilegio para editar este evento'
      })
    }

    // Permitimos actualizar
    const nuevoEvento = {
      ...req.body,
      user: uid
    }

    const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Pongase en contacto con el administrador'
    })
  }

}

const eliminarEvento = async (req, res = express.response) => {

  const eventoId = req.params.id;
  const uid = req.uid;

  try {

    const evento = await Evento.findById( eventoId );

    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento que desea eliminar no existe'
      })
    }

    if ( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene el privilegio para eliminar este evento'
      })
    }

    await Evento.findByIdAndDelete( eventoId );

    return res.status(200).json({
      ok: true,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Pongase en contacto con el administrador'
    })
  }

}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}