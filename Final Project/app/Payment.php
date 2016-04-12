<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'order_value',
        'status'
    ];

    public function users()
    {
        return $this->belongsToMany(\App\User::class);
    }
}
