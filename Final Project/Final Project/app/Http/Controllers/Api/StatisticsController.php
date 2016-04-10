<?php

namespace App\Http\Controllers\Api;

use App\Statistic;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;


class StatisticsController extends Controller{

    public function index(Request $request)
    {


        $users = Statistic::orderBy('high_score', 'desc')
            ->join('users', 'users.id', '=', 'user_id')
            ->take(10)
            ->get();

        return $this->transformCollection($users);
    }

    private function transformCollection($users){
        return array_map([$this, 'transform'], $users->toArray());
    }

    private function transform($user){
        return [
            'username' => $user['username'],
            'high_score' => $user['high_score'],
        ];
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
