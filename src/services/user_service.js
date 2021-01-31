'use strict';
const logger = require('../config/log4js_config');
const headerSchema = require('../schemas/header_schema');
const userSchema = require('../schemas/user_schema');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

class User {
    /**
     * @method
     * @description Valida el request de la solicitud
     * @param {object} req Objeto que contiene request de la solicitud
     */
    validarRequestUser(req, res) {
        const Ajv = require('ajv');
        const ajv = new Ajv();
        let headers = req.headers;
        let body = req.body;
        let valid;

        return new Promise((resolve, reject) => {
            logger.info('Validando request de la solicitud');
            // Validando headers de la solicitud
            valid = ajv.validate(headerSchema, headers);
            if (!valid) {
                logger.error('Solicitud invalida - Headers invalidos!');
                return res.status(400).json({
                    code: '400',
                    message: `${ajv.errors[0].message}`
                });
            } else {
                // Validando body de la solicitud
                valid = ajv.validate(userSchema, body);
                if (!valid) {
                    logger.error('Solicitud invalida - Body invalido!');
                    reject(
                        res.status(400).json({
                            code: '400',
                            message: `${ajv.errors[0].dataPath} - ${ajv.errors[0].message}`
                        })
                    );
                } else {
                    logger.info('Solicitud valida!');
                    resolve(req);
                }
            }
        });
    }

    /**
     * @method
     * @description Inserta usuario en BD
     * @param {object} req Objeto que contiene request de la solicitud
     * @returns {object} Retorna un error o un objeto con el request
     */
    insertarUsuarioDB(req, res) {
        let data = req.body.data;

        let usuario = new Usuario({
            email: data.client_credentials.email,
            password: bcrypt.hashSync(data.client_credentials.password, 10),
            phone: data.client_data.phone,
            nickname: data.client_data.nickname,
            age: data.client_data.age
        });

        logger.info('Insertando usuario en DB');
        usuario.save((err, usuarioDB) => {
            if (err) {
                logger.error('Error al insertar usuario en DB: ', err);
                return res.status(422).json({
                    code: err.code,
                    message: err.errmsg
                });
            } else {
                logger.info('Usuario insertado en DB');
                res.json({
                    data: {
                        user: usuarioDB
                    }
                });
            }
        });
    }
}

module.exports = User;
