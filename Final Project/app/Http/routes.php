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
    Route::group([
        'prefix' => 'api/v1',
        'middleware' => 'api',
        'namespace' => 'Api'
    ], function () {
        Route::post('/login', 'AuthController@login');
        Route::post('/register', 'AuthController@registration');
        Route::post('get/user', 'UserController@getUser');
        Route::post('success', 'PaymentController@updateOrder');
        Route::post('/payment' , 'PaymentController@addOrder');
        Route::put('/update/results' , 'StatisticsController@update');
        Route::get('/scores' , 'StatisticsController@index');
    });

Route::get('/', function () {
    return view('index');
});

    Route::auth();





