import { Column, ManyToOne, OneToMany } from "typeorm";
import Base from "../../entities/base.entity";
import { Category } from "./category.entity";
import Media from "../media.entity";
import { Auth } from "../auth.entity";

export class Album extends Base {
  @Column({
    name: "title",
    type: "varchar",
  })
  title: string;
  @Column({
    name: "description",
    type: "text",
  })
  description: string;

  @Column({
    name: "photographer",
    type: "varchar",
  })
  photographer: string;

  @Column({
    name: "year",
    type: "int",
  })
  year: number;

  @OneToMany(() => Media, (media) => media.album, {
    cascade: true,
  })
  media: Media[];

  @ManyToOne(() => Category, (category) => category.albums)
  category: Category;

  @ManyToOne(() => Auth, (auth) => auth.albums, {
    onDelete: "CASCADE",
  })
  auth: Auth;
}
