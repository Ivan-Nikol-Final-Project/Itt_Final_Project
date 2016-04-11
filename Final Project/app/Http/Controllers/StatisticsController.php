<?php

namespace App\Http\Controllers;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller{

    public function index(Request $request)
    {
        $users = DB::table('statistics')
            ->select('users.username', 'statistics.high_score')
            ->join('users', 'users.id', '=', 'statistics.user_id')
            ->orderBy('high_score', 'desc')
            ->paginate(10);

        return $users;
    }
   

    public function update(Request $request)
    {
        if (!$request->id or !$request->high_score or !$request->last_score) {
            return Response::json([
                'error' => [
                    'message' => 'Please user id, high_score and last_score!'
                ]
            ], 422);
        }

        $user = Statistic::where('user_id', '=', $request->id)->first();
        if($user['high_score'] < $request->last_score)
        {
            $user['high_score'] = $request->last_score;
            $user['last_score'] = $request->last_Score;
        }

        $user['last_score'] = $request->last_score;
        $user->save();

        return $user;
    }

}
