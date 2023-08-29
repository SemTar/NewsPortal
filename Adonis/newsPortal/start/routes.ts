/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for a majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

//User
Route.group(() => {
  Route.post('/create', 'AuthController.createUser')
  Route.post('/login', 'AuthController.loginUser')
  Route.post('/passwordRecovery', 'AuthController.sendToken')
  Route.get('/accessCheck/:refreshPasswordToken', 'AuthController.accessCheck')
  Route.put('/newPassword', 'AuthController.newPassword')

  Route.get('/test', 'AuthController.testNuts')

  Route.group(() => {
    Route.get('/list', 'CategoriesController.list')
  }).prefix('/categories')

  Route.group(() => {
    Route.get('/list/:numOfPage', 'NewsController.list')
    Route.get('/item/:id', 'NewsController.item')
  }).prefix('/news')

  Route.get('/comment/', 'CommentsController.getComments')

  //with auth
  Route.group(() => {
    Route.group(() => {
      Route.get('/header', 'ProfilesController.header')
      Route.get('/', 'ProfilesController.getProfileInfo')
      Route.put('/', 'ProfilesController.putProfileInfo')
      Route.put('/password', 'ProfilesController.putPassword')
    }).prefix('/profile')

    Route.post('/comment/', 'CommentsController.postComment')
  }).middleware('myAuth')
})
  .prefix('/user')
  .namespace('App/Controllers/User')

// Admin
Route.group(() => {
  Route.group(() => {
    Route.get('/list/:numOfPage', 'NewsController.list')
    Route.post('/item', 'NewsController.itemSend')
    Route.get('/item/:id', 'NewsController.getNews')
    Route.put('/item/', 'NewsController.putNews')
    Route.delete('/item/:id', 'NewsController.deleteNews')
  }).prefix('/news')

  Route.group(() => {
    Route.get('/list/:numOfPage', 'UsersController.list')
    Route.post('/item', 'UsersController.itemSend')
    Route.get('/item/:id', 'UsersController.getUser')
    Route.put('/item/', 'UsersController.putUser')
    Route.delete('/item/:id', 'UsersController.deleteUser')
    Route.put('/item/passwordRefresh', 'UsersController.putUserPassword')
  }).prefix('/users')

  Route.group(() => {
    Route.get('/list/:numOfPage', 'CommentsController.list')
    Route.get('/item/:id', 'CommentsController.getComment')
    Route.put('/item/', 'CommentsController.putComment')
    Route.delete('/item/:id', 'CommentsController.deleteComment')
  }).prefix('/comments')

  Route.group(() => {
    Route.get('/list/:numOfPage', 'CategoriesController.list')
    Route.post('/item', 'CategoriesController.postCategory')
    Route.delete('/item/:id', 'CategoriesController.deleteCategory')
  }).prefix('/categories')
})
  .prefix('/admin')
  .namespace('App/Controllers/Admin')
  .middleware('myAuth')
  .middleware('adminCheck')
