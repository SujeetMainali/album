import Base from "../../entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Album } from "./album.entity";

@Entity()
export class Category extends Base {
  @Column({
    name: "title",
    type: "varchar",
  })
  title: string;

  @OneToMany(() => Album, (album) => album.category, {
    cascade: true,
  })
  albums: Album[];
}
