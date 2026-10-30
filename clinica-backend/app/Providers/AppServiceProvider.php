<?php

namespace App\Providers;

use App\Policies\AuthPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(\App\Models\BoletaServicioPrestado::class, \App\Policies\BoletaPolicy::class);
        Gate::policy(\App\Models\Proforma::class, \App\Policies\ProformaPolicy::class);

        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
