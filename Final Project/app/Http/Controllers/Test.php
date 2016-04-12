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
        return ('thank-you.php');
    }
}

test();