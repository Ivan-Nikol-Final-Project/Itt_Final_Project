<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $fillable =
        [
            'user_id',
            'total_score',
            'games_played',
            'games_won',
            'games_lost'
        ];
    public function users()
    {
        return $this -> belongsTo(\App\User::class, 'id');
    }
}
