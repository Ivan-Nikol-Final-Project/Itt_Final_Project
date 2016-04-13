<?php

namespace App\Http\Controllers\Api;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
class UserController extends Controller
{

    public function index()    {
        $users = User::all();
        return $users;
    }   

    public function getUser(Request $request)
    {
        $token = $request->api_token;
        $user = User::with('statistic')
            ->where('api_token', '=', $token)->first();
        return $user;
    }

}
