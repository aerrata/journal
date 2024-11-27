---
title: Virtual Column In Laravel
description: Setting virtual column from your existing JSON column
image:
tags:
  - laravel
createdDate: Feb 10 2023
updatedDate: June 2 2024
draft: false
---

Virtual columns are not physically stored in the database but are calculated on-the-fly. They are particularly useful when working with JSON columns, as they allow you to extract and utilize data without duplicating it.

---

### Laravel Migration File

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->json('meta')->nullable();
    $table->string('author_id')->nullable()->virtualAs("json_unquote(json_extract(meta, '$.author_id'))");
    $table->string('slug')->nullable()->virtualAs("json_unquote(json_extract(meta, '$.slug'))");
    $table->timestamps();
});
```

These virtual columns do not take up extra storage space but are accessible as part of queries.

### Table Structure

| id  | meta                                            | author_id | slug          | created_at          | updated_at          |
| --- | ----------------------------------------------- | --------- | ------------- | ------------------- | ------------------- |
| 1   | {"author_id": "12345", "slug": "my-first-post"} | 12345     | my-first-post | 2024-11-24 12:00:00 | 2024-11-24 12:00:00 |

By using virtual columns, `author_id` and `slug` are extracted dynamically from the JSON column `meta`.
