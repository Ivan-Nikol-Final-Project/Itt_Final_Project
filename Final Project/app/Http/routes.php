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

Route::group([
    'prefix' => 'api/v1',
    'middleware' => 'api'
], function () {
    Route::get('/users', 'UserController@index');

    Route::post('success', 'PaymentController@updateOrder');
    Route::get('/scores' , 'StatisticsController@index');
    Route::post('/payment' , 'PaymentController@addOrder');




});

    Route::group([
        'prefix' => 'api/v1',
        'middleware' => 'api',
        'namespace' => 'Api'
    ], function () {
        Route::post('/login', 'AuthController@login');
        Route::post('/register', 'AuthController@registration');
        Route::put('/update/results' , 'UpdateStatisticsController@update');
        Route::post('get/user', 'UserController@getUser');

       
    });

Route::get('/', function () {
    return view('index');
});

    Route::auth();





