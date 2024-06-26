---
title: Virtual Column In Laravel Migration
description: Setting virtual column from your existing JSON column
tags: ['laravel']
image:
publishedDate: Feb 10 2023
updatedDate: June 2 2024
---

Virtual columns are columns that are not physically stored in the database but calculated on-the-fly. This is useful when you are working with JSON columns.

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->json('meta')->nullable();
    $table->string('author_id')->nullable()->virtualAs("json_unquote(json_extract(meta, '$.author_id'))");
    $table->string('slug')->nullable()->virtualAs("json_unquote(json_extract(meta, '$.slug'))");
    $table->timestamps();
});
```
