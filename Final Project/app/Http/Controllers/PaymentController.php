<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Session;
use Omnipay\Omnipay;

use App\Http\Requests;

use Anouar\Paypalpayment\Facades\PaypalPayment;

class PaymentController extends Controller
{



 private $data;

    public function postPayment(Request $request, User $user)
    {
        $params = array(
            'cancelUrl' => 'http://localhost:8000/api/v1/cancel_order',
            'returnUrl' => 'http://localhost:8000/api/v1/payment_success',
            'name' => $request->name,
            'description' => 'test',
            'amount' => $request->price,
            'currency' => $request->currency
        );

        Session::put('params', $params);
        Session::save();

        $gateway = Omnipay::create('PayPal_Express');
        $gateway->setUsername('nikol_paraskova-facilitator_api1.abv.bg');
        $gateway->setPassword('QH835TD9UGL4NDFD');
        $gateway->setSignature('ATJ7CUbS.FXcCuMS-uQr4N9gFod1AQLZdx75Xpz1eT89hOFcla35eZ09');
        $gateway->setTestMode(true);

        $response = $gateway->purchase($params)->send();

        if($response->isSuccessful()) {
           //
        }

        elseif ($response->isRedirect())
        {
            $response->redirect();
        }

        else{

            echo $response->getMessage();
        }
        }

    public function getSuccessPayment(Request $request)
    {
        $gateway = Omnipay::create('PayPal_Express');
        $gateway->setUsername('nikol_paraskova-facilitator_api1.abv.bg');
        $gateway->setPassword('QH835TD9UGL4NDFD');
        $gateway->setSignature('ATJ7CUbS.FXcCuMS-uQr4N9gFod1AQLZdx75Xpz1eT89hOFcla35eZ09');
        $gateway->setTestMode(true);

        $params = Session::get('params');
        $response = $gateway->completePurchase($params)->send();
        $paypalResponse = $response->getData();

        if(isset($paypalResponse['ACK']) && $paypalResponse['ACK'] === 'Success')
        {
            $token = $request->token;
            $user = User::where('api_token', '=', $token)->first();
            $user['gold'] += $request->gold;
            print_r($response);
        }else{
            //
        }

        return view('index');
    }
    }


