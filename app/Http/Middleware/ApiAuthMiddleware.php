<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
use Illuminate\Support\Facades\Auth;

class ApiAuthMiddleware

{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('X-Api-Token');
        $user = User::where('api_token', $token)->first();

        if(!$user)
            return response('Not authorized', 403);

        Auth::login($user);

        return $next($request);
    }
}
