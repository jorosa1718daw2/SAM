
//obtenemos el modelo UserModel con toda la funcionalidad
var UserModel = require('../models/users');

//creamos el ruteo de la aplicación
module.exports = function(app)
{
	//formulario que muestra los datos de un usuario para editar
	app.get("/update/:id", function(req, res){
		var id = parseInt(req.params.id);
		//solo actualizamos si la id es un número
		if(!isNaN(id))
		{
			UserModel.getUser(id,function(error, data)
			{
				//si existe el usuario mostramos el formulario
				if (typeof data !== 'undefined' && data.length > 0)
				{
					res.render("index",{ 
						title : "Formulario Update", 
						info : data
					});
				}
				//en otro caso mostramos un error
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
		}
		//si la id no es numerica mostramos un error de servidor
		else
		{
			res.json(500,{"msg":"The id must be numeric"});
		}
	});

	//formulario para crear un nuevo usuario
	app.get("/create", function(req, res){
		res.render("new",{ 
			title : "Formulario para crear un nuevo recurso"
		});
	});

	//formulario para eliminar un usuario
	app.get("/delete", function(req, res){
		console.log('IN USER DELETE');
		res.render("delete",{ 
			title : "Formulario para eliminar un recurso"
		});
	});

	//mostramos todos los usuarios 
	app.get("/users", function(req,res){
		console.log('SHOW USERS');
		UserModel.getUsers(function(error, data)
		{
			res.json(200,data);
		});
	});

	//obtiene un usuario por su id
	app.get("/users/:id", function(req,res)
	{
		console.log('SHOW USER BY ID');
		
		//id del usuario
		var id = parseInt(req.params.id);
		//solo actualizamos si la id es un número
		if(!isNaN(id))
		{
			UserModel.getUser(id,function(error, data)
			{
				//si el usuario existe lo mostramos en formato json
				if (typeof data !== 'undefined' && data.length > 0)
				{
					res.json(200,data);
				}
				//en otro caso mostramos una respuesta conforme no existe
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
		}
		//si hay algún error
		else
		{
			res.json(500,{"msg":"Error"});
		}
	});

	//obtiene un usuario por su id
	app.post("/users", function(req,res)
	{
		console.log('INSERT USER');
		//creamos un objeto con los datos a insertar del usuario
		var userData = {
			id : null,
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
			
		};
		UserModel.insertUser(userData,function(error, data)
		{
			//si el usuario se ha insertado correctamente mostramos su info
			if(data && data.insertId)
			{
				res.redirect("/users/" + data.insertId);
				console.log('User Created');
			}
			else
			{
				res.json(500,{"msg":"Error"});
				console.log('User NO Created');
			}
		});
	});

	//función que usa el verbo http put para actualizar usuarios ///
	app.put("/users", function(req,res)
	{
		//almacenamos los datos del formulario en un objeto
		console.log('TO UPDATE USER');
		var userData = {username:req.param('username'),email:req.param('email'),id:req.param('id')};
		try  {
		UserModel.updateUser(userData,function(error, data)
		{
			console.log('TO UPDATE USER');
			//si el usuario se ha actualizado correctamente mostramos un mensaje
			if(data && data.msg)
			{
				res.json(200,data);
				console.log('User Updated');
			}
			else
			{
				res.json(500,{"msg":"Error"});
				console.log('User Not Updated');
			}
		});
	}catch(a){
		res.json(500,{"msg":"Error, Catch"});	
	}
	});

	//utilizamos el verbo delete para eliminar un usuario
	app.delete("/users/:id", function(req,res)
	{
	  //id del usuario a eliminar
	  var id = parseInt(req.params.id);
	  if (isNaN(id)) {
		res.status(400).json('error: invalid id');
		return;
	  }
	try {	
	  UserModel.deleteUser(id,function(error, data)
		{
			if(data && data.msg === "deleted" || data.msg === "notExist")
			{
				res.json(200,data);
				console.log('USER DELETED');
			}
			else
			{
				res.json(500,{"msg":"Error"});
				console.log('USER NO DELETED');
			}
		});
	} catch (a) {
		res.json(500,{"msg":"Error, Catch"});	
	} 
});
}