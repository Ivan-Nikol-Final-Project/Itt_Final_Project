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
    Route::get('/users/{user_id}' , 'UserController@show');
    Route::get('/scores' , 'StatisticsController@index');
    Route::post('/updateResults' , 'StatisticsController@update');
    Route::post('/payment' , 'PaymentController@postPayment');
    Route::get('/payment_success', 'PaymentController@getSuccessPayment');
    Route::get('/cancel_order', function(){
        return redirect('index');
    });

});

    Route::group([
        'prefix' => 'api/v1',
        'middleware' => 'api',
        'namespace' => 'Api'
    ], function () {
        Route::post('/login', 'AuthController@login');
        Route::post('/register', 'AuthController@registration');
       // Route::post('/game', 'AuthController@getUser');
    });

    Route::get('/', function () {
        return view('index');
    });

    Route::auth();





