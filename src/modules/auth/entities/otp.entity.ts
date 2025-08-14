import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity('otp')
export class Otp extends BaseEntity {
    @Column({type: 'varchar', name: "otp"})
    otp:string

    @Column({type: 'varchar', name: "phone_number"})
    phoneNumber:string

    @Column({type: 'timestamp', name: "expiration_time"})
    expirationTime:Date

    @Column({type: 'boolean', name: "is_verified", default: false})
    isVerified:boolean
}
