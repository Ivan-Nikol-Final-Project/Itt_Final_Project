<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Response;
use App\User;
class UserController extends Controller
{


    public function show($id)    {
        $user = User::find($id);

        if(!$user){
            return Response::json([
                'error' => [
                    'message' => 'User does not exist!'
                ]
            ], 404);
        }

        return Response::json([
            'data' => $this->transform($user)
        ], 200);
    }

    public function buyItem($id)
    {
        $user = Auth::user();
        $item = Item::find($id);
        $user
            ->items()
            ->attach($item->id);
        return redirect('back');
    }

    public function showItems($id)
    {
        $user = User::findOrFail($id);
        $items = $user->items()->get();
        return $items;

    }


    private function transform($user)
    {
        return [
            'name' => $user['name'],
            'username' => $user['username']

        ];
    }


}
