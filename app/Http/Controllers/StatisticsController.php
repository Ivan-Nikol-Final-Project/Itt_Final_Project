<?php

namespace App\Http\Controllers;

use App\Statistic;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
      /*$users = User::where('is_admin',0 )
          ->orderBy('id', 'desc')
          ->get();*/

        $users = Statistic::where('total_score', '>=', '0')
            ->orderBy('total_score' , 'desc')
            ->get();




        return $users;
    }
}
