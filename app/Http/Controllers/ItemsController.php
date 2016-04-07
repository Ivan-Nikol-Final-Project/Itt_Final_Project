<?php

namespace App\Http\Controllers;
use App\Item;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Response;


class ItemsController extends Controller
{
    public function index(){
        $items = Item::all();
        return $items;
    }


    public function show($id){
        $item = Item::find($id);

        if(!$item){
            return Response::json([
                'error' => [
                    'message' => 'Item does not exist!'
                ]
            ], 404);
        }

        return $item;
    }

    public function store(Request $request)
    {

        if(! $request->name or ! $request->price or ! $request->description or ! $request->img_address){
            return Response::json([
                'error' => [
                    'message' => 'Please Provide name, price and description and image!'
                ]
            ], 422);
        }
        $item = Item::create($request->all());
        return $item;
    }



    public function update(Request $request, $id)
    {
        if(! $request->name or ! $request->price or ! $request->description or ! $request->img_address){
            return Response::json([
                'error' => [
                    'message' => 'Please Provide name, price, description and image!'
                ]
            ], 422);
        }

        $item = Item::find($id);
        $item->name = $request->name;
        $item->price = $request->price;
        $item->description = $request->description;
        $item->img_address = $request->img_address;
        $item->save();

        return $item;
    }


}
