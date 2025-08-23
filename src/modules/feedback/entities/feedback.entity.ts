import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { FeedbackTypeEnum } from "../../../common/enums/enum";
import { User } from "../../user/entities/user.entity";

@Entity('feedback')
export class Feedback extends BaseEntity {
  @Column({ type: 'text', name: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.feedbacks, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: User;

//   @Column({
//     type: 'enum',
//     enum: FeedbackTypeEnum,
//     name: 'type',
//   })
//   type: FeedbackTypeEnum;
}
