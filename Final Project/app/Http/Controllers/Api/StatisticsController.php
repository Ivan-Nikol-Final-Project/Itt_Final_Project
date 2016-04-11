<?php

namespace App\Http\Controllers\Api;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;


class StatisticsController extends Controller{

    public function index(Request $request)
    {


        $users = Statistic::orderBy('high_score', 'desc')
            ->join('users', 'users.id', '=', 'user_id')
            ->paginate(5);

        return $users;
        //return $this->transformCollection($users);
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


       $stat = Statistic::where('user_id', '=', $request->id)->first();
        if($stat['high_score'] < $request->lastScore)
        {
            $stat['high_score'] = $request->lastScore;
            $stat['last_score'] = $request->lastScore;
        }

        $stat['last_score'] = $request->lastScore;
        $stat->save();




        $stat = Statistic::where('user_id', '=', $request->id)->first();
        if($stat['high_score'] < $request->lastScore)
        {
            $stat['high_score'] = $request->lastScore;
            $stat['last_score'] = $request->lastScore;
        }

        $stat['last_score'] = $request->lastScore;
        $stat->save();
        $user = User::where('id', '=', $request->id)->first();
        return $user;

    }

}
