<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

//Blade::setContentTags('<%', '%>');        // for variables and all things Blade
//Blade::setEscapedContentTags('<%%', '%%>');



Route::group(['prefix' => 'api/v1'], function(){
    Route::resource('items', 'ItemsController');
    Route::resource('users', 'UserController');


});

Route::group([
    'prefix' => 'api/v1',
    'middleware' => 'api'
], function () {
    Route::get('/users', 'UserController@index');
    Route::get('/users/{user_id}' , 'UserController@show');
    Route::get('/items', 'ItemsController@index');
    Route::get('/items/{item_id}' , 'ItemsController@show');
    Route::get('buyItem/{item_id}', 'UserController@buyItem');
    Route::get('scores' , 'StatisticsController@index');
    Route::get('/users/{user_id}/items' , 'UserController@showUserItems');
});



Route::group([
    'prefix' => 'api/v1',
    'middleware' => 'api',
    'namespace' => 'Api'
], function () {
    Route::post('/login', 'AuthController@login');
    Route::post('/register', 'AuthController@registration');


    Route::group(['middleware' => 'api.auth'], function () {
        Route::get('/token_test', function (){
            return Auth::user();
        });
    });
} );

Route::get('/', function () {
    return view('index');
});

Route::auth();





