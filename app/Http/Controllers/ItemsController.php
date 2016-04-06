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
        return Response::json([
            'data' => $this->transformCollection($items)
        ], 200);
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
        return Response::json([
            'message' => 'Item Created Succesfully',
            'data' => $this->transform($item)
        ]);
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

        return Response::json([
            'message' => 'Item Updated Succesfully'
        ]);
    }

    private function transformCollection($items){
        return array_map([$this, 'transform'], $items->toArray());
    }

    private function transform($item)
    {
        return [
            'name' => $item['name'],
            'price' => $item['price'],
            'description' => $item['description']
        ];
    }
    }
