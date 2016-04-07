<?php

namespace App\Http\Controllers;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class StatisticsController extends Controller{

    public function index(Request $request)
    {

        $users = Statistic::orderBy('total_score', 'desc')
            ->join('users', 'users.id', '=', 'user_id')
            ->take(10)
            ->get();


        return $users;
    }
}
