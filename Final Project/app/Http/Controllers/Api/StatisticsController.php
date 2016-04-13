<?php

namespace App\Http\Controllers\Api;
use App\Statistic;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;


class StatisticsController extends Controller
{

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
       $stat = Statistic::where('user_id', '=', $request->id)->first();
        if($stat['high_score'] < $request->lastScore)
        {
            $stat['high_score'] = $request->lastScore;
            $stat['last_score'] = $request->lastScore;
        }

        $stat['last_score'] = $request->lastScore;
        $stat->save();

        $user = User::with('statistic')
        ->where('id', '=', $request->id)->first();
        return $user;
    }
}
