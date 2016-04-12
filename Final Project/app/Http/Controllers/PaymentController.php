<?php

namespace App\Http\Controllers;

use App\Payment;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class PaymentController extends Controller
{
    public function addOrder(Request $request)
    {

        $data['user_id'] = $request->id;
        $data['order_value'] = $request->gold;
        
        $order = Payment::create($data);
        return $order;
    }
    

}
