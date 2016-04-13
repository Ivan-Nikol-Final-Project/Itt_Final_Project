<?php

namespace App\Http\Controllers;
use App\Payment;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\Response;


class PaymentController extends Controller
{
    public function addOrder(Request $request)
    {
        $data['user_id'] = $request->id;
        $data['order_value'] = $request->gold;

        $order = Payment::create($data);

        return $order;
    }

    public function updateOrder(Request $request)
    {

        if ($request->address_status == 'confirmed') {
            $order = Payment::orderBy('created_at', 'desc')->first();

            if ($order['status'] == 0) {
                $user = User::where('id', '=', $order['user_id'])->first();
                $user['gold'] += $order['order_value'];
                $user->save();
                $order['status'] = 1;
                $order->save();

                return redirect("/#/paypall");
            }
        }

         else {
            return response(['ERROR' => ['Payment has failed']]);
        }
    }



}
