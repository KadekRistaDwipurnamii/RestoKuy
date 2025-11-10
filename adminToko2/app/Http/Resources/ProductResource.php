<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'slug' => $this->slug,
            'img' => $this->img,
            'img_url' => $this->img_url ?? ($this->img ? url($this->img) : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // ✅ perbaiki relasi category
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->category_id ?? $this->category->id,
                    'name' => $this->category->category ?? $this->category->name,
                ];
            }),
        ];
    }
}
