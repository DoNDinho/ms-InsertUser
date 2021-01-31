'use strict';
const logger = require('../config/log4js_config');
const User = require('../services/user_service');

exports.user = async (req, res) => {
    try {
        let transactionId = req.headers.transaction_id;
        logger.addContext('transaction_id', transactionId);

        let user = new User();

        try {
            await user.validarRequestUser(req, res);
            user.insertarUsuarioDB(req, res);
        } catch (err) {
            // Devuelve objeto error
            return err;
        }
    } catch (err) {
        logger.error('Ha ocurrido un error en metodo User Controller: ', err);
        return res.status(500).json({
            code: '500',
            message: 'Internal Server Error'
        });
    }
};
