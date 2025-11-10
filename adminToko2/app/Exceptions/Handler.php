<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Override default unauthenticated response
     */
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        dd([
            'expectsJson' => $request->expectsJson(),
            'isApi' => $request->is('api/*'),
            'path' => $request->path(),
            'headers' => $request->headers->all(),
        ]);
    }
}
