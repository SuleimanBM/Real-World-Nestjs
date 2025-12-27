import { Migration } from '@mikro-orm/migrations';

export class Migration20251209100558 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "favorite" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "user" varchar(255) not null, "favorite_articles" text[] null, constraint "favorite_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "favorite" add constraint "favorite_user_unique" unique ("user");`,
    );

    this.addSql(
      `create table "follows" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "follower_id" varchar(255) not null, "followed_id" varchar(255) not null, constraint "follows_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "follows" add constraint "follows_follower_id_followed_id_unique" unique ("follower_id", "followed_id");`,
    );

    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" varchar(255) null, "image" varchar(255) null default 'https://i.pravatar.cc/150', "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "article" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "slug" varchar(255) null, "title" varchar(255) not null, "description" varchar(255) not null, "body" text not null, "tag_list" text[] not null, "favorited" boolean not null default false, "favorites_count" int not null default 0, "author_id" uuid not null, constraint "article_pkey" primary key ("id"));`,
    );
    this.addSql(`create index "article_slug_index" on "article" ("slug");`);
    this.addSql(
      `create index "article_tag_list_index" on "article" ("tag_list");`,
    );
    this.addSql(
      `create index "article_author_id_index" on "article" ("author_id");`,
    );

    this.addSql(
      `create table "comment" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "article_id" uuid not null, "body" varchar(255) null, "author_id" uuid not null, constraint "comment_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "article" add constraint "article_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "comment" add constraint "comment_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`,
    );
  }
}
