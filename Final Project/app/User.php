<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username', 'email', 'password', 'gold', 'api_token'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function statistic()
    {
        return $this->hasOne(\App\Statistic::class, 'user_id');
    }

    public function payment()
    {
        return $this->hasMany(\App\Payment::class, 'user_id');
    }
}
