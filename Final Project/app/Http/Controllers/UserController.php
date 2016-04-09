<?php

namespace App\Http\Controllers;

use App\Item;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use App\User;
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

   /* public function buyItem($id)
    {
        $user = Auth::user();
        $item = Item::find($id);
        if($user['gold'] >= $item['price']) {
            $user
                ->items()
                ->attach($item->id);
            $user['gold'] -= $item->price ;
        }
    }*/

    public function showUserItems($id)
    {
        $user = User::findOrFail($id);
        $items = $user->items()->get();
        return $items;

    }




}
