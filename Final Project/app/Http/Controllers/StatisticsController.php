<?php

namespace App\Http\Controllers;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class StatisticsController extends Controller{

    public function index(Request $request)
    {


        $users = Statistic::orderBy('high_score', 'desc')
            ->join('users', 'users.id', '=', 'user_id')
            ->take(10)
            ->get();



        return $users;
    }

    public function update(Request $request, $id)
    {
        if (!$request->id or !$request->high_score or !$request->last_score) {
            return Response::json([
                'error' => [
                    'message' => 'Please user id, high_score and last_score!'
                ]
            ], 422);
        }

        $user = User::find($id);
        if($user->high_score < $request->last_score)
        {
            $user->high_score = $request->last_score;
            $user->last_score = $request->last_Score;
        }

        $user->last_score = $request->last_score;
        $user->save();

        return $user;
    }

}
