<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Http\Requests\StoreTareaRequest;
use App\Http\Requests\UpdateTareaRequest;

class TareaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function index()
    {
        //

        $r = Tarea::all();
        return response()->json($r);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTareaRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTareaRequest $request)
    {
        //
        Tarea::where(['id'=>$request->id])->firstOrFail()->fill($request->only([$request->rules()]))->save();
        return  Tarea::where(['id'=>$tarea->id])->firstOrNew();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tarea  $tarea
     * @return \Illuminate\Http\Response
     */
    public function show(Tarea $tarea)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Tarea  $tarea
     * @return \Illuminate\Http\Response
     */
    public function edit(Tarea $tarea)
    {
        //

        Tarea::where(['id'=>$tarea->id])->firstOrFail()->fill($tarea)->save();
        return  Tarea::where(['id'=>$tarea->id])->firstOrNew();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTareaRequest  $request
     * @param  \App\Models\Tarea  $tarea
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTareaRequest $request, Tarea $tarea)
    {
        //
        $t = Tarea::where(['id'=>$tarea->id])->firstOrFail();
        $t->fill( $request->only([$request->rules()]));
        if($request->input('completed') == 'true' || (Boolean)$request->input('completed')){
            $t->completed = true;
        }

            $t->save();
        return  Tarea::where(['id'=>$tarea->id])->firstOrNew();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tarea  $tarea
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tarea $tarea)
    {
        $t = Tarea::destroy($tarea->id);
        return Tarea::where(['id'=>$tarea->id])->firstOrNew();

    }
}
