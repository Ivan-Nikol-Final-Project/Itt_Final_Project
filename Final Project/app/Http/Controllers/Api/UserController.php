<?php

namespace App\Http\Controllers\Api;
use App\Statistic;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
class UserController extends Controller
{

    public function index()
    {
        $users = User::all();
        return $users;
    }

    public function show($id)    {
        $user = User::find($id);
        if(!$user){
            return Response::json([
                'error' => [
                    'message' => 'User does not exist!'
                ]
            ], 404);
        }
        return $user;
    } 

    public function getUser(Request $request)
    {
        $token = $request->api_token;
        $user = User::with('statistic')
            ->where('api_token', '=', $token)->first();
        return $user;
    }




}
