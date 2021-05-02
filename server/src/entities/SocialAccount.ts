import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class SocialAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * user_id
   * social_id
   */

  @Column()
  token: string;
}
