<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $fillable =
        [
            'user_id',
            'high_score',
            'last_score'
        ];
    public function users()
    {
        return $this -> belongsTo(\App\User::class, 'id');
    }
}
