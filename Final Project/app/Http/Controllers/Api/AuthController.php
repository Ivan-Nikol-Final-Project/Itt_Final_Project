<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\User;



class AuthController extends Controller
{
    public function login(Request $request)
    {
       // dd($request);
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required',
        ] );

        if (Auth::attempt(['username' => $request->input('username'), 'password' => $request->input('password')])) {
            return Auth::user();
        }

        return response(['username' => ['Wrong username or password']], 422);
    }

    public function registration(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'username' => 'required|min:5',
            'password' => 'required|min:6',
            'password2' => 'required|same:password',


        ] );

        $data = $request->all();
        $data['password'] = bcrypt($data['password']);
        $data['gold'] = 1000;
        $data['api_token'] = md5(microtime(true));
        $data['is_admin'] = false;
        return User::create($data);

    }

    public function getUser(Request $request)
    {
        $token = $request->token;
        $user = User::where('api_token', '=' , $token)->first();
        return $user;
    }

}
