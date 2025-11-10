<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title inertia>{{ config('app.name', 'ChronoDesk') }}</title>

    <link rel="icon" type="image/png" href="{{ asset('logo.png') }}" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>


<body class="font-sans antialiased">
    @inertia
</body>

</html>
