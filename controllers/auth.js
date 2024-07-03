const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = express.response) => {

  const { email, password } = req.body;

  try {

    let usuario = await Usuario.findOne({ email });
    
    if ( usuario ) {
      res.status(400).json({
        ok: false,
        msg: 'Ya existe un registro con este correo',
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    await usuario.save();

    // Generar token
    const token = await generarJWT( usuario.id, usuario.name );

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Comuniquese con el administrador del sistema',
    })
  }

}

const loginUsuario = async (req, res = express.response) => {

  const { email, password } = req.body;

  try {

    const usuario = await Usuario.findOne({ email });

    if ( !usuario ) {
      res.status(400).json({
        ok: false,
        msg: 'No existe un registro con este correo',
      });
    }

    // Confirmar contraseña
    const validPassword = bcrypt.compareSync( password, usuario.password );

    if ( !validPassword ) {
      res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta',
      });
    }

    // Generar token
    const token = await generarJWT( usuario.id, usuario.name );

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Comuniquese con el administrador del sistema',
    })
  }

}

const revalidarToken = async (req, res = express.response) => {

  const { uid, name } = req;

  // generar un nuevo JWT y retornarlo en esta peticion
  const token = await generarJWT( uid, name );

  res.json({
    ok: true,
    uid,
    name,
    token
  })

}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}