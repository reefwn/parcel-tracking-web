import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PostalStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * postal_id
   */

  @Column()
  displayStatus!: string;
}
