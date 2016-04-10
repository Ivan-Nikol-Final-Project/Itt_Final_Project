<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
class Test extends Controller
{

    function test()
    {
        $params = array(
            'cancelUrl' => 'http://localhost:8000/api/v1/cancel_order',
            'returnUrl' => 'http://localhost:8000/api/v1/payment_success',
            'id' => 5,
            'name' => 6,
            'description' => 7,
            'amount' => 8,
            'currency' => 9,
            'gold' => 10
        );


        Session::put('params', $params);
        Session::save();

        $new = Session::get('params');
        var_dump($new);
    }
}

test();