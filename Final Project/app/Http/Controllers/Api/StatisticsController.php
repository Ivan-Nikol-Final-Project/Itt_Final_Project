<?php

namespace App\Http\Controllers\Api;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;


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
        if (!$request->id  or !$request->last_score) {
            return Response::json([
                'error' => [
                    'message' => 'Please user id, high_score and last_score!'
                ]
            ], 422);
        }

        $stat = Statistic::where('user_id', '=', $request->id)->first();
        if($stat['high_score'] < $request->last_score)
        {
            $stat['high_score'] = $request->last_score;
            $stat['last_score'] = $request->last_Score;
        }

        $stat['last_score'] = $request->last_score;
        $stat->save();

        $user = User::where('id', '=', $request->id)->first();
        return $user;
    }

}
