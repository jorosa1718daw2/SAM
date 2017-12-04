//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql'),
    //creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
    connection = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'database_ej'
        }
    );


//creamos un objeto para ir almacenando todo lo que necesitemos
var userModel = {};

//obtenemos todos los usuarios
userModel.getUsers = function (callback) {
    if (connection) {
        connection.query('SELECT * FROM users ORDER BY id', function (error, rows) {
            if (error) {
                throw error;
            }
            else {
                console.log(JSON.stringify(rows));
                callback(null, rows);
            }
        });
    }
}

//obtenemos un usuario por su id
userModel.getUser = function (id, callback) {
    if (connection) {
        var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
        connection.query(sql, function (error, row) {
            if (error) {
                throw error;
            }
            else {
                callback(null, row);
            }
        });
    }
}

//añadir un nuevo usuario
userModel.insertUser = function (userData, callback) {
    if (connection) {
        console.log('CREAR USUARIO');
        connection.query('INSERT INTO users (username,email,password) values (?,?,?)',
            [userData.username, userData.email, userData.password],

            function (error, result) {

                if (error) {
                    throw error;
                }
                else {
                    //devolvemos la última id insertada
                    
                    callback(null, { "insertId": result.insertId });
                }
            });
    }
}

//actualizar un usuario FIX
userModel.updateUser = function (userData, callback) {
    if (connection) {
        console.log('Actualizar usuario');
        connection.query('UPDATE users SET username= ?, email= ? where id = ?',
            [userData.username, userData.email, userData.id],
           /* function (error, result) {
                if (error) {
                    throw error;
                }
                else {
                    callback(null, { "Updated": result.Updated });    
                }
            });*/
            connection.query(sql, function(error, result)
            {
                if(error)
            {
                throw error;
                console.log('error al actualizar usuario');
            }
            else {
                callback(null,{"msg":"success"});
                console.log('usuario actualizado');
            }
            }));
        }
}

//eliminar un usuario pasando la id a eliminar ///////////////////////
userModel.deleteUser = function (id, callback) {
    throw error;
    if (connection) {
        var sqlExists = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
        connection.query(sqlExists, function (err, row) {
            //si existe la id del usuario a eliminar
            if (row) {
                var sql = 'DELETE FROM users WHERE id = ' + connection.escape(id);
                connection.query(sql, function (error, result) {
                    if (err) {
                        throw error;
                    }
                    else {
                        callback(null, { "msg": "deleted" });
                    }
                });
            }
            else {
                callback(null, { "msg": "notExist" });
            }
        });
    }
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = userModel;