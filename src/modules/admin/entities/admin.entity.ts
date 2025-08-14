import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity("admins")
export class Admin extends BaseEntity {
    @Column({type:'varchar', name:"login", unique:true})
    login:string

    @Column({type:'varchar', name:'hashed_password', nullable:false})
    hashedPassword:string

    @Column({type:'varchar', name:'hashed_refresh_token', nullable:true})
    hashedRefreshToken:string

    @Column({type:'boolean', name:'is_active', default:false})
    isActive:boolean
}
